import apiClient from './apiClient';

export const authService = {
  login: async (email, matKhau) => {
    const response = await apiClient.post('/auth/login', { email, matKhau });
    return response.data.data;
  },

  register: async (hoTen, email, matKhau, soDienThoai) => {
    const response = await apiClient.post('/auth/register', {
      hoTen,
      email,
      matKhau,
      soDienThoai,
    });
    return response.data.data;
  },

  getCurrentUser: async () => {
    const response = await apiClient.get('/auth/me');
    return response.data.data;
  },
};
