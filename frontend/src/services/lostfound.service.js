import api from './api';

const lostFoundService = {
  getItems: async (type = 'all') => { // type: 'lost' | 'found' | 'all'
    const response = await api.get(`/lost-found?type=${type}`);
    return response.data;
  },

  reportItem: async (itemData) => {
    const response = await api.post('/lost-found', itemData);
    return response.data;
  },

  resolveItem: async (id) => {
    const response = await api.patch(`/lost-found/${id}/resolve`);
    return response.data;
  },
};

export default lostFoundService;
