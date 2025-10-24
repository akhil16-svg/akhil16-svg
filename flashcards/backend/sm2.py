"""
SM-2 (SuperMemo 2) Spaced Repetition Algorithm
Quality rating: 0-5
  0: complete blackout
  1: incorrect response; correct answer remembered
  2: incorrect response; correct answer seemed easy to recall
  3: correct response recalled with serious difficulty
  4: correct response after hesitation
  5: perfect response
"""

from datetime import datetime, timedelta

def calculate_next_review(card, quality):
    """
    Calculate next review date based on SM-2 algorithm
    
    Args:
        card: Flashcard object with SM-2 fields
        quality: int (0-5) representing how well user recalled the answer
    
    Returns:
        tuple: (easiness_factor, repetitions, interval, next_review_date)
    """
    if quality < 0 or quality > 5:
        raise ValueError("Quality must be between 0 and 5")
    
    # Update easiness factor
    ef = card.easiness_factor
    ef = ef + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02))
    
    # Ensure EF doesn't go below 1.3
    if ef < 1.3:
        ef = 1.3
    
    # Update repetitions and interval
    if quality < 3:
        # Reset if quality is poor
        repetitions = 0
        interval = 1
    else:
        repetitions = card.repetitions + 1
        
        if repetitions == 1:
            interval = 1
        elif repetitions == 2:
            interval = 6
        else:
            interval = round(card.interval * ef)
    
    # Calculate next review date
    next_review = datetime.utcnow() + timedelta(days=interval)
    
    return ef, repetitions, interval, next_review
