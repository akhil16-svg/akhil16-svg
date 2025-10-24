import React, { useState, useEffect } from 'react';
import { flashcardAPI } from '../api';

function Study() {
  const [dueCards, setDueCards] = useState([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [studyComplete, setStudyComplete] = useState(false);
  const [sessionStats, setSessionStats] = useState({ studied: 0, correct: 0 });

  useEffect(() => {
    fetchDueCards();
  }, []);

  const fetchDueCards = async () => {
    try {
      setLoading(true);
      const response = await flashcardAPI.getDueCards();
      setDueCards(response.data);
      setError(null);
      
      if (response.data.length === 0) {
        setStudyComplete(true);
      }
    } catch (err) {
      setError('Failed to load cards for study. Make sure the backend server is running.');
      console.error('Error fetching due cards:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCardReview = async (difficulty) => {
    const currentCard = dueCards[currentCardIndex];
    
    try {
      await flashcardAPI.reviewCard(currentCard.id, difficulty);
      
      // Update session stats
      const newStats = {
        studied: sessionStats.studied + 1,
        correct: sessionStats.correct + (difficulty !== 'forgot' ? 1 : 0)
      };
      setSessionStats(newStats);

      // Move to next card or complete session
      if (currentCardIndex + 1 >= dueCards.length) {
        setStudyComplete(true);
      } else {
        setCurrentCardIndex(currentCardIndex + 1);
        setShowAnswer(false);
      }
    } catch (err) {
      setError('Failed to record your answer. Please try again.');
      console.error('Error reviewing card:', err);
    }
  };

  const resetStudySession = () => {
    setCurrentCardIndex(0);
    setShowAnswer(false);
    setStudyComplete(false);
    setSessionStats({ studied: 0, correct: 0 });
    fetchDueCards();
  };

  if (loading) {
    return <div className="loading">Loading cards for study...</div>;
  }

  if (error) {
    return (
      <div className="error">
        {error}
        <br />
        <button className="btn" onClick={fetchDueCards} style={{ marginTop: '12px' }}>
          Retry
        </button>
      </div>
    );
  }

  if (studyComplete || dueCards.length === 0) {
    const accuracy = sessionStats.studied > 0 
      ? Math.round((sessionStats.correct / sessionStats.studied) * 100) 
      : 0;

    return (
      <div className="card" style={{ textAlign: 'center' }}>
        <h2>🎉 Study Session Complete!</h2>
        
        {sessionStats.studied > 0 ? (
          <div style={{ margin: '24px 0' }}>
            <div className="stats-grid" style={{ maxWidth: '600px', margin: '0 auto' }}>
              <div className="stat-card">
                <div className="stat-number">{sessionStats.studied}</div>
                <div className="stat-label">Cards Studied</div>
              </div>
              <div className="stat-card">
                <div className="stat-number">{sessionStats.correct}</div>
                <div className="stat-label">Correct Answers</div>
              </div>
              <div className="stat-card">
                <div className="stat-number">{accuracy}%</div>
                <div className="stat-label">Accuracy</div>
              </div>
            </div>
          </div>
        ) : (
          <p style={{ margin: '24px 0', fontSize: '1.2rem', color: '#666' }}>
            No cards are due for review right now. Great job staying on top of your studies!
          </p>
        )}

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
          <button className="btn" onClick={resetStudySession}>
            Check for New Cards
          </button>
          <button className="btn btn-secondary" onClick={() => window.location.href = '/'}>
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const currentCard = dueCards[currentCardIndex];
  const progress = ((currentCardIndex + 1) / dueCards.length) * 100;

  return (
    <div>
      {/* Progress Bar */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h2>Study Session</h2>
          <span style={{ color: '#666' }}>
            Card {currentCardIndex + 1} of {dueCards.length}
          </span>
        </div>
        <div style={{ 
          width: '100%', 
          height: '8px', 
          backgroundColor: '#e2e8f0', 
          borderRadius: '4px',
          overflow: 'hidden'
        }}>
          <div style={{ 
            width: `${progress}%`, 
            height: '100%', 
            backgroundColor: '#667eea',
            transition: 'width 0.3s ease'
          }} />
        </div>
      </div>

      {/* Current Card */}
      <div 
        className="flashcard"
        onClick={() => setShowAnswer(!showAnswer)}
      >
        <div className="flashcard-content">
          {!showAnswer ? (
            <div>
              <div style={{ fontSize: '1rem', color: '#666', marginBottom: '16px' }}>
                Question:
              </div>
              <div>{currentCard.question}</div>
              <div style={{ fontSize: '1rem', color: '#888', marginTop: '24px' }}>
                Click to reveal answer
              </div>
            </div>
          ) : (
            <div>
              <div style={{ fontSize: '1rem', color: '#666', marginBottom: '8px' }}>
                Question:
              </div>
              <div style={{ marginBottom: '24px', color: '#333' }}>
                {currentCard.question}
              </div>
              <div style={{ fontSize: '1rem', color: '#666', marginBottom: '8px' }}>
                Answer:
              </div>
              <div style={{ fontWeight: 'bold', color: '#667eea' }}>
                {currentCard.answer}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Difficulty Buttons */}
      {showAnswer && (
        <div className="card">
          <h3 style={{ textAlign: 'center', marginBottom: '20px' }}>
            How well did you know this?
          </h3>
          <div className="difficulty-buttons">
            <button 
              className="btn btn-danger"
              onClick={() => handleCardReview('forgot')}
            >
              😵 Forgot
            </button>
            <button 
              className="btn btn-warning"
              onClick={() => handleCardReview('hard')}
            >
              😰 Hard
            </button>
            <button 
              className="btn btn-secondary"
              onClick={() => handleCardReview('medium')}
            >
              🤔 Medium
            </button>
            <button 
              className="btn btn-success"
              onClick={() => handleCardReview('easy')}
            >
              😊 Easy
            </button>
          </div>
          <div style={{ textAlign: 'center', marginTop: '16px', fontSize: '0.875rem', color: '#666' }}>
            Your choice affects when you'll see this card again
          </div>
        </div>
      )}

      {/* Session Stats */}
      <div className="card">
        <h3>Session Progress</h3>
        <div style={{ display: 'flex', gap: '24px', marginTop: '12px' }}>
          <span>Cards studied: {sessionStats.studied}</span>
          <span>Correct: {sessionStats.correct}</span>
          <span>
            Accuracy: {sessionStats.studied > 0 
              ? Math.round((sessionStats.correct / sessionStats.studied) * 100) 
              : 0}%
          </span>
        </div>
      </div>
    </div>
  );
}

export default Study;