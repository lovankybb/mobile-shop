import api from './api';

export const checkout = async (checkoutData) => {
  const response = await api.post('/orders/checkout', checkoutData);
  return response.data;
};

export const getMyOrders = async (page = 0, size = 10) => {
  const response = await api.get('/orders/my-orders', { params: { page, size } });
  return response.data;
};

export const getOrderById = async (id) => {
  const response = await api.get(`/orders/${id}`);
  return response.data;
};

export const getAllOrders = async (page = 0, size = 10) => {
  const response = await api.get('/orders/all', { params: { page, size } });
  return response.data;
};

export const updateOrderStatus = async (id, status) => {
  const response = await api.put(`/orders/${id}/status`, { status });
  return response.data;
};
