from flask import Flask, request, jsonify
from flask_cors import CORS
from datetime import datetime
import os
from dotenv import load_dotenv

from db import init_db, SessionLocal
from models import Flashcard
from sm2 import calculate_next_review
from schemas import validate_flashcard_create, validate_review_response

load_dotenv()

app = Flask(__name__)
CORS(app)

# Initialize database
init_db()

@app.route("/")
def home():
    return jsonify({"message": "Flashcard API is running!", "status": "ok"})

@app.route("/api/cards", methods=["GET"])
def get_cards():
    """Get all flashcards"""
    db = SessionLocal()
    try:
        cards = db.query(Flashcard).all()
        return jsonify([card.to_dict() for card in cards])
    finally:
        db.close()

@app.route("/api/cards", methods=["POST"])
def create_card():
    """Create a new flashcard"""
    data = request.get_json()
    
    valid, error = validate_flashcard_create(data)
    if not valid:
        return jsonify({"error": error}), 400
    
    db = SessionLocal()
    try:
        card = Flashcard(
            question=data["question"],
            answer=data["answer"]
        )
        db.add(card)
        db.commit()
        db.refresh(card)
        return jsonify(card.to_dict()), 201
    finally:
        db.close()

@app.route("/api/cards/<int:card_id>", methods=["GET"])
def get_card(card_id):
    """Get a specific flashcard"""
    db = SessionLocal()
    try:
        card = db.query(Flashcard).filter(Flashcard.id == card_id).first()
        if not card:
            return jsonify({"error": "Card not found"}), 404
        return jsonify(card.to_dict())
    finally:
        db.close()

@app.route("/api/cards/<int:card_id>", methods=["PUT"])
def update_card(card_id):
    """Update a flashcard"""
    data = request.get_json()
    
    db = SessionLocal()
    try:
        card = db.query(Flashcard).filter(Flashcard.id == card_id).first()
        if not card:
            return jsonify({"error": "Card not found"}), 404
        
        if "question" in data:
            card.question = data["question"]
        if "answer" in data:
            card.answer = data["answer"]
        
        card.updated_at = datetime.utcnow()
        db.commit()
        db.refresh(card)
        return jsonify(card.to_dict())
    finally:
        db.close()

@app.route("/api/cards/<int:card_id>", methods=["DELETE"])
def delete_card(card_id):
    """Delete a flashcard"""
    db = SessionLocal()
    try:
        card = db.query(Flashcard).filter(Flashcard.id == card_id).first()
        if not card:
            return jsonify({"error": "Card not found"}), 404
        
        db.delete(card)
        db.commit()
        return jsonify({"message": "Card deleted successfully"})
    finally:
        db.close()

@app.route("/api/cards/due", methods=["GET"])
def get_due_cards():
    """Get flashcards due for review"""
    db = SessionLocal()
    try:
        now = datetime.utcnow()
        cards = db.query(Flashcard).filter(Flashcard.next_review <= now).all()
        return jsonify([card.to_dict() for card in cards])
    finally:
        db.close()

@app.route("/api/cards/<int:card_id>/review", methods=["POST"])
def review_card(card_id):
    """Submit a review for a flashcard (SM-2 algorithm)"""
    data = request.get_json()
    
    valid, error = validate_review_response(data)
    if not valid:
        return jsonify({"error": error}), 400
    
    db = SessionLocal()
    try:
        card = db.query(Flashcard).filter(Flashcard.id == card_id).first()
        if not card:
            return jsonify({"error": "Card not found"}), 404
        
        quality = data["quality"]
        
        # Calculate next review using SM-2 algorithm
        ef, repetitions, interval, next_review = calculate_next_review(card, quality)
        
        # Update card
        card.easiness_factor = ef
        card.repetitions = repetitions
        card.interval = interval
        card.next_review = next_review
        card.updated_at = datetime.utcnow()
        
        db.commit()
        db.refresh(card)
        
        return jsonify({
            "message": "Review recorded successfully",
            "card": card.to_dict(),
            "next_review_in_days": interval
        })
    finally:
        db.close()

@app.route("/api/stats", methods=["GET"])
def get_stats():
    """Get learning statistics"""
    db = SessionLocal()
    try:
        total_cards = db.query(Flashcard).count()
        now = datetime.utcnow()
        due_cards = db.query(Flashcard).filter(Flashcard.next_review <= now).count()
        reviewed_cards = db.query(Flashcard).filter(Flashcard.repetitions > 0).count()
        
        return jsonify({
            "total_cards": total_cards,
            "due_cards": due_cards,
            "reviewed_cards": reviewed_cards,
            "mastered_cards": db.query(Flashcard).filter(Flashcard.repetitions >= 5).count()
        })
    finally:
        db.close()

if __name__ == "__main__":
    port = int(os.getenv("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=True)
