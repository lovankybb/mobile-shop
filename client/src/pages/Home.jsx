import React from 'react';
import Button from '../components/Button';
import Input from '../components/Input';
import { Terminal } from 'lucide-react';

const Home = () => {
  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="border border-gray-800 bg-gray-900/50 p-8 relative overflow-hidden">
        {/* Tech decorative elements */}
        <div className="absolute top-0 left-0 w-2 h-2 bg-blue-500"></div>
        <div className="absolute top-0 right-0 w-2 h-2 bg-blue-500"></div>
        <div className="absolute bottom-0 left-0 w-2 h-2 bg-blue-500"></div>
        <div className="absolute bottom-0 right-0 w-2 h-2 bg-blue-500"></div>
        
        <div className="max-w-3xl">
          <div className="flex items-center space-x-2 text-blue-400 mb-4 font-mono text-sm">
            <Terminal size={16} />
            <span>he_thong.khoi_dong()</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white tracking-tight">
            THIẾT BỊ DI ĐỘNG THẾ HỆ MỚI
          </h1>
          <p className="text-gray-400 mb-8 max-w-2xl leading-relaxed">
            Nâng cấp thiết bị công nghệ với hiệu năng hàng đầu.
            Kho hàng của chúng tôi được đồng bộ hóa theo thời gian thực.
          </p>
          <div className="flex space-x-4">
            <Button size="lg">KHÁM PHÁ DANH MỤC</Button>
            <Button variant="outline" size="lg">XEM CẤU HÌNH</Button>
          </div>
        </div>
      </section>

      {/* Component Showcase (Temporary to verify tech style) */}
      <section className="mt-12">
        <h2 className="font-mono text-lg text-gray-400 border-b border-gray-800 pb-2 mb-6">
          // HE_THONG.GIAO_DIEN
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4 p-6 border border-gray-800 bg-[#0a0a0a]">
            <h3 className="font-mono text-sm text-blue-500 mb-4">{"<Input />"}</h3>
            <Input label="TÀI KHOẢN" placeholder="Nhập định danh..." />
            <Input label="MẬT KHẨU" type="password" placeholder="••••••••" />
            <Input label="TRẠNG THÁI LỖI" error="Phát hiện thông tin không hợp lệ." defaultValue="admin" />
          </div>
          
          <div className="space-y-4 p-6 border border-gray-800 bg-[#0a0a0a]">
            <h3 className="font-mono text-sm text-blue-500 mb-4">{"<Button />"}</h3>
            <div className="flex flex-wrap gap-4">
              <Button>HÀNH ĐỘNG CHÍNH</Button>
              <Button variant="secondary">PHỤ TRỢ</Button>
            </div>
            <div className="flex flex-wrap gap-4">
              <Button variant="outline">VIỀN NGOÀI</Button>
              <Button variant="danger">CHẤM DỨT</Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
