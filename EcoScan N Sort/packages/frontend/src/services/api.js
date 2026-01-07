import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add token to requests if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      // Redirect to login if needed
      if (window.location.pathname !== '/') {
        window.location.href = '/'
      }
    }
    return Promise.reject(error)
  }
)

// Auth API
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
}

// Scans API
export const scansAPI = {
  create: (data) => api.post('/scans', data),
  getMyScans: (params) => api.get('/scans/my-scans', { params }),
  getStats: () => api.get('/scans/stats'),
}

// Leaderboard API
export const leaderboardAPI = {
  get: (type = 'school', limit = 10) => api.get('/leaderboard', { params: { type, limit } }),
  seed: () => api.post('/leaderboard/seed'),
}

// Analytics API
export const analyticsAPI = {
  getToday: () => api.get('/analytics/today'),
  getGlobal: () => api.get('/analytics/global'),
  getDaily: (startDate, endDate) => api.get('/analytics/daily', { params: { start_date: startDate, end_date: endDate } }),
}

export default api

