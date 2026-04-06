import axios from 'axios';

const normalizeApiBaseUrl = (url) => (url || 'http://localhost:5000').replace(/\/(api\/v1|api)\/?$/i, '');
const API_URL = normalizeApiBaseUrl(import.meta.env.VITE_API_URL);

// Use sessionStorage for tab-specific sessions (allows multiple users in different tabs)
const USE_SESSION_STORAGE = import.meta.env.VITE_USE_SESSION_STORAGE === 'true';
const storage = USE_SESSION_STORAGE ? sessionStorage : localStorage;

// Create axios instance with defaults
const api = axios.create({
  baseURL: `${API_URL}/api/v1`,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true
});

let isRefreshing = false;
let pendingRequests = [];
const authExemptPaths = ['/auth/login', '/auth/register', '/auth/refresh'];

const queueRequest = (resolve, reject) => {
  pendingRequests.push({ resolve, reject });
};

const flushQueue = (error, token = null) => {
  pendingRequests.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve(token);
    }
  });
  pendingRequests = [];
};

const clearAuthStorage = () => {
  storage.removeItem('auth_token');
  storage.removeItem('auth_user');
  if (USE_SESSION_STORAGE) {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
  }
};

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
  async (error) => {
    const originalRequest = error.config;
    const requestUrl = originalRequest?.url || '';
    const isAuthRequest = authExemptPaths.some((path) => requestUrl.includes(path));

    if (error.response?.status === 401 && !originalRequest?._retry && !isAuthRequest) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          queueRequest(resolve, reject);
        }).then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return api(originalRequest);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshResponse = await api.post('/auth/refresh');
        const newToken = refreshResponse.data?.data?.accessToken;
        if (!newToken) {
          throw new Error('Refresh did not return an access token');
        }

        storage.setItem('auth_token', newToken);
        api.defaults.headers.common.Authorization = `Bearer ${newToken}`;
        flushQueue(null, newToken);
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        flushQueue(refreshError, null);
        clearAuthStorage();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

// ─── Auth API ──────────────────────────────────────────
export const authAPI = {
  login: (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data),
  refresh: () => api.post('/auth/refresh'),
  logout: () => api.post('/auth/logout'),
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
