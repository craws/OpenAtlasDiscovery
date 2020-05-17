from flask import render_template

from openatlas_frontend import app
from openatlas_frontend.util.changelog import Changelog


@app.route('/')
def index() -> str:
    return render_template('index/index.html')


@app.route('/changelog')
def index_changelog() -> str:
    return render_template('index/changelog.html', versions=Changelog.versions)
