# ⚡ Quick Execution Guide

## 🎯 The Problem You Mentioned

You said: *"I think it is because of not properly handling the backend and frontend execution steps on the terminal."*

**You were absolutely right!** This is the #1 issue with full-stack apps.

## ✅ The Solution: 2 Terminals, 2 Servers

Here's the exact execution pattern:

---

## 🔴 TERMINAL 1: Start Backend FIRST

```bash
# Navigate to backend
cd /workspace/flashcards/backend

# Activate virtual environment
source venv/bin/activate

# Start Flask server
python app.py
```

**Keep running!** You should see:
```
* Running on http://127.0.0.1:5000
```

---

## 🔵 TERMINAL 2: Start Frontend SECOND

```bash
# Open NEW terminal (don't close Terminal 1!)
# Navigate to frontend
cd /workspace/flashcards/frontend

# Start React dev server
npm run dev
```

**Keep running!** You should see:
```
Local: http://localhost:3000
```

---

## 🌐 Access the App

Open browser: **http://localhost:3000**

---

## 🎬 First Time Setup Commands

If this is your first time running the app, execute these in order:

### Terminal 1: Backend Setup
```bash
cd /workspace/flashcards/backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python seed.py              # Add sample data
python app.py               # Start server ← LEAVE RUNNING
```

### Terminal 2: Frontend Setup
```bash
cd /workspace/flashcards/frontend
npm install                 # Install dependencies
npm run dev                 # Start server ← LEAVE RUNNING
```

---

## 🔄 Subsequent Runs (After First Setup)

### Terminal 1:
```bash
cd /workspace/flashcards/backend
source venv/bin/activate
python app.py
```

### Terminal 2:
```bash
cd /workspace/flashcards/frontend
npm run dev
```

---

## 🛑 How to Stop

1. **Terminal 1**: Press `Ctrl + C` (stops backend)
2. **Terminal 2**: Press `Ctrl + C` (stops frontend)

---

## ⚠️ Common Mistakes to AVOID

❌ **Mistake 1**: Starting frontend before backend
- Frontend will fail to load data
- Always start backend first!

❌ **Mistake 2**: Closing terminal after starting server
- Server stops immediately
- Keep both terminals open while using app

❌ **Mistake 3**: Running both in one terminal
- You need TWO separate terminals
- Use `&` or terminal tabs/windows

❌ **Mistake 4**: Not activating virtual environment
- Backend dependencies won't be found
- Always activate: `source venv/bin/activate`

---

## ✅ What Success Looks Like

### Terminal 1 Output:
```
(venv) $ python app.py
 * Serving Flask app 'app'
 * Debug mode: on
 * Running on http://127.0.0.1:5000
Press CTRL+C to quit
```

### Terminal 2 Output:
```
$ npm run dev
  VITE v5.0.8  ready in 324 ms
  ➜  Local:   http://localhost:3000/
  ➜  press h to show help
```

### Browser:
- Beautiful purple gradient background
- "🧠 Flashcards" navbar
- Dashboard with statistics
- No console errors (press F12 to check)

---

## 🧪 Quick Verification Test

1. **Backend Test**: Visit http://localhost:5000
   - Should see: `{"message": "Flashcard API is running!", "status": "ok"}`

2. **Frontend Test**: Visit http://localhost:3000
   - Should see: Full flashcard app interface

3. **Integration Test**: 
   - Click "Add New Card" 
   - Create a card
   - If it saves → Full stack is working! ✅

---

## 🐛 Error Solutions

### Error: "Address already in use (port 5000)"
```bash
# Kill process on port 5000
kill -9 $(lsof -ti:5000)
# Then start backend again
```

### Error: "Connection refused" in browser
```bash
# Backend isn't running!
# Go to Terminal 1 and start: python app.py
```

### Error: "Module not found"
```bash
# Virtual environment not activated
source venv/bin/activate
# Then try again
```

### Error: "npm: command not found"
```bash
# Install Node.js first from https://nodejs.org
# Then try: npm install
```

---

## 📊 Process Flow Diagram

```
YOU
 │
 ├─→ Terminal 1 (Backend)
 │   └─→ Python/Flask @ port 5000
 │       └─→ SQLite Database
 │
 └─→ Terminal 2 (Frontend)
     └─→ React/Vite @ port 3000
         └─→ Makes API calls to Backend
```

---

## 🎓 Understanding the Architecture

1. **Backend (Flask)**: 
   - Handles data storage
   - Runs SM-2 algorithm
   - Provides REST API
   - Port: 5000

2. **Frontend (React)**:
   - User interface
   - Makes HTTP requests to backend
   - Displays data beautifully
   - Port: 3000

3. **Communication**:
   - Frontend calls: `http://localhost:5000/api/cards`
   - Backend responds with JSON
   - CORS enabled for local development

---

## 🚀 Pro Tips

1. **Use Terminal Multiplexers**: 
   - `tmux` or `screen` to manage multiple terminals
   - Split panes in VS Code terminal

2. **Create Start Scripts**:
   - See `start-backend.sh` and `start-frontend.sh` in the project

3. **Check Logs**:
   - Backend logs show API requests
   - Frontend console (F12) shows errors

4. **Development Workflow**:
   - Edit code
   - Changes auto-reload (hot reload enabled)
   - Test in browser
   - Check both terminal logs for errors

---

## 📝 Checklist Before Starting

- [ ] Python 3.8+ installed
- [ ] Node.js 16+ installed  
- [ ] Two terminals ready
- [ ] Internet connection (for first-time npm install)
- [ ] Ports 5000 and 3000 available

---

## ✨ You're Ready!

Follow the steps above and your app will run smoothly. The key is:
1. **TWO terminals**
2. **Backend starts FIRST**
3. **Keep both RUNNING**
4. **Open browser to localhost:3000**

Good luck! 🚀
