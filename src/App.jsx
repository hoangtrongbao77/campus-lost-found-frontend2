import React from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import Home from './pages/Home';
import CreateItem from './pages/CreateItem';
import ItemDetail from './pages/ItemDetail';

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

            {currentUser?.role === 'admin' && (
              <Link to="/admin" style={styles.adminBtn}>
                🛡️ Trang Admin
              </Link>
            )}

            {currentUser ? (
              <div style={styles.userSection}>
                <span style={styles.welcomeText}>
                  👤 Chào, <strong>{currentUser.fullName || currentUser.name || 'Sinh viên'}</strong>
                </span>
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

      {/* NỘI DUNG NỀN TRANG */}
      <main style={{ paddingBottom: '40px' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/create" element={<CreateItem />} />
          <Route path="/items/:id" element={<ItemDetail />} />
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
    gap: '10px',
  },
  welcomeText: {
    fontSize: '14px',
    color: '#334155',
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