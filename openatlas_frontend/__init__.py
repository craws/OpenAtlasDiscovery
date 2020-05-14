from flask import Flask, Response, request

app = Flask(__name__, instance_relative_config=True)
app.config.from_object('config.default')   # type: ignore
app.config.from_pyfile('production.py')   # type: ignore

from openatlas_frontend.views import index


@app.before_request
def before_request() -> None:
    if request.path.startswith('/static'):  # pragma: no cover
        return  # Only needed if not running with apache and static alias


@app.after_request
def apply_caching(response: Response) -> Response:
    response.headers['Strict-Transport-Security'] = 'max-age=31536000; includeSubDomains'
    response.headers['X-Content-Type-Options'] = 'nosniff'
    response.headers['X-Frame-Options'] = 'SAMEORIGIN'
    response.headers['X-XSS-Protection'] = '1; mode=block'

    # Todo: activate Content-Security-Policy after removal of every inline CSS and JavaScript
    # response.headers['Content-Security-Policy'] = "default-src 'self'"
    return response


if __name__ == "__main__":  # pragma: no cover
    app.run()
