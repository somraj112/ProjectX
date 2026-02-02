import api from './api';

const marketService = {
  getItems: async (category) => {
    const query = category ? `?category=${category}` : '';
    const response = await api.get(`/market${query}`);
    return response.data;
  },

  getItemById: async (id) => {
    const response = await api.get(`/market/${id}`);
    return response.data;
  },

  listItem: async (itemData) => {
    const response = await api.post('/market', itemData);
    return response.data;
  },

  deleteItem: async (id) => {
     const response = await api.delete(`/market/${id}`);
     return response.data;
  },
};

export default marketService;
