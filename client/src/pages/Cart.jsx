import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import Button from '../components/Button';
import { ShoppingCart, Trash2, Plus, Minus, ArrowRight } from 'lucide-react';

const Cart = () => {
  const { cartItems, totalAmount, updateQuantity, removeFromCart, clearCart } = useCart();
  const navigate = useNavigate();

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price || 0);
  };

  if (cartItems.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 flex flex-col items-center justify-center min-h-[60vh]">
        <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-6">
          <ShoppingCart size={40} className="text-gray-300" />
        </div>
        <h2 className="text-2xl font-extrabold text-gray-900 mb-2">Giỏ hàng trống</h2>
        <p className="text-gray-500 mb-8">Bạn chưa thêm sản phẩm nào vào giỏ hàng.</p>
        <Button onClick={() => navigate('/products')} size="lg">
          Tiếp tục mua sắm
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-extrabold text-gray-900 mb-8">Giỏ hàng của bạn</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Cart Items List */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex justify-between items-center mb-4">
            <span className="font-semibold text-gray-500">{cartItems.length} sản phẩm</span>
            <button onClick={clearCart} className="text-sm font-semibold text-red-500 hover:text-red-600">
              Xóa tất cả
            </button>
          </div>

          <div className="space-y-6">
            {cartItems.map((item) => (
              <div key={item.id} className="flex gap-6 p-6 bg-white border border-gray-100 rounded-3xl shadow-sm">
                <div className="w-24 h-24 shrink-0 bg-gray-50 rounded-2xl p-2 flex items-center justify-center">
                  <img src={item.productImage || 'https://via.placeholder.com/150'} alt={item.productName} className="w-full h-full object-contain mix-blend-multiply" />
                </div>
                
                <div className="flex-1 flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-gray-900 text-lg mb-1">{item.productName}</h3>
                      <p className="text-sm text-gray-500 font-medium">
                        {item.versionName} • {item.colorName}
                      </p>
                    </div>
                    <button onClick={() => removeFromCart(item.id)} className="text-gray-400 hover:text-red-500 transition-colors p-1">
                      <Trash2 size={18} />
                    </button>
                  </div>

                  <div className="flex justify-between items-end mt-4">
                    <div className="flex items-center space-x-3 bg-gray-50 rounded-xl p-1 border border-gray-100">
                      <button 
                        onClick={() => updateQuantity(item.id, item.variantId, item.quantity - 1)}
                        className="w-8 h-8 flex items-center justify-center rounded-lg bg-white text-gray-600 shadow-sm hover:text-blue-600 disabled:opacity-50"
                        disabled={item.quantity <= 1}
                      >
                        <Minus size={14} />
                      </button>
                      <span className="font-semibold text-sm w-4 text-center">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.id, item.variantId, item.quantity + 1)}
                        className="w-8 h-8 flex items-center justify-center rounded-lg bg-white text-gray-600 shadow-sm hover:text-blue-600"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                    
                    <span className="font-bold text-lg text-gray-900">
                      {formatPrice(item.price)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-gray-50 rounded-3xl p-8 border border-gray-100 sticky top-28">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Tóm tắt đơn hàng</h2>
            
            <div className="space-y-4 mb-6">
              <div className="flex justify-between text-gray-500">
                <span>Tạm tính</span>
                <span className="font-medium text-gray-900">{formatPrice(totalAmount)}</span>
              </div>
              <div className="flex justify-between text-gray-500">
                <span>Phí vận chuyển</span>
                <span className="font-medium text-green-600">Miễn phí</span>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-6 mb-8">
              <div className="flex justify-between items-end">
                <span className="font-bold text-gray-900">Tổng cộng</span>
                <span className="text-2xl font-extrabold text-blue-600">{formatPrice(totalAmount)}</span>
              </div>
            </div>

            <Button onClick={() => navigate('/checkout')} size="lg" className="w-full flex items-center justify-center text-lg">
              Tiến hành thanh toán <ArrowRight size={20} className="ml-2" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
