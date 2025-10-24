"""
Seed script to populate the database with sample flashcards
"""
from app import app
from models import db, Flashcard
from datetime import datetime

def seed_database():
    """Add sample flashcards to the database"""
    
    sample_cards = [
        {
            'question': 'What is the capital of France?',
            'answer': 'Paris',
            'category': 'Geography'
        },
        {
            'question': 'What is 2 + 2?',
            'answer': '4',
            'category': 'Math'
        },
        {
            'question': 'Who wrote "Romeo and Juliet"?',
            'answer': 'William Shakespeare',
            'category': 'Literature'
        },
        {
            'question': 'What is the largest planet in our solar system?',
            'answer': 'Jupiter',
            'category': 'Science'
        },
        {
            'question': 'In what year did World War II end?',
            'answer': '1945',
            'category': 'History'
        },
        {
            'question': 'What is the chemical symbol for gold?',
            'answer': 'Au',
            'category': 'Science'
        },
        {
            'question': 'What is the square root of 64?',
            'answer': '8',
            'category': 'Math'
        },
        {
            'question': 'Which programming language is known for its simplicity and readability?',
            'answer': 'Python',
            'category': 'Programming'
        }
    ]
    
    with app.app_context():
        # Clear existing cards (optional)
        # Flashcard.query.delete()
        
        # Add sample cards
        for card_data in sample_cards:
            # Check if card already exists
            existing = Flashcard.query.filter_by(
                question=card_data['question']
            ).first()
            
            if not existing:
                card = Flashcard(**card_data)
                db.session.add(card)
        
        db.session.commit()
        print(f"Database seeded with {len(sample_cards)} flashcards!")

if __name__ == '__main__':
    seed_database()