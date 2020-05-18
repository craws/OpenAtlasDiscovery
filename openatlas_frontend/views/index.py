from flask import render_template, request, session
from werkzeug.utils import redirect
from werkzeug.wrappers import Response

from openatlas_frontend import app
from openatlas_frontend.util.changelog import Changelog


@app.route('/')
def index() -> str:
    return render_template('index/index.html')


@app.route('/changelog')
def index_changelog() -> str:
    return render_template('index/changelog.html', versions=Changelog.versions)


@app.route('/index/setlocale/<language>')
def set_locale(language: str) -> Response:
    session['language'] = language
    print(request.referrer)
    return redirect(request.referrer)
