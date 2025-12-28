from flask import Flask
from flask_cors import CORS

from .routes.ocr import ocr_bp
from .routes.llm import llm_bp
from .routes.practice import practice_bp


def create_app() -> Flask:
    app = Flask(__name__)
    
    # Enable CORS for Node.js backend requests
    CORS(app)

    # Register blueprints
    app.register_blueprint(ocr_bp)
    app.register_blueprint(llm_bp)
    app.register_blueprint(practice_bp)

    return app
