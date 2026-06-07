import api from './api';

export const getProductReviews = async (productId, page = 0, size = 10) => {
  const response = await api.get(`/reviews/product/${productId}`, {
    params: { page, size, sort: 'createdAt,desc' }
  });
  return response.data;
};

export const postReview = async (productId, rating, comment) => {
  const response = await api.post('/reviews', { productId, rating, comment });
  return response.data;
};
