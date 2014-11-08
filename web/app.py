from flask import Flask

app = Flask(__name__, instance_relative_config=True)
app.config.from_object('web.default_settings')
app.config.from_pyfile('application.cfg', silent=True)


@app.route('/')
def index():
    return 'index'


if __name__ == '__main__':
    app.run()