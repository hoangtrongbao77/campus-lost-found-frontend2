import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Đọc thông tin user từ localStorage
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error('Lỗi đọc dữ liệu user:', error);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  return (
    <header style={styles.header}>
      <div style={styles.container}>
        {/* Logo ứng dụng */}
        <Link to="/" style={styles.logo}>
          <span role="img" aria-label="search">🔍</span> Campus Lost & Found
        </Link>

        {/* Khung menu bên phải */}
        <div style={styles.navRight}>
          {user ? (
            <div style={styles.userSection}>
              {/* 1. NÚT VÀO TRANG ADMIN (Chỉ hiển thị khi tài khoản có role === 'admin') */}
              {user.role === 'admin' && (
                <Link to="/admin" style={styles.adminBtn}>
                  🛡️ Trang Admin
                </Link>
              )}

              {/* 2. LINK BẤM VÀO TRANG CÁ NHÂN */}
              <Link to="/profile" style={styles.profileLink} title="Bấm để xem trang cá nhân">
                👤 Chào, <strong>{user.fullName || user.name || 'Sinh viên'}</strong>
              </Link>

              {/* 3. NÚT ĐĂNG XUẤT */}
              <button onClick={handleLogout} style={styles.logoutBtn}>
                Đăng Xuất
              </button>
            </div>
          ) : (
            <div style={styles.authSection}>
              <Link to="/login" style={styles.loginBtn}>
                Đăng Nhập
              </Link>
              <Link to="/register" style={styles.registerBtn}>
                Đăng Ký
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

const styles = {
  header: {
    backgroundColor: '#ffffff',
    borderBottom: '1px solid #e5e7eb',
    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
    position: 'sticky',
    top: 0,
    zIndex: 1000,
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '12px 20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logo: {
    fontSize: '20px',
    fontWeight: 'bold',
    color: '#1d4ed8',
    textDecoration: 'none',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  navRight: {
    display: 'flex',
    alignItems: 'center',
  },
  userSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  adminBtn: {
    backgroundColor: '#f59e0b',
    color: '#ffffff',
    padding: '7px 12px',
    borderRadius: '6px',
    textDecoration: 'none',
    fontWeight: '600',
    fontSize: '13px',
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  },
  profileLink: {
    fontSize: '14px',
    color: '#1e293b',
    textDecoration: 'none',
    padding: '7px 12px',
    borderRadius: '6px',
    backgroundColor: '#f1f5f9',
    transition: 'background-color 0.2s',
  },
  logoutBtn: {
    backgroundColor: '#ef4444',
    color: '#ffffff',
    border: 'none',
    padding: '7px 12px',
    borderRadius: '6px',
    fontWeight: '600',
    fontSize: '13px',
    cursor: 'pointer',
  },
  authSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  loginBtn: {
    backgroundColor: '#1d4ed8',
    color: '#ffffff',
    padding: '8px 16px',
    borderRadius: '6px',
    textDecoration: 'none',
    fontWeight: '600',
    fontSize: '14px',
  },
  registerBtn: {
    backgroundColor: '#f3f4f6',
    color: '#374151',
    padding: '8px 16px',
    borderRadius: '6px',
    textDecoration: 'none',
    fontWeight: '500',
    fontSize: '14px',
    border: '1px solid #d1d5db',
  },
};

export default Navbar;