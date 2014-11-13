from flask import Flask, render_template, request, jsonify
from .db.engine import init_db, get_db
from .db.models import Hue, User, UserAnswer
import json
import peewee

app = Flask(__name__, instance_relative_config=True)
app.config.from_object('web.default_settings')
app.config.from_pyfile('application.cfg', silent=True)

init_db(app)


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


if __name__ == '__main__':
    app.run()