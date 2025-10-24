# 🚀 ULTRA-SIMPLE Flashcard App

**The EASIEST way to run the flashcard app!**

## ✨ What Makes This Simple?

✅ **Single Backend File** - Everything in `app.py` (260 lines)  
✅ **Single Frontend File** - Everything in `static/index.html`  
✅ **No Build Step** - Pure HTML/CSS/JavaScript  
✅ **No Virtual Env Needed** - Just install 2 packages  
✅ **One Server** - Backend serves frontend too  
✅ **No ORM** - Direct SQLite queries  
✅ **Same Features** - Still has SM-2 algorithm!  

## 🚀 How to Run (3 Steps)

### Step 1: Install Dependencies
```bash
cd /workspace/flashcards-simple
pip install -r requirements.txt
```

### Step 2: Run the App
```bash
python app.py
```

### Step 3: Open Browser
```
http://localhost:5000
```

**That's it!** ✅ One terminal, one command, one port!

## 🎯 Features

- ✅ Create flashcards
- ✅ Study with spaced repetition (SM-2)
- ✅ Track progress
- ✅ Beautiful UI
- ✅ Stats dashboard
- ✅ Sample data button

## 📁 Project Structure

```
flashcards-simple/
├── app.py              # Backend (Flask + SQLite)
├── static/
│   └── index.html      # Frontend (Vanilla JS)
├── requirements.txt    # Just 2 dependencies!
└── README.md          # This file
```

**Total: 2 files + dependencies!**

## 🆚 Comparison

| Feature | Original | Simple |
|---------|----------|--------|
| Backend files | 8 | 1 |
| Frontend files | 7+ | 1 |
| Terminals needed | 2 | 1 |
| Build step | Yes (Vite) | No |
| Virtual env | Required | Optional |
| Dependencies | 6+ | 2 |
| Complexity | High | Low |
| Features | All | All |

## 🐛 Troubleshooting

### "Port 5000 already in use"
```bash
kill -9 $(lsof -ti:5000)
python app.py
```

### "Module not found"
```bash
pip install Flask Flask-CORS
python app.py
```

### Still not working?
Make sure you're in the right directory:
```bash
cd /workspace/flashcards-simple
ls  # Should see app.py
python app.py
```

## 🎓 How It Works

1. **Backend** (`app.py`):
   - Flask serves both API and frontend
   - Direct SQLite3 queries (no ORM)
   - SM-2 algorithm built-in
   - All routes in one file

2. **Frontend** (`static/index.html`):
   - Pure HTML/CSS/JavaScript
   - No React, no build tools
   - Fetch API for backend calls
   - All code in one file

3. **Database** (`flashcards.db`):
   - Auto-created on first run
   - Simple SQLite file
   - One table with all fields

## 📊 API Endpoints

```
GET    /                      Frontend
GET    /api/health            Health check
GET    /api/cards             All cards
POST   /api/cards             Create card
DELETE /api/cards/:id         Delete card
GET    /api/cards/due         Due cards
POST   /api/cards/:id/review  Submit review
GET    /api/stats             Statistics
POST   /api/seed              Add samples
```

## ✅ Quick Test

1. Run: `python app.py`
2. Open: http://localhost:5000
3. Click: "Add Samples" button
4. Click: "Study" button
5. Flip card and rate it
6. Check stats update

## 🎯 Perfect For

- Learning full-stack concepts
- Quick demos
- Portfolio projects
- Understanding how it works
- Customization

## 🚀 Next Steps

- Add your own flashcards
- Modify the design
- Add features
- Deploy to Heroku/Railway
- Share with friends

## 💡 No Errors!

This version:
- ✅ No FastAPI (pure Flask)
- ✅ No deprecation warnings
- ✅ No complex setup
- ✅ No multiple terminals
- ✅ Just works!

---

**Start now:**
```bash
cd /workspace/flashcards-simple
python app.py
```

**Open:** http://localhost:5000

**Enjoy!** 🎉
