import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, ArrowLeft, Home } from 'lucide-react';
import Button from '../components/Button';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center bg-gray-50 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full text-center space-y-8">
        <div className="flex justify-center">
          <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center animate-bounce">
            <AlertCircle size={48} className="text-red-500" />
          </div>
        </div>
        
        <div>
          <h1 className="text-9xl font-extrabold text-gray-900 tracking-tight">404</h1>
          <h2 className="text-3xl font-bold text-gray-900 mt-4 mb-2">Oops! Không tìm thấy trang</h2>
          <p className="text-lg text-gray-500">
            Trang bạn đang tìm kiếm có thể đã bị xóa, đổi tên hoặc tạm thời không thể truy cập.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
          <Button 
            variant="outline" 
            onClick={() => navigate(-1)} 
            className="w-full sm:w-auto flex items-center justify-center"
          >
            <ArrowLeft size={18} className="mr-2" />
            Quay lại
          </Button>
          <Button 
            onClick={() => navigate('/')} 
            className="w-full sm:w-auto flex items-center justify-center"
          >
            <Home size={18} className="mr-2" />
            Trang chủ
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
