import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Input from '../components/Input';
import Button from '../components/Button';
import { login } from '../services/authService';
import { Smartphone, AlertCircle } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.username || !formData.password) {
      setError('Vui lòng nhập đầy đủ thông tin.');
      return;
    }

    try {
      setIsLoading(true);
      await login(formData.username, formData.password);
      window.location.href = '/'; 
    } catch (err) {
      setError(err.response?.data?.message || 'Lỗi hệ thống. Vui lòng thử lại sau.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-80px)] bg-gray-50 py-12">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-10 border border-gray-100">
        
        <div className="flex flex-col items-center mb-10">
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-4">
            <Smartphone size={24} />
          </div>
          <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Chào mừng trở lại</h2>
          <p className="text-gray-500 mt-2 text-sm font-medium">Vui lòng nhập thông tin để đăng nhập.</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl flex items-center space-x-3">
            <AlertCircle size={18} className="text-red-500 flex-shrink-0" />
            <span className="text-red-600 text-sm font-medium">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <Input 
            label="Tên đăng nhập" 
            name="username" 
            value={formData.username}
            onChange={handleChange}
            placeholder="Nhập tên đăng nhập" 
          />
          <Input 
            label="Mật khẩu" 
            name="password" 
            type="password" 
            value={formData.password}
            onChange={handleChange}
            placeholder="••••••••" 
          />

          <Button 
            type="submit" 
            className="w-full mt-2" 
            disabled={isLoading}
          >
            {isLoading ? 'Đang đăng nhập...' : 'Đăng nhập'}
          </Button>
        </form>

        <div className="mt-8 text-center text-sm text-gray-500 font-medium">
          Chưa có tài khoản?{' '}
          <Link to="/register" className="text-blue-600 hover:text-blue-700 font-semibold transition-colors">
            Đăng ký
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
