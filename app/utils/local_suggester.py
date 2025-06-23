def get_local_suggestions(task_title):
    keywords = {
        "meeting": ["Prepare agenda", "Send calendar invite", "Book conference room"],
        "report": ["Gather data", "Draft report", "Review with team"],
        "email": ["Draft email", "Send follow-up", "Attach documents"],
        "presentation": ["Create slides", "Practice delivery", "Check equipment"],
    }

    suggestions = []
    for keyword, tasks in keywords.items():
        if keyword in task_title.lower():
            suggestions.extend(tasks)

    return suggestions if suggestions else ["No specific suggestions available."]


def extra_suggestions(task_title):
    lowered = task_title.lower()
    if "assignment" in lowered:
        return "1. Research topic\n2. Draft answers\n3. Proofread\n4. Submit"

    if "email" in lowered:
        return "1. Draft message\n2. Add recipient\n3. Attach files\n4. Send"

    if "meeting" in lowered:
        return "1. Prepare agenda\n2. Book time slot\n3. Notify attendees"

    return "1. Break down into subtasks\n2. Prioritize\n3. Schedule on calendar"

