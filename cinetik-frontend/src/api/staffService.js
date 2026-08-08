import apiClient from './apiClient';

export const staffService = {
  checkinTicket: async (ticketCode) => {
    const response = await apiClient.post('/staff/checkin', { ticketCode });
    return response.data.data;
  },
};
