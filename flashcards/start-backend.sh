#!/bin/bash

# Start Backend Script for Flashcard App
echo "🔴 Starting Backend Server..."
echo ""

cd "$(dirname "$0")/backend"

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo "⚠️  Virtual environment not found. Creating one..."
    python3 -m venv venv
fi

# Activate virtual environment
echo "📦 Activating virtual environment..."
source venv/bin/activate

# Check if dependencies are installed
if [ ! -f "venv/lib/python*/site-packages/flask/__init__.py" ]; then
    echo "📥 Installing dependencies..."
    pip install -r requirements.txt
fi

# Check if database needs seeding
if [ ! -f "flashcards.db" ]; then
    echo "🌱 Seeding database with sample data..."
    python seed.py
fi

echo ""
echo "✅ Starting Flask server on port 5000..."
echo "🌐 Backend will be available at http://localhost:5000"
echo "⚠️  Keep this terminal open!"
echo ""

python app.py
