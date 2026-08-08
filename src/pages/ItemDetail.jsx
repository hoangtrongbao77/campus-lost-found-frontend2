import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../api/axios';

const ItemDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchItemDetail();
  }, [id]);

  const fetchItemDetail = async () => {
    try {
      setLoading(true);
      const res = await API.get(`/items/${id}`);
      setItem(res.data.data || res.data);
    } catch (err) {
      console.error('Lỗi tải chi tiết bài viết:', err);
      setError('Không tìm thấy bài đăng hoặc bài viết đã bị xóa!');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div style={styles.loading}>Đang tải chi tiết bài đăng...</div>;
  }

  if (error || !item) {
    return (
      <div style={styles.container}>
        <div style={styles.errorCard}>
          <p style={{ color: '#ef4444', fontSize: '16px', fontWeight: 'bold' }}>{error}</p>
          <button onClick={() => navigate('/')} style={styles.backBtn}>
            ⬅ Quay lại Trang chủ
          </button>
        </div>
      </div>
    );
  }

  const authorName =
    item.user?.fullName ||
    item.user?.name ||
    item.user?.username ||
    item.authorName ||
    'Người dùng';
  const firstLetter = authorName.charAt(0).toUpperCase();

  return (
    <div style={styles.container}>
      <button onClick={() => navigate('/')} style={styles.backBtn}>
        ⬅ Quay lại Trang chủ
      </button>

      <div style={styles.card}>
        {/* Header: Avatar, Tên & Loại tin */}
        <div style={styles.header}>
          <div style={styles.userInfo}>
            <div style={styles.avatar}>
              {item.user?.avatar ? (
                <img src={item.user.avatar} alt="Avatar" style={styles.avatarImg} />
              ) : (
                <span style={styles.avatarText}>{firstLetter}</span>
              )}
            </div>
            <div>
              <div style={styles.authorName}>{authorName}</div>
              <div style={styles.date}>
                Đăng ngày: {new Date(item.createdAt || Date.now()).toLocaleDateString('vi-VN')}
              </div>
            </div>
          </div>

          <span
            style={{
              ...styles.badge,
              ...(item.type === 'lost' ? styles.badgeLost : styles.badgeFound),
            }}
          >
            {item.type === 'lost' ? '🔴 Cần tìm đồ' : '🟢 Nhặt được đồ'}
          </span>
        </div>

        {/* Tiêu đề & Thông tin cơ bản */}
        <h1 style={styles.title}>{item.title}</h1>

        <div style={styles.infoBox}>
          <div style={styles.infoItem}>
            📍 <strong>Vị trí:</strong> {item.location}
          </div>
          <div style={styles.infoItem}>
            🏷️ <strong>Danh mục:</strong> {item.category}
          </div>
          <div style={styles.infoItem}>
            📌 <strong>Trạng thái:</strong>{' '}
            {item.status === 'resolved' ? '✅ Đã hoàn tất' : '⏳ Đang tìm / Chưa trả'}
          </div>
        </div>

        {/* Nội dung mô tả */}
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>📄 Mô tả chi tiết</h3>
          <p style={styles.description}>{item.description}</p>
        </div>

        {/* Thông tin liên hệ */}
        <div style={styles.contactBox}>
          <h3 style={styles.sectionTitle}>📞 Thông tin liên hệ người đăng</h3>
          {item.user?.email ? (
            <p style={styles.contactItem}>✉️ Email: <strong>{item.user.email}</strong></p>
          ) : (
            <p style={styles.contactItem}>
              Vui lòng trao đổi trực tiếp hoặc kiểm tra tài khoản liên hệ của tác giả.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '720px',
    margin: '30px auto',
    padding: '0 15px',
  },
  loading: {
    textAlign: 'center',
    padding: '50px',
    fontSize: '16px',
    color: '#64748b',
  },
  backBtn: {
    backgroundColor: '#ffffff',
    border: '1px solid #cbd5e1',
    padding: '8px 16px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600',
    color: '#334155',
    marginBottom: '20px',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    padding: '28px',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.06)',
    border: '1px solid #f1f5f9',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
    paddingBottom: '15px',
    borderBottom: '1px solid #f1f5f9',
  },
  userInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  avatar: {
    width: '48px',
    height: '48px',
    borderRadius: '50%',
    backgroundColor: '#2563eb',
    color: '#ffffff',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontWeight: 'bold',
    fontSize: '20px',
    overflow: 'hidden',
  },
  avatarImg: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  avatarText: {
    lineHeight: 1,
  },
  authorName: {
    fontWeight: '700',
    fontSize: '16px',
    color: '#0f172a',
  },
  date: {
    fontSize: '12px',
    color: '#94a3b8',
    marginTop: '2px',
  },
  badge: {
    padding: '6px 14px',
    borderRadius: '20px',
    fontSize: '13px',
    fontWeight: '600',
  },
  badgeLost: {
    backgroundColor: '#fef2f2',
    color: '#dc2626',
  },
  badgeFound: {
    backgroundColor: '#f0fdf4',
    color: '#16a34a',
  },
  title: {
    fontSize: '24px',
    fontWeight: '800',
    color: '#0f172a',
    margin: '0 0 20px 0',
  },
  infoBox: {
    backgroundColor: '#f8fafc',
    padding: '16px',
    borderRadius: '10px',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    marginBottom: '24px',
  },
  infoItem: {
    fontSize: '14px',
    color: '#334155',
  },
  section: {
    marginBottom: '24px',
  },
  sectionTitle: {
    fontSize: '16px',
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: '10px',
  },
  description: {
    fontSize: '15px',
    color: '#475569',
    lineHeight: '1.6',
    whiteSpace: 'pre-line',
  },
  contactBox: {
    backgroundColor: '#f0fdf4',
    border: '1px solid #bbf7d0',
    padding: '18px',
    borderRadius: '12px',
  },
  contactItem: {
    margin: 0,
    fontSize: '14px',
    color: '#166534',
  },
  errorCard: {
    backgroundColor: '#ffffff',
    padding: '30px',
    borderRadius: '12px',
    textAlign: 'center',
  },
};

export default ItemDetail;