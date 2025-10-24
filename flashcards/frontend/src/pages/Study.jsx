import { useState, useEffect } from 'react';
import { api } from '../api';
import { Link } from 'react-router-dom';

function Study() {
  const [cards, setCards] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [loading, setLoading] = useState(true);
  const [reviewComplete, setReviewComplete] = useState(false);

  useEffect(() => {
    loadDueCards();
  }, []);

  const loadDueCards = async () => {
    try {
      const dueCards = await api.getDueCards();
      setCards(dueCards);
      setLoading(false);
    } catch (error) {
      console.error('Error loading due cards:', error);
      setLoading(false);
    }
  };

  const handleFlip = () => {
    setFlipped(!flipped);
  };

  const handleReview = async (quality) => {
    if (!flipped) {
      alert('Please flip the card to see the answer first!');
      return;
    }

    try {
      await api.reviewCard(cards[currentIndex].id, quality);
      
      // Move to next card
      if (currentIndex + 1 < cards.length) {
        setCurrentIndex(currentIndex + 1);
        setFlipped(false);
      } else {
        setReviewComplete(true);
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      alert('Failed to submit review');
    }
  };

  if (loading) {
    return (
      <div className="page-container">
        <p style={{ textAlign: 'center' }}>Loading...</p>
      </div>
    );
  }

  if (cards.length === 0) {
    return (
      <div className="page-container">
        <div className="empty-state">
          <div className="empty-state-icon">🎉</div>
          <div className="empty-state-text">No cards due for review!</div>
          <p style={{ color: '#666', marginBottom: '1.5rem' }}>
            Come back later or add more cards to study.
          </p>
          <Link to="/" className="btn btn-primary">Back to Dashboard</Link>
        </div>
      </div>
    );
  }

  if (reviewComplete) {
    return (
      <div className="page-container">
        <div className="empty-state">
          <div className="empty-state-icon">✅</div>
          <div className="empty-state-text">Review Complete!</div>
          <p style={{ color: '#666', marginBottom: '1.5rem' }}>
            Great job! You've reviewed all due cards.
          </p>
          <Link to="/" className="btn btn-primary">Back to Dashboard</Link>
        </div>
      </div>
    );
  }

  const currentCard = cards[currentIndex];

  return (
    <div className="page-container">
      <h1 className="page-title">Study Session</h1>
      
      <div style={{ textAlign: 'center', marginBottom: '1rem', color: '#666' }}>
        Card {currentIndex + 1} of {cards.length}
      </div>

      <div className="study-container">
        <div className={`flashcard ${flipped ? 'flipped' : ''}`} onClick={handleFlip}>
          <div className="flashcard-content">
            <div className="flashcard-text">
              {flipped ? currentCard.answer : currentCard.question}
            </div>
            <div className="card-hint">
              {flipped ? 'Question was shown on front' : 'Click to flip'}
            </div>
          </div>
        </div>

        {flipped && (
          <div className="quality-buttons">
            <button 
              className="quality-btn again"
              onClick={() => handleReview(0)}
            >
              Again<br/>
              <small>&lt;1 day</small>
            </button>
            <button 
              className="quality-btn hard"
              onClick={() => handleReview(3)}
            >
              Hard<br/>
              <small>~3 days</small>
            </button>
            <button 
              className="quality-btn good"
              onClick={() => handleReview(4)}
            >
              Good<br/>
              <small>~7 days</small>
            </button>
            <button 
              className="quality-btn easy"
              onClick={() => handleReview(5)}
            >
              Easy<br/>
              <small>~14 days</small>
            </button>
          </div>
        )}

        {!flipped && (
          <div style={{ textAlign: 'center', marginTop: '2rem', color: '#999' }}>
            <p>Click the card to reveal the answer</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Study;
