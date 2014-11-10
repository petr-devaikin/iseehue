from flask import Flask, render_template
from .db.engine import init_db

app = Flask(__name__, instance_relative_config=True)
app.config.from_object('web.default_settings')
app.config.from_pyfile('application.cfg', silent=True)

init_db(app)


@app.route('/')
def index():
    return render_template('index.html')


if __name__ == '__main__':
    app.run()