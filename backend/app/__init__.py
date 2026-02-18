import os
from flask import Flask, send_from_directory
from flask_cors import CORS

from .models import db


def create_app():
    app = Flask(__name__)
    CORS(app)

    uri = os.environ.get("DATABASE_URL")
    if uri and uri.startswith("postgres://"):
        uri = uri.replace("postgres://", "postgresql://", 1)
    env = (os.environ.get("FLASK_ENV") or os.environ.get("APP_ENV") or "").strip().lower()
    if env == "production" and not uri:
        raise RuntimeError(
            "Production requires DATABASE_URL (e.g. Heroku Postgres). "
            "Do not use sqlite in production."
        )
    app.config["SQLALCHEMY_DATABASE_URI"] = uri or "sqlite:///chart_cache.db"
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
    db.init_app(app)

    with app.app_context():
        db.create_all()

    from .routes import api
    from .cli import init_cli

    app.register_blueprint(api, url_prefix="/api")
    init_cli(app)

    # Serve React build when present (single-app Heroku deploy)
    static_ui = os.path.join(app.root_path, "static_ui")
    if os.path.isdir(static_ui):
        app.static_folder = static_ui
        app.static_url_path = ""

        @app.route("/")
        @app.route("/<path:path>")
        def serve_spa(path=""):
            if path and not path.startswith("static/"):
                return send_from_directory(app.static_folder, "index.html")
            if path:
                return send_from_directory(app.static_folder, path)
            return send_from_directory(app.static_folder, "index.html")

    return app
