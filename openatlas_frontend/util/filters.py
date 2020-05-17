import flask
import jinja2


blueprint: flask.Blueprint = flask.Blueprint('filters', __name__)


@jinja2.contextfilter
@blueprint.app_template_filter()
def uc_first(self, string: str) -> str:
    return str(string)[0].upper() + str(string)[1:] if string else ''
