from flask.views import MethodView
from flask_smorest import Blueprint, abort
from flask import request, jsonify
from app.models import Task, User
from app import db
from app.schemas import UserRegisterSchema, UserLoginSchema, UserProfileSchema
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
# from flask_limiter import Limiter
# from flask_limiter.util import get_remote_address

blp = Blueprint("Auth", "auth", url_prefix = '/auth', description="Operations on authentication")

@blp.route("/register")
class UserRegister(MethodView):
    @blp.arguments(UserRegisterSchema)
    def post(self, user_data):
        if User.query.filter_by(email=user_data['email']).first():
            abort(400, message="Email already registered")
            
        new_user = User(
            username=user_data['username'],
            email=user_data['email']    
        )
        if User.query.filter_by(username=user_data['username']).first():
            abort(400, message="Username already exists")
            
        new_user.set_password(user_data['password'])
        db.session.add(new_user)
        db.session.commit()
        return {"message": "User registered successfully"}, 201
    
@blp.route("/login")
class Login(MethodView):
    @blp.arguments(UserLoginSchema)
    def post(self, user_data):
        #Initialize Limiter somewhere in your app (usually in app/__init__.py)
        # limiter = Limiter(get_remote_address, app=app, default_limits=["200 per day", "50 per hour"])

        # Apply rate limiting to this endpoint
        # You can also use @limiter.limit("5 per minute") decorator on the class or method

        user = User.query.filter_by(email=user_data['email']).first()
        if user and user.check_password(user_data['password']):
            token = create_access_token(identity=str(user.id))
            return {"access_token": token}, 200 
        else:
            abort(401, message="Invalid email or password")

@blp.route("/profile")
class Profile(MethodView):
    @jwt_required()
    @blp.response(200, UserProfileSchema)
    def get(self):
        username = request.args.get('username')
        if username:
            user = User.query.filter_by(username=username).first()
        else:
            user_id = get_jwt_identity()
            user = User.query.get(user_id)
        if not user:
            abort(404, message="User not found")
        
        return user
    
    
    