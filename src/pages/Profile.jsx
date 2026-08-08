import React, { useState } from 'react';
import API from '../api/axios';

const Profile = () => {
  let initialUser = {};
  try {
    initialUser = JSON.parse(localStorage.getItem('user') || '{}');
  } catch (e) {
    initialUser = {};
  }

  const [fullName, setFullName] = useState(
    initialUser.fullName || initialUser.name || ''
  );
  const [studentId, setStudentId] = useState(
    initialUser.studentId || initialUser.username || ''
  );
  const [avatar, setAvatar] = useState(initialUser.avatar || '');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setMessage({ type: 'error', text: 'Kích thước ảnh phải nhỏ hơn 2MB!' });
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const userId = initialUser._id || initialUser.id;
      const res = await API.put('/auth/profile', {
        userId,
        fullName,
        studentId,
        avatar,
      });

      if (res.data.success) {
        setMessage({ type: 'success', text: 'Cập nhật thành công!' });
        localStorage.setItem('user', JSON.stringify(res.data.user));
        setTimeout(() => window.location.reload(), 1000);
      }
    } catch (err) {
      console.error('Lỗi cập nhật profile:', err);
      setMessage({
        type: 'error',
        text: err.response?.data?.message || 'Cập nhật thất bại. Vui lòng thử lại!',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.card}>
      <h2 style={styles.title}>👤 Thông Tin Cá Nhân</h2>

      {message.text && (
        <div
          style={{
            ...styles.alertBox,
            backgroundColor: message.type === 'success' ? '#f0fdf4' : '#fef2f2',
            color: message.type === 'success' ? '#16a34a' : '#dc2626',
            borderColor: message.type === 'success' ? '#bbf7d0' : '#fecaca',
          }}
        >
          {message.text}
        </div>
      )}

      {/* AVATAR */}
      <div style={styles.avatarSection}>
        <div style={styles.avatarWrapper}>
          {avatar ? (
            <img src={avatar} alt="Avatar" style={styles.avatarImg} />
          ) : (
            <div style={styles.avatarPlaceholder}>
              {(fullName || 'U').charAt(0).toUpperCase()}
            </div>
          )}
        </div>

        <div style={styles.uploadControls}>
          <label style={styles.fileLabel}>
            📁 Chọn ảnh từ máy
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              style={{ display: 'none' }}
            />
          </label>
        </div>
      </div>

      <form onSubmit={handleSave} style={styles.form}>
        <div style={styles.field}>
          <label style={styles.label}>Họ và tên:</label>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Nhập họ và tên..."
            required
            style={styles.input}
          />
        </div>

        <div style={styles.field}>
          <label style={styles.label}>Mã sinh viên (MSV):</label>
          <input
            type="text"
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
            placeholder="Nhập mã sinh viên..."
            required
            style={styles.input}
          />
        </div>

        <div style={styles.field}>
          <label style={styles.label}>URL Ảnh đại diện (Tùy chọn):</label>
          <input
            type="text"
            value={avatar}
            onChange={(e) => setAvatar(e.target.value)}
            placeholder="Dán đường dẫn ảnh https://..."
            style={styles.input}
          />
        </div>

        <div style={styles.field}>
          <label style={styles.label}>Email:</label>
          <input
            type="text"
            value={initialUser.email || 'Chưa cập nhật'}
            disabled
            style={{ ...styles.input, backgroundColor: '#f1f5f9', cursor: 'not-allowed' }}
          />
        </div>

        <div style={styles.field}>
          <label style={styles.label}>Quyền hạn:</label>
          <span style={styles.roleBadge}>
            {initialUser.role || 'user'}
          </span>
        </div>

        <button type="submit" disabled={loading} style={styles.saveBtn}>
          {loading ? 'Đang lưu...' : '💾 Lưu Thay Đổi'}
        </button>
      </form>
    </div>
  );
};

const styles = {
  card: {
    maxWidth: '520px',
    margin: '30px auto',
    padding: '30px',
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    border: '1px solid #e2e8f0',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.06)',
  },
  title: {
    fontSize: '22px',
    fontWeight: '700',
    marginBottom: '24px',
    color: '#0f172a',
    textAlign: 'center',
  },
  alertBox: {
    padding: '10px 14px',
    borderRadius: '8px',
    border: '1px solid',
    marginBottom: '18px',
    fontSize: '14px',
    textAlign: 'center',
  },
  avatarSection: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '24px',
  },
  avatarWrapper: {
    width: '100px',
    height: '100px',
    borderRadius: '50%',
    overflow: 'hidden',
    border: '3px solid #2563eb',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  },
  avatarImg: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  avatarPlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: '#2563eb',
    color: '#ffffff',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: '36px',
    fontWeight: '700',
  },
  uploadControls: {
    display: 'flex',
    gap: '10px',
  },
  fileLabel: {
    backgroundColor: '#f1f5f9',
    color: '#334155',
    border: '1px solid #cbd5e1',
    padding: '6px 14px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: '600',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  field: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  label: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#475569',
  },
  input: {
    padding: '10px 12px',
    borderRadius: '8px',
    border: '1px solid #cbd5e1',
    fontSize: '14px',
    outline: 'none',
  },
  roleBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#eff6ff',
    color: '#2563eb',
    fontWeight: '700',
    fontSize: '13px',
    padding: '4px 10px',
    borderRadius: '6px',
    textTransform: 'uppercase',
  },
  saveBtn: {
    backgroundColor: '#2563eb',
    color: '#ffffff',
    border: 'none',
    padding: '12px',
    borderRadius: '8px',
    fontWeight: '700',
    fontSize: '15px',
    cursor: 'pointer',
    marginTop: '10px',
  },
};

export default Profile;