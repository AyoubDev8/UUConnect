import axios from 'axios';

const API_URL = 'uuconnect-backend.azurewebsites.net/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authService = {
  signup: async (userData) => {
    const response = await api.post('/auth/signup', userData);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user-info', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user-info', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user-info');
  },

  getProfile: async () => {
    const response = await api.get('/users/profile');
    return response.data;
  },

  editProfile: async (data) => {
    const response = await api.put('/users/profile', data);
    return response.data;
  },
};

export const postService = {
  createPost: async (data) => {
    const response = await api.post('/posts', data);
    return response.data;
  },
  getFeed: async () => {
    const response = await api.get('/posts/feed');
    return response.data;
  },
  getUserPosts: async (userId) => {
    const response = await api.get(`/posts/user/${userId}`);
    return response.data;
  },
  deletePost: async (id) => {
    const response = await api.delete(`/posts/${id}`);
    return response.data;
  },
  savePost: async (id) => {
    const response = await api.post(`/posts/${id}/save`);
    return response.data;
  },
  unsavePost: async (id) => {
    const response = await api.post(`/posts/${id}/unsave`);
    return response.data;
  },
  getSavedPosts: async () => {
    const response = await api.get('/users/saved');
    return response.data;
  },
  getLikedPosts: async () => {
    const response = await api.get('/users/liked');
    return response.data;
  },
};

export default api; 