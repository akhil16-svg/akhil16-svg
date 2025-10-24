"""
Data validation schemas
"""

def validate_flashcard_create(data):
    """Validate flashcard creation data"""
    if not data.get("question"):
        return False, "Question is required"
    if not data.get("answer"):
        return False, "Answer is required"
    return True, None

def validate_review_response(data):
    """Validate review response data"""
    if "quality" not in data:
        return False, "Quality rating is required"
    
    quality = data.get("quality")
    if not isinstance(quality, int) or quality < 0 or quality > 5:
        return False, "Quality must be an integer between 0 and 5"
    
    return True, None
