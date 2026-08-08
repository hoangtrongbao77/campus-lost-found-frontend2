import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';

// 🛠️ ĐOẠN CODE TỰ ĐỘNG DỌN DẸP LOCALSTORAGE BỊ LỖI
try {
  const user = localStorage.getItem('user');
  if (user === 'undefined' || user === 'null' || user === '[object Object]') {
    localStorage.removeItem('user');
  } else if (user) {
    JSON.parse(user); // Thử parse, nếu lỗi nhảy xuống catch bên dưới
  }
} catch (e) {
  console.warn('Phát hiện localStorage bị hỏng, đang tự động dọn dẹp...');
  localStorage.clear();
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);