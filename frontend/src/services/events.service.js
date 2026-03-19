import api from './api';

const eventsService = {
  getEvents: async (category = 'all') => {
    // Determine category filter
    const query = category !== 'all' && category !== 'All' ? `?category=${category}` : '';
    const response = await api.get(`/events${query}`);
    return response.data;
  },

  getEventById: async (id) => {
    const response = await api.get(`/events/${id}`);
    return response.data;
  },

  createEvent: async (eventData) => {
    let payload = eventData;
    if (!(eventData instanceof FormData)) {
        payload = new FormData();
        Object.keys(eventData).forEach(key => {
            if (eventData[key] !== null && eventData[key] !== undefined) {
                payload.append(key, eventData[key]);
            }
        });
    }

    const response = await api.post(`/events`, payload, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
  },

  updateEvent: async (id, eventData) => {
    let payload = eventData;
    if (!(eventData instanceof FormData)) {
        payload = new FormData();
        Object.keys(eventData).forEach(key => {
            if (eventData[key] !== null && eventData[key] !== undefined) {
                payload.append(key, eventData[key]);
            }
        });
    }

    const response = await api.put(`/events/${id}`, payload, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
  },

  deleteEvent: async (id) => {
    const response = await api.delete(`/events/${id}`);
    return response.data;
  },

  registerForEvent: async (id) => {
    // This isn't implemented in backend yet, keeping placeholder for future
    console.log("Registration logic to be added to backend in future");
    return { success: true };
  },
};

export default eventsService;
