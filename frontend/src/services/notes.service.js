import api from './api';

const notesService = {
  getNotes: async (filter = '') => {
    const query = filter ? `?search=${filter}` : '';
    const response = await api.get(`/notes${query}`);
    return response.data;
  },

  uploadNote: async (noteData) => {
    let payload = noteData;
    if (!(noteData instanceof FormData)) {
        payload = new FormData();
        Object.keys(noteData).forEach(key => {
            if (noteData[key] !== null && noteData[key] !== undefined) {
                payload.append(key, noteData[key]);
            }
        });
    }

    const response = await api.post('/notes', payload, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
  },

  updateNote: async (id, noteData) => {
    let payload = noteData;
    if (!(noteData instanceof FormData)) {
      payload = new FormData();
      Object.keys(noteData).forEach(key => {
        if (noteData[key] !== null && noteData[key] !== undefined) {
          payload.append(key, noteData[key]);
        }
      });
    }
    const response = await api.patch(`/notes/${id}`, payload, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  deleteNote: async (id) => {
    const response = await api.delete(`/notes/${id}`);
    return response.data;
  },
};

export default notesService;
