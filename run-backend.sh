#!/bin/bash

echo "🚀 Starting Flashcard App Backend..."

# Navigate to backend directory
cd backend

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo "📦 Creating virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
echo "🔧 Activating virtual environment..."
source venv/bin/activate

# Install dependencies
echo "📋 Installing Python dependencies..."
pip install -r requirements.txt

# Seed database with sample data
echo "🌱 Seeding database..."
python seed.py

# Start Flask server
echo "🌟 Starting Flask server on http://localhost:5000"
echo "Press Ctrl+C to stop the server"
python app.py