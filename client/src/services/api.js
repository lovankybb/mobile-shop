import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/api', // Adjust based on your backend port
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercept requests to add the auth token from localStorage
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;
