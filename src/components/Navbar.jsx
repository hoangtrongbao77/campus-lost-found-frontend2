import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Lấy thông tin user đã lưu trong localStorage khi tải trang
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
    // Xóa Token & User khỏi localStorage và tải lại trang Login
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
            /* --- GIAO DIỆN KHI ĐÃ ĐĂNG NHẬP --- */
            <div style={styles.userSection}>
              <span style={styles.greeting}>
                Chào, <strong>{user.fullName || user.name || 'Sinh viên'}</strong>
              </span>

              <button onClick={handleLogout} style={styles.logoutBtn}>
                Đăng Xuất
              </button>
            </div>
          ) : (
            /* --- GIAO DIỆN KHI CHƯA ĐĂNG NHẬP --- */
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

// Inline Style đồng bộ màu sắc toàn hệ thống
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
    gap: '15px',
  },
  greeting: {
    fontSize: '14px',
    color: '#374151',
  },
  logoutBtn: {
    backgroundColor: '#ef4444',
    color: '#ffffff',
    border: 'none',
    padding: '8px 14px',
    borderRadius: '6px',
    fontWeight: '600',
    fontSize: '14px',
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