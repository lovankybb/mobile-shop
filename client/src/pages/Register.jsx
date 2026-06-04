import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Input from '../components/Input';
import Button from '../components/Button';
import { register } from '../services/authService';
import { Terminal, ShieldAlert } from 'lucide-react';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ username: '', email: '', password: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.username || !formData.email || !formData.password || !formData.confirmPassword) {
      setError('Vui lòng nhập đầy đủ thông tin.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Mật khẩu xác nhận không khớp.');
      return;
    }

    try {
      setIsLoading(true);
      await register(formData.username, formData.email, formData.password);
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Lỗi hệ thống. Vui lòng thử lại sau.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-200px)] py-10">
      <div className="w-full max-w-md border border-gray-800 bg-[#0a0a0a] p-8 relative overflow-hidden">
        {/* Decorative corner borders */}
        <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-blue-500"></div>
        <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-blue-500"></div>
        <div className="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-blue-500"></div>
        <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-blue-500"></div>

        <div className="flex flex-col items-center mb-8">
          <Terminal size={32} className="text-blue-500 mb-2" />
          <h2 className="text-2xl font-bold font-mono tracking-wider">ĐĂNG KÝ</h2>
          <p className="text-gray-500 text-xs font-mono mt-1">// INITIALIZE_NEW_USER</p>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-900/20 border border-red-800/50 flex items-center space-x-3">
            <ShieldAlert size={16} className="text-red-500 flex-shrink-0" />
            <span className="text-red-400 text-sm font-mono">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <Input 
            label="TÀI KHOẢN" 
            name="username" 
            value={formData.username}
            onChange={handleChange}
            placeholder="Nhập tên định danh..." 
          />
          <Input 
            label="ĐỊA CHỈ EMAIL" 
            name="email" 
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="email@example.com" 
          />
          <Input 
            label="MẬT KHẨU" 
            name="password" 
            type="password" 
            value={formData.password}
            onChange={handleChange}
            placeholder="••••••••" 
          />
          <Input 
            label="XÁC NHẬN MẬT KHẨU" 
            name="confirmPassword" 
            type="password" 
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="••••••••" 
          />

          <Button 
            type="submit" 
            className="w-full mt-4" 
            disabled={isLoading}
          >
            {isLoading ? 'ĐANG KHỞI TẠO...' : 'TẠO ĐỊNH DANH MỚI'}
          </Button>
        </form>

        <div className="mt-6 text-center font-mono text-sm text-gray-500">
          Đã có quyền truy cập?{' '}
          <Link to="/login" className="text-blue-400 hover:text-blue-300 transition-colors">
            Quay lại Đăng nhập
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
