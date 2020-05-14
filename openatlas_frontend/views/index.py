from flask import render_template

from openatlas_frontend import app


@app.route('/')
def index() -> str:
    return render_template('index.html')
