from flask import Flask, request, jsonify
from flask_cors import CORS
from datetime import datetime, date
import os
from dotenv import load_dotenv

from models import db, Flashcard, StudySession
from sm2 import calculate_next_review, get_quality_from_difficulty

# Load environment variables
load_dotenv()

app = Flask(__name__)
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'dev-secret-key')
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL', 'sqlite:///flashcards.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Initialize extensions
db.init_app(app)
CORS(app)

# Create tables
with app.app_context():
    db.create_all()

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({'status': 'healthy', 'timestamp': datetime.utcnow().isoformat()})

@app.route('/api/cards', methods=['GET'])
def get_cards():
    """Get all flashcards"""
    try:
        cards = Flashcard.query.all()
        return jsonify([card.to_dict() for card in cards])
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/cards', methods=['POST'])
def create_card():
    """Create a new flashcard"""
    try:
        data = request.get_json()
        
        if not data or not data.get('question') or not data.get('answer'):
            return jsonify({'error': 'Question and answer are required'}), 400
        
        card = Flashcard(
            question=data['question'],
            answer=data['answer'],
            category=data.get('category', 'General')
        )
        
        db.session.add(card)
        db.session.commit()
        
        return jsonify(card.to_dict()), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@app.route('/api/cards/<int:card_id>', methods=['PUT'])
def update_card(card_id):
    """Update a flashcard"""
    try:
        card = Flashcard.query.get_or_404(card_id)
        data = request.get_json()
        
        if 'question' in data:
            card.question = data['question']
        if 'answer' in data:
            card.answer = data['answer']
        if 'category' in data:
            card.category = data['category']
        
        db.session.commit()
        return jsonify(card.to_dict())
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@app.route('/api/cards/<int:card_id>', methods=['DELETE'])
def delete_card(card_id):
    """Delete a flashcard"""
    try:
        card = Flashcard.query.get_or_404(card_id)
        db.session.delete(card)
        db.session.commit()
        return jsonify({'message': 'Card deleted successfully'})
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@app.route('/api/study/due', methods=['GET'])
def get_due_cards():
    """Get cards that are due for review"""
    try:
        now = datetime.utcnow()
        due_cards = Flashcard.query.filter(Flashcard.next_review <= now).all()
        return jsonify([card.to_dict() for card in due_cards])
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/study/review', methods=['POST'])
def review_card():
    """Review a card and update its spaced repetition data"""
    try:
        data = request.get_json()
        card_id = data.get('card_id')
        difficulty = data.get('difficulty')  # 'easy', 'medium', 'hard', 'forgot'
        
        if not card_id or not difficulty:
            return jsonify({'error': 'card_id and difficulty are required'}), 400
        
        card = Flashcard.query.get_or_404(card_id)
        quality = get_quality_from_difficulty(difficulty)
        
        # Calculate new spaced repetition values
        new_ease_factor, new_interval, new_repetitions, next_review_date = calculate_next_review(
            card.ease_factor, card.interval, card.repetitions, quality
        )
        
        # Update card
        card.ease_factor = new_ease_factor
        card.interval = new_interval
        card.repetitions = new_repetitions
        card.next_review = next_review_date
        card.last_reviewed = datetime.utcnow()
        
        # Update or create study session for today
        today = date.today()
        session = StudySession.query.filter_by(date=today).first()
        
        if not session:
            session = StudySession(date=today)
            db.session.add(session)
        
        session.cards_studied += 1
        if quality >= 3:  # Correct answer
            session.correct_answers += 1
        
        db.session.commit()
        
        return jsonify({
            'card': card.to_dict(),
            'next_interval_days': new_interval,
            'message': f'Card will be reviewed again in {new_interval} days'
        })
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@app.route('/api/stats', methods=['GET'])
def get_stats():
    """Get study statistics"""
    try:
        total_cards = Flashcard.query.count()
        due_cards = Flashcard.query.filter(Flashcard.next_review <= datetime.utcnow()).count()
        
        # Get today's session
        today = date.today()
        today_session = StudySession.query.filter_by(date=today).first()
        
        # Get recent sessions for streak calculation
        recent_sessions = StudySession.query.order_by(StudySession.date.desc()).limit(30).all()
        
        return jsonify({
            'total_cards': total_cards,
            'due_cards': due_cards,
            'today_studied': today_session.cards_studied if today_session else 0,
            'today_accuracy': today_session.accuracy if today_session else 0,
            'recent_sessions': [session.to_dict() for session in recent_sessions]
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/categories', methods=['GET'])
def get_categories():
    """Get all unique categories"""
    try:
        categories = db.session.query(Flashcard.category).distinct().all()
        return jsonify([cat[0] for cat in categories if cat[0]])
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)