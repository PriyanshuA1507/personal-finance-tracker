import axios from 'axios';

// FORCE the live URL. Delete the localhost fallback completely.
const API_URL = 'https://personal-finance-tracker-1-64th.onrender.com/api';

const api = axios.create({
  baseURL: API_URL,
});

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
