import api from './api';

export const getVersions = async () => {
  const response = await api.get('/versions');
  return response.data;
};

export const createVersion = async (versionData) => {
  const response = await api.post('/versions', versionData);
  return response.data;
};

export const updateVersion = async (id, versionData) => {
  const response = await api.put(`/versions/${id}`, versionData);
  return response.data;
};

export const deleteVersion = async (id) => {
  const response = await api.delete(`/versions/${id}`);
  return response.data;
};
