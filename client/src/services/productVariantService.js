import api from './api';

export const getVariantsByProductId = async (productId) => {
  const response = await api.get(`/variants/product/${productId}`);
  return response.data;
};

export const getVariantById = async (id) => {
  const response = await api.get(`/variants/${id}`);
  return response.data;
};

export const createVariant = async (variantData) => {
  const response = await api.post('/variants', variantData);
  return response.data;
};

export const updateVariant = async (id, variantData) => {
  const response = await api.put(`/variants/${id}`, variantData);
  return response.data;
};

export const deleteVariant = async (id) => {
  const response = await api.delete(`/variants/${id}`);
  return response.data;
};
