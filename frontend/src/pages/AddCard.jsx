import React, { useState, useEffect } from 'react';
import { flashcardAPI } from '../api';

function AddCard() {
  const [formData, setFormData] = useState({
    question: '',
    answer: '',
    category: 'General'
  });
  const [categories, setCategories] = useState(['General']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await flashcardAPI.getCategories();
      const existingCategories = response.data;
      if (existingCategories.length > 0) {
        setCategories([...new Set(['General', ...existingCategories])]);
      }
    } catch (err) {
      console.error('Error fetching categories:', err);
      // Don't show error for categories, just use default
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.question.trim() || !formData.answer.trim()) {
      setError('Both question and answer are required');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      await flashcardAPI.createCard(formData);
      
      setSuccess('Flashcard created successfully!');
      setFormData({
        question: '',
        answer: '',
        category: 'General'
      });
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000);
      
      // Refresh categories in case a new one was added
      fetchCategories();
      
    } catch (err) {
      setError('Failed to create flashcard. Please try again.');
      console.error('Error creating card:', err);
    } finally {
      setLoading(false);
    }
  };

  const addBulkCards = async () => {
    const sampleCards = [
      {
        question: "What is the time complexity of binary search?",
        answer: "O(log n)",
        category: "Computer Science"
      },
      {
        question: "What is the capital of Japan?",
        answer: "Tokyo",
        category: "Geography"
      },
      {
        question: "Who painted the Mona Lisa?",
        answer: "Leonardo da Vinci",
        category: "Art"
      },
      {
        question: "What is the derivative of x²?",
        answer: "2x",
        category: "Mathematics"
      },
      {
        question: "What year did World War I begin?",
        answer: "1914",
        category: "History"
      }
    ];

    try {
      setLoading(true);
      setError(null);
      
      for (const card of sampleCards) {
        await flashcardAPI.createCard(card);
      }
      
      setSuccess(`Added ${sampleCards.length} sample cards successfully!`);
      fetchCategories();
      
      setTimeout(() => setSuccess(null), 3000);
      
    } catch (err) {
      setError('Failed to add sample cards. Please try again.');
      console.error('Error adding bulk cards:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="card">
        <h2>Add New Flashcard</h2>
        
        {error && <div className="error">{error}</div>}
        {success && (
          <div style={{ 
            background: '#c6f6d5', 
            color: '#22543d', 
            padding: '16px', 
            borderRadius: '8px', 
            marginBottom: '16px' 
          }}>
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
              Question:
            </label>
            <textarea
              name="question"
              value={formData.question}
              onChange={handleInputChange}
              className="textarea"
              placeholder="Enter your question here..."
              rows="3"
              required
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
              Answer:
            </label>
            <textarea
              name="answer"
              value={formData.answer}
              onChange={handleInputChange}
              className="textarea"
              placeholder="Enter the answer here..."
              rows="3"
              required
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
              Category:
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className="input"
              style={{ marginBottom: '24px' }}
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
            <input
              type="text"
              placeholder="Or type a new category..."
              onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value || 'General' }))}
              className="input"
              style={{ marginTop: '-16px' }}
            />
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <button 
              type="submit" 
              className="btn"
              disabled={loading}
            >
              {loading ? 'Creating...' : 'Create Flashcard'}
            </button>
            
            <button 
              type="button"
              className="btn btn-secondary"
              onClick={() => setFormData({ question: '', answer: '', category: 'General' })}
              disabled={loading}
            >
              Clear Form
            </button>
          </div>
        </form>
      </div>

      {/* Quick Actions */}
      <div className="card">
        <h3>Quick Actions</h3>
        <p style={{ marginBottom: '16px', color: '#666' }}>
          Need some cards to get started? Add sample flashcards to test the app.
        </p>
        
        <button 
          className="btn btn-secondary"
          onClick={addBulkCards}
          disabled={loading}
        >
          {loading ? 'Adding...' : 'Add 5 Sample Cards'}
        </button>
      </div>

      {/* Tips */}
      <div className="card">
        <h3>💡 Tips for Creating Good Flashcards</h3>
        <ul style={{ marginLeft: '20px', lineHeight: '1.6' }}>
          <li>Keep questions clear and specific</li>
          <li>Make answers concise but complete</li>
          <li>Use categories to organize related topics</li>
          <li>Include context when necessary</li>
          <li>Test yourself regularly for best results</li>
        </ul>
      </div>
    </div>
  );
}

export default AddCard;