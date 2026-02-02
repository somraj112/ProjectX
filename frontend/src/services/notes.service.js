import api from './api';

const notesService = {
  getNotes: async (filter = '') => {
    const query = filter ? `?search=${filter}` : '';
    const response = await api.get(`/notes${query}`);
    return response.data;
  },

  uploadNote: async (noteData) => {
    // Expect noteData to contain file and metadata, likely FormData
    // Axios sets Content-Type to multipart/form-data automatically for FormData
    const response = await api.post('/notes', noteData);
    return response.data;
  },

  deleteNote: async (id) => {
    const response = await api.delete(`/notes/${id}`);
    return response.data;
  },
};

export default notesService;
