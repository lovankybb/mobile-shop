import React, { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { CheckCircle, XCircle, ArrowRight } from 'lucide-react';
import Button from '../components/Button';
import { useCart } from '../contexts/CartContext';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  render() {
    if (this.state.hasError) {
      return <div className="p-10 text-red-500"><h1>Error in PaymentResult:</h1><pre>{this.state.error?.toString()}</pre></div>;
    }
    return this.props.children;
  }
}

const PaymentResultContent = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { clearCart } = useCart();
  
  const success = searchParams.get('success') === 'true';
  const orderCode = searchParams.get('orderCode');
  const method = searchParams.get('method');

  useEffect(() => {
    try {
      if (success) {
        clearCart();
      }
    } catch (e) {
      console.error("Error clearing cart on result page:", e);
    }
  }, [success]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-gray-50 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl border border-gray-100 p-8 text-center transform transition-all">
        {success ? (
          <div className="flex flex-col items-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
              <CheckCircle size={40} className="text-green-600" />
            </div>
            <h2 className="text-2xl font-extrabold text-gray-900 mb-2">
              {method === 'COD' ? 'Đặt hàng thành công!' : 'Thanh toán thành công!'}
            </h2>
            <p className="text-gray-500 mb-6 leading-relaxed">
              Cảm ơn bạn đã mua sắm tại Bảo Bình Mobile. Đơn hàng <strong className="text-gray-900">{orderCode}</strong> của bạn đã được ghi nhận.
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-6">
              <XCircle size={40} className="text-red-600" />
            </div>
            <h2 className="text-2xl font-extrabold text-gray-900 mb-2">Thanh toán thất bại</h2>
            <p className="text-gray-500 mb-6 leading-relaxed">
              Đã có lỗi xảy ra trong quá trình thanh toán. Vui lòng kiểm tra lại.
            </p>
          </div>
        )}

        <div className="flex flex-col space-y-3 mt-8">
          <Button onClick={() => navigate('/products')} className="w-full flex items-center justify-center">
            Tiếp tục mua sắm <ArrowRight size={18} className="ml-2" />
          </Button>
          {!success && (
            <button 
              onClick={() => navigate('/cart')}
              className="w-full py-3 px-4 text-gray-600 hover:text-gray-900 font-semibold transition-colors"
            >
              Quay lại giỏ hàng
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

const PaymentResult = () => (
  <ErrorBoundary>
    <PaymentResultContent />
  </ErrorBoundary>
);

export default PaymentResult;
