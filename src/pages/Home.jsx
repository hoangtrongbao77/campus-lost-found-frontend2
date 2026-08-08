import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';

export default function Home() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // States lưu giá trị bộ lọc
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedType, setSelectedType] = useState('All');

  // Lấy danh sách bài đăng từ Backend
  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const res = await API.get('/items');
      setItems(res.data);
    } catch (err) {
      console.error('Lỗi lấy danh sách bài đăng:', err);
    } finally {
      setLoading(false);
    }
  };

  // Logic lọc dữ liệu
  const filteredItems = items.filter((item) => {
    const matchesSearch =
      item.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.location?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      selectedCategory === 'All' || item.category === selectedCategory;

    const matchesType = selectedType === 'All' || item.type === selectedType;

    return matchesSearch && matchesCategory && matchesType;
  });

  if (loading) {
    return (
      <div className="text-center py-20 font-bold text-gray-500">
        ⏳ Đang tải danh sách bài đăng...
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
      {/* 🔍 THANH TÌM KIẾM VÀ BỘ LỌC */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-3">
        {/* Ô tìm kiếm */}
        <input
          type="text"
          placeholder="🔍 Tìm kiếm theo tên đồ vật, vị trí..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {/* Lọc loại tin */}
        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          className="px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
        >
          <option value="All">--- Tất cả loại tin ---</option>
          <option value="lost">🔴 Đồ thất lạc (Cần tìm)</option>
          <option value="found">🟢 Đồ nhặt được</option>
        </select>

        {/* Lọc danh mục */}
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
        >
          <option value="All">--- Tất cả danh mục ---</option>
          <option value="Ví / Giấy tờ">Ví / Giấy tờ</option>
          <option value="Thiết bị điện tử">Thiết bị điện tử</option>
          <option value="Chìa khóa">Chìa khóa</option>
          <option value="Thẻ sinh viên">Thẻ sinh viên</option>
          <option value="Khác">Khác</option>
        </select>
      </div>

      {/* 📦 DANH SÁCH BÀI ĐĂNG (GRID CO GIÃN RESPONSIVE) */}
      {filteredItems.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-100 shadow-sm space-y-3">
          <p className="text-4xl">📭</p>
          <p className="text-sm font-semibold text-gray-600">
            Chưa có bài đăng nào phù hợp.
          </p>
          <p className="text-xs text-gray-400">
            Hãy bấm nút bên dưới để tạo bài đăng đầu tiên cho ứng dụng nhé!
          </p>
          <button
            onClick={() => navigate('/create-item')}
            className="inline-block mt-2 bg-yellow-400 hover:bg-yellow-300 text-gray-900 text-xs font-bold px-4 py-2 rounded-xl transition shadow-sm"
          >
            + Đăng tin mới ngay
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {filteredItems.map((item) => (
            <div
              key={item._id}
              onClick={() => navigate(`/items/${item._id}`)}
              className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm hover:shadow-md transition cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span
                    className={`text-[10px] md:text-xs font-bold px-2.5 py-1 rounded-full ${
                      item.type === 'lost'
                        ? 'bg-red-100 text-red-600'
                        : 'bg-green-100 text-green-600'
                    }`}
                  >
                    {item.type === 'lost' ? '🔴 Cần tìm đồ' : '🟢 Nhặt được đồ'}
                  </span>
                  <span className="text-[10px] text-gray-400">
                    {new Date(item.createdAt).toLocaleDateString('vi-VN')}
                  </span>
                </div>

                <h3 className="font-bold text-sm md:text-base text-gray-800 line-clamp-1 mb-1">
                  {item.title}
                </h3>
                <p className="text-xs text-gray-500 line-clamp-2 mb-3">
                  {item.description}
                </p>
              </div>

              <div className="border-t border-gray-50 pt-2 text-[11px] text-gray-500 space-y-1">
                <p className="truncate">
                  📍 <span className="font-medium">{item.location}</span>
                </p>
                <p className="truncate">
                  🏷️ <span className="font-medium">{item.category}</span>
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}