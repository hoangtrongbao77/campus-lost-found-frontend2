import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import CreateItem from './pages/CreateItem';
import ItemDetail from './pages/ItemDetail'; // 👈 Import trang chi tiết vừa tạo

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/create" element={<CreateItem />} />
      <Route path="/items/:id" element={<ItemDetail />} /> {/* 👈 Đăng ký route xem chi tiết */}
    </Routes>
  );
}

export default App;