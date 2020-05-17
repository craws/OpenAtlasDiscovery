from flask import url_for
from openatlas_frontend import app

from tests.base import TestBaseCase


class IndexTests(TestBaseCase):

    def test_index(self) -> None:
        with app.app_context():  # type: ignore
            rv = self.app.get(url_for('index'))
            assert b'OpenAtlas' in rv.data
            rv = self.app.get(url_for('index_changelog'))
            assert b'0.1.0' in rv.data
