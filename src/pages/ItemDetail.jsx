import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import API from '../api/axios';

const ItemDetail = () => {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [relatedItems, setRelatedItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchItemAndRelated = async () => {
      setLoading(true);
      setError('');
      try {
        // 1. Lấy thông tin chi tiết bài viết
        const res = await API.get(`/items/${id}`);
        const currentItem = res.data.item || res.data;
        setItem(currentItem);

        // 2. Lấy danh sách bài viết gợi ý cùng Danh mục (Category)
        if (currentItem && currentItem.category) {
          const relatedRes = await API.get(`/items?category=${encodeURIComponent(currentItem.category)}`);
          const allItems = relatedRes.data.items || relatedRes.data || [];
          
          // Lọc loại bỏ bài viết đang xem và lấy tối đa 4 bài
          const filtered = allItems.filter(
            (i) => (i._id || i.id) !== id && (i._id || i.id) !== currentItem._id
          );
          setRelatedItems(filtered.slice(0, 4));
        }
      } catch (err) {
        console.error('Lỗi lấy chi tiết bài viết:', err);
        setError('Không tìm thấy bài viết hoặc đã có lỗi xảy ra!');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchItemAndRelated();
    }
  }, [id]);

  if (loading) {
    return <div style={styles.centerText}>⏳ Đang tải dữ liệu bài viết...</div>;
  }

  if (error || !item) {
    return (
      <div style={styles.centerText}>
        <p style={{ color: '#ef4444' }}>{error || 'Bài viết không tồn tại!'}</p>
        <Link to="/" style={styles.backBtn}>
          👈 Quay về trang chủ
        </Link>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <Link to="/" style={styles.backLink}>
        ← Quay lại danh sách
      </Link>

      {/* THÔNG TIN CHI TIẾT BÀI VIẾT */}
      <div style={styles.card}>
        <div style={styles.imageBox}>
          {item.imageUrl || item.image ? (
            <img
              src={item.imageUrl || item.image}
              alt={item.title}
              style={styles.image}
            />
          ) : (
            <div style={styles.noImg}>📷 Không có hình ảnh</div>
          )}
        </div>

        <div style={styles.infoBox}>
          <div style={styles.badgeGroup}>
            <span
              style={{
                ...styles.typeBadge,
                backgroundColor: item.type === 'lost' ? '#fee2e2' : '#dcfce7',
                color: item.type === 'lost' ? '#dc2626' : '#16a34a',
              }}
            >
              {item.type === 'lost' ? '🔴 Tin Nhặt / Nhặt Được' : '🟢 Tin Mất Đồ'}
            </span>
            <span style={styles.categoryBadge}>{item.category || 'Khác'}</span>
          </div>

          <h1 style={styles.title}>{item.title}</h1>

          <div style={styles.detailRow}>
            <strong>📍 Địa điểm:</strong> {item.location || 'Chưa cập nhật'}
          </div>

          <div style={styles.detailRow}>
            <strong>📅 Ngày đăng/nhặt:</strong>{' '}
            {item.date ? new Date(item.date).toLocaleDateString('vi-VN') : 'Mới đây'}
          </div>

          <div style={styles.detailRow}>
            <strong>📝 Mô tả chi tiết:</strong>
            <p style={styles.description}>{item.description || 'Không có mô tả.'}</p>
          </div>

          <hr style={styles.divider} />

          {/* THÔNG TIN NGUỜI ĐĂNG */}
          <div style={styles.contactCard}>
            <h3 style={{ margin: '0 0 8px 0', fontSize: '16px' }}>👤 Thông tin liên hệ:</h3>
            <p style={{ margin: '4px 0' }}>
              <strong>Người đăng:</strong> {item.user?.fullName || item.contactName || 'Người dùng'}
            </p>
            {item.user?.studentId && (
              <p style={{ margin: '4px 0' }}>
                <strong>MSV:</strong> {item.user.studentId}
              </p>
            )}
            <p style={{ margin: '4px 0' }}>
              <strong>Số điện thoại/Zalo:</strong>{' '}
              <a href={`tel:${item.phone || item.contactPhone}`} style={{ color: '#2563eb', fontWeight: 'bold' }}>
                {item.phone || item.contactPhone || 'Chưa cung cấp'}
              </a>
            </p>
          </div>
        </div>
      </div>

      {/* BÀI VIẾT GỢI Ý PHÙ HỢP */}
      <div style={styles.relatedSection}>
        <h2 style={styles.relatedTitle}>💡 Bài viết gợi ý phù hợp (Cùng danh mục)</h2>

        {relatedItems.length > 0 ? (
          <div style={styles.grid}>
            {relatedItems.map((rel) => (
              <Link
                key={rel._id || rel.id}
                to={`/items/${rel._id || rel.id}`}
                style={styles.gridCard}
              >
                <div style={styles.gridImgBox}>
                  {rel.imageUrl || rel.image ? (
                    <img
                      src={rel.imageUrl || rel.image}
                      alt={rel.title}
                      style={styles.gridImg}
                    />
                  ) : (
                    <div style={styles.gridNoImg}>📷 Không ảnh</div>
                  )}
                </div>
                <div style={styles.gridInfo}>
                  <h4 style={styles.gridTitle}>{rel.title}</h4>
                  <p style={styles.gridLocation}>📍 {rel.location || 'Chưa có vị trí'}</p>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div style={styles.emptyRelated}>
            Chưa có bài viết nào khác thuộc danh mục <strong>"{item.category}"</strong>.
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '960px',
    margin: '0 auto',
    padding: '10px 15px',
  },
  backLink: {
    display: 'inline-block',
    marginBottom: '16px',
    color: '#2563eb',
    textDecoration: 'none',
    fontWeight: '600',
  },
  centerText: {
    textAlign: 'center',
    padding: '50px 20px',
    fontSize: '16px',
  },
  backBtn: {
    display: 'inline-block',
    marginTop: '12px',
    backgroundColor: '#2563eb',
    color: '#fff',
    padding: '8px 16px',
    borderRadius: '8px',
    textDecoration: 'none',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
    border: '1px solid #e2e8f0',
    overflow: 'hidden',
    display: 'flex',
    flexWrap: 'wrap',
    marginBottom: '40px',
  },
  imageBox: {
    flex: '1 1 350px',
    minHeight: '300px',
    backgroundColor: '#f8fafc',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
    maxHeight: '400px',
    objectFit: 'cover',
  },
  noImg: {
    color: '#94a3b8',
    fontSize: '15px',
  },
  infoBox: {
    flex: '1 1 400px',
    padding: '24px',
    display: 'flex',
    flexDirection: 'column',
  },
  badgeGroup: {
    display: 'flex',
    gap: '8px',
    marginBottom: '12px',
  },
  typeBadge: {
    padding: '4px 10px',
    borderRadius: '6px',
    fontSize: '12px',
    fontWeight: '700',
  },
  categoryBadge: {
    backgroundColor: '#f1f5f9',
    color: '#475569',
    padding: '4px 10px',
    borderRadius: '6px',
    fontSize: '12px',
    fontWeight: '600',
  },
  title: {
    fontSize: '22px',
    fontWeight: '800',
    color: '#0f172a',
    margin: '0 0 16px 0',
  },
  detailRow: {
    fontSize: '14px',
    color: '#334155',
    marginBottom: '10px',
  },
  description: {
    marginTop: '4px',
    lineHeight: '1.6',
    color: '#475569',
    whiteSpace: 'pre-line',
  },
  divider: {
    border: 'none',
    borderTop: '1px solid #e2e8f0',
    margin: '20px 0',
  },
  contactCard: {
    backgroundColor: '#f8fafc',
    border: '1px solid #e2e8f0',
    padding: '16px',
    borderRadius: '8px',
    fontSize: '14px',
  },
  relatedSection: {
    marginTop: '20px',
  },
  relatedTitle: {
    fontSize: '18px',
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: '16px',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
    gap: '16px',
  },
  gridCard: {
    backgroundColor: '#ffffff',
    borderRadius: '8px',
    border: '1px solid #e2e8f0',
    overflow: 'hidden',
    textDecoration: 'none',
    color: 'inherit',
    transition: 'transform 0.2s',
  },
  gridImgBox: {
    height: '130px',
    backgroundColor: '#f1f5f9',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  gridImg: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  gridNoImg: {
    fontSize: '12px',
    color: '#94a3b8',
  },
  gridInfo: {
    padding: '12px',
  },
  gridTitle: {
    fontSize: '14px',
    fontWeight: '700',
    margin: '0 0 6px 0',
    color: '#1e293b',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  gridLocation: {
    fontSize: '12px',
    color: '#64748b',
    margin: 0,
  },
  emptyRelated: {
    backgroundColor: '#ffffff',
    padding: '20px',
    borderRadius: '8px',
    border: '1px border-dashed #cbd5e1',
    color: '#64748b',
    fontSize: '14px',
  },
};

export default ItemDetail;