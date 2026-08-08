import React from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import Home from './pages/Home';
import CreateItem from './pages/CreateItem';
import ItemDetail from './pages/ItemDetail';
import Admin from './pages/Admin'; // 👈 Import Trang Admin
import Profile from './pages/Profile'; // 👈 Import Trang Cá Nhân

function App() {
  const navigate = useNavigate();
  const savedUser = localStorage.getItem('user');
  const currentUser = savedUser ? JSON.parse(savedUser) : null;

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    window.location.href = '/';
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc', fontFamily: 'sans-serif' }}>
      {/* THANH HEADER ĐIỀU HƯỚNG */}
      <header style={styles.header}>
        <div style={styles.headerContainer}>
          <Link to="/" style={styles.logo}>
            🔍 Campus Lost & Found
          </Link>

          <div style={styles.navActions}>
            <Link to="/create" style={styles.createBtn}>
              + Đăng tin
            </Link>

            {/* Nút vào Trang Admin nếu tài khoản có quyền admin */}
            {currentUser?.role === 'admin' && (
              <Link to="/admin" style={styles.adminBtn}>
                🛡️ Trang Admin
              </Link>
            )}

            {currentUser ? (
              <div style={styles.userSection}>
                {/* 👈 Nút bấm vào TRANG CÁ NHÂN */}
                <Link to="/profile" style={styles.profileLink}>
                  👤 <strong>{currentUser.fullName || currentUser.name || 'Trang cá nhân'}</strong>
                </Link>
                <button onClick={handleLogout} style={styles.logoutBtn}>
                  Đăng Xuất
                </button>
              </div>
            ) : (
              <Link to="/login" style={styles.loginBtn}>
                Đăng Nhập
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* KHU VỰC HIỂN THỊ TRANG */}
      <main style={{ paddingBottom: '40px' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/create" element={<CreateItem />} />
          <Route path="/items/:id" element={<ItemDetail />} />
          <Route path="/admin" element={<Admin />} /> {/* 👈 Đăng ký Route Admin */}
          <Route path="/profile" element={<Profile />} /> {/* 👈 Đăng ký Route Trang cá nhân */}
        </Routes>
      </main>
    </div>
  );
}

const styles = {
  header: {
    backgroundColor: '#ffffff',
    borderBottom: '1px solid #e2e8f0',
    padding: '12px 20px',
    position: 'sticky',
    top: 0,
    zIndex: 100,
    boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
  },
  headerContainer: {
    maxWidth: '1100px',
    margin: '0 auto',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '12px',
  },
  logo: {
    fontSize: '20px',
    fontWeight: '800',
    color: '#2563eb',
    textDecoration: 'none',
  },
  navActions: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  createBtn: {
    backgroundColor: '#2563eb',
    color: '#ffffff',
    padding: '8px 16px',
    borderRadius: '8px',
    textDecoration: 'none',
    fontWeight: '600',
    fontSize: '14px',
  },
  adminBtn: {
    backgroundColor: '#eab308',
    color: '#ffffff',
    padding: '8px 16px',
    borderRadius: '8px',
    textDecoration: 'none',
    fontWeight: '600',
    fontSize: '14px',
  },
  userSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  profileLink: {
    color: '#1e293b',
    textDecoration: 'none',
    fontSize: '14px',
    padding: '6px 10px',
    borderRadius: '6px',
    backgroundColor: '#f1f5f9',
    transition: 'background-color 0.2s',
  },
  logoutBtn: {
    backgroundColor: '#ef4444',
    color: '#ffffff',
    border: 'none',
    padding: '8px 14px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '14px',
  },
  loginBtn: {
    backgroundColor: '#10b981',
    color: '#ffffff',
    padding: '8px 16px',
    borderRadius: '8px',
    textDecoration: 'none',
    fontWeight: '600',
    fontSize: '14px',
  },
};

export default App;