import React, { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { usePopup } from '../contexts/PopupContext';

const AdminRoute = () => {
  const { showPopup } = usePopup();
  const [checked, setChecked] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    const user = userStr ? JSON.parse(userStr) : null;

    if (!user) {
      showPopup({ 
        type: 'error', 
        title: 'Yêu cầu Đăng nhập', 
        message: 'Bạn cần phải đăng nhập để truy cập khu vực Quản trị.' 
      });
      setIsAuthorized(false);
    } else if (!user.roles?.includes('ROLE_ADMIN')) {
      showPopup({ 
        type: 'error', 
        title: 'Truy cập bị từ chối', 
        message: 'Tài khoản của bạn không có quyền truy cập khu vực này.' 
      });
      setIsAuthorized(false);
    } else {
      setIsAuthorized(true);
    }
    setChecked(true);
  }, [showPopup]);

  if (!checked) {
    return null; // Wait for check
  }

  if (!isAuthorized) {
    // If user is not even logged in, go to login, else go to home
    const hasToken = localStorage.getItem('token');
    return <Navigate to={hasToken ? "/" : "/login"} replace />;
  }

  return <Outlet />;
};

export default AdminRoute;
