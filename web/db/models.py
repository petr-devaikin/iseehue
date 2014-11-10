from peewee import *
from .engine import get_db


class Hue(Model):
    name = CharField(unique=True)
    value = DoubleField(unique=True)

    class Meta:
        database = get_db()


class User(Model):
    external_id = CharField()

    class Meta:
        database = get_db()


class UserAnswer(Model):
    user = ForeignKeyField(User, related_name='answers')
    hue = ForeignKeyField(Hue, related_name='user_answers')
    border_position = DoubleField()

    class Meta:
        database = get_db()