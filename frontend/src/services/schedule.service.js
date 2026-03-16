import api from './api';

const scheduleService = {
  getSchedule: async (date) => {
    // API expects optional date query, but user requirement says get all events
    // We will stick to the existing pattern but support date filtering if needed later
    const query = date ? `?date=${date}` : '';
    const response = await api.get(`/schedule${query}`);
    return response.data;
  },

  createSchedule: async (scheduleData) => {
    const response = await api.post('/schedule', scheduleData);
    return response.data;
  },

  connectGoogle: async () => {
    const response = await api.get('/schedule/connect');
    return response.data; // Should return { url: '...' }
  },

  // Keeping this for backward compatibility if used elsewhere, though req didn't specify strict removal
  addToSchedule: async (classData) => {
    const response = await api.post('/schedule', classData);
    return response.data;
  },

  removeFromSchedule: async (id) => {
    const response = await api.delete(`/schedule/${id}`);
    return response.data;
  },
};

export default scheduleService;
