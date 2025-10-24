import React from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import Study from './pages/Study';
import AddCard from './pages/AddCard';

function App() {
  const location = useLocation();

  return (
    <div className="container">
      <nav className="nav">
        <h1 style={{ color: 'white', fontSize: '1.5rem', fontWeight: 'bold' }}>
          🧠 Adaptive Flashcards
        </h1>
        <div style={{ display: 'flex', gap: '16px', marginLeft: 'auto' }}>
          <Link 
            to="/" 
            className={location.pathname === '/' ? 'active' : ''}
          >
            Dashboard
          </Link>
          <Link 
            to="/study" 
            className={location.pathname === '/study' ? 'active' : ''}
          >
            Study
          </Link>
          <Link 
            to="/add" 
            className={location.pathname === '/add' ? 'active' : ''}
          >
            Add Cards
          </Link>
        </div>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/study" element={<Study />} />
        <Route path="/add" element={<AddCard />} />
      </Routes>
    </div>
  );
}

export default App;