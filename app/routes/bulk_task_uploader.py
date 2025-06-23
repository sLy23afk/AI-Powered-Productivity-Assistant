import requests
# This script uploads a list of tasks to a task management API.


tasks = [
    "Write blog on machine learning trends",
    "Research deep learning techniques",
    "Watch a tutorial on neural networks",
    "Organize AI study notes",
    "Review past project documentation",
    "Outline chapter 3 for research paper",
    "Draft introduction for final thesis"
]

JWT_TOKEN = "your_jwt_token_here"
headers = {"Authorization": f"Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmcmVzaCI6ZmFsc2UsImlhdCI6MTc1MDMwMjYwNSwianRpIjoiNTUxZWM3NWUtNTg3MC00MThiLWJkYjctZWU0MGM5ZmNhMDNhIiwidHlwZSI6ImFjY2VzcyIsInN1YiI6IjIiLCJuYmYiOjE3NTAzMDI2MDUsImNzcmYiOiI4NjI3NWVkOS1lNmViLTQxYTUtYTk1Mi03NjYxY2U2Y2QzYWIiLCJleHAiOjE3NTAzMDM1MDV9.0IshImW1kSGg4tKeyzYRx1nrhYkdcb7nNqN6phao9D8",
           "content-type": "application/json"}
URL = "http://localhost:5000/tasks/"

for title in tasks:
    data = {"title": title,
            "status": "pending",}
    
    response = requests.post(URL, json=data, headers=headers)
    print(f"Task: {title}")
    print("Status:", response.status_code)
    print("Response:", response.json())
    print("------")