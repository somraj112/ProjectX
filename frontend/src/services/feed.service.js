import api from './api';

const feedService = {
  getPosts: async (page = 1, limit = 10) => {
    const response = await api.get(`/posts?page=${page}&limit=${limit}`);
    return response.data;
  },

  createPost: async (postData) => {
    // If postData contains files, we might need 'multipart/form-data'
    // But axios handles FormData automatically if passed directly
    const response = await api.post('/posts', postData);
    return response.data;
  },

  likePost: async (postId) => {
    const response = await api.post(`/posts/${postId}/like`);
    return response.data;
  },

  getStories: async () => {
    const response = await api.get('/stories');
    return response.data;
  },
};

export default feedService;
