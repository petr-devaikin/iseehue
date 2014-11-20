from flask.ext.script import Manager
from web.app import app
from web.logger import get_logger
from web.db import scripts

manager = Manager(app)

@manager.command
def hello():
    """
    Print hello
    """
    get_logger().debug("Hello debug")
    get_logger().info("Hello info")
    get_logger().warning("Hello warning")
    get_logger().error("Hello error")
    get_logger().critical("Hello critical")
    print "hello"


@manager.command
def initdb():
    """
    Drop and create database
    """
    scripts.init_database()


@manager.command
def generator():
    """
    Generate test data
    """
    from web.db.models import User, UserAnswer, Hue
    import random
    hues = Hue.select()
    count = hues.count()
    for i in range(20):
        user = User.create(external_id='test_%d' % i, name="Test Name %d" % i)
        borders = [random.gauss(hue.value + 180./count, 10) for hue in hues]
        for i in range(count):
            answer = UserAnswer.create(
                user=user,
                hue=hues[i],
                left_border=borders[(i - 1) % count],
                right_border=borders[i])


if __name__ == "__main__":
    manager.run()
