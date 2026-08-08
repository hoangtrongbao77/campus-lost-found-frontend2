import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import API from '../api/axios';

export default function ItemDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [item, setItem] = useState(null);
  const [matches, setMatches] = useState([]); // State lưu bài đăng gợi ý
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchItemAndMatches();
  }, [id]);

  const fetchItemAndMatches = async () => {
    try {
      setLoading(true);
      // Gọi song song API lấy Chi tiết bài đăng & Bài đăng trùng khớp
      const [itemRes, matchesRes] = await Promise.all([
        API.get(`/items/${id}`),
        API.get(`/items/${id}/matches`),
      ]);

      setItem(itemRes.data);
      setMatches(matchesRes.data);
    } catch (err) {
      console.error('Lỗi khi tải chi tiết bài đăng:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-20 font-bold text-gray-500">⏳ Đang tải thông tin...</div>;
  }

  if (!item) {
    return <div className="text-center py-20 text-red-500 font-bold">⚠️ Bài đăng không tồn tại!</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6 space-y-6">
      {/* 📄 BÀI ĐĂNG CHI TIẾT HIỆN TẠI */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4">
        <div className="flex justify-between items-start gap-2">
          <span
            className={`text-xs font-bold px-3 py-1 rounded-full ${
              item.type === 'lost' ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'
            }`}
          >
            {item.type === 'lost' ? '🔴 Cần tìm đồ thất lạc' : '🟢 Đã nhặt được đồ'}
          </span>
          <span className="text-xs text-gray-400">
            {new Date(item.createdAt).toLocaleDateString('vi-VN')}
          </span>
        </div>

        <h1 className="text-2xl font-bold text-gray-800">{item.title}</h1>
        <p className="text-gray-600 text-sm leading-relaxed">{item.description}</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-4 border-t border-gray-100 text-xs text-gray-600">
          <p>📍 <strong>Địa điểm:</strong> {item.location}</p>
          <p>🏷️ <strong>Danh mục:</strong> {item.category}</p>
          <p>👤 <strong>Người đăng:</strong> {item.user?.fullName || 'Sinh viên'}</p>
          <p>📞 <strong>SĐT liên hệ:</strong> {item.user?.phoneNumber || 'Chưa cung cấp'}</p>
        </div>
      </div>

      {/* 🎯 KHUNG SMART MATCH: GỢI Ý BÀI ĐĂNG CÓ THỂ TRÙNG KHỚP */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-2xl border border-blue-100 space-y-4">
        <div className="flex items-center gap-2">
          <span className="text-xl">⚡</span>
          <h2 className="text-lg font-bold text-gray-800">
            Gợi Ý Trùng Khớp Tự Động ({matches.length})
          </h2>
        </div>
        <p className="text-xs text-gray-500">
          Hệ thống phát hiện các bài đăng đối ứng có cùng danh mục và từ khóa liên quan:
        </p>

        {matches.length === 0 ? (
          <div className="bg-white/80 p-4 rounded-xl text-center text-xs text-gray-500">
            Hệ thống chưa tìm thấy bài đăng nào có dấu hiệu trùng khớp.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {matches.map((matchItem) => (
              <div
                key={matchItem._id}
                className="bg-white p-4 rounded-xl border border-blue-100 shadow-sm hover:shadow-md transition space-y-2 flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="bg-amber-100 text-amber-700 text-[10px] font-bold px-2 py-0.5 rounded-md">
                      ✨ Khớp {item.category}
                    </span>
                    <span className="text-[10px] text-gray-400">
                      {new Date(matchItem.createdAt).toLocaleDateString('vi-VN')}
                    </span>
                  </div>
                  <h3 className="font-bold text-sm text-gray-800 line-clamp-1">
                    {matchItem.title}
                  </h3>
                  <p className="text-xs text-gray-500 line-clamp-2 mt-1">
                    {matchItem.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-gray-50 flex justify-between items-center text-xs">
                  <span className="text-gray-400 truncate max-w-[150px]">📍 {matchItem.location}</span>
                  <Link
                    to={`/items/${matchItem._id}`}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-3 py-1 rounded-lg text-[11px] transition"
                  >
                    Xem chi tiết →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}