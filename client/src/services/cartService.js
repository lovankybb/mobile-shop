import api from './api';

export const getMyCart = async () => {
  const response = await api.get('/cart');
  return response.data;
};

export const addToCart = async (variantId, quantity) => {
  const response = await api.post('/cart/items', { variantId, quantity });
  return response.data;
};

export const updateCartItem = async (itemId, variantId, quantity) => {
  const response = await api.put(`/cart/items/${itemId}`, { variantId, quantity });
  return response.data;
};

export const removeFromCart = async (itemId) => {
  const response = await api.delete(`/cart/items/${itemId}`);
  return response.data;
};

export const clearCart = async () => {
  const response = await api.delete('/cart');
  return response.data;
};
