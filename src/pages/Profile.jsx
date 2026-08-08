import React from 'react';

const Profile = () => {
  let user = {};
  try {
    user = JSON.parse(localStorage.getItem('user') || '{}');
  } catch (e) {
    user = {};
  }

  return (
    <div style={{ maxWidth: '500px', margin: '40px auto', padding: '24px', backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
      <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '20px', color: '#0f172a', textAlign: 'center' }}>
        👤 Thông Tin Cá Nhân
      </h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '15px' }}>
        <p><strong>Họ và tên:</strong> {user.fullName || user.name || 'Chưa cập nhật'}</p>
        <p><strong>Email:</strong> {user.email || 'Chưa cập nhật'}</p>
        <p><strong>Tên tài khoản:</strong> {user.username || 'Chưa cập nhật'}</p>
        <p><strong>Quyền hạn:</strong> <span style={{ textTransform: 'capitalize', fontWeight: '600', color: user.role === 'admin' ? '#eab308' : '#2563eb' }}>{user.role || 'user'}</span></p>
      </div>
    </div>
  );
};

export default Profile;