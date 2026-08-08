import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../api/axios';
import Toast from '../components/Toast';

export default function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [toast, setToast] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Regex kiểm tra định dạng email
  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Xóa thông báo lỗi khi người dùng bắt đầu gõ lại
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let newErrors = {};

    // 1. Kiểm tra rỗng
    if (!formData.email.trim()) {
      newErrors.email = 'Vui lòng nhập Email!';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Định dạng Email không hợp lệ (Ví dụ: user@gmail.com)!';
    }

    if (!formData.password) {
      newErrors.password = 'Vui lòng nhập Mật khẩu!';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Mật khẩu phải có tối thiểu 6 ký tự!';
    }

    // Nếu có lỗi thì dừng lại không gửi request
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // 2. Gửi dữ liệu lên API Backend
    try {
      setIsSubmitting(true);
      const res = await API.post('/auth/login', formData);
      
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data));

      setToast({ type: 'success', message: 'Đăng nhập thành công!' });
      setTimeout(() => navigate('/'), 1000);
    } catch (err) {
      setToast({
        type: 'error',
        message: err.response?.data?.message || 'Email hoặc mật khẩu không chính xác!',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-sm border border-gray-100 space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800">🔑 Đăng Nhập</h2>
          <p className="text-xs text-gray-400 mt-1">Chào mừng bạn quay trở lại với Campus Lost & Found</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email Input */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Email Sinh Viên (*)</label>
            <input
              type="text"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="example@gmail.com"
              className={`w-full px-4 py-2.5 text-xs rounded-xl border focus:outline-none transition ${
                errors.email
                  ? 'border-red-500 bg-red-50/30 focus:ring-1 focus:ring-red-500'
                  : 'border-gray-200 focus:ring-2 focus:ring-blue-500'
              }`}
            />
            {errors.email && <p className="text-[11px] text-red-500 font-semibold mt-1">⚠️ {errors.email}</p>}
          </div>

          {/* Password Input */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Mật Khẩu (*)</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              className={`w-full px-4 py-2.5 text-xs rounded-xl border focus:outline-none transition ${
                errors.password
                  ? 'border-red-500 bg-red-50/30 focus:ring-1 focus:ring-red-500'
                  : 'border-gray-200 focus:ring-2 focus:ring-blue-500'
              }`}
            />
            {errors.password && <p className="text-[11px] text-red-500 font-semibold mt-1">⚠️ {errors.password}</p>}
          </div>

          {/* Nút Đăng nhập có hiệu ứng Loading */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-bold py-2.5 rounded-xl transition text-xs shadow-sm"
          >
            {isSubmitting ? '⏳ Đang đăng nhập...' : 'Đăng Nhập'}
          </button>
        </form>

        <p className="text-center text-xs text-gray-500">
          Chưa có tài khoản?{' '}
          <Link to="/register" className="text-blue-600 font-bold hover:underline">
            Đăng ký ngay
          </Link>
        </p>
      </div>
    </div>
  );
}