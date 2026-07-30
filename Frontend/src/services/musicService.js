import api from './api';

export const musicService = {
  getTrending: async () => {
    const response = await api.get('/api/music/trending');
    return response.data;
  },
  getAllMusic: async () => {
    const response = await api.get('/api/music/');
    return response.data;
  },
  getPlaylists: async () => {
    const response = await api.get('/api/music/playlists');
    return response.data;
  },
  playMusic: async (musicId) => {
    const response = await api.post(`/api/music/${musicId}/play`);
    return response.data;
  },
  getAlbumById: async (albumId) => {
    const response = await api.get(`/api/music/playlists/${albumId}`);
    return response.data;
  },
  getArtistById: async (artistId) => {
    const response = await api.get(`/api/music/artists/${artistId}`);
    return response.data;
  },
  
  // Admin Service Methods
  uploadMusic: async (formData) => {
    const response = await api.post('/api/music/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
  updateMusic: async (musicId, data) => {
    const response = await api.put(`/api/music/${musicId}`, data);
    return response.data;
  },
  deleteMusic: async (musicId) => {
    const response = await api.delete(`/api/music/${musicId}`);
    return response.data;
  },
  createPlaylist: async (data) => {
    const response = await api.post('/api/music/playlist', data);
    return response.data;
  },
  updatePlaylist: async (playlistId, data) => {
    const response = await api.put(`/api/music/playlists/${playlistId}`, data);
    return response.data;
  },
  deletePlaylist: async (playlistId) => {
    const response = await api.delete(`/api/music/playlists/${playlistId}`);
    return response.data;
  },
  getArtistStats: async () => {
    const response = await api.get('/api/music/artist/stats');
    return response.data;
  }
};