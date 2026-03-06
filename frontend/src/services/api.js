import axios from 'axios';

// THE FIX: Pointing directly to your live Node.js Web Service!
const API_URL = 'https://personal-finance-tracker-k337.onrender.com/api';

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
