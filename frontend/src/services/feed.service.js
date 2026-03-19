import api from './api';

const feedService = {
  getPosts: async (page = 1, limit = 10) => {
    const response = await api.get(`/posts?page=${page}&limit=${limit}`);
    return response.data;
  },

  createPost: async (postData) => {
    let payload = postData;
    if (!(postData instanceof FormData)) {
        payload = new FormData();
        Object.keys(postData).forEach(key => {
            if (postData[key] !== null && postData[key] !== undefined) {
                payload.append(key, postData[key]);
            }
        });
    }

    const response = await api.post('/posts', payload, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
  },

  likePost: async (postId) => {
    const response = await api.patch(`/posts/${postId}/like`);
    return response.data;
  },

  deletePost: async (postId) => {
      const response = await api.delete(`/posts/${postId}`);
      return response.data;
  },

  editPost: async (postId, postData) => {
    let payload = postData;
    if (!(postData instanceof FormData)) {
        payload = new FormData();
        Object.keys(postData).forEach(key => {
            if (postData[key] !== null && postData[key] !== undefined) {
                payload.append(key, postData[key]);
            }
        });
    }

    const response = await api.put(`/posts/${postId}`, payload, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
  },

  getStories: async () => {
    const response = await api.get('/stories');
    return response.data;
  },
};

export default feedService;
