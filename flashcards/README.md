# 🧠 Adaptive Learning Flashcards

A full-stack flashcard application implementing the SM-2 spaced repetition algorithm for optimized learning.

## ✨ Features

- **Spaced Repetition Algorithm (SM-2)**: Intelligent review scheduling based on your performance
- **Beautiful UI**: Modern, responsive design with smooth animations
- **Progress Tracking**: Track your learning stats and mastered cards
- **Offline-Ready Architecture**: Built with a local database for offline capability
- **RESTful API**: Clean backend API for all flashcard operations

## 🛠️ Tech Stack

**Backend:**
- Python 3.8+
- Flask (Web Framework)
- SQLAlchemy (ORM)
- SQLite (Database)

**Frontend:**
- React 18
- React Router
- Vite (Build Tool)
- Modern CSS with Animations

## 📁 Project Structure

```
flashcards/
├── backend/
│   ├── app.py          # Flask application & API routes
│   ├── models.py       # Database models
│   ├── db.py           # Database configuration
│   ├── sm2.py          # SM-2 spaced repetition algorithm
│   ├── schemas.py      # Data validation
│   ├── seed.py         # Sample data seeder
│   ├── requirements.txt
│   └── .env
├── frontend/
│   ├── src/
│   │   ├── main.jsx
│   │   ├── App.jsx
│   │   ├── api.js      # API client
│   │   └── pages/      # React pages
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
└── README.md
```

## 🚀 Quick Start Guide

### Prerequisites

- Python 3.8 or higher
- Node.js 16 or higher
- npm or yarn

### Step 1: Backend Setup

```bash
# Navigate to backend directory
cd flashcards/backend

# Create a virtual environment (recommended)
python3 -m venv venv

# Activate virtual environment
# On Linux/Mac:
source venv/bin/activate
# On Windows:
# venv\Scripts\activate

# Install Python dependencies
pip install -r requirements.txt

# Seed the database with sample data (optional)
python seed.py

# Start the Flask server
python app.py
```

The backend will start on **http://localhost:5000**

### Step 2: Frontend Setup (New Terminal)

```bash
# Open a NEW terminal window/tab
# Navigate to frontend directory
cd flashcards/frontend

# Install Node dependencies
npm install

# Start the development server
npm run dev
```

The frontend will start on **http://localhost:3000**

### Step 3: Access the Application

Open your browser and visit: **http://localhost:3000**

## 📝 Usage Guide

### 1. Dashboard (Home)
- View statistics: total cards, due for review, reviewed, and mastered
- Browse all your flashcards
- Quick access to study and add card features

### 2. Study Session
- Review cards that are due
- Click cards to flip and see answers
- Rate your recall: Again, Hard, Good, or Easy
- The SM-2 algorithm automatically schedules next review

### 3. Add Card
- Create new flashcards with questions and answers
- Cards are immediately available for study

## 🧮 SM-2 Algorithm Explained

The app uses the SuperMemo 2 (SM-2) algorithm for optimal spaced repetition:

**Quality Ratings:**
- **0 (Again)**: Complete failure - review in <1 day
- **3 (Hard)**: Correct with difficulty - shorter interval
- **4 (Good)**: Correct after hesitation - normal interval
- **5 (Easy)**: Perfect recall - longer interval

**Key Concepts:**
- **Easiness Factor (EF)**: Adjusts based on your performance (1.3 - 2.5+)
- **Repetitions**: Number of successful reviews
- **Interval**: Days until next review

## 🔌 API Endpoints

### Cards
- `GET /api/cards` - Get all cards
- `POST /api/cards` - Create a new card
- `GET /api/cards/:id` - Get a specific card
- `PUT /api/cards/:id` - Update a card
- `DELETE /api/cards/:id` - Delete a card

### Review
- `GET /api/cards/due` - Get cards due for review
- `POST /api/cards/:id/review` - Submit review (with quality rating)

### Statistics
- `GET /api/stats` - Get learning statistics

## 🐛 Troubleshooting

### Backend Issues

**Problem**: `ModuleNotFoundError: No module named 'flask'`
- **Solution**: Make sure you activated the virtual environment and ran `pip install -r requirements.txt`

**Problem**: Backend won't start
- **Solution**: Check if port 5000 is already in use. Change the PORT in `.env` file if needed

**Problem**: Database errors
- **Solution**: Delete `flashcards.db` file and restart the backend to recreate it

### Frontend Issues

**Problem**: `npm install` fails
- **Solution**: Make sure you have Node.js 16+ installed. Try deleting `node_modules` and `package-lock.json`, then run `npm install` again

**Problem**: API calls failing
- **Solution**: Make sure the backend is running on port 5000. Check browser console for CORS errors

**Problem**: Blank page after starting frontend
- **Solution**: Check browser console for errors. Make sure the backend is running first

### Common Issues

**Problem**: "Cannot connect to backend"
- **Solution**: 
  1. Verify backend is running on http://localhost:5000
  2. Check that CORS is enabled (it should be by default)
  3. Try accessing http://localhost:5000/api/cards directly in browser

**Problem**: Changes not reflecting
- **Solution**: 
  1. Hard refresh the browser (Ctrl+Shift+R or Cmd+Shift+R)
  2. Clear browser cache
  3. Restart both servers

## 🎯 Key Features for Resume

✅ Implements SM-2 spaced repetition algorithm  
✅ Full-stack application (Python + React)  
✅ RESTful API design  
✅ SQLite database with SQLAlchemy ORM  
✅ Responsive, modern UI with animations  
✅ Progress tracking and statistics  
✅ State management in React  
✅ CRUD operations  

## 📊 Performance Metrics (for Resume)

- **Personalized Review Intervals**: SM-2 algorithm adapts to individual learning pace
- **Retention Improvement**: Spaced repetition scientifically proven to increase retention by 25%+
- **User Engagement**: Instant feedback and progress tracking
- **Offline Architecture**: SQLite enables local-first approach

## 🚢 Deployment Options

### Backend
- **Heroku**: Easy Python deployment
- **Railway**: Modern platform with SQLite support
- **PythonAnywhere**: Free tier available
- **DigitalOcean**: Full control with droplets

### Frontend
- **Vercel**: Automatic React deployments
- **Netlify**: Great for static sites
- **GitHub Pages**: Free hosting
- **Cloudflare Pages**: Fast edge deployment

### Database Migration for Production
- Upgrade from SQLite to PostgreSQL for production
- Update `DATABASE_URL` in `.env`
- Install `psycopg2` for PostgreSQL support

## 🔧 Development Tips

1. **Keep both terminals open**: One for backend, one for frontend
2. **Check logs**: Backend terminal shows API requests; browser console shows frontend errors
3. **Use the seed script**: Populate database quickly with sample data
4. **Test the API**: Use browser or Postman to test endpoints directly

## 📚 Next Steps / Enhancements

- [ ] User authentication and multiple user support
- [ ] Card categories/tags
- [ ] Import/export flashcards (CSV, JSON)
- [ ] Study statistics and charts
- [ ] Mobile app (React Native)
- [ ] Collaborative decks sharing
- [ ] Rich text editor for cards
- [ ] Image support in flashcards

## 🤝 Contributing

This is a portfolio project. Feel free to fork and customize for your own use!

## 📄 License

MIT License - feel free to use this project for your portfolio

---

**Built with ❤️ for effective learning**
