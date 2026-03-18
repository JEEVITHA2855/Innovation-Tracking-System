import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Use sessionStorage for tab-specific sessions (allows multiple users in different tabs)
const USE_SESSION_STORAGE = true; // Match AppContext setting
const storage = USE_SESSION_STORAGE ? sessionStorage : localStorage;

// Create axios instance with defaults
const api = axios.create({
  baseURL: `${API_URL}/api`,
  headers: { 'Content-Type': 'application/json' }
});

// Attach JWT token to every request
api.interceptors.request.use((config) => {
  const token = storage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 responses globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      storage.removeItem('auth_token');
      storage.removeItem('auth_user');
      if (USE_SESSION_STORAGE) {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth_user');
      }
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ─── Auth API ──────────────────────────────────────────
export const authAPI = {
  login: (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data),
  me: () => api.get('/auth/me'),
};

// ─── Ideas API ─────────────────────────────────────────
export const ideasAPI = {
  getAll: () => api.get('/ideas'),
  getById: (id) => api.get(`/ideas/${id}`),
  getMyIdeas: () => api.get('/ideas/my'),
  getAssigned: () => api.get('/ideas/assigned'),
  create: (data) => api.post('/ideas', data),
  updateStatus: (id, status) => api.put(`/ideas/${id}/status`, { status }),
  assignReviewer: (id, reviewerId) => api.put(`/ideas/${id}/assign`, { reviewerId }),
  getStats: () => api.get('/ideas/stats'),
};

// ─── Reviews API ───────────────────────────────────────
export const reviewsAPI = {
  create: (data) => api.post('/reviews', data),
  getByIdea: (ideaId) => api.get(`/reviews/idea/${ideaId}`),
  getHistory: () => api.get('/reviews/history'),
};

// ─── Notifications API ─────────────────────────────────
export const notificationsAPI = {
  getAll: () => api.get('/notifications'),
  getUnreadCount: () => api.get('/notifications/unread-count'),
  markAsRead: (id) => api.put(`/notifications/${id}/read`),
  markAllAsRead: () => api.put('/notifications/read-all'),
};

// ─── Reports API ───────────────────────────────────────
export const reportsAPI = {
  getAnalytics: () => api.get('/reports/analytics'),
};

// ─── Users API ─────────────────────────────────────────
export const usersAPI = {
  getAll: () => api.get('/users'),
  getByRole: (role) => api.get(`/users/role/${role}`),
  getById: (id) => api.get(`/users/${id}`),
  update: (id, data) => api.put(`/users/${id}`, data),
  delete: (id) => api.delete(`/users/${id}`),
};

export default api;
