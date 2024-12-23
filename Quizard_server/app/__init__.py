# __init__.py
from flask import Flask
from flask_cors import CORS
from app.config import Config
from app.utils.api_response import APIResponse

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    CORS(app)

    from app.routes.apis import api_blueprint
    app.register_blueprint(api_blueprint, url_prefix='/api/v1')

    @app.errorhandler(404)
    def not_found_error(error):
        return APIResponse.error(code='RESOURCE_NOT_FOUND', message='Resource not found', status_code=404)

    @app.errorhandler(500)
    def internal_error(error):
        return APIResponse.error(code='INTERNAL_SERVER_ERROR', message='A internal server error occur please try again.', status_code=500)

    return app