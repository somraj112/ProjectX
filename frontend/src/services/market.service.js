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
    let payload = itemData;
    if (!(itemData instanceof FormData)) {
        payload = new FormData();
        Object.keys(itemData).forEach(key => {
            if (itemData[key] !== null && itemData[key] !== undefined) {
                // If it's an array of files, append each one
                if (Array.isArray(itemData[key])) {
                    itemData[key].forEach(val => payload.append(key, val));
                } else {
                    payload.append(key, itemData[key]);
                }
            }
        });
    }

    const response = await api.post('/market', payload, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
  },

  deleteItem: async (id) => {
     const response = await api.delete(`/market/${id}`);
     return response.data;
  },
};

export default marketService;
