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
        // 1. Lấy chi tiết bài viết
        const res = await API.get(`/items/${id}`);
        // Tự động nhận diện cấu trúc API (res.data.item hoặc res.data.data hoặc res.data)
        const rawItem = res.data?.item || res.data?.data || res.data;
        
        console.log('Dữ liệu bài viết nhận từ Backend:', rawItem);

        if (!rawItem || typeof rawItem !== 'object') {
          setError('Không tìm thấy dữ liệu bài viết!');
          return;
        }

        // Chuẩn hóa dữ liệu bài viết hiện tại (Tất cả các tên trường có thể có)
        const normalizedItem = {
          ...rawItem,
          title: rawItem.title || rawItem.itemName || rawItem.name || rawItem.topic || 'Bài đăng không tên',
          description: rawItem.description || rawItem.content || rawItem.desc || rawItem.details || '',
          location: rawItem.location || rawItem.place || rawItem.address || rawItem.area || '',
          category: rawItem.category || rawItem.cat || rawItem.categoryName || 'Khác',
          type: rawItem.type || rawItem.postType || rawItem.status || 'lost',
          image: rawItem.imageUrl || rawItem.image || (Array.isArray(rawItem.images) ? rawItem.images[0] : rawItem.images) || '',
          phone: rawItem.phone || rawItem.contactPhone || rawItem.phoneNumber || rawItem.user?.phone || rawItem.user?.phoneNumber || '',
          contactName: rawItem.user?.fullName || rawItem.user?.name || rawItem.contactName || rawItem.author || rawItem.userName || '',
          studentId: rawItem.user?.studentId || rawItem.user?.username || rawItem.studentId || rawItem.msv || '',
          date: rawItem.date || rawItem.createdAt || rawItem.lostDate || rawItem.foundDate || '',
        };

        setItem(normalizedItem);

        // 2. Lấy danh sách tất cả bài viết để làm Bài viết gợi ý
        const allRes = await API.get('/items');
        const rawAll = allRes.data?.items || allRes.data?.data || allRes.data || [];
        const allItems = Array.isArray(rawAll) ? rawAll : [];

        // Lọc bỏ bài hiện tại
        const otherItems = allItems.filter(
          (i) => (i._id || i.id) !== id && (i._id || i.id) !== normalizedItem._id
        );

        const currentCat = normalizedItem.category.trim().toLowerCase();

        // Ưu tiên 1: Cùng danh mục -> Ưu tiên 2: Cùng loại tin -> Ưu tiên 3: Các bài khác
        let matched = otherItems.filter(
          (i) => ((i.category || i.cat || 'Khác').trim().toLowerCase() === currentCat)
        );

        if (matched.length === 0) {
          matched = otherItems.filter((i) => (i.type || i.postType) === normalizedItem.type);
        }

        if (matched.length === 0) {
          matched = otherItems;
        }

        setRelatedItems(matched.slice(0, 4));
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
        <p style={{ color: '#ef4444', fontWeight: '600' }}>{error || 'Bài viết không tồn tại!'}</p>
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

      {/* CHI TIẾT BÀI VIẾT */}
      <div style={styles.card}>
        <div style={styles.imageBox}>
          {item.image ? (
            <img src={item.image} alt={item.title} style={styles.image} />
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
              {item.type === 'lost' ? '🔴 Tin Mất Đồ' : '🟢 Tin Nhặt Được'}
            </span>
            <span style={styles.categoryBadge}>{item.category}</span>
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

          {/* THÔNG TIN LIÊN HỆ */}
          <div style={styles.contactCard}>
            <h3 style={{ margin: '0 0 10px 0', fontSize: '15px', color: '#1e293b' }}>
              👤 Thông tin liên hệ:
            </h3>
            <p style={{ margin: '4px 0', color: '#334155' }}>
              <strong>Người đăng:</strong> {item.contactName || 'Người dùng'}
            </p>
            {item.studentId && (
              <p style={{ margin: '4px 0', color: '#334155' }}>
                <strong>MSV:</strong> {item.studentId}
              </p>
            )}
            <p style={{ margin: '4px 0', color: '#334155' }}>
              <strong>Số điện thoại/Zalo:</strong>{' '}
              {item.phone ? (
                <a
                  href={`tel:${item.phone}`}
                  style={{ color: '#2563eb', fontWeight: 'bold', textDecoration: 'none' }}
                >
                  {item.phone}
                </a>
              ) : (
                <span style={{ color: '#94a3b8' }}>Chưa cung cấp</span>
              )}
            </p>
          </div>
        </div>
      </div>

      {/* BÀI VIẾT GỢI Ý */}
      <div style={styles.relatedSection}>
        <h2 style={styles.relatedTitle}>💡 Bài viết gợi ý phù hợp</h2>

        {relatedItems.length > 0 ? (
          <div style={styles.grid}>
            {relatedItems.map((rel) => {
              const relTitle = rel.title || rel.itemName || rel.name || 'Chưa có tiêu đề';
              const relLocation = rel.location || rel.place || 'Toàn trường';
              const relImg = rel.imageUrl || rel.image || (Array.isArray(rel.images) ? rel.images[0] : rel.images);
              const relType = rel.type || rel.postType || 'lost';

              return (
                <Link
                  key={rel._id || rel.id}
                  to={`/items/${rel._id || rel.id}`}
                  style={styles.gridCard}
                >
                  <div style={styles.gridImgBox}>
                    {relImg ? (
                      <img src={relImg} alt={relTitle} style={styles.gridImg} />
                    ) : (
                      <div style={styles.gridNoImg}>📷 Không có ảnh</div>
                    )}
                  </div>
                  <div style={styles.gridInfo}>
                    <span
                      style={{
                        ...styles.miniBadge,
                        backgroundColor: relType === 'lost' ? '#fee2e2' : '#dcfce7',
                        color: relType === 'lost' ? '#dc2626' : '#16a34a',
                      }}
                    >
                      {relType === 'lost' ? 'Mất đồ' : 'Nhặt được'}
                    </span>
                    <h4 style={styles.gridTitle}>{relTitle}</h4>
                    <p style={styles.gridLocation}>📍 {relLocation}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div style={styles.emptyRelated}>Chưa có bài viết liên quan khác.</div>
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
    padding: '60px 20px',
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
    boxShadow: '0 4px 15px rgba(0,0,0,0.04)',
    border: '1px solid #e2e8f0',
    overflow: 'hidden',
    display: 'flex',
    flexWrap: 'wrap',
    marginBottom: '32px',
  },
  imageBox: {
    flex: '1 1 350px',
    minHeight: '280px',
    backgroundColor: '#f8fafc',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
    maxHeight: '380px',
    objectFit: 'cover',
  },
  noImg: {
    color: '#94a3b8',
    fontSize: '14px',
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
    margin: '18px 0',
  },
  contactCard: {
    backgroundColor: '#f8fafc',
    border: '1px solid #e2e8f0',
    padding: '16px',
    borderRadius: '8px',
    fontSize: '14px',
  },
  relatedSection: {
    marginTop: '10px',
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
    borderRadius: '10px',
    border: '1px solid #e2e8f0',
    overflow: 'hidden',
    textDecoration: 'none',
    color: 'inherit',
    boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
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
  miniBadge: {
    fontSize: '10px',
    fontWeight: '700',
    padding: '2px 6px',
    borderRadius: '4px',
    display: 'inline-block',
    marginBottom: '6px',
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
    border: '1px dashed #cbd5e1',
    color: '#64748b',
    fontSize: '14px',
    textAlign: 'center',
  },
};

export default ItemDetail;