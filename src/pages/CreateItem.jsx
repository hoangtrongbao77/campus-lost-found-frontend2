import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';

const CreateItem = () => {
  let currentUser = {};
  try {
    currentUser = JSON.parse(localStorage.getItem('user') || '{}');
  } catch (e) {
    currentUser = {};
  }

  const [formData, setFormData] = useState({
    title: '',
    type: 'lost', // lost: Mất đồ, found: Nhặt được
    category: 'Giấy tờ cá nhân',
    location: '',
    phone: currentUser.phone || '', // Tự điền nếu có
    description: '',
    imageUrl: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 3 * 1024 * 1024) {
        setError('Kích thước ảnh không quá 3MB!');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, imageUrl: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const userId = currentUser._id || currentUser.id;
    if (!userId) {
      alert('Vui lòng đăng nhập trước khi đăng tin!');
      navigate('/login');
      return;
    }

    try {
      const res = await API.post('/items', {
        ...formData,
        userId,
      });

      if (res.data.success) {
        alert('Đăng tin thành công!');
        navigate('/');
      }
    } catch (err) {
      console.error('Lỗi tạo bài viết:', err);
      setError(
        err.response?.data?.message || 'Đăng tin thất bại. Vui lòng thử lại!'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>📢 Đăng Tin Mới</h2>

        {error && <div style={styles.errorBox}>{error}</div>}

        <form onSubmit={handleSubmit} style={styles.form}>
          {/* LOẠI TIN */}
          <div style={styles.field}>
            <label style={styles.label}>Phân loại tin:</label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              style={styles.select}
            >
              <option value="lost">🔴 Tin Mất Đồ (Cần tìm)</option>
              <option value="found">🟢 Tin Nhặt Được (Trả đồ)</option>
            </select>
          </div>

          {/* TIÊU ĐỀ */}
          <div style={styles.field}>
            <label style={styles.label}>Tiêu đề bài đăng (*):</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="VD: Nhặt được thẻ sinh viên Ngô Văn Nghĩa..."
              required
              style={styles.input}
            />
          </div>

          {/* DANH MỤC */}
          <div style={styles.field}>
            <label style={styles.label}>Danh mục đồ vật:</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              style={styles.select}
            >
              <option value="Giấy tờ cá nhân">💳 Giấy tờ cá nhân (Thẻ SV, CCCD...)</option>
              <option value="Thiết bị điện tử">📱 Thiết bị điện tử (Điện thoại, Laptop...)</option>
              <option value="Ví / Bóp">👛 Ví / Bóp / Tiền mặt</option>
              <option value="Chìa khóa / Thẻ xe">🔑 Chìa khóa / Thẻ xe</option>
              <option value="Khác">📦 Khác</option>
            </select>
          </div>

          {/* SỐ ĐIỆN THOẠI BỔ SUNG */}
          <div style={styles.field}>
            <label style={styles.label}>Số điện thoại / Zalo liên hệ (*):</label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Nhập số điện thoại để người khác liên hệ..."
              required
              style={styles.input}
            />
          </div>

          {/* ĐỊA ĐIỂM */}
          <div style={styles.field}>
            <label style={styles.label}>Địa điểm (Nhặt được / Đánh rơi):</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="VD: Sảnh A, Nhà thể thao, Căng tin..."
              style={styles.input}
            />
          </div>

          {/* MÔ TẢ CHI TIẾT */}
          <div style={styles.field}>
            <label style={styles.label}>Mô tả chi tiết:</label>
            <textarea
              name="description"
              rows="4"
              value={formData.description}
              onChange={handleChange}
              placeholder="Mô tả đặc điểm nhận dạng, thời gian..."
              style={styles.textarea}
            />
          </div>

          {/* TẢI ẢNH */}
          <div style={styles.field}>
            <label style={styles.label}>Hình ảnh đồ vật:</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              style={{ fontSize: '14px' }}
            />
            {formData.imageUrl && (
              <img
                src={formData.imageUrl}
                alt="Preview"
                style={styles.imagePreview}
              />
            )}
          </div>

          <button type="submit" disabled={loading} style={styles.submitBtn}>
            {loading ? 'Đang đăng tin...' : '🚀 Đăng Tin Khởi Tạo'}
          </button>
        </form>
      </div>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '560px',
    margin: '20px auto',
    padding: '0 15px',
  },
  card: {
    backgroundColor: '#ffffff',
    padding: '30px',
    borderRadius: '12px',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.06)',
    border: '1px solid #e2e8f0',
  },
  title: {
    fontSize: '20px',
    fontWeight: '700',
    marginBottom: '20px',
    color: '#0f172a',
    textAlign: 'center',
  },
  errorBox: {
    backgroundColor: '#fef2f2',
    color: '#dc2626',
    padding: '10px',
    borderRadius: '8px',
    marginBottom: '16px',
    fontSize: '14px',
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
    color: '#334155',
  },
  input: {
    padding: '10px 12px',
    borderRadius: '8px',
    border: '1px solid #cbd5e1',
    fontSize: '14px',
    outline: 'none',
  },
  select: {
    padding: '10px 12px',
    borderRadius: '8px',
    border: '1px solid #cbd5e1',
    fontSize: '14px',
    outline: 'none',
    backgroundColor: '#fff',
  },
  textarea: {
    padding: '10px 12px',
    borderRadius: '8px',
    border: '1px solid #cbd5e1',
    fontSize: '14px',
    outline: 'none',
    resize: 'vertical',
  },
  imagePreview: {
    marginTop: '10px',
    width: '100%',
    maxHeight: '200px',
    objectFit: 'cover',
    borderRadius: '8px',
  },
  submitBtn: {
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

export default CreateItem;