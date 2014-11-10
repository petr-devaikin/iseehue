from ..logger import get_logger
from .models import *

def drop_tables():
    if UserAnswer.table_exists():
        UserAnswer.drop_table()
        get_logger().info('UserAnswer table dropped')

    if User.table_exists():
        User.drop_table()
        get_logger().info('User table dropped')

    if Hue.table_exists():
        Hue.drop_table()
        get_logger().info('Hue table dropped')


def create_tables():
    Hue.create_table()
    get_logger().info('Hue table created')

    User.create_table()
    get_logger().info('User table created')

    UserAnswer.create_table()
    get_logger().info('UserAnswer table created')


def init_data():
    Hue.create(name='red', value=0./7)
    Hue.create(name='orange', value=1./7)
    Hue.create(name='yellow', value=2./7)
    Hue.create(name='green', value=3./7)
    Hue.create(name='blue', value=4./7)
    Hue.create(name='dark blue', value=5./7)
    Hue.create(name='purple', value=6./7)


def init_database():
    drop_tables()
    create_tables()
    init_data()