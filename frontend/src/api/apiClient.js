import axios from 'axios';

// Get base URL from environment variable or default intelligently:
// 1. If VITE_API_URL is explicitly set, use it.
// 2. If running on Vercel and VITE_API_URL is missing, connect directly to the Render backend API.
// 3. In production on the same host (Render full-stack), use relative '/api'.
// 4. In local development, fall back to 'http://localhost:5000/api'.
let apiBaseUrl = import.meta.env.VITE_API_URL;
if (!apiBaseUrl) {
  if (typeof window !== 'undefined' && window.location.hostname.includes('vercel.app')) {
    apiBaseUrl = 'https://om-enterprises-backend-azk7.onrender.com/api';
  } else if (import.meta.env.PROD) {
    apiBaseUrl = '/api';
  } else {
    apiBaseUrl = 'http://localhost:5000/api';
  }
}

// Normalize: ensure it ends with /api
if (apiBaseUrl && !apiBaseUrl.endsWith('/api') && !apiBaseUrl.endsWith('/api/')) {
  apiBaseUrl = `${apiBaseUrl.replace(/\/+$/, '')}/api`;
}

// Create Axios instance with base URL
const apiClient = axios.create({
  baseURL: apiBaseUrl,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: automatically attach JWT token to every request
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('om_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: handle 401 unauthorized (token expired / invalid)
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear expired credentials if unauthorized
      const currentPath = window.location.pathname;
      if (currentPath !== '/login' && currentPath !== '/register') {
        localStorage.removeItem('om_token');
        localStorage.removeItem('om_user');
        localStorage.removeItem('om_role');
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
