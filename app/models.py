# from app import db

# class Task(db.Model):
#     id = db.Column(db.Integer, primary_key = True)
#     title = db.Column(db.String(100), nullable= False)
#     due_date = db.Column(db.DateTime)
#     status = db.Column(db.String(20), default='pending')

from flask_sqlalchemy import SQLAlchemy
from app import db
from datetime import datetime

class Task(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    due_date = db.Column(db.DateTime, nullable=True)
    status = db.Column(db.String(20), default='pending')
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    completed_at = db.Column(db.DateTime, nullable=True)  # Nullable for pending tasks
    priority = db.Column(db.Integer, default= 0)
    suggestions = db.Column(db.PickleType, nullable=True)  # Store suggestions as a list
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)  # Foreign key to User
    complimentary_tasks = db.Column(db.PickleType, nullable=True)  # Store complimentary tasks as a list
    
    def __repr__(self):
        return f'<Task {self.title}>'

    def to_dict(self):
        return {
            "id": self.id,
            "title": self.title,
            "due_date": self.due_date,
            "status": self.status,
            "user_id": self.user_id,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "completed_at": self.completed_at.isoformat() if self.completed_at else None,
            "priority": self.priority,
        }

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)
    
    tasks = db.relationship('Task', backref='user', lazy=True) # One-to-many relationship with Task
    
    def set_password(self, password):
        from werkzeug.security import generate_password_hash
        self.password_hash = generate_password_hash(password)
    
    def check_password(self, password):
        from werkzeug.security import check_password_hash
        return check_password_hash(self.password_hash, password)
    
    def __repr__(self):
        return f'<User {self.username}>'
    
    def to_dict(self):
        return {
            "id": self.id,
            "username": self.username,
            "email": self.email
        }