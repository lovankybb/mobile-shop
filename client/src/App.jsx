import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css'; // Sometimes needed for newer versions, otherwise harmless
import MainLayout from './layouts/MainLayout';
import AdminLayout from './layouts/AdminLayout';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ProductList from './pages/ProductList';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import PaymentResult from './pages/PaymentResult';
import Profile from './pages/Profile';
import AboutUs from './pages/AboutUs';
import NotFound from './pages/NotFound';
import ColorManagement from './pages/admin/ColorManagement';
import VersionManagement from './pages/admin/VersionManagement';
import CategoryManagement from './pages/admin/CategoryManagement';
import BrandManagement from './pages/admin/BrandManagement';
import AdminDashboard from './pages/admin/AdminDashboard';
import ProductManagement from './pages/admin/ProductManagement';
import ProductVariantManagement from './pages/admin/ProductVariantManagement';
import OrderManagement from './pages/admin/OrderManagement';
import { PopupProvider } from './contexts/PopupContext';
import AdminRoute from './components/AdminRoute';
import { CartProvider } from './contexts/CartContext';

function App() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: 'vertical',
      gestureDirection: 'vertical',
      smooth: true,
      mouseMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 2,
      infinite: false,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  return (
    <PopupProvider>
      <CartProvider>
        <BrowserRouter>
          <Routes>
            {/* User Facing Routes */}
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Home />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="products" element={<ProductList />} />
            <Route path="products/:id" element={<ProductDetail />} />
            <Route path="cart" element={<Cart />} />
            <Route path="checkout" element={<Checkout />} />
            <Route path="payment-result" element={<PaymentResult />} />
            <Route path="profile" element={<Profile />} />
            <Route path="about" element={<AboutUs />} />
            <Route path="*" element={<NotFound />} />
          </Route>

          {/* Admin Dashboard Routes protected by AdminRoute */}
          <Route path="/admin" element={<AdminRoute />}>
            <Route element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="products" element={<ProductManagement />} />
              <Route path="variants" element={<ProductVariantManagement />} />
              <Route path="categories" element={<CategoryManagement />} />
              <Route path="brands" element={<BrandManagement />} />
              <Route path="colors" element={<ColorManagement />} />
              <Route path="versions" element={<VersionManagement />} />
              <Route path="orders" element={<OrderManagement />} />
              <Route path="*" element={<NotFound />} />
              {/* We will add other management routes here later */}
            </Route>
          </Route>
        </Routes>
        </BrowserRouter>
      </CartProvider>
    </PopupProvider>
  );
}

export default App;
