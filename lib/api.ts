import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000', // Our backend URL
});

// Request Interceptor: Before sending any request, do this:
api.interceptors.request.use((config) => {
  // 1. Check if token exists in localStorage
  const token = localStorage.getItem('token');

  // 2. If found, attach it to the Authorization header
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;