import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { usePopup } from '../contexts/PopupContext';
import { checkout } from '../services/orderService';
import api from '../services/api';
import Button from '../components/Button';
import { MapPin, Phone, User, FileText, ArrowLeft, CheckCircle, Wallet, CreditCard } from 'lucide-react';

const Checkout = () => {
  const navigate = useNavigate();
  const { cartItems, totalAmount, clearCart } = useCart();
  const { showPopup } = usePopup();

  const [formData, setFormData] = useState({
    customerName: '',
    customerPhone: '',
    customerAddress: '',
    note: '',
    paymentMethod: 'COD'
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // If cart is empty, redirect back to cart
    if (cartItems.length === 0) {
      navigate('/cart');
    }
  }, [cartItems, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price || 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.customerName || !formData.customerPhone || !formData.customerAddress) {
      showPopup({
        type: 'error',
        title: 'Thiếu thông tin',
        message: 'Vui lòng điền đầy đủ Họ tên, Số điện thoại và Địa chỉ giao hàng.',
        confirmText: 'Đóng'
      });
      return;
    }

    try {
      setLoading(true);

      const items = cartItems.map(item => ({
        variantId: item.variantId,
        quantity: item.quantity
      }));

      const payload = {
        ...formData,
        items
      };

      const res = await checkout(payload);
      const createdOrder = res.result;
      
      // Handle VNPAY Redirect
      if (formData.paymentMethod === 'VNPAY') {
        try {
          const vnpayRes = await api.get('/payment/create_payment', {
            params: {
              amount: createdOrder.totalAmount,
              orderCode: createdOrder.orderCode
            }
          });
          
          if (vnpayRes.data && vnpayRes.data.result) {
            // Redirect to VNPay sandbox
            window.location.href = vnpayRes.data.result;
            return; // Stop execution here, we are redirecting
          }
        } catch (vnpayErr) {
          console.error("Lỗi khi tạo link thanh toán VNPay", vnpayErr);
          showPopup({
            type: 'error',
            title: 'Lỗi thanh toán',
            message: 'Không thể kết nối đến VNPay. Vui lòng thử lại hoặc chọn thanh toán COD.',
            confirmText: 'Đóng'
          });
          return;
        }
      } else if (formData.paymentMethod === 'MOMO') {
        try {
          const momoRes = await api.get('/payment/create_momo_payment', {
            params: {
              amount: createdOrder.totalAmount,
              orderCode: createdOrder.orderCode
            }
          });
          
          if (momoRes.data && momoRes.data.result) {
            // Redirect to MoMo sandbox
            window.location.href = momoRes.data.result;
            return; // Stop execution here, we are redirecting
          }
        } catch (momoErr) {
          console.error("Lỗi khi tạo link thanh toán MoMo", momoErr);
          showPopup({
            type: 'error',
            title: 'Lỗi thanh toán',
            message: 'Không thể kết nối đến MoMo. Vui lòng thử lại hoặc chọn thanh toán COD.',
            confirmText: 'Đóng'
          });
          return;
        }
      }

      // If COD, simply redirect to the success page
      navigate(`/payment-result?orderCode=${createdOrder.orderCode}&success=true&method=${formData.paymentMethod}`);
    } catch (err) {
      showPopup({
        type: 'error',
        title: 'Đặt hàng thất bại',
        message: err.response?.data?.message || 'Có lỗi xảy ra trong quá trình đặt hàng. Vui lòng thử lại.',
        confirmText: 'Đóng'
      });
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0) return null; // Prevent flicker while redirecting

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <button 
        onClick={() => navigate('/cart')}
        className="flex items-center text-sm font-semibold text-gray-500 hover:text-gray-900 transition-colors mb-8"
      >
        <ArrowLeft size={20} className="mr-1" />
        Quay lại Giỏ hàng
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        {/* Checkout Form */}
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 mb-8">Thông tin giao hàng</h1>
          
          <form id="checkout-form" onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 flex items-center">
                <User size={16} className="mr-2" /> Họ và tên *
              </label>
              <input 
                type="text" 
                name="customerName"
                value={formData.customerName}
                onChange={handleInputChange}
                placeholder="Nhập họ và tên người nhận"
                className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-xl px-4 py-3 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all duration-200"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 flex items-center">
                <Phone size={16} className="mr-2" /> Số điện thoại *
              </label>
              <input 
                type="tel" 
                name="customerPhone"
                value={formData.customerPhone}
                onChange={handleInputChange}
                placeholder="Nhập số điện thoại liên hệ"
                className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-xl px-4 py-3 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all duration-200"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 flex items-center">
                <MapPin size={16} className="mr-2" /> Địa chỉ giao hàng *
              </label>
              <input 
                type="text" 
                name="customerAddress"
                value={formData.customerAddress}
                onChange={handleInputChange}
                placeholder="Số nhà, tên đường, phường/xã, quận/huyện, tỉnh/thành phố"
                className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-xl px-4 py-3 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all duration-200"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 flex items-center">
                <FileText size={16} className="mr-2" /> Ghi chú đơn hàng (Tùy chọn)
              </label>
              <textarea 
                name="note"
                value={formData.note}
                onChange={handleInputChange}
                placeholder="Ghi chú thêm về thời gian giao hàng, yêu cầu đặc biệt..."
                rows="4"
                className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-xl px-4 py-3 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all duration-200 resize-none"
              ></textarea>
            </div>

            <div className="pt-6 border-t border-gray-100">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <Wallet size={20} className="mr-2 text-blue-600" /> Phương thức thanh toán
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <label className={`relative flex flex-col items-center justify-center p-4 cursor-pointer rounded-2xl border-2 transition-all ${formData.paymentMethod === 'COD' ? 'border-blue-600 bg-blue-50' : 'border-gray-200 bg-white hover:border-gray-300'}`}>
                  <input type="radio" name="paymentMethod" value="COD" checked={formData.paymentMethod === 'COD'} onChange={handleInputChange} className="hidden" />
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                    <MapPin size={24} className="text-gray-600" />
                  </div>
                  <span className="font-bold text-gray-900 text-center text-sm mb-1">Thanh toán khi nhận hàng</span>
                  <span className="text-xs text-gray-500 text-center">(COD)</span>
                </label>

                <label className={`relative flex flex-col items-center justify-center p-4 cursor-pointer rounded-2xl border-2 transition-all ${formData.paymentMethod === 'VNPAY' ? 'border-blue-600 bg-blue-50' : 'border-gray-200 bg-white hover:border-gray-300'}`}>
                  <input type="radio" name="paymentMethod" value="VNPAY" checked={formData.paymentMethod === 'VNPAY'} onChange={handleInputChange} className="hidden" />
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-3">
                    <CreditCard size={24} className="text-blue-600" />
                  </div>
                  <span className="font-bold text-gray-900 text-center text-sm mb-1">Thanh toán VNPay</span>
                  <span className="text-xs text-gray-500 text-center">Qua thẻ ATM/QR Code</span>
                </label>

                <label className={`relative flex flex-col items-center justify-center p-4 cursor-pointer rounded-2xl border-2 transition-all ${formData.paymentMethod === 'MOMO' ? 'border-blue-600 bg-blue-50' : 'border-gray-200 bg-white hover:border-gray-300'}`}>
                  <input type="radio" name="paymentMethod" value="MOMO" checked={formData.paymentMethod === 'MOMO'} onChange={handleInputChange} className="hidden" />
                  <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center mb-3">
                    <Wallet size={24} className="text-pink-600" />
                  </div>
                  <span className="font-bold text-gray-900 text-center text-sm mb-1">Ví MoMo</span>
                  <span className="text-xs text-gray-500 text-center">Quét mã QR MoMo</span>
                </label>
              </div>
            </div>
          </form>
        </div>

        {/* Order Summary */}
        <div>
          <div className="bg-gray-50 rounded-3xl p-8 border border-gray-100 sticky top-28">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Đơn hàng của bạn</h2>
            
            <div className="space-y-4 max-h-[40vh] overflow-y-auto pr-2 mb-6">
              {cartItems.map((item) => (
                <div key={item.id} className="flex gap-4">
                  <div className="w-16 h-16 shrink-0 bg-white rounded-xl p-1 border border-gray-100 flex items-center justify-center">
                    <img src={item.productImage || 'https://via.placeholder.com/150'} alt={item.productName} className="w-full h-full object-contain mix-blend-multiply" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-gray-900 text-sm mb-1">{item.productName}</h4>
                    <p className="text-xs text-gray-500 mb-1">{item.versionName} • {item.colorName}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">Số lượng: {item.quantity}</span>
                      <span className="font-semibold text-gray-900">{formatPrice(item.price * item.quantity)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-200 pt-6 space-y-4 mb-6">
              <div className="flex justify-between text-gray-500 text-sm">
                <span>Tạm tính</span>
                <span className="font-medium text-gray-900">{formatPrice(totalAmount)}</span>
              </div>
              <div className="flex justify-between text-gray-500 text-sm">
                <span>Phí vận chuyển</span>
                <span className="font-medium text-green-600">Miễn phí</span>
              </div>
              <div className="flex justify-between text-gray-500 text-sm">
                <span>Phương thức thanh toán</span>
                <span className="font-medium text-gray-900 text-right">
                  {formData.paymentMethod === 'COD' ? 'Thanh toán khi nhận hàng' : 
                   formData.paymentMethod === 'VNPAY' ? 'Thanh toán qua VNPay' : 
                   'Thanh toán qua Ví MoMo'}
                </span>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-6 mb-8">
              <div className="flex justify-between items-end">
                <span className="font-bold text-gray-900">Tổng cộng</span>
                <span className="text-3xl font-extrabold text-blue-600">{formatPrice(totalAmount)}</span>
              </div>
            </div>

            <Button 
              type="submit" 
              form="checkout-form" 
              size="lg" 
              className="w-full flex items-center justify-center text-lg"
              disabled={loading}
            >
              {loading ? (
                <>Đang xử lý...</>
              ) : (
                <>
                  <CheckCircle size={20} className="mr-2" /> Hoàn tất đặt hàng
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
