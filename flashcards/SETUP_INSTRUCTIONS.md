# 🚀 Step-by-Step Setup Instructions

Follow these exact steps to run your Adaptive Learning Flashcards app.

## ⚠️ Critical: You Need TWO Terminal Windows

This app has **two separate servers** that must run simultaneously:
1. **Backend (Python/Flask)** on port 5000
2. **Frontend (React/Vite)** on port 3000

## 📋 Prerequisites Check

Before starting, verify you have:
- [ ] Python 3.8+ installed (`python3 --version`)
- [ ] Node.js 16+ installed (`node --version`)
- [ ] npm installed (`npm --version`)

---

## 🔴 TERMINAL 1: Backend Setup

### Step 1: Navigate to Backend
```bash
cd /workspace/flashcards/backend
```

### Step 2: Create Virtual Environment
```bash
python3 -m venv venv
```

### Step 3: Activate Virtual Environment

**On Linux/Mac:**
```bash
source venv/bin/activate
```

**On Windows:**
```bash
venv\Scripts\activate
```

You should see `(venv)` at the start of your terminal prompt.

### Step 4: Install Dependencies
```bash
pip install -r requirements.txt
```

### Step 5: Seed Sample Data (Optional but Recommended)
```bash
python seed.py
```

This creates 8 sample flashcards so you can test immediately.

### Step 6: Start Backend Server
```bash
python app.py
```

✅ **Success indicators:**
- You see: `Running on http://127.0.0.1:5000`
- No error messages
- Server stays running

🚨 **Keep this terminal open!** The backend must stay running.

---

## 🔵 TERMINAL 2: Frontend Setup

### Step 1: Open NEW Terminal
**Important:** Open a completely new terminal window/tab. Don't close the first one!

### Step 2: Navigate to Frontend
```bash
cd /workspace/flashcards/frontend
```

### Step 3: Install Dependencies
```bash
npm install
```

This might take 2-3 minutes. Wait for it to complete.

### Step 4: Start Frontend Server
```bash
npm run dev
```

✅ **Success indicators:**
- You see: `Local: http://localhost:3000`
- You see: `ready in XXX ms`
- Server stays running

🚨 **Keep this terminal open too!** Both servers must run together.

---

## 🌐 Step 3: Open the App

Open your web browser and go to:
```
http://localhost:3000
```

You should see the flashcard app with a beautiful purple gradient!

---

## ✅ Verification Checklist

- [ ] Terminal 1 shows Flask running on port 5000
- [ ] Terminal 2 shows Vite running on port 3000
- [ ] Browser shows the app at http://localhost:3000
- [ ] Dashboard displays statistics (0 or sample data)
- [ ] You can navigate between Home, Study, and Add Card pages

---

## 🎯 Quick Test

1. **View Dashboard**: Should show stats
2. **Click "Add New Card"**: Create a test flashcard
3. **Click "Start Studying"**: Review cards with the SM-2 algorithm
4. **Rate a card**: Try "Good" or "Easy" to see algorithm work

---

## 🐛 Common Problems & Solutions

### Problem: "Port 5000 already in use"
**Solution:**
1. Find what's using port 5000: `lsof -ti:5000`
2. Kill it: `kill -9 $(lsof -ti:5000)`
3. Or change port in `backend/.env`: `PORT=5001`

### Problem: "ModuleNotFoundError: No module named 'flask'"
**Solution:**
- Make sure virtual environment is activated (you see `(venv)` in prompt)
- Run `pip install -r requirements.txt` again

### Problem: "npm: command not found"
**Solution:**
- Install Node.js from https://nodejs.org/
- Verify: `node --version` should show v16+

### Problem: Frontend shows blank page
**Solution:**
1. Check browser console (F12) for errors
2. Verify backend is running: visit http://localhost:5000/api/cards
3. Hard refresh: Ctrl+Shift+R (Windows/Linux) or Cmd+Shift+R (Mac)

### Problem: "Cannot connect to backend"
**Solution:**
1. Ensure backend terminal is still running
2. Visit http://localhost:5000 directly - should show "Flashcard API is running!"
3. Check `frontend/src/api.js` - API_BASE_URL should be `http://localhost:5000/api`

### Problem: Changes not showing
**Solution:**
- For backend changes: Stop (Ctrl+C) and restart `python app.py`
- For frontend changes: Should auto-reload (Vite HMR)
- If stuck: Stop both servers, restart backend first, then frontend

---

## 🔄 Restarting the App Later

### Quick Start (if already set up):

**Terminal 1 (Backend):**
```bash
cd /workspace/flashcards/backend
source venv/bin/activate  # or venv\Scripts\activate on Windows
python app.py
```

**Terminal 2 (Frontend):**
```bash
cd /workspace/flashcards/frontend
npm run dev
```

---

## 🛑 Stopping the App

### To stop gracefully:
1. In Terminal 1 (Backend): Press `Ctrl + C`
2. In Terminal 2 (Frontend): Press `Ctrl + C`

Both servers will shut down cleanly.

---

## 📊 Understanding the Architecture

```
Browser (localhost:3000)
         ↓
    React Frontend
         ↓
    API Calls (fetch)
         ↓
    Flask Backend (localhost:5000)
         ↓
    SQLite Database (flashcards.db)
```

**Key Points:**
- Frontend makes HTTP requests to backend
- Backend processes requests and updates database
- SM-2 algorithm calculates review intervals
- Both servers must run for full functionality

---

## 🎓 Features to Test

1. **Create Cards**: Add several flashcards on different topics
2. **Study Session**: Review cards and rate your performance
3. **SM-2 Algorithm**: 
   - Rate "Again" → card returns next day
   - Rate "Easy" → card returns in ~14 days
4. **Statistics**: Watch your stats update after reviews
5. **Progress Tracking**: See mastered cards increase

---

## 📸 Expected Screenshots

### Dashboard
- 4 stat cards showing metrics
- List of all flashcards
- "Start Studying" and "Add Card" buttons

### Study Page
- One flashcard visible
- Click to flip front/back
- 4 rating buttons: Again, Hard, Good, Easy

### Add Card Page
- Question textarea
- Answer textarea
- Create button

---

## 🎉 Success!

If you can:
- ✅ View the dashboard
- ✅ Create a new flashcard
- ✅ Study and rate a flashcard
- ✅ See statistics update

**Congratulations!** Your app is working perfectly!

---

## 📱 Next Steps

- Customize the sample cards
- Add your own study material
- Track your progress over days
- Consider deployment (see main README.md)

---

**Need Help?** Check the main README.md for troubleshooting and API documentation.
