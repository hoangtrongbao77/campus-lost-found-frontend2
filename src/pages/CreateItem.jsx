import React, { useState } from 'react';
import API from '../api/axios';

const CreateItem = () => {
  const [formData, setFormData] = useState({
    type: 'lost',
    title: '',
    category: 'Thiết bị điện tử',
    location: '',
    description: '',
  });

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  
  // State quản lý thông báo Toast ở góc phải phía dưới
  const [toastMessage, setToastMessage] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleTypeSelect = (typeValue) => {
    setFormData({
      ...formData,
      type: typeValue,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    const token = localStorage.getItem('token') || localStorage.getItem('accessToken');

    if (!token) {
      setErrorMsg('Phiên đăng nhập đã hết hạn. Vui lòng Đăng xuất và Đăng nhập lại!');
      return;
    }

    setLoading(true);

    try {
      await API.post('/items', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // 1. Hiển thị Toast thông báo ở góc phải phía dưới
      setToastMessage('🎉 Đăng tin thành công!');

      // 2. Tự động chuyển về Trang chủ sau 2 giây
      setTimeout(() => {
        window.location.href = '/';
      }, 2000);

    } catch (error) {
      console.error('Lỗi đăng tin:', error);
      setErrorMsg(
        error.response?.data?.message || error.response?.data?.error || 'Lỗi server khi đăng tin!'
      );
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>📝 Đăng Tin Đồ Thất Lạc</h2>

        {errorMsg && <div style={styles.errorBanner}>{errorMsg}</div>}

        <form onSubmit={handleSubmit} style={styles.form}>
          {/* Chọn Loại Tin */}
          <div style={styles.inputGroup}>
            <label style={styles.label}>Loại Tin (*)</label>
            <div style={styles.typeContainer}>
              <button
                type="button"
                onClick={() => handleTypeSelect('lost')}
                style={{
                  ...styles.typeBtn,
                  ...(formData.type === 'lost' ? styles.typeBtnLostActive : {}),
                }}
              >
                🔴 Cần tìm đồ thất lạc
              </button>
              <button
                type="button"
                onClick={() => handleTypeSelect('found')}
                style={{
                  ...styles.typeBtn,
                  ...(formData.type === 'found' ? styles.typeBtnFoundActive : {}),
                }}
              >
                🟢 Nhặt được đồ
              </button>
            </div>
          </div>

          {/* Tiêu đề */}
          <div style={styles.inputGroup}>
            <label style={styles.label}>Tiêu Đề (*)</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="VD: Nhặt được ví tiền màu đen"
              required
              style={styles.input}
            />
          </div>

          {/* Danh mục */}
          <div style={styles.inputGroup}>
            <label style={styles.label}>Danh Mục (*)</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              style={styles.select}
            >
              <option value="Thiết bị điện tử">Thiết bị điện tử</option>
              <option value="Giấy tờ cá nhân">Giấy tờ cá nhân</option>
              <option value="Ví / Tiền mặt">Ví / Tiền mặt</option>
              <option value="Chìa khóa">Chìa khóa</option>
              <option value="Balo / Túi xách">Balo / Túi xách</option>
              <option value="Đồ dùng học tập">Đồ dùng học tập</option>
              <option value="Khác">Khác</option>
            </select>
          </div>

          {/* Vị trí */}
          <div style={styles.inputGroup}>
            <label style={styles.label}>Vị Trí (*)</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="VD: Phòng H501, Nhà xe A, Căng tin..."
              required
              style={styles.input}
            />
          </div>

          {/* Mô tả */}
          <div style={styles.inputGroup}>
            <label style={styles.label}>Mô Tả Chi Tiết (*)</label>
            <textarea
              name="description"
              rows="4"
              value={formData.description}
              onChange={handleChange}
              placeholder="Mô tả đặc điểm nhận dạng, thời gian..."
              required
              style={styles.textarea}
            />
          </div>

          <button type="submit" disabled={loading} style={styles.submitBtn}>
            {loading ? 'Đang gửi...' : '+ Hoàn Tất Đăng Tin'}
          </button>
        </form>
      </div>

      {/* --- TOAST THÔNG BÁO Ở GÓC PHẢI PHÍA DƯỚI --- */}
      {toastMessage && (
        <div style={styles.toast}>
          <span style={{ fontSize: '18px' }}>✅</span>
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    minHeight: '85vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '30px 20px',
    position: 'relative',
  },
  card: {
    backgroundColor: '#ffffff',
    padding: '35px',
    borderRadius: '16px',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.06)',
    width: '100%',
    maxWidth: '550px',
  },
  title: {
    textAlign: 'center',
    color: '#1e293b',
    marginBottom: '25px',
    fontSize: '22px',
    fontWeight: 'bold',
  },
  errorBanner: {
    backgroundColor: '#fef2f2',
    color: '#991b1b',
    border: '1px solid #fecaca',
    padding: '12px 16px',
    borderRadius: '8px',
    marginBottom: '20px',
    fontSize: '14px',
    textAlign: 'center',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '18px',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  label: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#334155',
  },
  typeContainer: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '10px',
  },
  typeBtn: {
    padding: '10px',
    borderRadius: '8px',
    border: '1px solid #cbd5e1',
    backgroundColor: '#f8fafc',
    color: '#64748b',
    fontSize: '13px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  typeBtnLostActive: {
    backgroundColor: '#fef2f2',
    borderColor: '#ef4444',
    color: '#dc2626',
  },
  typeBtnFoundActive: {
    backgroundColor: '#f0fdf4',
    borderColor: '#22c55e',
    color: '#16a34a',
  },
  input: {
    padding: '11px 14px',
    borderRadius: '8px',
    border: '1px solid #cbd5e1',
    fontSize: '14px',
    outline: 'none',
  },
  select: {
    padding: '11px 14px',
    borderRadius: '8px',
    border: '1px solid #cbd5e1',
    fontSize: '14px',
    outline: 'none',
    backgroundColor: '#ffffff',
  },
  textarea: {
    padding: '11px 14px',
    borderRadius: '8px',
    border: '1px solid #cbd5e1',
    fontSize: '14px',
    outline: 'none',
    resize: 'vertical',
  },
  submitBtn: {
    marginTop: '10px',
    padding: '13px',
    backgroundColor: '#eab308',
    color: '#1e293b',
    border: 'none',
    borderRadius: '8px',
    fontSize: '15px',
    fontWeight: 'bold',
    cursor: 'pointer',
  },
  // Style cho khung Toast góc phải phía dưới
  toast: {
    position: 'fixed',
    bottom: '24px',
    right: '24px',
    backgroundColor: '#16a34a',
    color: '#ffffff',
    padding: '14px 22px',
    borderRadius: '10px',
    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.2)',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    fontSize: '15px',
    fontWeight: '600',
    zIndex: 9999,
  },
};

export default CreateItem;