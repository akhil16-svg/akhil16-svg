#!/bin/bash

echo "=================================================="
echo "   🧠 SIMPLE FLASHCARD APP - AUTO SETUP"
echo "=================================================="
echo ""

cd "$(dirname "$0")"

# Check if Flask is installed
if ! python -c "import flask" 2>/dev/null; then
    echo "📦 Installing dependencies..."
    pip install -r requirements.txt
    echo ""
fi

echo "✅ Starting application..."
echo ""
echo "🌐 Open browser to: http://localhost:5000"
echo "⚠️  Press Ctrl+C to stop"
echo ""
echo "=================================================="
echo ""

python app.py
