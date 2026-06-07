import React, { useState, useEffect } from 'react';
import { getDashboardStatistics } from '../../services/statisticService';
import { Users, ShoppingBag, Smartphone, DollarSign, Activity, Package, Clock, CheckCircle } from 'lucide-react';
import { usePopup } from '../../contexts/PopupContext';
import { useDelayedLoading } from '../../hooks/useDelayedLoading';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    totalUsers: 0,
    totalProducts: 0,
    ordersByStatus: {}
  });
  const [loading, setLoading] = useState(true);
  const { showPopup } = usePopup();
  const showLoading = useDelayedLoading(loading, 250);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const res = await getDashboardStatistics();
      setStats(res.result || {
        totalRevenue: 0,
        totalOrders: 0,
        totalUsers: 0,
        totalProducts: 0,
        ordersByStatus: {}
      });
    } catch (error) {
      showPopup({ type: 'error', title: 'Lỗi', message: 'Không thể tải dữ liệu thống kê.' });
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  const statusIcons = {
    'PENDING': <Clock size={20} className="text-yellow-500" />,
    'PROCESSING': <Activity size={20} className="text-blue-500" />,
    'SHIPPED': <Package size={20} className="text-purple-500" />,
    'DELIVERED': <CheckCircle size={20} className="text-green-500" />
  };

  const statusLabels = {
    'PENDING': 'Chờ xử lý',
    'PROCESSING': 'Đang xử lý',
    'SHIPPED': 'Đang giao',
    'DELIVERED': 'Đã giao',
    'CANCELLED': 'Đã hủy'
  };

  if (showLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Tổng quan hệ thống</h1>
          <p className="text-gray-500">Xin chào! Dưới đây là các chỉ số mới nhất.</p>
        </div>
        <button 
          onClick={fetchStats}
          className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 flex items-center space-x-2 transition-colors"
        >
          <Activity size={18} />
          <span>Làm mới</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Doanh thu */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex items-center space-x-4">
          <div className="p-4 bg-green-100 rounded-full text-green-600">
            <DollarSign size={28} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">Tổng doanh thu</p>
            <h3 className="text-2xl font-bold text-gray-900">{formatPrice(stats.totalRevenue)}</h3>
          </div>
        </div>

        {/* Đơn hàng */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex items-center space-x-4">
          <div className="p-4 bg-blue-100 rounded-full text-blue-600">
            <ShoppingBag size={28} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">Tổng đơn hàng</p>
            <h3 className="text-2xl font-bold text-gray-900">{stats.totalOrders}</h3>
          </div>
        </div>

        {/* Khách hàng */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex items-center space-x-4">
          <div className="p-4 bg-purple-100 rounded-full text-purple-600">
            <Users size={28} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">Khách hàng</p>
            <h3 className="text-2xl font-bold text-gray-900">{stats.totalUsers}</h3>
          </div>
        </div>

        {/* Sản phẩm */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex items-center space-x-4">
          <div className="p-4 bg-orange-100 rounded-full text-orange-600">
            <Smartphone size={28} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">Sản phẩm</p>
            <h3 className="text-2xl font-bold text-gray-900">{stats.totalProducts}</h3>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 bg-gray-50/50">
            <h2 className="text-lg font-bold text-gray-800">Trạng thái đơn hàng</h2>
          </div>
          <div className="p-6">
            {Object.keys(stats.ordersByStatus || {}).length === 0 ? (
              <div className="text-center text-gray-500 py-8">Chưa có dữ liệu đơn hàng.</div>
            ) : (
              <div className="space-y-4">
                {Object.entries(stats.ordersByStatus).map(([status, count]) => (
                  <div key={status} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      {statusIcons[status] || <Package size={20} className="text-gray-400" />}
                      <span className="font-medium text-gray-700">{statusLabels[status] || status}</span>
                    </div>
                    <div className="px-4 py-1 bg-white border border-gray-200 rounded-full text-gray-800 font-bold">
                      {count} đơn
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col items-center justify-center text-center p-8">
           <img src="https://cdni.iconscout.com/illustration/premium/thumb/data-analysis-4061803-3363385.png" alt="Analytics" className="w-64 h-auto opacity-75 mb-6" />
           <h3 className="text-lg font-bold text-gray-700">Thêm nhiều tính năng sẽ được cập nhật</h3>
           <p className="text-gray-500 mt-2">Biểu đồ doanh thu và phân tích xu hướng sẽ xuất hiện tại đây.</p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
