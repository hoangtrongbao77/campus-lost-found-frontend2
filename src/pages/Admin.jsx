import React, { useState, useEffect } from 'react';
import API from '../api/axios';

const Admin = () => {
  const [items, setItems] = useState([]);
  const [userCount, setUserCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      // 1. Lấy tất cả bài viết
      const resItems = await API.get('/items?status=all');
      const rawItems = resItems.data?.items || resItems.data || [];
      setItems(Array.isArray(rawItems) ? rawItems : []);

      // 2. Lấy số lượng người dùng từ endpoint /admin/user-count
      const resUsers = await API.get('/admin/user-count');
      if (resUsers.data?.success) {
        setUserCount(resUsers.data.count);
      }
    } catch (err) {
      console.error('Lỗi tải dữ liệu Admin:', err);
    } finally {
      setLoading(false);
    }
  };

  // Hàm duyệt bài
  const handleApprove = async (id) => {
    try {
      const res = await API.put(`/items/${id}/approve`);
      if (res.data.success) {
        alert('✅ Đã duyệt bài viết thành công!');
        setItems((prev) =>
          prev.map((item) => (item._id === id ? { ...item, status: 'approved' } : item))
        );
      }
    } catch (err) {
      alert('Không thể duyệt bài viết. Vui lòng thử lại!');
    }
  };

  // Hàm xóa bài
  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa bài viết này?')) {
      try {
        const res = await API.delete(`/items/${id}`);
        if (res.data.success) {
          alert('🗑️ Đã xóa bài viết!');
          setItems((prev) => prev.filter((item) => item._id !== id));
        }
      } catch (err) {
        alert('Xóa bài viết thất bại!');
      }
    }
  };

  const pendingCount = items.filter((i) => i.status === 'pending').length;
  const approvedCount = items.filter((i) => i.status === 'approved').length;

  const displayedItems = items.filter((item) => {
    if (filterStatus === 'pending') return item.status === 'pending';
    if (filterStatus === 'approved') return item.status === 'approved';
    return true;
  });

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>🛡️ Bảng Quản Trị Hệ Thống (Admin Dashboard)</h2>

      {/* THỐNG KÊ */}
      <div style={styles.statsGrid}>
        <div style={{ ...styles.statCard, borderColor: '#3b82f6' }}>
          <div style={styles.statIcon}>👥</div>
          <div>
            <div style={styles.statNumber}>{userCount}</div>
            <div style={styles.statLabel}>Tổng người dùng</div>
          </div>
        </div>

        <div style={{ ...styles.statCard, borderColor: '#f59e0b' }}>
          <div style={styles.statIcon}>⏳</div>
          <div>
            <div style={{ ...styles.statNumber, color: '#d97706' }}>{pendingCount}</div>
            <div style={styles.statLabel}>Bài chờ duyệt</div>
          </div>
        </div>

        <div style={{ ...styles.statCard, borderColor: '#10b981' }}>
          <div style={styles.statIcon}>✅</div>
          <div>
            <div style={{ ...styles.statNumber, color: '#059669' }}>{approvedCount}</div>
            <div style={styles.statLabel}>Bài đã duyệt</div>
          </div>
        </div>
      </div>

      {/* TABS */}
      <div style={styles.tabContainer}>
        <button
          onClick={() => setFilterStatus('all')}
          style={{ ...styles.tabBtn, ...(filterStatus === 'all' ? styles.activeTab : {}) }}
        >
          Tất cả ({items.length})
        </button>
        <button
          onClick={() => setFilterStatus('pending')}
          style={{ ...styles.tabBtn, ...(filterStatus === 'pending' ? styles.activeTab : {}) }}
        >
          ⏳ Chờ duyệt ({pendingCount})
        </button>
        <button
          onClick={() => setFilterStatus('approved')}
          style={{ ...styles.tabBtn, ...(filterStatus === 'approved' ? styles.activeTab : {}) }}
        >
          ✅ Đã duyệt ({approvedCount})
        </button>
      </div>

      {/* TABLE */}
      <div style={styles.tableCard}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px' }}>⏳ Đang tải dữ liệu...</div>
        ) : displayedItems.length > 0 ? (
          <table style={styles.table}>
            <thead>
              <tr style={styles.thRow}>
                <th style={styles.th}>Tiêu đề</th>
                <th style={styles.th}>Người đăng</th>
                <th style={styles.th}>Loại tin</th>
                <th style={styles.th}>Trạng thái</th>
                <th style={styles.th}>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {displayedItems.map((item) => (
                <tr key={item._id} style={styles.tr}>
                  <td style={styles.tdBold}>{item.title}</td>
                  <td style={styles.td}>
                    {item.user?.fullName || 'Người dùng'} <br />
                    <small style={{ color: '#64748b' }}>SĐT: {item.phone || item.user?.phone || 'Chưa có'}</small>
                  </td>
                  <td style={styles.td}>
                    <span
                      style={{
                        ...styles.badge,
                        backgroundColor: item.type === 'lost' ? '#fee2e2' : '#dcfce7',
                        color: item.type === 'lost' ? '#dc2626' : '#16a34a',
                      }}
                    >
                      {item.type === 'lost' ? 'Cần tìm đồ' : 'Nhặt được đồ'}
                    </span>
                  </td>
                  <td style={styles.td}>
                    {item.status === 'approved' ? (
                      <span style={{ ...styles.badge, backgroundColor: '#d1fae5', color: '#047857' }}>
                        ✅ Đã duyệt
                      </span>
                    ) : (
                      <span style={{ ...styles.badge, backgroundColor: '#fef3c7', color: '#b45309' }}>
                        ⏳ Chờ duyệt
                      </span>
                    )}
                  </td>
                  <td style={styles.td}>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      {item.status !== 'approved' && (
                        <button onClick={() => handleApprove(item._id)} style={styles.approveBtn}>
                          Duyệt
                        </button>
                      )}
                      <button onClick={() => handleDelete(item._id)} style={styles.deleteBtn}>
                        Xóa
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>
            Không có bài viết nào ở trạng thái này.
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: { maxWidth: '1100px', margin: '20px auto', padding: '0 15px' },
  title: { fontSize: '22px', fontWeight: '700', color: '#0f172a', marginBottom: '20px' },
  statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '24px' },
  statCard: { backgroundColor: '#ffffff', padding: '20px', borderRadius: '12px', borderLeft: '5px solid', boxShadow: '0 2px 10px rgba(0,0,0,0.04)', display: 'flex', alignItems: 'center', gap: '16px' },
  statIcon: { fontSize: '32px' },
  statNumber: { fontSize: '24px', fontWeight: '800', color: '#1e293b' },
  statLabel: { fontSize: '13px', color: '#64748b', fontWeight: '600' },
  tabContainer: { display: 'flex', gap: '8px', marginBottom: '16px' },
  tabBtn: { padding: '8px 16px', borderRadius: '8px', border: '1px solid #cbd5e1', backgroundColor: '#ffffff', cursor: 'pointer', fontSize: '14px', fontWeight: '600', color: '#475569' },
  activeTab: { backgroundColor: '#2563eb', color: '#ffffff', borderColor: '#2563eb' },
  tableCard: { backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 2px 10px rgba(0,0,0,0.03)', overflowX: 'auto' },
  table: { width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' },
  thRow: { backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' },
  th: { padding: '12px 16px', fontWeight: '700', color: '#334155' },
  tr: { borderBottom: '1px solid #f1f5f9' },
  td: { padding: '12px 16px', color: '#475569' },
  tdBold: { padding: '12px 16px', fontWeight: '600', color: '#0f172a' },
  badge: { fontSize: '12px', fontWeight: '700', padding: '4px 8px', borderRadius: '6px', display: 'inline-block' },
  approveBtn: { backgroundColor: '#10b981', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '6px', fontWeight: '600', cursor: 'pointer' },
  deleteBtn: { backgroundColor: '#ef4444', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '6px', fontWeight: '600', cursor: 'pointer' },
};

export default Admin;