import React, { useState, useEffect } from 'react';
import { getAllOrders, updateOrderStatus } from '../../services/orderService';
import { usePopup } from '../../contexts/PopupContext';
import { Package, Search, Calendar, ChevronLeft, ChevronRight, Edit, Eye, X } from 'lucide-react';
import Button from '../../components/Button';

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [statusUpdating, setStatusUpdating] = useState(false);
  const { showPopup } = usePopup();

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await getAllOrders(page, 10);
      if (res && res.result) {
        setOrders(res.result.content);
        setTotalPages(res.result.totalPages);
      }
    } catch (err) {
      console.error('Failed to load orders', err);
      showPopup({ type: 'error', title: 'Lỗi', message: 'Không thể tải danh sách đơn hàng.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [page]);

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      setStatusUpdating(true);
      await updateOrderStatus(id, newStatus);
      showPopup({ type: 'success', title: 'Thành công', message: 'Đã cập nhật trạng thái đơn hàng.' });
      fetchOrders();
      if (selectedOrder && selectedOrder.id === id) {
        setSelectedOrder(prev => ({ ...prev, orderStatus: newStatus }));
      }
    } catch (err) {
      console.error('Failed to update status', err);
      showPopup({ type: 'error', title: 'Lỗi', message: 'Không thể cập nhật trạng thái đơn hàng.' });
    } finally {
      setStatusUpdating(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price || 0);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('vi-VN', { 
      year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit'
    }).format(date);
  };

  const getStatusBadgeClass = (status) => {
    switch(status) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-700';
      case 'PAID': return 'bg-blue-100 text-blue-700';
      case 'PROCESSING': return 'bg-purple-100 text-purple-700';
      case 'SHIPPED': return 'bg-indigo-100 text-indigo-700';
      case 'DELIVERED': return 'bg-green-100 text-green-700';
      case 'CANCELED': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const STATUS_OPTIONS = [
    { value: 'PENDING', label: 'Đang chờ' },
    { value: 'PAID', label: 'Đã thanh toán' },
    { value: 'PROCESSING', label: 'Đang xử lý' },
    { value: 'SHIPPED', label: 'Đang giao' },
    { value: 'DELIVERED', label: 'Đã giao' },
    { value: 'CANCELED', label: 'Đã hủy' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Quản lý Đơn hàng</h2>
          <p className="text-sm text-gray-500 mt-1">Xem và cập nhật trạng thái tất cả đơn hàng</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-600">
              <thead className="bg-gray-50 text-gray-700 uppercase font-semibold text-xs border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4">Mã Đơn</th>
                  <th className="px-6 py-4">Khách hàng</th>
                  <th className="px-6 py-4">Ngày đặt</th>
                  <th className="px-6 py-4">Tổng tiền</th>
                  <th className="px-6 py-4">Thanh toán</th>
                  <th className="px-6 py-4">Trạng thái</th>
                  <th className="px-6 py-4 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-bold text-gray-900">
                      {order.orderCode}
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-semibold text-gray-900">{order.customerName}</div>
                      <div className="text-xs text-gray-500">{order.customerPhone}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {formatDate(order.createdAt)}
                    </td>
                    <td className="px-6 py-4 font-bold text-blue-600 whitespace-nowrap">
                      {formatPrice(order.totalAmount)}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${order.paymentStatus === 'PAID' || order.paymentStatus === 'SUCCESS' ? 'bg-green-100 text-green-700' : order.paymentStatus === 'FAILED' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>
                        {order.paymentStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <select 
                        value={order.orderStatus} 
                        onChange={(e) => handleUpdateStatus(order.id, e.target.value)}
                        disabled={statusUpdating}
                        className={`text-xs font-bold uppercase rounded-lg border-gray-200 outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer ${getStatusBadgeClass(order.orderStatus)} px-2 py-1.5`}
                      >
                        {STATUS_OPTIONS.map(opt => (
                          <option key={opt.value} value={opt.value} className="bg-white text-gray-900">{opt.label}</option>
                        ))}
                      </select>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => setSelectedOrder(order)}
                        className="p-2 text-gray-400 hover:text-blue-600 transition-colors bg-white rounded-lg border border-gray-100 hover:border-blue-100 hover:bg-blue-50 shadow-sm"
                        title="Xem chi tiết"
                      >
                        <Eye size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
                {orders.length === 0 && (
                  <tr>
                    <td colSpan="7" className="px-6 py-12 text-center text-gray-500">
                      Không tìm thấy đơn hàng nào
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between bg-gray-50">
            <span className="text-sm text-gray-500">
              Trang <span className="font-semibold text-gray-900">{page + 1}</span> / <span className="font-semibold text-gray-900">{totalPages}</span>
            </span>
            <div className="flex space-x-2">
              <button
                onClick={() => setPage(p => Math.max(0, p - 1))}
                disabled={page === 0}
                className="p-2 rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
                disabled={page >= totalPages - 1}
                className="p-2 rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b border-gray-100 sticky top-0 bg-white/95 backdrop-blur-sm z-10">
              <h3 className="text-xl font-bold text-gray-900">Chi tiết đơn hàng {selectedOrder.orderCode}</h3>
              <button onClick={() => setSelectedOrder(null)} className="text-gray-400 hover:text-gray-600 transition-colors">
                <X size={24} />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Customer Info */}
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                <h4 className="font-bold text-gray-900 mb-3 text-sm uppercase tracking-wider">Thông tin người nhận</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500 block mb-1">Họ tên:</span>
                    <span className="font-semibold text-gray-900">{selectedOrder.customerName}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block mb-1">Số điện thoại:</span>
                    <span className="font-semibold text-gray-900">{selectedOrder.customerPhone}</span>
                  </div>
                  <div className="md:col-span-2">
                    <span className="text-gray-500 block mb-1">Địa chỉ giao hàng:</span>
                    <span className="font-semibold text-gray-900">{selectedOrder.customerAddress}</span>
                  </div>
                  {selectedOrder.note && (
                    <div className="md:col-span-2">
                      <span className="text-gray-500 block mb-1">Ghi chú:</span>
                      <span className="text-gray-900 bg-yellow-50 p-2 rounded block">{selectedOrder.note}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Order Items */}
              <div>
                <h4 className="font-bold text-gray-900 mb-3 text-sm uppercase tracking-wider">Sản phẩm</h4>
                <div className="border border-gray-100 rounded-xl overflow-hidden divide-y divide-gray-100">
                  {selectedOrder.orderDetails && selectedOrder.orderDetails.map(item => (
                    <div key={item.id} className="p-4 flex items-center gap-4 hover:bg-gray-50">
                      <img 
                        src={item.productVariant?.product?.image || 'https://via.placeholder.com/64'} 
                        alt="Product" 
                        className="w-16 h-16 object-contain mix-blend-multiply bg-gray-50 rounded-lg border border-gray-100"
                      />
                      <div className="flex-1">
                        <div className="font-bold text-gray-900">{item.productVariant?.product?.name}</div>
                        <div className="text-sm text-gray-500">{item.productVariant?.versionName} - {item.productVariant?.colorName}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-gray-900">{formatPrice(item.price)}</div>
                        <div className="text-sm text-gray-500">x {item.quantity}</div>
                      </div>
                      <div className="text-right w-24">
                        <div className="font-bold text-blue-600">{formatPrice(item.price * item.quantity)}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Summary */}
              <div className="flex flex-col items-end pt-4 border-t border-gray-100 space-y-2">
                <div className="flex justify-between w-64 text-sm">
                  <span className="text-gray-500">Tạm tính:</span>
                  <span className="font-semibold text-gray-900">{formatPrice(selectedOrder.totalAmount)}</span>
                </div>
                <div className="flex justify-between w-64 text-sm">
                  <span className="text-gray-500">Phí giao hàng:</span>
                  <span className="font-semibold text-gray-900">{formatPrice(0)}</span>
                </div>
                <div className="flex justify-between w-64 text-lg font-bold">
                  <span className="text-gray-900">Tổng cộng:</span>
                  <span className="text-blue-600">{formatPrice(selectedOrder.totalAmount)}</span>
                </div>
              </div>

              {/* Status Update section */}
              <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-blue-900 text-sm">Cập nhật trạng thái</h4>
                  <p className="text-xs text-blue-700 mt-1">Thay đổi trạng thái của đơn hàng này</p>
                </div>
                <div className="flex gap-2">
                  <select 
                    value={selectedOrder.orderStatus} 
                    onChange={(e) => handleUpdateStatus(selectedOrder.id, e.target.value)}
                    disabled={statusUpdating}
                    className="text-sm font-semibold rounded-lg border-gray-200 focus:ring-2 focus:ring-blue-500 px-3 py-2 outline-none"
                  >
                    {STATUS_OPTIONS.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderManagement;
