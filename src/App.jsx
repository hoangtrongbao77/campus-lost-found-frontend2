import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import CreateItem from './pages/CreateItem';
import ItemDetail from './pages/ItemDetail';
import Admin from './pages/Admin';
import Profile from './pages/Profile';

function App() {
  let currentUser = null;
  try {
    const savedUser = localStorage.getItem('user');
    if (savedUser && savedUser !== 'undefined' && savedUser !== 'null') {
      currentUser = JSON.parse(savedUser);
    }
  } catch (err) {
    console.error('Lỗi đọc user:', err);
  }

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/login';
  };

  const isAdmin =
    currentUser?.role === 'admin' ||
    currentUser?.isAdmin === true ||
    currentUser?.email === 'hoangtrongbao1408@gmail.com' ||
    currentUser?.username === 'hoangtrongbao' ||
    currentUser?.fullName === 'Hoàng Trọng Bảo' ||
    currentUser?.name === 'Hoàng Trọng Bảo';

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc', fontFamily: 'sans-serif' }}>
      <header style={styles.header}>
        <div style={styles.headerContainer}>
          <Link to="/" style={styles.logo}>
            🔍 Campus Lost & Found
          </Link>

          <div style={styles.navActions}>
            <Link to="/create" style={styles.createBtn}>
              + Đăng tin
            </Link>

            {isAdmin && (
              <Link to="/admin" style={styles.adminBtn}>
                🛡️ Trang Admin
              </Link>
            )}

            {currentUser ? (
              <div style={styles.userSection}>
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

      <main style={{ padding: '20px 15px' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/create" element={<CreateItem />} />
          <Route path="/items/:id" element={<ItemDetail />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="*" element={<Home />} />
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
    padding: '6px 12px',
    borderRadius: '8px',
    backgroundColor: '#f1f5f9',
    border: '1px solid #cbd5e1',
    display: 'inline-block',
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