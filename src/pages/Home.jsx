import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../api/axios';

const Home = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Bộ lọc
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await API.get('/items');
      console.log('Dữ liệu từ API Backend:', res.data);

      // Nhận diện dữ liệu linh hoạt (res.data.items hoặc res.data.data hoặc res.data)
      const rawData = res.data?.items || res.data?.data || res.data;

      if (Array.isArray(rawData)) {
        setItems(rawData);
      } else {
        setItems([]);
      }
    } catch (err) {
      console.error('Lỗi khi tải danh sách:', err);
      setError('Không thể kết nối đến máy chủ!');
    } finally {
      setLoading(false);
    }
  };

  // Logic lọc bài viết
  const filteredItems = items.filter((item) => {
    const title = (item.title || item.itemName || '').toLowerCase();
    const location = (item.location || item.place || '').toLowerCase();
    const description = (item.description || item.content || '').toLowerCase();
    const search = searchTerm.toLowerCase();

    // Lọc theo từ khóa
    const matchesSearch =
      title.includes(search) || location.includes(search) || description.includes(search);

    // Lọc theo loại tin (lost/found)
    const itemType = item.type || item.postType;
    const matchesType =
      selectedType === 'all' || !selectedType || itemType === selectedType;

    // Lọc theo danh mục
    const itemCategory = item.category || item.cat || 'Khác';
    const matchesCategory =
      selectedCategory === 'all' ||
      !selectedCategory ||
      itemCategory.trim().toLowerCase() === selectedCategory.trim().toLowerCase();

    return matchesSearch && matchesType && matchesCategory;
  });

  return (
    <div style={styles.container}>
      {/* THANH TÌM KIẾM VÀ BỘ LỌC */}
      <div style={styles.filterCard}>
        <div style={styles.searchBox}>
          <span style={styles.searchIcon}>🔍</span>
          <input
            type="text"
            placeholder="Tìm kiếm theo tên đồ vật, vị trí..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={styles.searchInput}
          />
        </div>

        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          style={styles.select}
        >
          <option value="all">--- Tất cả loại tin ---</option>
          <option value="lost">🔴 Tin Mất Đồ</option>
          <option value="found">🟢 Tin Nhặt Được</option>
        </select>

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          style={styles.select}
        >
          <option value="all">--- Tất cả danh mục ---</option>
          <option value="Giấy tờ cá nhân">Giấy tờ cá nhân</option>
          <option value="Thiết bị điện tử">Thiết bị điện tử</option>
          <option value="Ví / Bóp">Ví / Bóp</option>
          <option value="Chìa khóa / Thẻ xe">Chìa khóa / Thẻ xe</option>
          <option value="Khác">Khác</option>
        </select>
      </div>

      {/* DANG SÁCH BÀI ĐĂNG */}
      {loading ? (
        <div style={styles.centerText}>⏳ Đang tải bài viết...</div>
      ) : error ? (
        <div style={{ ...styles.centerText, color: '#ef4444' }}>{error}</div>
      ) : filteredItems.length > 0 ? (
        <div style={styles.grid}>
          {filteredItems.map((item) => {
            const itemId = item._id || item.id;
            const itemTitle = item.title || item.itemName || 'Bài đăng không tên';
            const itemType = item.type || item.postType || 'lost';
            const itemCategory = item.category || 'Khác';
            const itemLocation = item.location || 'Chưa cập nhật';
            const itemImage =
              item.imageUrl || item.image || (Array.isArray(item.images) ? item.images[0] : null);
            const itemDate = item.date || item.createdAt;

            return (
              <Link to={`/items/${itemId}`} key={itemId} style={styles.card}>
                <div style={styles.imageBox}>
                  {itemImage ? (
                    <img src={itemImage} alt={itemTitle} style={styles.image} />
                  ) : (
                    <div style={styles.noImg}>📷 Không có hình ảnh</div>
                  )}
                </div>

                <div style={styles.cardBody}>
                  <div style={styles.badgeRow}>
                    <span
                      style={{
                        ...styles.typeBadge,
                        backgroundColor: itemType === 'lost' ? '#fee2e2' : '#dcfce7',
                        color: itemType === 'lost' ? '#dc2626' : '#16a34a',
                      }}
                    >
                      {itemType === 'lost' ? '🔴 Tin Mất Đồ' : '🟢 Tin Nhặt Được'}
                    </span>
                    <span style={styles.catBadge}>{itemCategory}</span>
                  </div>

                  <h3 style={styles.cardTitle}>{itemTitle}</h3>

                  <div style={styles.infoRow}>
                    <span>📍 Địa điểm: {itemLocation}</span>
                  </div>

                  <div style={styles.infoRow}>
                    <span>
                      📅 Ngày:{' '}
                      {itemDate ? new Date(itemDate).toLocaleDateString('vi-VN') : 'Mới đây'}
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      ) : (
        <div style={styles.centerText}>
          <p style={{ color: '#64748b' }}>Không tìm thấy bài đăng phù hợp.</p>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '1100px',
    margin: '0 auto',
    padding: '20px 15px',
  },
  filterCard: {
    backgroundColor: '#ffffff',
    padding: '16px 20px',
    borderRadius: '12px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.03)',
    border: '1px solid #e2e8f0',
    display: 'flex',
    gap: '12px',
    flexWrap: 'wrap',
    alignItems: 'center',
    marginBottom: '24px',
  },
  searchBox: {
    flex: '1 1 280px',
    display: 'flex',
    alignItems: 'center',
    border: '1px solid #cbd5e1',
    borderRadius: '8px',
    padding: '0 12px',
    backgroundColor: '#fff',
  },
  searchIcon: {
    marginRight: '8px',
    color: '#94a3b8',
  },
  searchInput: {
    width: '100%',
    padding: '10px 0',
    border: 'none',
    outline: 'none',
    fontSize: '14px',
  },
  select: {
    padding: '10px 12px',
    borderRadius: '8px',
    border: '1px solid #cbd5e1',
    fontSize: '14px',
    outline: 'none',
    backgroundColor: '#fff',
    cursor: 'pointer',
  },
  centerText: {
    textAlign: 'center',
    padding: '60px 20px',
    fontSize: '15px',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
    gap: '20px',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    border: '1px solid #e2e8f0',
    overflow: 'hidden',
    textDecoration: 'none',
    color: 'inherit',
    boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
    transition: 'transform 0.2s, box-shadow 0.2s',
  },
  imageBox: {
    height: '180px',
    backgroundColor: '#f8fafc',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  noImg: {
    color: '#94a3b8',
    fontSize: '13px',
  },
  cardBody: {
    padding: '16px',
  },
  badgeRow: {
    display: 'flex',
    gap: '6px',
    marginBottom: '10px',
  },
  typeBadge: {
    fontSize: '11px',
    fontWeight: '700',
    padding: '3px 8px',
    borderRadius: '6px',
  },
  catBadge: {
    fontSize: '11px',
    fontWeight: '600',
    backgroundColor: '#f1f5f9',
    color: '#475569',
    padding: '3px 8px',
    borderRadius: '6px',
  },
  cardTitle: {
    fontSize: '16px',
    fontWeight: '700',
    color: '#0f172a',
    margin: '0 0 10px 0',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  infoRow: {
    fontSize: '13px',
    color: '#64748b',
    marginTop: '4px',
  },
};

export default Home;