import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Search, ShoppingCart, User, LogOut, Menu, X, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../contexts/CartContext';
import { getBrands } from '../services/brandService';
import { getCategories } from '../services/categoryService';

const MainLayout = () => {
  const isAuthenticated = !!localStorage.getItem('token');
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { cartCount } = useCart();
  
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeDesktopDropdown, setActiveDesktopDropdown] = useState(null);
  
  const [mobileBrandsOpen, setMobileBrandsOpen] = useState(false);
  const [mobileCatsOpen, setMobileCatsOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [brandsData, catsData] = await Promise.all([
          getBrands(),
          getCategories()
        ]);
        setBrands(brandsData.result || brandsData);
        setCategories(catsData.result || catsData);
      } catch (err) {
        console.error("Failed to load header data", err);
      }
    };
    fetchData();
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setActiveDesktopDropdown(null);
    setMobileBrandsOpen(false);
    setMobileCatsOpen(false);
  }, [location.pathname, location.search]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans selection:bg-blue-100 flex flex-col">
      {/* Top Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 w-full z-50 bg-white/90 backdrop-blur-md border-b border-gray-100 transform-gpu will-change-transform [backface-visibility:hidden]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            
            {/* Logo area */}
            <div className="flex items-center space-x-4 md:space-x-12">
              <button 
                className="md:hidden p-2 -ml-2 text-gray-600 hover:text-gray-900 transition-colors"
                onClick={() => setIsMobileMenuOpen(true)}
              >
                <Menu size={24} strokeWidth={2.5} />
              </button>

              <Link to="/" className="flex items-center space-x-2">
                <img src={import.meta.env.VITE_LOGO_URL} alt="Bảo Bình Mobile" className="h-8 object-contain" />
                <span className="text-2xl font-extrabold tracking-tight text-gray-900 uppercase hidden sm:block">
                  Bảo Bình Mobile
                </span>
              </Link>

              {/* Desktop Navigation Links */}
              <div className="hidden md:flex items-center space-x-8">
                <Link to="/products" className="text-sm font-semibold text-gray-600 hover:text-gray-900 transition-colors">
                  Cửa hàng
                </Link>
                
                {/* Brands Dropdown */}
                <div 
                  className="relative group"
                  onMouseEnter={() => setActiveDesktopDropdown('brands')}
                  onMouseLeave={() => setActiveDesktopDropdown(null)}
                >
                  <button className="flex items-center text-sm font-semibold text-gray-600 hover:text-gray-900 transition-colors py-2">
                    Thương hiệu <ChevronDown size={16} className={`ml-1 transition-transform ${activeDesktopDropdown === 'brands' ? 'rotate-180' : ''}`} />
                  </button>
                  <AnimatePresence>
                    {activeDesktopDropdown === 'brands' && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10, transition: { duration: 0.1 } }}
                        className="absolute left-0 top-full pt-2 w-64"
                      >
                        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-3 flex flex-col space-y-1">
                          {brands.map(brand => (
                            <Link 
                              key={brand.id}
                              to={`/products?brand=${brand.id}`}
                              className="px-4 py-2.5 rounded-xl hover:bg-gray-50 text-gray-700 hover:text-blue-600 font-medium transition-colors"
                            >
                              {brand.name}
                            </Link>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Categories Dropdown */}
                <div 
                  className="relative group"
                  onMouseEnter={() => setActiveDesktopDropdown('categories')}
                  onMouseLeave={() => setActiveDesktopDropdown(null)}
                >
                  <button className="flex items-center text-sm font-semibold text-gray-600 hover:text-gray-900 transition-colors py-2">
                    Danh mục <ChevronDown size={16} className={`ml-1 transition-transform ${activeDesktopDropdown === 'categories' ? 'rotate-180' : ''}`} />
                  </button>
                  <AnimatePresence>
                    {activeDesktopDropdown === 'categories' && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10, transition: { duration: 0.1 } }}
                        className="absolute left-0 top-full pt-2 w-64"
                      >
                        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-3 flex flex-col space-y-1">
                          {categories.map(cat => (
                            <Link 
                              key={cat.id}
                              to={`/products?category=${cat.id}`}
                              className="px-4 py-2.5 rounded-xl hover:bg-gray-50 text-gray-700 hover:text-blue-600 font-medium transition-colors"
                            >
                              {cat.name}
                            </Link>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <Link to="/about" className="text-sm font-semibold text-gray-600 hover:text-gray-900 transition-colors">
                  Về chúng tôi
                </Link>
              </div>
            </div>

            {/* Right side actions */}
            <div className="flex items-center space-x-4 md:space-x-6">
              <button className="hidden sm:block text-gray-600 hover:text-gray-900 transition-colors">
                <Search size={20} strokeWidth={2.5} />
              </button>

              {isAuthenticated ? (
                <div className="hidden sm:flex items-center space-x-6">
                  <Link to="/profile" className="text-gray-600 hover:text-gray-900 transition-colors">
                    {(() => {
                      const user = JSON.parse(localStorage.getItem('user') || '{}');
                      return user.avatarUrl ? (
                        <img src={user.avatarUrl} alt="Avatar" className="w-8 h-8 rounded-full object-cover border border-gray-200" />
                      ) : (
                        <User size={20} strokeWidth={2.5} />
                      );
                    })()}
                  </Link>
                  <button onClick={handleLogout} className="text-gray-600 hover:text-red-600 transition-colors">
                    <LogOut size={20} strokeWidth={2.5} />
                  </button>
                </div>
              ) : (
                <Link to="/login" className="hidden sm:block text-gray-600 hover:text-gray-900 transition-colors">
                  <User size={20} strokeWidth={2.5} />
                </Link>
              )}

              <Link to="/cart" className="text-gray-600 hover:text-gray-900 transition-colors relative flex items-center">
                <ShoppingCart size={22} strokeWidth={2.5} />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2.5 bg-gray-900 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                    {cartCount > 99 ? '99+' : cartCount}
                  </span>
                )}
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Fullscreen Navigation Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-[60] bg-white flex flex-col"
          >
            <div className="flex justify-between items-center h-20 px-4 sm:px-6 border-b border-gray-100">
              <div className="flex items-center space-x-2">
                <img src={import.meta.env.VITE_LOGO_URL} alt="Bảo Bình Mobile" className="h-8 object-contain" />
                <span className="text-2xl font-extrabold tracking-tight text-gray-900 uppercase">
                  Bảo Bình Mobile
                </span>
              </div>
              <button 
                className="p-2 -mr-2 text-gray-600 hover:text-gray-900 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <X size={28} strokeWidth={2.5} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 flex flex-col space-y-8">
              <div className="flex flex-col space-y-6 text-2xl font-bold tracking-tight">
                <Link to="/products" className="text-gray-900 hover:text-blue-600 transition-colors">Cửa hàng</Link>
                
                {/* Mobile Brands Accordion */}
                <div className="flex flex-col">
                  <button 
                    onClick={() => setMobileBrandsOpen(!mobileBrandsOpen)}
                    className="flex items-center justify-between text-gray-900 hover:text-blue-600 transition-colors"
                  >
                    Thương hiệu
                    <ChevronDown size={24} className={`transition-transform ${mobileBrandsOpen ? 'rotate-180 text-blue-600' : 'text-gray-400'}`} />
                  </button>
                  <AnimatePresence>
                    {mobileBrandsOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden flex flex-col space-y-4 pt-4 pb-2 pl-4 border-l-2 border-gray-100 mt-2"
                      >
                        {brands.map(brand => (
                          <Link key={brand.id} to={`/products?brand=${brand.id}`} className="text-xl font-semibold text-gray-500 hover:text-gray-900">
                            {brand.name}
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Mobile Categories Accordion */}
                <div className="flex flex-col">
                  <button 
                    onClick={() => setMobileCatsOpen(!mobileCatsOpen)}
                    className="flex items-center justify-between text-gray-900 hover:text-blue-600 transition-colors"
                  >
                    Danh mục
                    <ChevronDown size={24} className={`transition-transform ${mobileCatsOpen ? 'rotate-180 text-blue-600' : 'text-gray-400'}`} />
                  </button>
                  <AnimatePresence>
                    {mobileCatsOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden flex flex-col space-y-4 pt-4 pb-2 pl-4 border-l-2 border-gray-100 mt-2"
                      >
                        {categories.map(cat => (
                          <Link key={cat.id} to={`/products?category=${cat.id}`} className="text-xl font-semibold text-gray-500 hover:text-gray-900">
                            {cat.name}
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <Link to="/about" className="text-gray-900 hover:text-blue-600 transition-colors">Về chúng tôi</Link>
              </div>

              <div className="border-t border-gray-100 pt-8 flex flex-col space-y-6 text-lg font-semibold">
                {isAuthenticated ? (
                  <>
                    <Link to="/profile" className="flex items-center text-gray-600 hover:text-gray-900">
                      <User size={22} className="mr-3" /> Tài khoản của tôi
                    </Link>
                    <button onClick={handleLogout} className="flex items-center text-red-600 hover:text-red-700">
                      <LogOut size={22} className="mr-3" /> Đăng xuất
                    </button>
                  </>
                ) : (
                  <Link to="/login" className="flex items-center text-gray-600 hover:text-gray-900">
                    <User size={22} className="mr-3" /> Đăng nhập / Đăng ký
                  </Link>
                )}
                
                <Link to="/cart" className="flex items-center text-gray-600 hover:text-gray-900">
                  <ShoppingCart size={22} className="mr-3" /> Giỏ hàng {cartCount > 0 ? `(${cartCount})` : ''}
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <main className="flex-grow flex flex-col relative z-10 pt-8">
        <AnimatePresence mode="wait">
          <motion.div 
            key={location.pathname}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "ease" }}
            className="flex-grow w-full"
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-12 bg-gray-50 mt-12 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left">
             <div className="flex items-center justify-center md:justify-start space-x-2 mb-2">
               <img src={import.meta.env.VITE_LOGO_URL} alt="Bảo Bình Mobile" className="h-8 object-contain" />
               <span className="text-xl font-extrabold tracking-tight text-gray-900 uppercase">
                 Bảo Bình Mobile
               </span>
             </div>
             <p className="text-sm text-gray-500 font-medium">
               © {new Date().getFullYear()} Bảo Bình Mobile. Mọi quyền được bảo lưu.
             </p>
          </div>
          <div className="flex flex-wrap justify-center space-x-6 text-sm font-semibold text-gray-500">
            <Link to="/terms" className="hover:text-gray-900 transition-colors mb-2 md:mb-0">Điều khoản dịch vụ</Link>
            <Link to="/privacy" className="hover:text-gray-900 transition-colors mb-2 md:mb-0">Chính sách bảo mật</Link>
            <Link to="/status" className="hover:text-gray-900 transition-colors mb-2 md:mb-0">Trạng thái hệ thống</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;
