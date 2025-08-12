import requests
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# This script uploads a list of tasks to a task management API.
# IMPORTANT: Set your JWT token in .env file as JWT_TOKEN=your_token_here

tasks = [
    "Write blog on machine learning trends",
    "Research deep learning techniques",
    "Watch a tutorial on neural networks",
    "Organize AI study notes",
    "Review past project documentation",
    "Outline chapter 3 for research paper",
    "Draft introduction for final thesis"
]

# Get JWT token from environment variable
JWT_TOKEN = os.getenv('JWT_TOKEN')
if not JWT_TOKEN:
    raise ValueError("JWT_TOKEN environment variable is required. Set it in your .env file.")

headers = {
    "Authorization": f"Bearer {JWT_TOKEN}",
    "content-type": "application/json"
}
URL = "http://localhost:5000/tasks/"

for title in tasks:
    data = {
        "title": title,
        "status": "pending"
    }
    
    response = requests.post(URL, json=data, headers=headers)
    print(f"Task: {title}")
    print("Status:", response.status_code)
    print("Response:", response.json())
    print("------")
