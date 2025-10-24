"""
SM2 (SuperMemo 2) Spaced Repetition Algorithm
This algorithm determines when to show a flashcard next based on how well the user performed.
"""
from datetime import datetime, timedelta
import math

def calculate_next_review(ease_factor, interval, repetitions, quality):
    """
    Calculate next review date using SM2 algorithm
    
    Args:
        ease_factor (float): Current ease factor (starts at 2.5)
        interval (int): Current interval in days
        repetitions (int): Number of successful repetitions
        quality (int): Quality of response (0-5, where 3+ is correct)
    
    Returns:
        tuple: (new_ease_factor, new_interval, new_repetitions, next_review_date)
    """
    
    if quality < 3:
        # Incorrect answer - reset repetitions and set short interval
        new_repetitions = 0
        new_interval = 1
        new_ease_factor = ease_factor
    else:
        # Correct answer
        new_repetitions = repetitions + 1
        
        if new_repetitions == 1:
            new_interval = 1
        elif new_repetitions == 2:
            new_interval = 6
        else:
            new_interval = math.ceil(interval * ease_factor)
        
        # Update ease factor based on quality
        new_ease_factor = ease_factor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02))
        
        # Ensure ease factor doesn't go below 1.3
        new_ease_factor = max(1.3, new_ease_factor)
    
    # Calculate next review date
    next_review_date = datetime.utcnow() + timedelta(days=new_interval)
    
    return new_ease_factor, new_interval, new_repetitions, next_review_date

def get_quality_from_difficulty(difficulty):
    """
    Convert user difficulty rating to SM2 quality score
    
    Args:
        difficulty (str): 'easy', 'medium', 'hard', or 'forgot'
    
    Returns:
        int: Quality score for SM2 algorithm
    """
    difficulty_map = {
        'forgot': 0,    # Complete blackout
        'hard': 2,      # Difficult, but remembered
        'medium': 3,    # Some hesitation
        'easy': 5       # Perfect response
    }
    
    return difficulty_map.get(difficulty.lower(), 3)