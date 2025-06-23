from flask.views import MethodView
from flask_smorest import Blueprint, abort
from flask import request, jsonify
from app.models import Task, User
from app import db
from datetime import datetime, timedelta
from flask_jwt_extended import jwt_required, get_jwt_identity

blp = Blueprint("AnalyticsDashboard", "analytics_dashboard", url_prefix='/analytics', description="Operations on analytics dashboard")

@blp.route("/overview")
class AnalyticsDashboard(MethodView):
    @jwt_required()
    def get(self):
        user_id = get_jwt_identity()
        if not user_id:
            abort(401, message="User not authenticated.")
        
        # Fetch tasks for the user
        username = request.args.get('username')
        if username:
            user = User.query.filter_by(username=username).first()
        else:
            user_id = get_jwt_identity()
            user = User.query.get(user_id)
        
        tasks = Task.query.filter_by(user_id=user_id).all()
        if not tasks:
            return jsonify({"message": "No tasks found for this user."}), 404
        
        # Calculate task statistics
        total_tasks = len(tasks)
        completed_tasks = sum(1 for task in tasks if task.status == 'completed')
        pending_tasks = total_tasks - completed_tasks
        overdue_tasks = sum(1 for task in tasks if task.due_date and task.due_date < datetime.utcnow() and task.status != 'completed')
        today = datetime.utcnow().date()
        past_7_days = today - timedelta(days=6)

        last_week_tasks = Task.query.filter(
            Task.user_id == user_id,
            Task.created_at >= past_7_days
        ).all()

        day_counts = {}
        for i in range(7):
            date = today - timedelta(days=i)
            day_counts[date.strftime("%Y-%m-%d")] = 0

        for task in last_week_tasks:
            day = task.created_at.date().strftime("%Y-%m-%d")
            if day in day_counts:
                day_counts[day] += 1
        # Prepare the response data
        response_data = {
            "username": user.username if user else "Unknown User",
            "user_id": user.id if user else None,
            "email": user.email if user else "No Email",
            "total_tasks": total_tasks,
            "completed_tasks": completed_tasks,
            "pending_tasks": pending_tasks,
            "overdue_tasks": overdue_tasks,
            "weekly_task_distribution": day_counts,
            "tasks": [task.to_dict() for task in tasks]
        }
        
        return jsonify(response_data), 200