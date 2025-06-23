import spacy
from dateparser.search import search_dates
from app.utils.priority import calculate_priority
import re
from datetime import datetime

nlp = spacy.load('en_core_web_sm')

def parse_user_input(input_text):
    parsed_date = None
    cleaned_task = input_text
    # Define weekdays
    weekdays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
    
    # Replace "coming <day>" with "next <day>" for better date parsing
    for day in weekdays:
        pattern = r'\bcoming\s+' + day + r'\b'
        replacement = 'next ' + day
        input_text = re.sub(pattern, replacement, input_text, flags=re.IGNORECASE)
    
    settings = {
        'PREFER_DATES_FROM': 'future',  # Prefer future dates when ambiguous
        'RELATIVE_BASE': datetime.now(),  # Use current date as base for relative dates
        'RETURN_AS_TIMEZONE_AWARE': False,  # Return naive datetime objects
        'STRICT_PARSING': False,  # Disable strict parsing to allow relative dates like "tomorrow"
    }
    results = search_dates(input_text, settings=settings)
    if results:
        # Extract the first valid parsed date
        for phrase, date_obj in results:
            if date_obj:
                parsed_date = date_obj
                # Remove all date phrases from the input text for cleaned_task
                for phrase_to_remove, _ in results:
                    cleaned_task = re.sub(re.escape(phrase_to_remove), '', input_text, flags=re.IGNORECASE)
                break
    else:
        cleaned_task = input_text

    # Remove weekday names from cleaned_task to avoid leftover day names
    for day in weekdays:
        cleaned_task = re.sub(r'\b' + day + r'\b', '', cleaned_task, flags=re.IGNORECASE)

    # Remove extra whitespace and punctuation only
    cleaned_task = re.sub(r'\s+', ' ', cleaned_task).strip(" ,.-")

    # Check for priority words
    # lowered = input_text.lower()
    # priority_words = {
    #     "urgent": ["immediately", "asap", "urgent", "emergency", "now", "important"],
    #     "high": ["today", "soon", "quick", "fast"],
    #     "low": ["next week", "eventually", "later"]
    #}
    # for priority_level, words in priority_words.items():
    #     if any(word in lowered for word in words):
    #         priority = priority_level
    #         break
    
    priority = calculate_priority(cleaned_task, parsed_date.date() if parsed_date else None)

    return {
        "title": input_text,
        "cleaned_task": cleaned_task,
        "due_date": parsed_date.isoformat() if parsed_date else None,
        "priority": priority
    }
