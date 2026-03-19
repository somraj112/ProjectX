import api from './api';

const commentService = {
  getComments: async (postId) => {
    const response = await api.get(`/comments/posts/${postId}/comments`);
    return response.data;
  },

  addComment: async (postId, content) => {
    const response = await api.post(`/comments/posts/${postId}/comments`, { content });
    return response.data;
  },

  likeComment: async (commentId) => {
    const response = await api.patch(`/comments/${commentId}/like`);
    return response.data;
  },

  deleteComment: async (commentId) => {
    const response = await api.delete(`/comments/${commentId}`);
    return response.data;
  },
};

export default commentService;
