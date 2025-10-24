import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import Study from './pages/Study';
import AddCard from './pages/AddCard';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app">
        <nav className="navbar">
          <div className="nav-container">
            <h1 className="logo">🧠 Flashcards</h1>
            <div className="nav-links">
              <Link to="/" className="nav-link">Home</Link>
              <Link to="/study" className="nav-link">Study</Link>
              <Link to="/add" className="nav-link">Add Card</Link>
            </div>
          </div>
        </nav>

        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/study" element={<Study />} />
            <Route path="/add" element={<AddCard />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
