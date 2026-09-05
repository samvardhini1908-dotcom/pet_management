import api from './api';

const login = async (username, password) => {
  const response = await api.post('/auth/login', { username, password });
  if (response.data && response.data.token) {
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('user', JSON.stringify(response.data));
  }
  return response.data;
};

const register = async (userData) => {
  const response = await api.post('/auth/register', userData);
  return response.data;
};

const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

const getCurrentUser = () => {
  const user = localStorage.getItem('user');
  if (!user) return null;
  try {
    return JSON.parse(user);
  } catch (e) {
    return null;
  }
};

const authService = {
  login,
  register,
  logout,
  getCurrentUser,
};

export default authService;