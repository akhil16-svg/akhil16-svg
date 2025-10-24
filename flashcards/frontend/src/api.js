const API_BASE_URL = 'http://localhost:5000/api';

export const api = {
  // Get all cards
  async getCards() {
    const response = await fetch(`${API_BASE_URL}/cards`);
    if (!response.ok) throw new Error('Failed to fetch cards');
    return response.json();
  },

  // Get cards due for review
  async getDueCards() {
    const response = await fetch(`${API_BASE_URL}/cards/due`);
    if (!response.ok) throw new Error('Failed to fetch due cards');
    return response.json();
  },

  // Create a new card
  async createCard(question, answer) {
    const response = await fetch(`${API_BASE_URL}/cards`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ question, answer }),
    });
    if (!response.ok) throw new Error('Failed to create card');
    return response.json();
  },

  // Submit review
  async reviewCard(cardId, quality) {
    const response = await fetch(`${API_BASE_URL}/cards/${cardId}/review`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ quality }),
    });
    if (!response.ok) throw new Error('Failed to submit review');
    return response.json();
  },

  // Get stats
  async getStats() {
    const response = await fetch(`${API_BASE_URL}/stats`);
    if (!response.ok) throw new Error('Failed to fetch stats');
    return response.json();
  },

  // Delete card
  async deleteCard(cardId) {
    const response = await fetch(`${API_BASE_URL}/cards/${cardId}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete card');
    return response.json();
  },
};
