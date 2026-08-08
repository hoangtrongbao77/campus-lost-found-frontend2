import axios from 'axios';

const API = axios.create({
  // Tự động lấy URL từ Vercel khi deploy, nếu chạy Local thì lấy localhost:5000/api
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
});

export default API;