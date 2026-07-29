import api from './api';

export const searchService = {
  search: async (query) => {
    const response = await api.get(`/api/search?q=${encodeURIComponent(query)}`);
    return response.data;
  }
};
