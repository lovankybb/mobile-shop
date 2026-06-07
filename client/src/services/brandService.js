import api from './api';

export const getBrands = async () => {
  const response = await api.get('/brands');
  return response.data;
};

export const getBrandById = async (id) => {
  const response = await api.get(`/brands/${id}`);
  return response.data;
};

export const createBrand = async (brandData) => {
  const response = await api.post('/brands', brandData);
  return response.data;
};

export const updateBrand = async (id, brandData) => {
  const response = await api.put(`/brands/${id}`, brandData);
  return response.data;
};

export const deleteBrand = async (id) => {
  const response = await api.delete(`/brands/${id}`);
  return response.data;
};
