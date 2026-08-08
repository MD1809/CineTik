import apiClient from './apiClient';

export const vnpayService = {
  createPaymentUrl: async (ticketCode, bankCode = '') => {
    const response = await apiClient.post('/payments/vnpay/create-url', { ticketCode, bankCode });
    return response.data.data;
  },

  processMockPay: async (ticketCode, isSuccess = true) => {
    const response = await apiClient.post('/payments/vnpay/mock-pay', null, {
      params: { ticketCode, isSuccess },
    });
    return response.data.data;
  },
};
