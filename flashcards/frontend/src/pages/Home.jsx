import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api';

function Home() {
  const [stats, setStats] = useState(null);
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [statsData, cardsData] = await Promise.all([
        api.getStats(),
        api.getCards()
      ]);
      setStats(statsData);
      setCards(cardsData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (cardId) => {
    if (!window.confirm('Are you sure you want to delete this card?')) {
      return;
    }

    try {
      await api.deleteCard(cardId);
      setCards(cards.filter(card => card.id !== cardId));
      // Reload stats
      const statsData = await api.getStats();
      setStats(statsData);
    } catch (error) {
      console.error('Error deleting card:', error);
      alert('Failed to delete card');
    }
  };

  if (loading) {
    return (
      <div className="page-container">
        <p style={{ textAlign: 'center' }}>Loading...</p>
      </div>
    );
  }

  return (
    <div className="page-container">
      <h1 className="page-title">Dashboard</h1>

      {stats && (
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-label">Total Cards</div>
            <div className="stat-value">{stats.total_cards}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Due for Review</div>
            <div className="stat-value">{stats.due_cards}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Reviewed</div>
            <div className="stat-value">{stats.reviewed_cards}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Mastered</div>
            <div className="stat-value">{stats.mastered_cards}</div>
          </div>
        </div>
      )}

      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <Link to="/study" className="btn btn-primary" style={{ marginRight: '1rem' }}>
          Start Studying
        </Link>
        <Link to="/add" className="btn btn-secondary">
          Add New Card
        </Link>
      </div>

      <h2 style={{ marginTop: '2rem', marginBottom: '1rem', color: '#333' }}>All Flashcards</h2>

      {cards.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">📚</div>
          <div className="empty-state-text">No flashcards yet!</div>
          <Link to="/add" className="btn btn-primary">Create Your First Card</Link>
        </div>
      ) : (
        <div className="card-grid">
          {cards.map(card => (
            <div key={card.id} className="flashcard-item">
              <div className="flashcard-question">Q: {card.question}</div>
              <div className="flashcard-answer">A: {card.answer}</div>
              <div className="flashcard-meta">
                <span>Reviews: {card.repetitions}</span>
                <span>Interval: {card.interval}d</span>
              </div>
              <div style={{ marginTop: '1rem' }}>
                <button 
                  className="btn btn-danger"
                  onClick={() => handleDelete(card.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Home;
