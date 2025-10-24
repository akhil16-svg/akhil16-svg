import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { flashcardAPI } from '../api';

function Home() {
  const [stats, setStats] = useState(null);
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [statsResponse, cardsResponse] = await Promise.all([
        flashcardAPI.getStats(),
        flashcardAPI.getAllCards()
      ]);
      
      setStats(statsResponse.data);
      setCards(cardsResponse.data);
      setError(null);
    } catch (err) {
      setError('Failed to load data. Make sure the backend server is running.');
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  const deleteCard = async (cardId) => {
    if (!window.confirm('Are you sure you want to delete this card?')) {
      return;
    }

    try {
      await flashcardAPI.deleteCard(cardId);
      setCards(cards.filter(card => card.id !== cardId));
      // Refresh stats after deletion
      const statsResponse = await flashcardAPI.getStats();
      setStats(statsResponse.data);
    } catch (err) {
      setError('Failed to delete card');
      console.error('Error deleting card:', err);
    }
  };

  if (loading) {
    return <div className="loading">Loading your flashcards...</div>;
  }

  if (error) {
    return (
      <div className="error">
        {error}
        <br />
        <button className="btn" onClick={fetchData} style={{ marginTop: '12px' }}>
          Retry
        </button>
      </div>
    );
  }

  return (
    <div>
      {/* Statistics */}
      {stats && (
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-number">{stats.total_cards}</div>
            <div className="stat-label">Total Cards</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{stats.due_cards}</div>
            <div className="stat-label">Due for Review</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{stats.today_studied}</div>
            <div className="stat-label">Studied Today</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{stats.today_accuracy}%</div>
            <div className="stat-label">Today's Accuracy</div>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="card">
        <h2 style={{ marginBottom: '16px' }}>Quick Actions</h2>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <Link to="/study">
            <button className="btn btn-success">
              Start Studying ({stats?.due_cards || 0} due)
            </button>
          </Link>
          <Link to="/add">
            <button className="btn">Add New Cards</button>
          </Link>
          <button className="btn btn-secondary" onClick={fetchData}>
            Refresh Data
          </button>
        </div>
      </div>

      {/* Recent Cards */}
      <div className="card">
        <h2 style={{ marginBottom: '16px' }}>All Flashcards ({cards.length})</h2>
        {cards.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
            <p>No flashcards yet. Create your first card to get started!</p>
            <Link to="/add">
              <button className="btn" style={{ marginTop: '16px' }}>
                Create First Card
              </button>
            </Link>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '12px' }}>
            {cards.map(card => (
              <div 
                key={card.id} 
                style={{ 
                  border: '1px solid #e2e8f0', 
                  borderRadius: '8px', 
                  padding: '16px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start'
                }}
              >
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>
                    {card.question}
                  </div>
                  <div style={{ color: '#666', marginBottom: '8px' }}>
                    {card.answer}
                  </div>
                  <div style={{ fontSize: '0.875rem', color: '#888' }}>
                    Category: {card.category} | 
                    Repetitions: {card.repetitions} | 
                    Next review: {new Date(card.next_review).toLocaleDateString()}
                  </div>
                </div>
                <button 
                  className="btn btn-danger"
                  onClick={() => deleteCard(card.id)}
                  style={{ marginLeft: '16px', padding: '8px 12px', fontSize: '0.875rem' }}
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recent Study Sessions */}
      {stats?.recent_sessions && stats.recent_sessions.length > 0 && (
        <div className="card">
          <h2 style={{ marginBottom: '16px' }}>Recent Study Sessions</h2>
          <div style={{ display: 'grid', gap: '8px' }}>
            {stats.recent_sessions.slice(0, 5).map((session, index) => (
              <div 
                key={session.id || index}
                style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  padding: '12px',
                  backgroundColor: '#f7fafc',
                  borderRadius: '6px'
                }}
              >
                <span>{new Date(session.date).toLocaleDateString()}</span>
                <span>{session.cards_studied} cards studied</span>
                <span>{session.accuracy}% accuracy</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;