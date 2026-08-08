import React, { useEffect, useState } from 'react';
import API from '../api/axios';

const Admin = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const res = await API.get('/items');
      setItems(res.data.items || res.data || []);
    } catch (err) {
      console.error('Lỗi lấy danh sách đồ vật:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa tin này không?')) return;
    try {
      await API.delete(`/items/${id}`);
      setItems(items.filter((item) => item._id !== id));
      alert('Đã xóa thành công!');
    } catch (err) {
      console.error('Lỗi xóa tin:', err);
      alert('Không thể xóa tin. Vui lòng kiểm tra lại!');
    }
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '20px' }}>
      <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '20px', color: '#0f172a' }}>
        🛡️ Bảng Quản Trị Hệ Thống (Admin Dashboard)
      </h2>

      {loading ? (
        <p>Đang tải dữ liệu...</p>
      ) : (
        <div style={{ backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                <th style={{ padding: '12px 16px' }}>Tiêu đề</th>
                <th style={{ padding: '12px 16px' }}>Loại tin</th>
                <th style={{ padding: '12px 16px' }}>Địa điểm</th>
                <th style={{ padding: '12px 16px' }}>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {items.length === 0 ? (
                <tr>
                  <td colSpan="4" style={{ padding: '16px', textAlign: 'center', color: '#64748b' }}>
                    Chưa có bài đăng nào.
                  </td>
                </tr>
              ) : (
                items.map((item) => (
                  <tr key={item._id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '12px 16px', fontWeight: '600' }}>{item.title}</td>
                    <td style={{ padding: '12px 16px' }}>
                      <span
                        style={{
                          padding: '4px 8px',
                          borderRadius: '6px',
                          fontSize: '12px',
                          backgroundColor: item.type === 'lost' ? '#fef2f2' : '#f0fdf4',
                          color: item.type === 'lost' ? '#dc2626' : '#16a34a',
                          fontWeight: '600',
                        }}
                      >
                        {item.type === 'lost' ? 'Cần tìm đồ' : 'Nhặt được đồ'}
                      </span>
                    </td>
                    <td style={{ padding: '12px 16px' }}>{item.location || 'N/A'}</td>
                    <td style={{ padding: '12px 16px' }}>
                      <button
                        onClick={() => handleDelete(item._id)}
                        style={{
                          backgroundColor: '#ef4444',
                          color: '#fff',
                          border: 'none',
                          padding: '6px 12px',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          fontWeight: '600',
                        }}
                      >
                        Xóa
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Admin;