import api from './api';

export const login = async (username, password) => {
  const response = await api.post('/auth/signin', { username, password });
  if (response.data.data.token) {
    localStorage.setItem('token', response.data.data.token);
    // Optionally store user info
    localStorage.setItem('user', JSON.stringify(response.data.data));
  }
  return response.data;
};

export const register = async (username, email, password) => {
  const response = await api.post('/auth/signup', { username, email, password });
  return response.data;
};

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};
