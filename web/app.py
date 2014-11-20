from flask import Flask, render_template, request, jsonify, redirect, session, url_for
from flask.ext.scss import Scss
from flask_oauthlib.client import OAuth, OAuthException
from .db.engine import init_db, get_db
from .db.models import Hue, User, UserAnswer
from .env_settings import load_env
import json
import peewee


app = Flask(__name__, instance_relative_config=True)
app.config.from_object('web.default_settings')
load_env(app)
app.config.from_pyfile('application.cfg', silent=True)

Scss(app)
oauth = OAuth(app)

init_db(app)


facebook = oauth.remote_app(
    'facebook',
    consumer_key=app.config['FACEBOOK_APP_ID'],
    consumer_secret=app.config['FACEBOOK_APP_SECRET'],
    request_token_params={'scope': 'email'},
    base_url='https://graph.facebook.com',
    request_token_url=None,
    access_token_url='/oauth/access_token',
    authorize_url='https://www.facebook.com/dialog/oauth'
)


def calcSimilarAnswers(my_user, max_diff):
    ids = None
    for hue in Hue.select():            
        if ids != None:
            users = User.select().join(UserAnswer).where(User.id << ids)
        else:
            users = User.select().join(UserAnswer)

        right_border = my_user.answers.where(UserAnswer.hue == hue).first().right_border

        users = users.where(UserAnswer.hue == hue)
        users = users.where((UserAnswer.right_border >= right_border - max_diff) & \
                            (UserAnswer.right_border <= right_border + max_diff))
        
        ids = [u.id for u in users]

    return len(ids) - 1 if ids else 0


@app.route('/')
def index():
    try:
        my_user = get_user()
    except User.DoesNotExist:
        return redirect(url_for('logout'))

    tested = my_user and my_user.tested()

    answers = []
    my_answers = []
    for user in User.select():
        if user.tested():
            answers.append({
                'user': user.id,
                'answers': [answer.to_hash() for answer in user.answers]
            })

    if tested:
        my_answers.append({
            'user': my_user.id,
            'answers': [answer.to_hash() for answer in user.answers]
        })

    tested_count = Hue.select().first().user_answers.count() - 1

    similar_count = calcSimilarAnswers(my_user, app.config['MAX_DIFF']) if tested else 0

    overlaps = 100 * float(similar_count) / tested_count if tested_count else 0
    mutual = round(overlaps, 2) if overlaps < 1 else int(round(overlaps))

    return render_template('index.html', user=my_user, tested=tested, mutual=mutual,
        answers=json.dumps(answers), my_answers=json.dumps(my_answers), polled_count=tested_count+1)


@app.route('/test')
def test():
    try:
        user = get_user()
    except User.DoesNotExist:
        return redirect(url_for('logout'))

    if not user:
        return redirect(url_for('login'), next=request.path)

    if user.tested():
        return redirect(url_for('index'))

    hues = json.dumps([h.to_hash() for h in Hue.select()])
    return render_template('test.html', hues=hues)


@app.route('/results/save', methods=['POST'])
def save_results():
    user = get_user()
    if not user:
        return 'not logged id', 500

    if user.tested():
        return 'test already passed', 500

    results = json.loads(request.form.get('borders'))    

    hue_count = Hue.select().count()
    if len(results) < hue_count:
        return 'wrong result count', 500

    try:
        with get_db().transaction():
            sresults = sorted(results, key = lambda r: r['hue'])
            for i in range(hue_count):
                hue = Hue.get(Hue.id == sresults[i]['id'])
                left_border = sresults[(i - 1) % hue_count]['value']
                UserAnswer.create(user=user, hue=hue,
                                  left_border=left_border,
                                  right_border=sresults[i]['value'])
    except peewee.IntegrityError:
        return 'duplicate result', 500

    return jsonify(result='ok')


@app.route('/login')
def login():
    callback = url_for(
        'facebook_authorized',
        next=request.args.get('next') or request.referrer or None,
        _external=True
    )
    return facebook.authorize(callback=callback)


@app.route('/logout')
def logout():
    session.clear()
    return redirect(url_for('index'))

@app.route('/login/authorized')
def facebook_authorized():
    resp = facebook.authorized_response()
    if resp is None:
        return 'Access denied: reason=%s error=%s' % (
            request.args['error_reason'],
            request.args['error_description']
        ), 500
    if isinstance(resp, OAuthException):
        return 'Access denied: %s' % resp.message, 500

    session['oauth_token'] = (resp['access_token'], '')

    me = facebook.get('/me')
    try:
        user = User.get(User.external_id == me.data['id'])
    except User.DoesNotExist:
        user = User.create(external_id=me.data['id'], name=me.data['name'])
    session['user_id'] = user.id


    
    next = request.args.get('next')
    return redirect(next if next else url_for('test'))


@facebook.tokengetter
def get_facebook_oauth_token():
    return session.get('oauth_token')


def get_user():
    user_id = session.get('user_id')
    if user_id:
        return User.get(User.id == user_id)
    else:
        return None


if __name__ == '__main__':
    app.run()