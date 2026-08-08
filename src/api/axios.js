import axios from 'axios';

const API = axios.create({
  baseURL: 'https://campus-lost-found-api-jvfx.onrender.com/api',
});

// Tự động gắn Token vào Header trước khi gửi bất kỳ Request nào
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default API;