import React from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { LogOut, LayoutDashboard, Settings, ShoppingBag, Palette, Layers, Box, Tags, Smartphone, Package } from 'lucide-react';

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/';
  };

  const navItems = [
    { path: '/admin', icon: LayoutDashboard, label: 'Tổng quan' },
    { path: '/admin/categories', icon: Layers, label: 'Danh mục' },
    { path: '/admin/brands', icon: Tags, label: 'Thương hiệu' },
    { path: '/admin/products', icon: Smartphone, label: 'Sản phẩm' },
    { path: '/admin/colors', icon: Palette, label: 'Màu sắc' },
    { path: '/admin/versions', icon: Box, label: 'Phiên bản' },
    { path: '/admin/variants', icon: Package, label: 'Biến thể' },
    { path: '/admin/orders', icon: ShoppingBag, label: 'Đơn hàng' },
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex font-sans">
      {/* Sidebar - Light/Tech theme as requested for admin */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-gray-200">
          <Link to="/" className="flex items-center space-x-2 text-blue-600 font-bold font-mono">
            <LayoutDashboard size={20} />
            <span>SYS_ADMIN</span>
          </Link>
        </div>
        
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          <ul className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path || (item.path !== '/admin' && location.pathname.startsWith(item.path));
              return (
                <li key={item.path}>
                  <Link 
                    to={item.path} 
                    className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                      isActive 
                      ? 'bg-blue-50 text-blue-600 font-medium' 
                      : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <Icon size={20} />
                    <span>{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="p-4 border-t border-gray-200">
          <button onClick={handleLogout} className="flex items-center space-x-3 px-3 py-2.5 w-full rounded-lg text-red-600 hover:bg-red-50 transition-colors">
            <LogOut size={18} />
            <span className="font-medium text-sm">Đăng xuất</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="h-16 bg-white border-b border-gray-200 flex items-center px-8">
          <h2 className="text-xl font-bold text-gray-800">Bảng Điều Khiển Quản Trị</h2>
        </header>
        <div className="flex-1 overflow-auto p-8 bg-gray-50">
          <div className="animate-fade-in h-full">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
