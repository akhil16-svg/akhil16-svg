import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api';

function AddCard() {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!question.trim() || !answer.trim()) {
      setMessage({ type: 'error', text: 'Please fill in both fields' });
      return;
    }

    setLoading(true);
    try {
      await api.createCard(question, answer);
      setMessage({ type: 'success', text: 'Card created successfully!' });
      setQuestion('');
      setAnswer('');
      
      // Redirect to home after 1.5 seconds
      setTimeout(() => {
        navigate('/');
      }, 1500);
    } catch (error) {
      console.error('Error creating card:', error);
      setMessage({ type: 'error', text: 'Failed to create card' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <h1 className="page-title">Add New Flashcard</h1>

      {message && (
        <div className={`message ${message.type}`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ maxWidth: '600px', margin: '0 auto' }}>
        <div className="form-group">
          <label className="form-label">Question</label>
          <textarea
            className="form-textarea"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Enter your question here..."
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Answer</label>
          <textarea
            className="form-textarea"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Enter the answer here..."
            disabled={loading}
          />
        </div>

        <div style={{ textAlign: 'center' }}>
          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={loading}
            style={{ marginRight: '1rem' }}
          >
            {loading ? 'Creating...' : 'Create Card'}
          </button>
          <button 
            type="button" 
            className="btn btn-secondary"
            onClick={() => navigate('/')}
            disabled={loading}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddCard;
