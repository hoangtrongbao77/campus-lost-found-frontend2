import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Navbar() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  const loadUser = () => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) setUser(JSON.parse(savedUser));
    else setUser(null);
  };

  useEffect(() => {
    loadUser();
    window.addEventListener('storage', loadUser);
    return () => window.removeEventListener('storage', loadUser);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    navigate('/login');
  };

  const avatarSrc =
    user?.avatar ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(
      user?.fullName || 'User'
    )}&background=0D8ABC&color=fff&bold=true`;

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="font-bold text-blue-600 text-lg flex items-center gap-2">
          🔍 Campus Lost & Found
        </Link>

        <div className="flex items-center gap-3 text-xs font-semibold">
          {user ? (
            <>
              {/* 🛡️ NÚT QUẢN TRỊ VIÊN (Chỉ hiển thị khi role === 'admin') */}
              {user.role === 'admin' && (
                <Link
                  to="/admin"
                  className="bg-purple-100 text-purple-700 hover:bg-purple-200 border border-purple-200 px-3 py-1.5 rounded-xl transition flex items-center gap-1"
                >
                  🛡️ Quản trị
                </Link>
              )}

              <Link to="/create-item" className="bg-blue-600 text-white px-3 py-1.5 rounded-xl hover:bg-blue-700 transition">
                + Đăng tin
              </Link>

              {/* Link trang Cá nhân */}
              <Link to="/profile" className="flex items-center gap-2 bg-gray-50 hover:bg-gray-100 p-1.5 pr-3 rounded-full border border-gray-200 transition">
                <img
                  src={avatarSrc}
                  alt={user.fullName}
                  className="w-7 h-7 rounded-full object-cover"
                />
                <span className="text-gray-700 max-w-[100px] truncate">{user.fullName}</span>
              </Link>

              <button onClick={handleLogout} className="text-red-500 hover:underline ml-1">
                Đăng xuất
              </button>
            </>
          ) : (
            <Link to="/login" className="bg-blue-600 text-white px-4 py-1.5 rounded-xl">
              Đăng Nhập
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}