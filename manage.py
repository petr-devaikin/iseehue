from flask.ext.script import Manager
from web.app import app
from web.logger import get_logger

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
    #init_database()


if __name__ == "__main__":
    manager.run()
