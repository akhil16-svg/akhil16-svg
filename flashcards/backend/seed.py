"""
Seed database with sample flashcards
"""

from db import SessionLocal, init_db
from models import Flashcard

def seed_data():
    init_db()
    db = SessionLocal()
    
    # Check if data already exists
    if db.query(Flashcard).count() > 0:
        print("Database already has data. Skipping seed.")
        db.close()
        return
    
    sample_cards = [
        {
            "question": "What is the capital of France?",
            "answer": "Paris"
        },
        {
            "question": "What is 2 + 2?",
            "answer": "4"
        },
        {
            "question": "Who wrote 'Romeo and Juliet'?",
            "answer": "William Shakespeare"
        },
        {
            "question": "What is the chemical symbol for water?",
            "answer": "H2O"
        },
        {
            "question": "What is the largest planet in our solar system?",
            "answer": "Jupiter"
        },
        {
            "question": "What programming language is known for its use in data science?",
            "answer": "Python"
        },
        {
            "question": "What does CPU stand for?",
            "answer": "Central Processing Unit"
        },
        {
            "question": "What year did World War II end?",
            "answer": "1945"
        }
    ]
    
    for card_data in sample_cards:
        card = Flashcard(**card_data)
        db.add(card)
    
    db.commit()
    print(f"Seeded {len(sample_cards)} flashcards successfully!")
    db.close()

if __name__ == "__main__":
    seed_data()
