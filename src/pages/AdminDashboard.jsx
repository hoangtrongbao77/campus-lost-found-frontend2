import { useState, useEffect } from 'react';
import API from '../api/axios';
import Toast from '../components/Toast';

export default function AdminDashboard() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    fetchAllItems();
  }, []);

  // Lấy toàn bộ danh sách bài đăng hệ thống
  const fetchAllItems = async () => {
    try {
      setLoading(true);
      const res = await API.get('/items');
      setItems(res.data);
    } catch (err) {
      setToast({
        type: 'error',
        message: err.response?.data?.message || 'Không thể tải danh sách bài đăng!',
      });
    } finally { // 👈 Đã sửa lỗi chính tả ở đây (fontally -> finally)
      setLoading(false);
    }
  };

  // ⚡ Xử lý Xóa Bài Đăng Dành Cho Admin
  const handleDeleteItem = async (itemId, title) => {
    const isConfirmed = window.confirm(
      `⚠️ ADMIN CẢNH BÁO:\n\nBạn có chắc chắn muốn XÓA VĨNH VIỄN bài đăng:\n"${title}"?`
    );

    if (!isConfirmed) return;

    try {
      setDeletingId(itemId);
      await API.delete(`/items/${itemId}`);

      // Lọc bỏ bài đăng vừa xóa khỏi State để giao diện cập nhật ngay lập tức
      setItems((prevItems) => prevItems.filter((item) => item._id !== itemId));

      setToast({
        type: 'success',
        message: 'Đã xóa bài đăng vi phạm thành công!',
      });
    } catch (err) {
      setToast({
        type: 'error',
        message: err.response?.data?.message || 'Xóa bài đăng thất bại!',
      });
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return <div className="text-center py-20 text-gray-500 font-bold">⏳ Đang tải dữ liệu Admin...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6 space-y-6">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div className="flex justify-between items-center bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">🛡️ Quản Lý Bài Đăng (Admin)</h1>
          <p className="text-xs text-gray-400 mt-1">
            Tổng số bài đăng trên hệ thống: <strong className="text-blue-600">{items.length}</strong> bài
          </p>
        </div>
        <button
          onClick={fetchAllItems}
          className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold px-3 py-2 rounded-xl transition"
        >
          🔄 Làm mới
        </button>
      </div>

      {/* BẢNG DỮ LIỆU BÀI ĐĂNG */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50 border-b border-gray-100 text-gray-500 font-bold uppercase">
              <tr>
                <th className="p-4">Tiêu đề</th>
                <th className="p-4">Phân loại</th>
                <th className="p-4">Danh mục</th>
                <th className="p-4">Vị trí</th>
                <th className="p-4">Ngày đăng</th>
                <th className="p-4 text-center">Thao tác Admin</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {items.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center p-8 text-gray-400">
                    Chưa có bài đăng nào trên hệ thống.
                  </td>
                </tr>
              ) : (
                items.map((item) => (
                  <tr key={item._id} className="hover:bg-gray-50/50 transition">
                    <td className="p-4 font-bold text-gray-800 max-w-xs truncate">
                      {item.title}
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-2 py-1 rounded-md text-[10px] font-bold ${
                          item.type === 'lost'
                            ? 'bg-red-100 text-red-600'
                            : 'bg-green-100 text-green-600'
                        }`}
                      >
                        {item.type === 'lost' ? '🔴 Mất đồ' : '🟢 Nhặt được'}
                      </span>
                    </td>
                    <td className="p-4 text-gray-600">{item.category}</td>
                    <td className="p-4 text-gray-500 truncate max-w-[150px]">{item.location}</td>
                    <td className="p-4 text-gray-400">
                      {new Date(item.createdAt).toLocaleDateString('vi-VN')}
                    </td>
                    <td className="p-4 text-center">
                      <button
                        onClick={() => handleDeleteItem(item._id, item.title)}
                        disabled={deletingId === item._id}
                        className="bg-red-50 hover:bg-red-600 text-red-600 hover:text-white border border-red-200 font-bold px-3 py-1.5 rounded-lg text-xs transition disabled:opacity-50"
                      >
                        {deletingId === item._id ? '⏳ Đang xóa...' : '🗑️ Xóa bài'}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}