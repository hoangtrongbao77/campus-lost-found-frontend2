import { useState, useEffect } from 'react';
import API from '../api/axios';
import Toast from '../components/Toast';

export default function Profile() {
  const [user, setUser] = useState(null);
  const [avatarUrl, setAvatarUrl] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      setUser(parsedUser);
      setAvatarUrl(parsedUser.avatar || '');
    }
  }, []);

  // Danh sách avatar mẫu gợi ý
  const defaultAvatars = [
    'https://api.dicebear.com/7.x/bottts/svg?seed=Felix',
    'https://api.dicebear.com/7.x/bottts/svg?seed=Aneka',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Sophia',
  ];

  // URL Avatar hiển thị (Dùng UI-Avatars làm fallback nếu user chưa cài avatar)
  const displayAvatar =
    user?.avatar ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(
      user?.fullName || 'User'
    )}&background=0D8ABC&color=fff&bold=true`;

  const handleUpdateAvatar = async (newUrl) => {
    const finalUrl = newUrl || avatarUrl;
    if (!finalUrl.trim()) {
      setToast({ type: 'warning', message: 'Vui lòng nhập URL ảnh đại diện!' });
      return;
    }

    try {
      setLoading(true);
      const res = await API.put('/auth/avatar', { avatar: finalUrl });

      // Cập nhật lại localStorage & State
      const updatedUser = { ...user, avatar: res.data.avatar };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      setIsEditing(false);

      // Phát sự kiện thông báo các component khác (như Navbar) cập nhật lại
      window.dispatchEvent(new Event('storage'));

      setToast({ type: 'success', message: 'Cập nhật ảnh đại diện thành công!' });
    } catch (err) {
      setToast({
        type: 'error',
        message: err.response?.data?.message || 'Cập nhật thất bại!',
      });
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6 space-y-6">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {/* THÔNG TIN CÁ NHÂN & AVATAR CARD */}
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row items-center gap-6">
        {/* Khung chứa Avatar */}
        <div className="relative group">
          <img
            src={displayAvatar}
            alt={user.fullName}
            className="w-28 h-28 rounded-full object-cover border-4 border-blue-500/20 shadow-md"
          />
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="absolute bottom-0 right-0 bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full shadow-lg transition text-xs"
            title="Đổi ảnh đại diện"
          >
            ✏️
          </button>
        </div>

        {/* Thông tin Text */}
        <div className="space-y-1 text-center md:text-left flex-1">
          <div className="flex items-center justify-center md:justify-start gap-2">
            <h1 className="text-xl font-bold text-gray-800">{user.fullName}</h1>
            <span className="bg-blue-100 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
              {user.role}
            </span>
          </div>
          <p className="text-xs text-gray-500">📧 {user.email}</p>
          <p className="text-xs text-gray-400">
            Cập nhật lần cuối: {new Date().toLocaleDateString('vi-VN')}
          </p>
        </div>
      </div>

      {/* MODAL / KHUNG ĐỔI AVATAR */}
      {isEditing && (
        <div className="bg-blue-50/50 p-5 rounded-2xl border border-blue-100 space-y-4">
          <h3 className="text-xs font-bold text-gray-700">🖼️ Chọn hoặc Nhập Link Ảnh Đại Diện Mới</h3>

          {/* Dùng Avatar Mẫu Gợi Ý */}
          <div>
            <p className="text-[11px] text-gray-500 mb-2">Hoặc chọn nhanh avatar có sẵn:</p>
            <div className="flex gap-3">
              {defaultAvatars.map((url, idx) => (
                <img
                  key={idx}
                  src={url}
                  alt="avatar option"
                  onClick={() => {
                    setAvatarUrl(url);
                    handleUpdateAvatar(url);
                  }}
                  className="w-12 h-12 rounded-full border-2 border-white shadow-sm cursor-pointer hover:scale-110 transition bg-white"
                />
              ))}
            </div>
          </div>

          {/* Nhập URL tùy chỉnh */}
          <div className="flex gap-2">
            <input
              type="text"
              value={avatarUrl}
              onChange={(e) => setAvatarUrl(e.target.value)}
              placeholder="Dán URL hình ảnh từ internet (https://...)"
              className="flex-1 px-4 py-2 text-xs rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            />
            <button
              onClick={() => handleUpdateAvatar()}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2 rounded-xl text-xs transition disabled:opacity-50"
            >
              {loading ? '⏳ Đang lưu...' : 'Lưu Ảnh'}
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold px-3 py-2 rounded-xl text-xs transition"
            >
              Hủy
            </button>
          </div>
        </div>
      )}
    </div>
  );
}