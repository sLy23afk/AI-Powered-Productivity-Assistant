from datetime import datetime
from textblob import TextBlob

def calculate_priority(title, due_date):
    sentiment = TextBlob(title).sentiment.polarity
    if due_date is None:
        days_left = 9999  # Assign a large number if no due date
    else:
        days_left = (due_date - datetime.utcnow().date()).days

    print(f"Title: {title}")
    print(f"Sentiment polarity: {sentiment}")
    print(f"Days left: {days_left}")

    if days_left <= 1 and sentiment < 0:
        return 1  # Urgent and negative sentiment
    elif days_left <= 3:
        return 2
    elif days_left <= 7:
        return 3
    else:
        return 4  # Low priority
