import api from './api';

const lostFoundService = {
  getItems: async (type = 'all') => { // type: 'lost' | 'found' | 'all'
    const response = await api.get(`/lost-found?type=${type}`);
    return response.data;
  },

  reportItem: async (itemData) => {
    let payload = itemData;
    if (!(itemData instanceof FormData)) {
        payload = new FormData();
        Object.keys(itemData).forEach(key => {
            if (itemData[key] !== null && itemData[key] !== undefined) {
                payload.append(key, itemData[key]);
            }
        });
    }

    const response = await api.post('/lost-found', payload, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
  },

  resolveItem: async (id) => {
    const response = await api.patch(`/lost-found/${id}/resolve`);
    return response.data;
  },
};

export default lostFoundService;
