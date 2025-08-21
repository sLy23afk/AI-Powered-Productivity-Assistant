from flask.views import MethodView
from flask_smorest import Blueprint, abort
from sqlalchemy.exc import SQLAlchemyError
from app.models import db, Task, User
from app.schemas import TaskSchema, TaskCreateSchema, TaskUpdateSchema
from app.utils.nlp_parser import parse_user_input
from datetime import timedelta
from app.utils.gemini_suggester import get_suggestions, task_suggestions
from app.utils.local_suggester import get_local_suggestions
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.utils.content_recommender import recommend_similar_tasks
from app.utils.recommendation_engine import build_user_task_matrix, get_similar_tasks
from datetime import datetime

blp = Blueprint("tasks", "tasks", url_prefix="/tasks", description="Operations on tasks")


@blp.route("/")
class TasksList(MethodView):
    
    @jwt_required()
    @blp.response(200, TaskSchema(many=True))
    def get(self):
        """Get all tasks for the logged-in user"""
        user_id = get_jwt_identity()
        if not user_id:
            abort(401, message="User not authenticated.")
        return Task.query.filter_by(user_id=user_id).all()
    
    @jwt_required()
    @blp.arguments(TaskCreateSchema)
    @blp.response(201, TaskSchema)
    def post(self, task_data):
        user_id = get_jwt_identity()
        user_input = task_data.get("title")
        print(f"Received user_input: '{user_input}'")  # Debug print to check input before parsing
        if not user_input:
            abort(400, message="Title is required.")

        # Use NLP parser to extract due date
        parsed = parse_user_input(user_input)
        print(f"parse_user_input output: {parsed}")  # Debug print to check due_date
        task_title = parsed["cleaned_task"]
        due_date = parsed["due_date"]  # ISO format string if exists
        priority = parsed["priority"]
        
        # Convert ISO string to datetime object if due_date exists
        if due_date:
            from datetime import datetime
            due_date = datetime.fromisoformat(due_date)
            
        
        # Get suggestions from OpenAI (Gemini)
        suggestions = get_suggestions(task_title)
        if not suggestions:
            suggestions = get_local_suggestions(task_title)
        
        # ideal_task_suggestions = recommend_similar_tasks(user_id, task_title)
        # if not ideal_task_suggestions:
        #     ideal_task_suggestions = task_suggestions(task_title)    
        complimentary_tasks = get_similar_tasks(user_id, task_title)
        if not complimentary_tasks:
            complimentary_tasks = task_suggestions(task_title)
        status = task_data.get("status", "pending")
        if due_date:
            now = datetime.now()
            if due_date - now <= timedelta(days=1):
                status = "urgent"
        created_at = task_data.get("created_at", datetime.now())
        # Create Task object
        new_task = Task(
            title=task_title,
            due_date=due_date,
            status=status,
            priority=priority,
            suggestions = suggestions,
            complimentary_tasks = complimentary_tasks,
            created_at = created_at,
            user_id = user_id
        )
         
        try:
            db.session.add(new_task)
            db.session.commit()
        except Exception as e:
            db.session.rollback()
            import traceback
            traceback.print_exc()
            abort(500, message=f"An error occurred while creating the task: {str(e)}")
        # Ensure due_date is a datetime object before serialization
        from datetime import datetime
        if new_task.due_date and isinstance(new_task.due_date, str):
            new_task.due_date = datetime.fromisoformat(new_task.due_date)
        
        return new_task, 201

# @blp.route("/recommendations")
# class TaskRecommendations(MethodView):
    
#     @jwt_required()
#     @blp.arguments(TaskCreateSchema)
#     @blp.response(200, TaskSchema(many=True))
#     def post(self, task_data):
#         """Get task recommendations based on a given task title"""
#         user_id = get_jwt_identity()
#         if not user_id:
#             abort(401, message="User not authenticated.")
        
#         task_title = task_data.get("title")
#         if not task_title:
#             abort(400, message="Title is required for recommendations.")
        
#         # Get recommendations from the content recommender
#         recommendations = recommend_similar_tasks(task_title)
#         if not recommendations:
#             abort(404, message="No recommendations found.")
        
#         return recommendations, 200


@blp.route("/<int:task_id>")
class TaskDetail(MethodView):
    
    @jwt_required()
    @blp.response(200, TaskSchema)
    def get(self, task_id):
        """Get a task by ID"""
        user_id = get_jwt_identity()
        task = Task.query.get_or_404(task_id)
        return task
    
    @jwt_required()
    @blp.arguments(TaskUpdateSchema)
    @blp.response(200, TaskSchema)
    def put(self, task_data, task_id):
        """Update a task"""
        user_id = get_jwt_identity()
        task = Task.query.get_or_404(task_id)
        task.title = task_data.get("title", task.title)
        task.due_date = task_data.get("due_date", task.due_date)
        task.status = task_data.get("status", task.status)
        task.created_at = task_data.get("created_at", task.created_at)  
        try:
            db.session.commit()
        except SQLAlchemyError:
            db.session.rollback()
            abort(500, message="An error occurred while updating the task.")
        return task
    
    @jwt_required()
    @blp.response(204)
    def delete(self, task_id):
        """Delete a task"""
        user_id = get_jwt_identity()
        if not user_id:
            abort(401, message="User not authenticated.")
        task = Task.query.get_or_404(task_id)
        try:
            db.session.delete(task)
            db.session.commit()
        except SQLAlchemyError:
            db.session.rollback()
            abort(500, message="An error occurred while deleting the task.")
        return "Task deleted", 204
