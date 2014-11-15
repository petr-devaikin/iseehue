from flask import Flask, render_template, request, jsonify, redirect, session, url_for
from flask.ext.scss import Scss
from flask_oauthlib.client import OAuth, OAuthException
from .db.engine import init_db, get_db
from .db.models import Hue, User, UserAnswer
import json
import peewee


app = Flask(__name__, instance_relative_config=True)
app.config.from_object('web.default_settings')
app.config.from_pyfile('application.cfg', silent=True)

app.secret_key = 'development'

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


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/test')
def test():
    hues = json.dumps([h.to_hash() for h in Hue.select()])
    return render_template('test.html', hues=hues)


@app.route('/results/save', methods=['POST'])
def save_results():
    #check if results already exist

    results = json.loads(request.form.get('borders'))
    user = User.create(external_id='a')

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


@app.route('/results/')
def results():
    user = User.get()

    hues = []
    my_hues = []
    for hue in Hue.select():
        answers = [answer.to_hash() for answer in hue.user_answers]
        hues.append({
            'hue': hue.to_hash(),
            'answers': answers
        })
        my_hues.append({
            'hue': hue.to_hash(),
            'answers': [user.answers.join(Hue).where(Hue.id == hue.id)[0].to_hash()]
        })

    return jsonify(hues=hues, my_hues=my_hues)




@app.route('/login')
def login():
    callback = url_for(
        'facebook_authorized',
        next=request.args.get('next') or request.referrer or None,
        _external=True
    )
    return facebook.authorize(callback=callback)


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
    next = request.args.get('next')
    return redirect(next if next else url_for('test'))
    return 'Logged in as id=%s name=%s redirect=%s' % \
        (me.data['id'], me.data['name'], request.args.get('next'))


@facebook.tokengetter
def get_facebook_oauth_token():
    return session.get('oauth_token')


if __name__ == '__main__':
    app.run()