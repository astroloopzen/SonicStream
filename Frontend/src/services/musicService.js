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
  }
};