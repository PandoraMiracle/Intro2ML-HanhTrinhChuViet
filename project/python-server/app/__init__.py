from flask import Flask

from .routes.ocr import ocr_bp


def create_app() -> Flask:
    app = Flask(__name__)

    # Register blueprints
    app.register_blueprint(ocr_bp)

    return app
