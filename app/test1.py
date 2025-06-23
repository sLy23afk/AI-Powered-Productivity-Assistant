from utils.priority import calculate_priority
from datetime import datetime

# Sample task title and due date
title = "Fix major issue in billing"
due_date = datetime.strptime("2025-06-06", "%Y-%m-%d").date()

priority = calculate_priority(title, due_date)
print("Calculated Priority:", priority)  # Expecting 1 or 2
