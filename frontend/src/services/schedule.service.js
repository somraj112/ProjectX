import api from './api';

const scheduleService = {
  getSchedule: async (date) => {
    const query = date ? `?date=${date}` : '';
    const response = await api.get(`/schedule${query}`);
    return response.data;
  },

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
