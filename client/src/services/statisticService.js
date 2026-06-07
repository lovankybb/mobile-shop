import api from './api';

export const getDashboardStatistics = async () => {
  const response = await api.get('/admin/statistics');
  return response.data;
};
