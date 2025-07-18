from flask import Flask, request
from flask_sqlalchemy import SQLAlchemy
from flask_smorest import Api
from flask_cors import CORS
from flask_migrate import Migrate
from config import Config
from dotenv import load_dotenv
from flask_jwt_extended import JWTManager


load_dotenv()

db = SQLAlchemy()
migrate = Migrate()
jwt = JWTManager()

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    db.init_app(app)
    app.config['API_TITLE'] = 'AI Productivity Assistant API'
    app.config['API_VERSION'] = 'v1'
    app.config['OPENAPI_VERSION'] = '3.0.3'
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///app.db'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['OPENAPI_URL_PREFIX'] = '/docs'   # URL path for OpenAPI docs
    app.config['OPENAPI_SWAGGER_UI_PATH'] = '/api'  # Swagger UI path
    app.config['OPENAPI_SWAGGER_UI_URL'] = 'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.11.0/'  # CDN for Swagge
    # JWT configuration
    app.config['JWT_SECRET_KEY'] = app.config['SECRET_KEY']  # Use SECRET_KEY from config.py for JWT
    app.config['JWT_TOKEN_LOCATION'] = ['headers']

    CORS(app, resources={r"/*": {"origins": ["http://localhost:5173"]}}, supports_credentials=True, methods=["GET", "POST", "PATCH", "OPTIONS"])
    migrate.init_app(app, db)
    jwt.init_app(app)

    @app.after_request
    def after_request(response):
        # Remove manual addition of Access-Control-Allow-Origin to avoid duplicates
        # flask_cors.CORS will handle CORS headers automatically
        # response.headers.add('Access-Control-Allow-Origin', 'http://localhost:5173')
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
        response.headers.add('Access-Control-Allow-Methods', 'GET,POST,DELETE,PATCH,OPTIONS')
        if request.method == 'OPTIONS':
            # Return response immediately for OPTIONS requests without authentication
            response.status_code = 200
            response.data = ''
            return response
        return response

    from app.models import Task

    api = Api(app)
    api.spec.components.security_scheme(
        "BearerAuth",  # Name used in @blp.doc()
        {
            "type": "http",
            "scheme": "bearer",
            "bearerFormat": "JWT"
        }
    )
    api.spec.options["security"] = [{"BearerAuth": []}]
    from app.routes.task_routes import blp as TaskBlueprint
    from app.routes.auth_routes import blp as AuthBlueprint
    from app.routes.analytics_dashboard import blp as AnalyticsDashboardBlueprint
    api.register_blueprint(AuthBlueprint)
    api.register_blueprint(TaskBlueprint)
    api.register_blueprint(AnalyticsDashboardBlueprint)

    return app
    # if __name__ == '__main__':
    #       app.run(debug=True)
__all__ = ['create_app', 'db']  


# app/__init__.py

# from flask import Flask
# from flask_sqlalchemy import SQLAlchemy
# from flask_migrate import Migrate
# from flask_smorest import Api
# from config import Config
# from app.models import db, Task




# def create_app():
#     app = Flask(__name__)
#     app.config.from_object(Config)
    
    # app.config['API_TITLE'] = 'AI Productivity Assistant API'
    # app.config['API_VERSION'] = 'v1'
    # app.config['OPENAPI_VERSION'] = '3.0.3'
    # app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///app.db'
    # app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    # app.config['OPENAPI_URL_PREFIX'] = '/docs'   # URL path for OpenAPI docs
    # app.config['OPENAPI_SWAGGER_UI_PATH'] = '/api'  # Swagger UI path
    # app.config['OPENAPI_SWAGGER_UI_URL'] = 'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.11.0/'  # CDN for Swagger UI
  
#     db.init_app(app)
#     Migrate(app, db)
    
#     api = Api(app)
#     from app.routes.task_routes import blp as TaskBlueprint
#     # Register the blueprint for tasks
#     app.register_blueprint(TaskBlueprint)

#     return app

