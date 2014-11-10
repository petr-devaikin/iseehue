from peewee import *

_db = Proxy()

def init_db(app):
    if app.config['DATABASE']['engine'] == 'Sqlite':
        database = SqliteDatabase(app.config['DATABASE']['name'], threadlocals=True,
            **app.config['DATABASE']['params'])
    elif app.config['DATABASE']['engine'] == 'MySQL':
        database = MySQLDatabase(app.config['DATABASE']['name'], threadlocals=True,
            **app.config['DATABASE']['params'])
    elif app.config['DATABASE']['engine'] == 'Postgresql':
        database = PostgresqlDatabase(app.config['DATABASE']['name'], threadlocals=True,
            **app.config['DATABASE']['params'])
    else:
        raise Exception('Unknown database engine')

    _db.initialize(database)

def get_db():
    return _db