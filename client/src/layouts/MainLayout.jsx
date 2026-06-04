import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Smartphone, ShoppingCart, User, LogOut } from 'lucide-react';

const MainLayout = () => {
  const isAuthenticated = !!localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-gray-200 font-sans selection:bg-blue-500/30">
      {/* Top Navigation Bar */}
      <nav className="sticky top-0 z-50 bg-[#0a0a0a]/80 backdrop-blur-md border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            
            {/* Logo area */}
            <Link to="/" className="flex items-center space-x-2 group">
              <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center group-hover:shadow-[0_0_15px_rgba(37,99,235,0.6)] transition-all duration-300">
                <Smartphone size={20} className="text-white" />
              </div>
              <span className="font-mono text-xl font-bold tracking-tight text-white group-hover:text-blue-400 transition-colors">
                SYS_SHOP
              </span>
            </Link>

            {/* Right side actions */}
            <div className="flex items-center space-x-6">
              <Link to="/cart" className="text-gray-400 hover:text-blue-400 transition-colors relative">
                <ShoppingCart size={22} />
                {/* Cart Badge - just a mockup for now */}
                <span className="absolute -top-1.5 -right-2 bg-blue-600 text-white text-[10px] font-mono px-1.5 py-0.5 rounded-full">
                  0
                </span>
              </Link>
              
              {isAuthenticated ? (
                <div className="flex items-center space-x-4">
                  <Link to="/profile" className="text-gray-400 hover:text-blue-400 transition-colors">
                    <User size={22} />
                  </Link>
                  <button onClick={handleLogout} className="text-gray-400 hover:text-red-400 transition-colors">
                    <LogOut size={22} />
                  </button>
                </div>
              ) : (
                <Link 
                  to="/login" 
                  className="font-mono text-sm border border-blue-500 text-blue-400 hover:bg-blue-600/10 px-4 py-1.5 transition-all duration-200"
                >
                  [ĐĂNG NHẬP]
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 min-h-[calc(100vh-128px)]">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-800 py-8 bg-[#050505]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center">
          <p className="font-mono text-xs text-gray-500">
            © {new Date().getFullYear()} SYS_SHOP. HỆ THỐNG HOẠT ĐỘNG BÌNH THƯỜNG.
          </p>
          <div className="flex space-x-4 mt-4 md:mt-0 font-mono text-xs text-gray-500">
            <Link to="/terms" className="hover:text-blue-400">ĐIỀU KHOẢN</Link>
            <Link to="/privacy" className="hover:text-blue-400">BẢO MẬT</Link>
            <Link to="/status" className="hover:text-blue-400">TRẠNG THÁI</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;
