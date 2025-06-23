from sklearn.metrics.pairwise import cosine_similarity
from app.models import Task, User
import pandas as pd

def build_user_task_matrix(user_id):          
    # Get the user's tasks filtered by user_id
    tasks = Task.query.filter_by(user_id=user_id).all()
    data = [{"user_id": task.user_id, "task_title": task.title} for task in tasks]
    
    if not data:
        # Return empty DataFrame with expected columns to avoid KeyError
        return pd.DataFrame(columns=['user_id', 'task_title'])
    
    df = pd.DataFrame(data)
    user_task_matrix = df.pivot_table(index='user_id', columns='task_title', aggfunc=lambda x: 1, fill_value=0)
    
    return user_task_matrix

def get_similar_tasks(user_id, task_title, top_n=3):
    matrix = build_user_task_matrix(user_id)
    
    if task_title not in matrix.columns:
        return []  # Or fallback to AI suggestions
    
    similarity_matrix = cosine_similarity(matrix.T)
    task_index = list(matrix.columns).index(task_title)
    
    similar_task_scores = similarity_matrix[task_index]
    top_indices = similar_task_scores.argsort()[::-1][1:top_n+1]
    
    similar_tasks = [matrix.columns[i] for i in top_indices]
    return similar_tasks
