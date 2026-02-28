import axios from 'axios';

// The FIX: Use a relative path for the live site, and localhost for your Mac
const API_URL = import.meta.env.PROD ? '/api' : 'http://localhost:5001/api';

const api = axios.create({
  baseURL: API_URL,
});

// Automatically attach the JWT token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
