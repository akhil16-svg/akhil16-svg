#!/bin/bash

# Start Frontend Script for Flashcard App
echo "🔵 Starting Frontend Server..."
echo ""

cd "$(dirname "$0")/frontend"

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📥 Installing npm dependencies..."
    echo "⏳ This may take 2-3 minutes..."
    npm install
fi

echo ""
echo "✅ Starting Vite dev server on port 3000..."
echo "🌐 Open your browser to http://localhost:3000"
echo "⚠️  Keep this terminal open!"
echo ""

npm run dev
