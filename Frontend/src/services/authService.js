import api from './api';

export const authService = {
  login: async (email, password) => {
    const response = await api.post('/api/auth/login', { email, password });
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
    const response = await api.get('/api/auth/me');
    return response.data;
  },

  getFavorites: async () => {
    const response = await api.get('/api/auth/favourites');
    return response.data;
  },

  likeMusic: async (musicId) => {
    const response = await api.post('/api/auth/like', { musicId });
    return response.data;
  },

  unlikeMusic: async (musicId) => {
    const response = await api.post('/api/auth/unlike', { musicId });
    return response.data;
  },

  logout: async () => {
    const response = await api.post('/api/auth/logout');
    return response.data;
  },

  updateProfile: async (formData) => {
    // Requires formData because of profile picture
    const response = await api.put('/api/auth/profile', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  updatePassword: async (data) => {
    const response = await api.put('/api/auth/password', data);
    return response.data;
  }
};