from sqlalchemy import Column, Integer, String, Float, DateTime
from datetime import datetime
from db import Base

class Flashcard(Base):
    __tablename__ = "flashcards"
    
    id = Column(Integer, primary_key=True, index=True)
    question = Column(String, nullable=False)
    answer = Column(String, nullable=False)
    
    # SM-2 Algorithm fields
    easiness_factor = Column(Float, default=2.5)  # EF
    repetitions = Column(Integer, default=0)      # n
    interval = Column(Integer, default=0)         # interval in days
    next_review = Column(DateTime, default=datetime.utcnow)
    
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def to_dict(self):
        return {
            "id": self.id,
            "question": self.question,
            "answer": self.answer,
            "easiness_factor": self.easiness_factor,
            "repetitions": self.repetitions,
            "interval": self.interval,
            "next_review": self.next_review.isoformat() if self.next_review else None,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None
        }
