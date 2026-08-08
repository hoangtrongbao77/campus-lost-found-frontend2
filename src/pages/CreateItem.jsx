import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';
import Toast from '../components/Toast';

export default function CreateItem() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    type: 'lost',
    location: '',
  });

  const [errors, setErrors] = useState({});
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) setErrors({ ...errors, [name]: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Vui lòng nhập Tiêu đề bài đăng!';
    } else if (formData.title.trim().length < 6) {
      newErrors.title = 'Tiêu đề cần ít nhất 6 ký tự để mô tả rõ đồ vật!';
    }

    if (!formData.category) {
      newErrors.category = 'Vui lòng chọn Danh mục đồ vật!';
    }

    if (!formData.location.trim()) {
      newErrors.location = 'Vui lòng nhập Vị trí rơi / nhặt được!';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Vui lòng viết thêm chi tiết mô tả!';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setToast({ type: 'warning', message: 'Vui lòng hoàn thành các trường bắt buộc!' });
      return;
    }

    try {
      setLoading(true);
      await API.post('/items', formData);
      setToast({ type: 'success', message: 'Đăng tin thành công!' });
      setTimeout(() => navigate('/'), 1200);
    } catch (err) {
      setToast({
        type: 'error',
        message: err.response?.data?.message || 'Không thể tạo bài đăng!',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-4 md:p-6">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-5">
        <h1 className="text-xl font-bold text-gray-800 text-center">📝 Đăng Tin Đồ Thất Lạc</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Loại tin */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Loại Tin (*)</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, type: 'lost' })}
                className={`py-2 rounded-xl text-xs font-bold transition border ${
                  formData.type === 'lost'
                    ? 'bg-red-50 border-red-500 text-red-600'
                    : 'border-gray-200 text-gray-500'
                }`}
              >
                🔴 Cần tìm đồ thất lạc
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, type: 'found' })}
                className={`py-2 rounded-xl text-xs font-bold transition border ${
                  formData.type === 'found'
                    ? 'bg-green-50 border-green-500 text-green-600'
                    : 'border-gray-200 text-gray-500'
                }`}
              >
                🟢 Nhặt được đồ
              </button>
            </div>
          </div>

          {/* Tiêu đề */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Tiêu Đề (*)</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="VD: Rớt ví da màu đen tại Thư viện"
              className={`w-full px-4 py-2.5 text-xs rounded-xl border focus:outline-none ${
                errors.title ? 'border-red-500 bg-red-50/30' : 'border-gray-200 focus:ring-2 focus:ring-blue-500'
              }`}
            />
            {errors.title && <p className="text-[11px] text-red-500 mt-1">⚠️ {errors.title}</p>}
          </div>

          {/* Danh mục */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Danh Mục (*)</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className={`w-full px-4 py-2.5 text-xs rounded-xl border bg-white focus:outline-none ${
                errors.category ? 'border-red-500 bg-red-50/30' : 'border-gray-200 focus:ring-2 focus:ring-blue-500'
              }`}
            >
              <option value="">-- Chọn danh mục --</option>
              <option value="Ví / Giấy tờ">Ví / Giấy tờ</option>
              <option value="Thiết bị điện tử">Thiết bị điện tử</option>
              <option value="Chìa khóa">Chìa khóa</option>
              <option value="Thẻ sinh viên">Thẻ sinh viên</option>
              <option value="Khác">Khác</option>
            </select>
            {errors.category && <p className="text-[11px] text-red-500 mt-1">⚠️ {errors.category}</p>}
          </div>

          {/* Vị trí */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Vị Trí (*)</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="VD: Giảng đường A, Tầng 2"
              className={`w-full px-4 py-2.5 text-xs rounded-xl border focus:outline-none ${
                errors.location ? 'border-red-500 bg-red-50/30' : 'border-gray-200 focus:ring-2 focus:ring-blue-500'
              }`}
            />
            {errors.location && <p className="text-[11px] text-red-500 mt-1">⚠️ {errors.location}</p>}
          </div>

          {/* Mô tả */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Mô Tả Chi Tiết (*)</label>
            <textarea
              name="description"
              rows="3"
              value={formData.description}
              onChange={handleChange}
              placeholder="Mô tả đặc điểm nhận dạng, màu sắc, tình trạng..."
              className={`w-full px-4 py-2.5 text-xs rounded-xl border focus:outline-none ${
                errors.description ? 'border-red-500 bg-red-50/30' : 'border-gray-200 focus:ring-2 focus:ring-blue-500'
              }`}
            ></textarea>
            {errors.description && <p className="text-[11px] text-red-500 mt-1">⚠️ {errors.description}</p>}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-yellow-400 hover:bg-yellow-500 disabled:bg-gray-300 text-gray-900 font-bold py-2.5 rounded-xl transition text-xs shadow-sm"
          >
            {loading ? '⏳ Đang đăng tin...' : '+ Hoàn Tất Đăng Tin'}
          </button>
        </form>
      </div>
    </div>
  );
}