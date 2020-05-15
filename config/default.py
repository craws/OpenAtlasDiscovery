# Don't edit this file. To override settings please use instance/production.py

VERSION = '0.1.0'
LANGUAGES = {'en': 'English', 'de': 'Deutsch'}
DEBUG = False
SECRET_KEY = 'CHANGE ME'

# Security
SESSION_COOKIE_SECURE = False  # Should be set to True in production.py if using HTTPS only
REMEMBER_COOKIE_SECURE = True
SESSION_COOKIE_SAMESITE = 'Lax'
