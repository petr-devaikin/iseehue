from os import environ

def load_env(app):
    if 'DATABASE_URI' in environ: app.config.setdefault('DATABASE_URI', environ.get('DATABASE_URI'))

    if 'MAX_DIFF' in environ: app.config.setdefault('MAX_DIFF', environ.get('MAX_DIFF'))

    if 'SECRET_KEY' in environ: app.config.setdefault('SECRET_KEY', environ.get('SECRET_KEY'))

    if 'FACEBOOK_APP_ID' in environ: app.config.setdefault('FACEBOOK_APP_ID', environ.get('FACEBOOK_APP_ID'))
    if 'FACEBOOK_APP_SECRET' in environ: app.config.setdefault('FACEBOOK_APP_SECRET', environ.get('FACEBOOK_APP_SECRET'))
