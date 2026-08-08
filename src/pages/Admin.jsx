import React, { useEffect, useState } from 'react';
import API from '../api/axios';

const Admin = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const res = await API.get('/items');
      
      // Kiểm tra và lấy chính xác kiểu mảng dữ liệu từ API
      let rawData = res.data;
      if (Array.isArray(rawData)) {
        setItems(rawData);
      } else if (Array.isArray(rawData?.items)) {
        setItems(rawData.items);
      } else if (Array.isArray(rawData?.data)) {
        setItems(rawData.data);
      } else {
        setItems([]);
      }
    } catch (err) {
      console.error('Lỗi lấy danh sách đồ vật:', err);
      setError('Không thể kết nối đến máy chủ hoặc bài đăng.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!id) return;
    if (!window.confirm('Bạn có chắc chắn muốn xóa bài đăng này không?')) return;
    
    try {
      await API.delete(`/items/${id}`);
      setItems((prev) => prev.filter((item) => item._id !== id));
      alert('Đã xóa bài đăng thành công!');
    } catch (err) {
      console.error('Lỗi xóa bài đăng:', err);
      alert(err.response?.data?.message || 'Lỗi khi xóa bài đăng!');
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px', fontSize: '16px', color: '#64748b' }}>
        ⏳ Đang tải dữ liệu Bảng điều trị Admin...
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '20px' }}>
      <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '20px', color: '#0f172a' }}>
        🛡️ Bảng Quản Trị Hệ Thống (Admin Dashboard)
      </h2>

      {error && (
        <div style={{ padding: '12px 16px', backgroundColor: '#fef2f2', color: '#dc2626', borderRadius: '8px', marginBottom: '16px', border: '1px solid #fecaca' }}>
          {error}
        </div>
      )}

      <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
              <th style={{ padding: '14px 16px', color: '#475569', fontSize: '14px' }}>Tiêu đề</th>
              <th style={{ padding: '14px 16px', color: '#475569', fontSize: '14px' }}>Loại tin</th>
              <th style={{ padding: '14px 16px', color: '#475569', fontSize: '14px' }}>Địa điểm</th>
              <th style={{ padding: '14px 16px', color: '#475569', fontSize: '14px' }}>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {!Array.isArray(items) || items.length === 0 ? (
              <tr>
                <td colSpan="4" style={{ padding: '24px', textAlign: 'center', color: '#64748b' }}>
                  Chưa có bài đăng nào trong hệ thống.
                </td>
              </tr>
            ) : (
              items.map((item) => (
                <tr key={item._id || Math.random()} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '14px 16px', fontWeight: '600', color: '#0f172a' }}>
                    {item.title || 'Không có tiêu đề'}
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <span
                      style={{
                        padding: '4px 10px',
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
                  <td style={{ padding: '14px 16px', color: '#475569' }}>{item.location || 'N/A'}</td>
                  <td style={{ padding: '14px 16px' }}>
                    <button
                      onClick={() => handleDelete(item._id)}
                      style={{
                        backgroundColor: '#ef4444',
                        color: '#ffffff',
                        border: 'none',
                        padding: '6px 14px',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontWeight: '600',
                        fontSize: '13px',
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
    </div>
  );
};

export default Admin;