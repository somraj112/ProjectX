import api from './api';

const eventsService = {
  getEvents: async (category = 'all') => {
    const response = await api.get(`/events?category=${category}`);
    return response.data;
  },

  getEventById: async (id) => {
    const response = await api.get(`/events/${id}`);
    return response.data;
  },

  registerForEvent: async (id) => {
    const response = await api.post(`/events/${id}/register`);
    return response.data;
  },
};

export default eventsService;
