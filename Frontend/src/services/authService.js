import api from './api';

export const authService = {
  login: async (email, password) => {
    const response = await api.post('/api/auth/login', { email, password });
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    return response.data;
  },

  register: async (username, email, password) => {
  const response = await api.post('/api/auth/register', {
    username,
    email,
    password
  });
  return response.data;
},

  getProfile: async () => {
    const response = await api.get('/api/auth/profile');
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('token');
  }
};