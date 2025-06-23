from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from app.models import Task
from app import db

def recommend_similar_tasks(user_id, task_title, top_n = 3):
    user_tasks = Task.query.filter_by(user_id=user_id).all()
    task_titles = [task.title for task in user_tasks if task.title]
    
    if not task_titles:
        return []
    
    task_titles.append(task_title)  # Add the new task title for comparison
    
    vectorizer = TfidfVectorizer(stop_words='english')
    # Create TF-IDF matrix and compute cosine similarity
     # Fit the vectorizer on the task titles
    tfidf_matrix = vectorizer.fit_transform(task_titles)
    similarity_scores = cosine_similarity(tfidf_matrix[-1], tfidf_matrix[:-1])
     # Get indices of top N similar tasks
     
    top_indices = similarity_scores[0].argsort()[::-1][:top_n]
    suggestions = [task_titles[i] for i in top_indices]
    
    return suggestions