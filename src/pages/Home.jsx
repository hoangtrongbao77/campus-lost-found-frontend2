import React, { useState, useEffect } from 'react';
import API from '../api/axios';

const Home = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const res = await API.get('/items');
      const data = res.data.data || res.data;

      const sortedData = Array.isArray(data)
        ? data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        : [];

      setItems(sortedData);
    } catch (error) {
      console.error('Lỗi tải bài đăng:', error);
    } finally {
      setLoading(false);
    }
  };

  // Hàm trích xuất tên tác giả đa tầng
  const getAuthorName = (item) => {
    if (item.user && typeof item.user === 'object') {
      const name = item.user.fullName || item.user.name || item.user.username;
      if (name) return name;
      if (item.user.email) return item.user.email.split('@')[0];
    }
    if (item.authorName) return item.authorName;
    return 'Người dùng';
  };

  const filteredItems = items.filter((item) => {
    const matchSearch =
      item.title?.toLowerCase().includes(search.toLowerCase()) ||
      item.description?.toLowerCase().includes(search.toLowerCase()) ||
      item.location?.toLowerCase().includes(search.toLowerCase());

    const matchType = typeFilter ? item.type === typeFilter : true;
    const matchCategory = categoryFilter ? item.category === categoryFilter : true;

    return matchSearch && matchType && matchCategory;
  });

  return (
    <div style={styles.container}>
      <div style={styles.filterCard}>
        <input
          type="text"
          placeholder="🔍 Tìm kiếm theo tên đồ vật, vị trí..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={styles.searchInput}
        />

        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          style={styles.selectFilter}
        >
          <option value="">--- Tất cả loại tin ---</option>
          <option value="lost">🔴 Cần tìm đồ</option>
          <option value="found">🟢 Nhặt được đồ</option>
        </select>

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          style={styles.selectFilter}
        >
          <option value="">--- Tất cả danh mục ---</option>
          <option value="Thiết bị điện tử">Thiết bị điện tử</option>
          <option value="Giấy tờ cá nhân">Giấy tờ cá nhân</option>
          <option value="Ví / Tiền mặt">Ví / Tiền mặt</option>
          <option value="Chìa khóa">Chìa khóa</option>
          <option value="Balo / Túi xách">Balo / Túi xách</option>
          <option value="Đồ dùng học tập">Đồ dùng học tập</option>
          <option value="Khác">Khác</option>
        </select>
      </div>

      <div style={styles.feedContainer}>
        {loading ? (
          <div style={styles.emptyText}>Đang tải bài đăng...</div>
        ) : filteredItems.length === 0 ? (
          <div style={styles.emptyText}>Không tìm thấy bài đăng phù hợp.</div>
        ) : (
          filteredItems.map((item) => {
            const authorName = getAuthorName(item);
            const firstLetter = authorName.charAt(0).toUpperCase();

            return (
              <div key={item._id} style={styles.postCard}>
                <div style={styles.postHeader}>
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
                      <div style={styles.postDate}>
                        {new Date(item.createdAt || Date.now()).toLocaleDateString('vi-VN')}
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

                <div style={styles.postBody}>
                  <h3 style={styles.postTitle}>{item.title}</h3>
                  <p style={styles.postDescription}>{item.description}</p>

                  <div style={styles.postMeta}>
                    <span style={styles.metaItem}>📍 {item.location}</span>
                    <span style={styles.metaItem}>🏷️ {item.category}</span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '720px',
    margin: '0 auto',
    padding: '25px 15px',
  },
  filterCard: {
    backgroundColor: '#ffffff',
    padding: '16px',
    borderRadius: '12px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.04)',
    display: 'flex',
    gap: '10px',
    marginBottom: '25px',
    flexWrap: 'wrap',
  },
  searchInput: {
    flex: '2',
    minWidth: '200px',
    padding: '10px 14px',
    borderRadius: '8px',
    border: '1px solid #e2e8f0',
    fontSize: '14px',
    outline: 'none',
  },
  selectFilter: {
    flex: '1',
    minWidth: '140px',
    padding: '10px 12px',
    borderRadius: '8px',
    border: '1px solid #e2e8f0',
    fontSize: '14px',
    outline: 'none',
    backgroundColor: '#ffffff',
  },
  feedContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  postCard: {
    backgroundColor: '#ffffff',
    borderRadius: '14px',
    padding: '20px',
    boxShadow: '0 2px 12px rgba(0, 0, 0, 0.05)',
    border: '1px solid #f1f5f9',
  },
  postHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '14px',
    paddingBottom: '12px',
    borderBottom: '1px solid #f8fafc',
  },
  userInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  avatar: {
    width: '42px',
    height: '42px',
    borderRadius: '50%',
    backgroundColor: '#2563eb',
    color: '#ffffff',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontWeight: 'bold',
    fontSize: '18px',
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
    fontSize: '15px',
    color: '#1e293b',
  },
  postDate: {
    fontSize: '12px',
    color: '#94a3b8',
    marginTop: '2px',
  },
  badge: {
    padding: '5px 12px',
    borderRadius: '20px',
    fontSize: '12px',
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
  postBody: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  postTitle: {
    margin: 0,
    fontSize: '18px',
    fontWeight: '700',
    color: '#0f172a',
  },
  postDescription: {
    margin: '4px 0 10px 0',
    fontSize: '14px',
    color: '#475569',
    lineHeight: '1.5',
  },
  postMeta: {
    display: 'flex',
    gap: '15px',
    fontSize: '13px',
    color: '#64748b',
    backgroundColor: '#f8fafc',
    padding: '8px 12px',
    borderRadius: '8px',
  },
  metaItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  },
  emptyText: {
    textAlign: 'center',
    padding: '40px',
    color: '#64748b',
    fontSize: '15px',
  },
};

export default Home;