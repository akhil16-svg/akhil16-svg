from flask_sqlalchemy import SQLAlchemy
from datetime import datetime, timedelta
import json

db = SQLAlchemy()

class Flashcard(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    question = db.Column(db.Text, nullable=False)
    answer = db.Column(db.Text, nullable=False)
    category = db.Column(db.String(100), default='General')
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Spaced repetition fields
    ease_factor = db.Column(db.Float, default=2.5)  # SM2 algorithm
    interval = db.Column(db.Integer, default=1)     # Days until next review
    repetitions = db.Column(db.Integer, default=0)  # Number of successful reviews
    next_review = db.Column(db.DateTime, default=datetime.utcnow)
    last_reviewed = db.Column(db.DateTime)
    
    def to_dict(self):
        return {
            'id': self.id,
            'question': self.question,
            'answer': self.answer,
            'category': self.category,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'ease_factor': self.ease_factor,
            'interval': self.interval,
            'repetitions': self.repetitions,
            'next_review': self.next_review.isoformat() if self.next_review else None,
            'last_reviewed': self.last_reviewed.isoformat() if self.last_reviewed else None
        }

class StudySession(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    date = db.Column(db.Date, default=datetime.utcnow().date)
    cards_studied = db.Column(db.Integer, default=0)
    correct_answers = db.Column(db.Integer, default=0)
    total_time = db.Column(db.Integer, default=0)  # in seconds
    
    def to_dict(self):
        return {
            'id': self.id,
            'date': self.date.isoformat() if self.date else None,
            'cards_studied': self.cards_studied,
            'correct_answers': self.correct_answers,
            'total_time': self.total_time,
            'accuracy': round((self.correct_answers / self.cards_studied * 100), 2) if self.cards_studied > 0 else 0
        }