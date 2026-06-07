import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMyOrders } from '../services/orderService';
import { uploadAvatar, getUserById } from '../services/userService';
import { User, Package, Calendar, Clock, MapPin, ChevronRight, Activity, Camera, Loader2 } from 'lucide-react';
import Button from '../components/Button';
import { usePopup } from '../contexts/PopupContext';

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const { showPopup } = usePopup();

  useEffect(() => {
    const checkAuthAndFetchData = async () => {
      const storedUser = localStorage.getItem('user');
      if (!storedUser) {
        navigate('/login');
        return;
      }

      const parsedUser = JSON.parse(storedUser);

      try {
        setLoading(true);
        // Always fetch the freshest user data by ID so avatar is up to date
        const freshUserRes = await getUserById(parsedUser.id);
        if (freshUserRes && freshUserRes.result) {
          const freshUser = freshUserRes.result;
          setUser(freshUser);
          
          // Update localStorage with new user details just in case
          const updatedStorageUser = { ...parsedUser, avatarUrl: freshUser.avatarUrl };
          localStorage.setItem('user', JSON.stringify(updatedStorageUser));
        } else {
          setUser(parsedUser);
        }

        // Fetch user's orders
        const res = await getMyOrders(0, 50); // Get up to 50 recent orders
        if (res && res.result && res.result.content) {
          console.log("order, ", res.result.content);
          setOrders(res.result.content);
        }
      } catch (err) {
        console.error("Failed to load orders", err);
      } finally {
        setLoading(false);
      }
    };

    checkAuthAndFetchData();
  }, [navigate]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price || 0);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('vi-VN', { 
      year: 'numeric', month: 'long', day: 'numeric',
      hour: '2-digit', minute: '2-digit'
    }).format(date);
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 'PENDING':
        return <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-bold uppercase tracking-wider">Đang chờ xử lý</span>;
      case 'PAID':
        return <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold uppercase tracking-wider">Đã thanh toán</span>;
      case 'FAILED':
        return <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-bold uppercase tracking-wider">Thất bại</span>;
      case 'DELIVERED':
        return <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold uppercase tracking-wider">Đã giao hàng</span>;
      default:
        return <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-bold uppercase tracking-wider">{status}</span>;
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showPopup({ type: 'error', title: 'Lỗi', message: 'Vui lòng chọn file hình ảnh hợp lệ.' });
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      showPopup({ type: 'error', title: 'Lỗi', message: 'Kích thước ảnh tối đa là 5MB.' });
      return;
    }

    try {
      setUploading(true);
      const res = await uploadAvatar(user.id, file);
      if (res && res.result) {
        const newAvatarUrl = res.result;
        // Update user state
        setUser(prev => ({ ...prev, avatarUrl: newAvatarUrl }));
        // Update localStorage
        const storedUser = JSON.parse(localStorage.getItem('user'));
        localStorage.setItem('user', JSON.stringify({ ...storedUser, avatarUrl: newAvatarUrl }));
        
        showPopup({ type: 'success', title: 'Thành công', message: 'Đã cập nhật ảnh đại diện.' });
      }
    } catch (err) {
      console.error('Failed to upload avatar', err);
      showPopup({ type: 'error', title: 'Lỗi', message: 'Không thể cập nhật ảnh đại diện.' });
    } finally {
      setUploading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row gap-8">
        
        {/* Left Sidebar: Profile Summary */}
        <div className="w-full md:w-1/3 lg:w-1/4 flex flex-col space-y-6">
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 flex flex-col items-center text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-r from-blue-500 to-indigo-600 opacity-10"></div>
            
            <div className="relative group mb-4 z-10 cursor-pointer">
              <div className="w-24 h-24 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-full flex items-center justify-center text-white text-3xl font-extrabold shadow-lg overflow-hidden border-4 border-white relative">
                {user.avatarUrl ? (
                  <img src={user.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <span>{user.username ? user.username.charAt(0).toUpperCase() : 'U'}</span>
                )}
                
                {/* Overlay for uploading */}
                <div className={`absolute inset-0 bg-black/40 flex items-center justify-center transition-opacity duration-200 ${uploading ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                  {uploading ? (
                    <Loader2 size={24} className="text-white animate-spin" />
                  ) : (
                    <Camera size={24} className="text-white" />
                  )}
                </div>
              </div>
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleFileChange}
                disabled={uploading}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed" 
                title="Thay đổi ảnh đại diện"
              />
            </div>

            <h2 className="text-2xl font-extrabold text-gray-900 mb-1 z-10">{user.username}</h2>
            <p className="text-gray-500 font-medium mb-6 z-10">{user.email}</p>
            
            <div className="w-full border-t border-gray-100 pt-6">
              <div className="flex justify-between items-center mb-3">
                <span className="text-sm font-semibold text-gray-500 flex items-center"><Package size={16} className="mr-2"/> Tổng đơn hàng</span>
                <span className="text-sm font-extrabold text-gray-900">{orders.length}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Content: Order History */}
        <div className="w-full md:w-2/3 lg:w-3/4">
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
            <h3 className="text-2xl font-extrabold text-gray-900 mb-8 flex items-center">
              <Activity className="mr-3 text-blue-600" size={28} /> Lịch sử mua hàng
            </h3>

            {loading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : orders.length === 0 ? (
              <div className="text-center py-16 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                <Package size={48} className="mx-auto text-gray-400 mb-4" />
                <h4 className="text-lg font-bold text-gray-900 mb-2">Chưa có đơn hàng nào</h4>
                <p className="text-gray-500 mb-6">Bạn chưa thực hiện giao dịch nào trên hệ thống.</p>
                <Button onClick={() => navigate('/products')}>Khám phá sản phẩm ngay</Button>
              </div>
            ) : (
              <div className="space-y-6">
                {orders.map(order => (
                  <div key={order.id} className="bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-md transition-shadow duration-200">
                    {/* Order Header */}
                    <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex flex-wrap justify-between items-center gap-4">
                      <div>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Mã đơn hàng</p>
                        <p className="font-extrabold text-gray-900">{order.orderCode || `ORD-${order.id}`}</p>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Ngày đặt</p>
                        <p className="font-semibold text-gray-700 flex items-center">
                          <Calendar size={14} className="mr-1" /> {formatDate(order.createdAt)}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Tổng tiền</p>
                        <p className="font-extrabold text-blue-600">{formatPrice(order.totalAmount)}</p>
                      </div>
                      <div>
                        {getStatusBadge(order.paymentStatus || 'PENDING')}
                      </div>
                    </div>

                    {/* Order Items */}
                    <div className="p-6">
                      <div className="space-y-4">
                        {order.orderDetails && order.orderDetails.map(item => (
                          <div key={item.id} className="flex items-center gap-4 py-2">
                            <div className="w-16 h-16 bg-gray-50 rounded-xl p-2 border border-gray-100 shrink-0">
                              <img 
                                src={item.productVariant?.product?.image || 'https://via.placeholder.com/150'} 
                                alt="Product" 
                                className="w-full h-full object-contain mix-blend-multiply"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h5 className="font-bold text-gray-900 text-sm truncate">
                                {item.productVariant?.product?.name || 'Sản phẩm'}
                              </h5>
                              <p className="text-xs font-medium text-gray-500 mt-1">
                                {item.productVariant?.versionName} • {item.productVariant?.colorName}
                              </p>
                            </div>
                            <div className="text-right shrink-0">
                              <p className="font-bold text-gray-900">{formatPrice(item.price)}</p>
                              <p className="text-xs font-medium text-gray-500 mt-1">SL: {item.quantity}</p>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Delivery Info */}
                      <div className="mt-6 pt-4 border-t border-gray-100 bg-blue-50/50 rounded-xl p-4 flex items-start">
                        <MapPin size={18} className="text-blue-600 mt-0.5 mr-3 shrink-0" />
                        <div>
                          <p className="text-sm font-bold text-gray-900">Giao hàng đến:</p>
                          <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                            <span className="font-semibold">{order.customerName}</span> - {order.customerPhone}<br/>
                            {order.customerAddress}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
