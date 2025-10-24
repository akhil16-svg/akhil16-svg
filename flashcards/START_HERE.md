# 🚀 START HERE - Flashcard App Quick Start

## 👋 Welcome!

This is your **complete, ready-to-run** Adaptive Learning Flashcard application!

---

## ⚡ Ultra-Quick Start (3 Steps)

### Step 1: Open TWO Terminals

You need two terminal windows/tabs because you're running two servers.

### Step 2: Terminal 1 - Start Backend

```bash
cd /workspace/flashcards
./start-backend.sh
```

**Keep this running!** ✅

### Step 3: Terminal 2 - Start Frontend

```bash
cd /workspace/flashcards
./start-frontend.sh
```

**Keep this running too!** ✅

### Step 4: Open Browser

Go to: **http://localhost:3000**

**🎉 Done! Your app is running!**

---

## 📖 Need More Details?

### For Complete Setup Instructions:
👉 Read: `SETUP_INSTRUCTIONS.md`

### For Terminal Troubleshooting:
👉 Read: `EXECUTION_GUIDE.md`

### For Technical Documentation:
👉 Read: `README.md`

### For Project Overview:
👉 Read: `PROJECT_SUMMARY.md`

---

## 🐛 Common Issue?

**Backend won't start?**
```bash
cd /workspace/flashcards/backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python app.py
```

**Frontend won't start?**
```bash
cd /workspace/flashcards/frontend
npm install
npm run dev
```

**Port already in use?**
```bash
kill -9 $(lsof -ti:5000)  # Kill backend
kill -9 $(lsof -ti:3000)  # Kill frontend
```

---

## ✅ Quick Test

1. Go to http://localhost:3000
2. Click "Add New Card"
3. Create a test flashcard
4. Click "Start Studying"
5. Flip card and rate it
6. Check dashboard stats

If all that works → **Perfect! ✅**

---

## 🎯 What This App Does

✅ Spaced repetition learning (SM-2 algorithm)  
✅ Intelligent review scheduling  
✅ Progress tracking  
✅ Beautiful, responsive UI  
✅ Offline-capable (SQLite database)  
✅ Full-stack (Python + React)  

---

## 🔑 Key Points

1. **Two Servers**: Backend (5000) + Frontend (3000)
2. **Keep Running**: Don't close terminals while using app
3. **Start Order**: Backend first, then frontend
4. **First Time**: Scripts handle all setup automatically

---

## 📁 Project Structure

```
flashcards/
├── backend/          ← Python/Flask API
├── frontend/         ← React UI
├── start-backend.sh  ← Run this in Terminal 1
├── start-frontend.sh ← Run this in Terminal 2
└── *.md             ← Documentation
```

---

## 🎓 Resume-Ready Features

✅ Full-stack development  
✅ Algorithm implementation (SM-2)  
✅ RESTful API design  
✅ Database management (SQLite)  
✅ Modern UI/UX (React)  
✅ State management  
✅ Responsive design  

---

## 🤝 Need Help?

1. Check `EXECUTION_GUIDE.md` for terminal issues
2. Check `SETUP_INSTRUCTIONS.md` for setup problems
3. Check browser console (F12) for frontend errors
4. Check terminal output for backend errors

---

**Questions? Check the other .md files for detailed explanations!**

**Ready to start? Run the two commands above!** 🚀
