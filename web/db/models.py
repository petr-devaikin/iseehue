from peewee import *
from .engine import get_db


class Hue(Model):
    name = CharField(unique=True)
    value = DoubleField(unique=True)

    def to_hash(self):
        return {
            'id': self.id,
            'value': self.value,
            'name': self.name
        }

    class Meta:
        database = get_db()


class User(Model):
    external_id = CharField()
    name = CharField(null=True)

    def tested(self):
        return self.answers.count() > 0

    class Meta:
        database = get_db()


class UserAnswer(Model):
    user = ForeignKeyField(User, related_name='answers')
    hue = ForeignKeyField(Hue, related_name='user_answers')
    left_border = DoubleField()
    right_border = DoubleField()

    def to_hash(self):
        return {
            'id': self.id,
            'left': self.left_border,
            'right': self.right_border,
            'hue': self.hue.value,
        }

    class Meta:
        database = get_db()
        indexes = (
            (('user', 'hue'), True),
        )