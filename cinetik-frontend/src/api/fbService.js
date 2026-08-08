import apiClient from './apiClient';

export const fbService = {
  getPublicFBItems: async () => {
    const response = await apiClient.get('/public/fb-items');
    return response.data.data;
  },
};
