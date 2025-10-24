"""
SIMPLE FLASHCARD APP - Single File Backend
No ORM, No complexity, Just works!
"""

from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import sqlite3
from datetime import datetime, timedelta
import os

app = Flask(__name__, static_folder='static', static_url_path='')
CORS(app)

DB_FILE = 'flashcards.db'

# ==================== DATABASE SETUP ====================

def init_db():
    """Create database and table if they don't exist"""
    conn = sqlite3.connect(DB_FILE)
    c = conn.cursor()
    c.execute('''
        CREATE TABLE IF NOT EXISTS cards (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            question TEXT NOT NULL,
            answer TEXT NOT NULL,
            easiness REAL DEFAULT 2.5,
            repetitions INTEGER DEFAULT 0,
            interval INTEGER DEFAULT 0,
            next_review TEXT DEFAULT CURRENT_TIMESTAMP,
            created_at TEXT DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    conn.commit()
    conn.close()

def get_db():
    """Get database connection"""
    conn = sqlite3.connect(DB_FILE)
    conn.row_factory = sqlite3.Row  # Access columns by name
    return conn

# ==================== SM-2 ALGORITHM ====================

def calculate_sm2(easiness, repetitions, interval, quality):
    """
    Simple SM-2 algorithm
    quality: 0-5 (0=forgot, 5=perfect)
    """
    # Update easiness
    easiness = easiness + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02))
    if easiness < 1.3:
        easiness = 1.3
    
    # Update repetitions and interval
    if quality < 3:
        repetitions = 0
        interval = 1
    else:
        repetitions += 1
        if repetitions == 1:
            interval = 1
        elif repetitions == 2:
            interval = 6
        else:
            interval = round(interval * easiness)
    
    # Calculate next review date
    next_review = (datetime.now() + timedelta(days=interval)).isoformat()
    
    return easiness, repetitions, interval, next_review

# ==================== API ROUTES ====================

@app.route('/')
def index():
    """Serve the frontend"""
    return send_from_directory('static', 'index.html')

@app.route('/api/health')
def health():
    """Health check"""
    return jsonify({"status": "ok", "message": "Flashcard API running!"})

@app.route('/api/cards', methods=['GET'])
def get_cards():
    """Get all flashcards"""
    conn = get_db()
    cards = conn.execute('SELECT * FROM cards ORDER BY created_at DESC').fetchall()
    conn.close()
    return jsonify([dict(card) for card in cards])

@app.route('/api/cards', methods=['POST'])
def create_card():
    """Create new flashcard"""
    data = request.json
    question = data.get('question', '').strip()
    answer = data.get('answer', '').strip()
    
    if not question or not answer:
        return jsonify({"error": "Question and answer required"}), 400
    
    conn = get_db()
    cursor = conn.execute(
        'INSERT INTO cards (question, answer) VALUES (?, ?)',
        (question, answer)
    )
    conn.commit()
    card_id = cursor.lastrowid
    
    card = conn.execute('SELECT * FROM cards WHERE id = ?', (card_id,)).fetchone()
    conn.close()
    
    return jsonify(dict(card)), 201

@app.route('/api/cards/<int:card_id>', methods=['DELETE'])
def delete_card(card_id):
    """Delete a flashcard"""
    conn = get_db()
    conn.execute('DELETE FROM cards WHERE id = ?', (card_id,))
    conn.commit()
    conn.close()
    return jsonify({"message": "Card deleted"})

@app.route('/api/cards/due', methods=['GET'])
def get_due_cards():
    """Get cards due for review"""
    now = datetime.now().isoformat()
    conn = get_db()
    cards = conn.execute(
        'SELECT * FROM cards WHERE next_review <= ? ORDER BY next_review',
        (now,)
    ).fetchall()
    conn.close()
    return jsonify([dict(card) for card in cards])

@app.route('/api/cards/<int:card_id>/review', methods=['POST'])
def review_card(card_id):
    """Review a card (SM-2 algorithm)"""
    data = request.json
    quality = data.get('quality', 3)
    
    if not isinstance(quality, int) or quality < 0 or quality > 5:
        return jsonify({"error": "Quality must be 0-5"}), 400
    
    conn = get_db()
    card = conn.execute('SELECT * FROM cards WHERE id = ?', (card_id,)).fetchone()
    
    if not card:
        conn.close()
        return jsonify({"error": "Card not found"}), 404
    
    # Apply SM-2 algorithm
    easiness, repetitions, interval, next_review = calculate_sm2(
        card['easiness'], card['repetitions'], card['interval'], quality
    )
    
    # Update card
    conn.execute('''
        UPDATE cards 
        SET easiness = ?, repetitions = ?, interval = ?, next_review = ?
        WHERE id = ?
    ''', (easiness, repetitions, interval, next_review, card_id))
    conn.commit()
    
    updated_card = conn.execute('SELECT * FROM cards WHERE id = ?', (card_id,)).fetchone()
    conn.close()
    
    return jsonify({
        "message": "Review recorded",
        "card": dict(updated_card),
        "next_in_days": interval
    })

@app.route('/api/stats', methods=['GET'])
def get_stats():
    """Get statistics"""
    conn = get_db()
    total = conn.execute('SELECT COUNT(*) as count FROM cards').fetchone()['count']
    
    now = datetime.now().isoformat()
    due = conn.execute(
        'SELECT COUNT(*) as count FROM cards WHERE next_review <= ?', (now,)
    ).fetchone()['count']
    
    reviewed = conn.execute(
        'SELECT COUNT(*) as count FROM cards WHERE repetitions > 0'
    ).fetchone()['count']
    
    mastered = conn.execute(
        'SELECT COUNT(*) as count FROM cards WHERE repetitions >= 5'
    ).fetchone()['count']
    
    conn.close()
    
    return jsonify({
        "total_cards": total,
        "due_cards": due,
        "reviewed_cards": reviewed,
        "mastered_cards": mastered
    })

# ==================== SEED DATA ====================

@app.route('/api/seed', methods=['POST'])
def seed_data():
    """Add sample flashcards"""
    conn = get_db()
    
    # Check if already has data
    count = conn.execute('SELECT COUNT(*) as count FROM cards').fetchone()['count']
    if count > 0:
        conn.close()
        return jsonify({"message": "Database already has data"})
    
    samples = [
        ("What is the capital of France?", "Paris"),
        ("What is 2 + 2?", "4"),
        ("Who wrote Romeo and Juliet?", "William Shakespeare"),
        ("What is the chemical symbol for water?", "H2O"),
        ("What is the largest planet?", "Jupiter"),
        ("What does CPU stand for?", "Central Processing Unit"),
    ]
    
    conn.executemany(
        'INSERT INTO cards (question, answer) VALUES (?, ?)',
        samples
    )
    conn.commit()
    conn.close()
    
    return jsonify({"message": f"Added {len(samples)} sample cards"})

# ==================== MAIN ====================

if __name__ == '__main__':
    init_db()
    print("=" * 60)
    print("🧠 SIMPLE FLASHCARD APP")
    print("=" * 60)
    print("Backend API: http://localhost:5000")
    print("Frontend: http://localhost:5000")
    print("=" * 60)
    app.run(debug=True, host='0.0.0.0', port=5000)
