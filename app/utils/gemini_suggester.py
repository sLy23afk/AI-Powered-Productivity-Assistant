import os
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
try:
    model = genai.GenerativeModel("gemini-1.5-flash")  # Full model path is required
except Exception as e:
    print("Failed to initialize Gemini model:", e)
    # Optional: List models if needed
    models = genai.list_models()
    print("Available models:")
    for m in models:
        print("-", m.name)
    raise SystemExit("Exiting due to incorrect model configuration.")

def get_suggestions(task_title):
    try:
        prompt = f"""You are a productivity Guru for the last 10 years. 
        Given the task: "{task_title}", suggest exactly 3 short,key and practical subtasks or tips (each under 20 words) to help complete it.
        Respond ONLY with a numbered list. No intros(self-introductions), no explanations. Make sure to use a friendly and encouraging tone."""
        
        response = model.generate_content(prompt)
        text = response.text.strip()
        suggestions = [line.strip("-• ") for line in text.split("\n") if line.strip()]
        return suggestions[:3] if suggestions else None
    except Exception as e:
        print(f"Gemini Error: {e}")
        return None
    
def task_suggestions(task_title):
    try:
        task_help = f"""You are a productivity Guru for the last 10 years.
        Given the task: "{task_title}", suggest exactly 2 similar tasks (no more than 6-10 words) that can be done in contrast with the task in hand, which would be beneficial as a whole.
        Respond ONLY with a numbered list. No intros(self-introductions), no explanations."""
        response = model.generate_content(task_help)
        text = response.text.strip()
        suggestion = [line.strip("-• ") for line in text.split("\n") if line.strip()]
        return suggestion[:2] if suggestion else None
    
    except Exception as e:
        print(f"Gemini Error: {e}")
        return None
    
    
