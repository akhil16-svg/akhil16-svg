import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

export const flashcardAPI = {
  // Health check
  healthCheck: () => api.get('/health'),
  
  // Flashcard CRUD operations
  getAllCards: () => api.get('/cards'),
  createCard: (cardData) => api.post('/cards', cardData),
  updateCard: (cardId, cardData) => api.put(`/cards/${cardId}`, cardData),
  deleteCard: (cardId) => api.delete(`/cards/${cardId}`),
  
  // Study operations
  getDueCards: () => api.get('/study/due'),
  reviewCard: (cardId, difficulty) => api.post('/study/review', { card_id: cardId, difficulty }),
  
  // Statistics and categories
  getStats: () => api.get('/stats'),
  getCategories: () => api.get('/categories'),
};

export default api;