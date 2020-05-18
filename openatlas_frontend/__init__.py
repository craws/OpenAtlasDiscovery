from flask import Flask, Response, request, session
from flask_babel import Babel

app = Flask(__name__, instance_relative_config=True)
app.config.from_object('config.default')   # type: ignore
app.config.from_pyfile('production.py')   # type: ignore

from openatlas_frontend.views import index
from openatlas_frontend.util import filters

babel = Babel(app)


@babel.localeselector
def get_locale() -> str:
    if 'language' in session:
        return session['language']
    best_match = request.accept_languages.best_match(app.config['LANGUAGES'].keys())
    # Check if best_match is set (in tests it isn't)
    return best_match if best_match else 'en'


@app.before_request
def before_request() -> None:
    if request.path.startswith('/static'):  # pragma: no cover
        return  # Only needed if not running with apache and static alias
    session['language'] = get_locale()


@app.after_request
def apply_caching(response: Response) -> Response:
    response.headers['Strict-Transport-Security'] = 'max-age=31536000; includeSubDomains'
    response.headers['X-Content-Type-Options'] = 'nosniff'
    response.headers['X-Frame-Options'] = 'SAMEORIGIN'
    response.headers['X-XSS-Protection'] = '1; mode=block'

    # Todo: activate Content-Security-Policy after removal of every inline CSS and JavaScript
    # response.headers['Content-Security-Policy'] = "default-src 'self'"
    return response


app.register_blueprint(filters.blueprint)


if __name__ == "__main__":  # pragma: no cover
    app.run()
