from flask import Flask
from flask_cors import CORS


def create_app():
    app = Flask(__name__)
    CORS(app)

    from .routes import api
    from .views import web

    app.register_blueprint(web)
    app.register_blueprint(api, url_prefix='/api')

    return app
