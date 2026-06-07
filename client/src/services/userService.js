import api from './api';

export const uploadAvatar = async (id, file) => {
  const formData = new FormData();
  formData.append('file', file);
  
  const response = await api.post(`/users/${id}/avatar`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const getUserById = async (id) => {
  const response = await api.get(`/users/${id}`);
  return response.data;
};
