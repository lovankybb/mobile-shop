import api from './api';

export const getProducts = async (page = 0, size = 12, keyword = '', categoryId = null, brandId = null, featured = null) => {
  const params = { page, size };
  if (keyword) params.keyword = keyword;
  if (categoryId) params.categoryId = categoryId;
  if (brandId) params.brandId = brandId;
  if (featured !== null) params.featured = featured;

  const response = await api.get('/products', { params });
  return response.data;
};

export const getProductById = async (id) => {
  const response = await api.get(`/products/${id}`);
  return response.data;
};

export const getProductDetailById = async (id) => {
  const response = await api.get(`/products/detail/${id}`);
  return response.data;
};

export const createProduct = async (productData) => {
  const response = await api.post('/products', productData);
  return response.data;
};

export const updateProduct = async (id, productData) => {
  const response = await api.put(`/products/${id}`, productData);
  return response.data;
};

export const updateProductStatus = async (id, status) => {
  const response = await api.patch(`/products/${id}/status`, null, {
    params: { status }
  });
  return response.data;
};

export const deleteProduct = async (id) => {
  const response = await api.delete(`/products/${id}`);
  return response.data;
};
