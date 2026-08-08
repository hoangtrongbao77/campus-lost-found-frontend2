import React, { useState, useEffect } from 'react';

const Profile = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // 1. Lấy dữ liệu user từ localStorage
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error('Lỗi parse dữ liệu user:', error);
      }
    }
  }, []);

  // Hàm tạo avatar chữ cái đầu (VD: Hoàng Trọng Bảo -> HB hoặc US)
  const getInitials = (name) => {
    if (!name) return 'US';
    const words = name.trim().split(' ');
    if (words.length === 1) return words[0].substring(0, 2).toUpperCase();
    return (words[0][0] + words[words.length - 1][0]).toUpperCase();
  };

  if (!user) {
    return (
      <div style={styles.container}>
        <div style={styles.card}>
          <p style={{ textAlign: 'center' }}>Chưa tìm thấy thông tin tài khoản. Vui lòng đăng nhập lại!</p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        {/* Phần Avatar & Tên chính */}
        <div style={styles.headerSection}>
          <div style={styles.avatar}>
            {user.avatar ? (
              <img src={user.avatar} alt="Avatar" style={styles.avatarImg} />
            ) : (
              getInitials(user.fullName || user.name)
            )}
          </div>
          <div>
            <h2 style={styles.userName}>{user.fullName || user.name || 'Chưa cập nhật tên'}</h2>
            <p style={styles.roleBadge}>
              {user.role === 'admin' ? '🛡️ Quản trị viên' : '🎓 Sinh viên'}
            </p>
          </div>
        </div>

        <hr style={styles.divider} />

        {/* Danh sách thông tin chi tiết */}
        <div style={styles.infoGrid}>
          <div style={styles.infoItem}>
            <span style={styles.label}>🆔 Mã Số Sinh Viên:</span>
            <span style={styles.value}>{user.studentId || 'Chưa cập nhật'}</span>
          </div>

          <div style={styles.infoItem}>
            <span style={styles.label}>📧 Email Liên Hệ:</span>
            <span style={styles.value}>{user.email || 'Chưa cập nhật'}</span>
          </div>

          <div style={styles.infoItem}>
            <span style={styles.label}>📞 Số Điện Thoại:</span>
            <span style={styles.value}>{user.phoneNumber || user.phone || 'Chưa cập nhật'}</span>
          </div>

          <div style={styles.infoItem}>
            <span style={styles.label}>📅 Ngày Tham Gia:</span>
            <span style={styles.value}>
              {user.createdAt ? new Date(user.createdAt).toLocaleDateString('vi-VN') : 'Mới tham gia'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '80vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingTop: '40px',
    paddingLeft: '20px',
    paddingRight: '20px',
  },
  card: {
    backgroundColor: '#ffffff',
    padding: '30px',
    borderRadius: '12px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
    width: '100%',
    maxWidth: '600px',
  },
  headerSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
    marginBottom: '20px',
  },
  avatar: {
    width: '80px',
    height: '80px',
    borderRadius: '50%',
    backgroundColor: '#0284c7',
    color: '#ffffff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '28px',
    fontWeight: 'bold',
  },
  avatarImg: {
    width: '100%',
    height: '100%',
    borderRadius: '50%',
    objectFit: 'cover',
  },
  userName: {
    fontSize: '22px',
    fontWeight: 'bold',
    color: '#1e293b',
    margin: 0,
  },
  roleBadge: {
    fontSize: '14px',
    color: '#64748b',
    marginTop: '4px',
    margin: 0,
  },
  divider: {
    border: 'none',
    borderTop: '1px solid #e2e8f0',
    margin: '20px 0',
  },
  infoGrid: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  },
  infoItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: '15px',
    padding: '8px 0',
    borderBottom: '1px dashed #f1f5f9',
  },
  label: {
    color: '#475569',
    fontWeight: '500',
  },
  value: {
    color: '#0f172a',
    fontWeight: '600',
  },
};

export default Profile;