import apiClient from './apiClient';

export const bookingService = {
  getShowtimeDetail: async (showtimeId) => {
    const response = await apiClient.get(`/public/showtimes/${showtimeId}`);
    return response.data.data;
  },

  getRoomSeats: async (roomId) => {
    const response = await apiClient.get(`/public/rooms/${roomId}/seats`);
    return response.data.data;
  },

  getSeatsStatus: async (showtimeId) => {
    const response = await apiClient.get(`/public/showtimes/${showtimeId}/seats-status`);
    return response.data.data;
  },

  calculatePrice: async (showtimeId, seatIds) => {
    const response = await apiClient.post('/public/showtimes/calculate-price', { showtimeId, seatIds });
    return response.data.data;
  },

  lockSeats: async (showtimeId, seatIds) => {
    const response = await apiClient.post('/bookings/lock-seats', { showtimeId, seatIds });
    return response.data.data;
  },

  lockSingleSeat: async (showtimeId, seatId) => {
    const response = await apiClient.post('/bookings/lock-single-seat', { showtimeId, seatId });
    return response.data.data;
  },

  releaseSingleSeat: async (showtimeId, seatId) => {
    const response = await apiClient.post('/bookings/release-single-seat', { showtimeId, seatId });
    return response.data.data;
  },

  releaseMySeats: async (showtimeId) => {
    const response = await apiClient.post(`/bookings/release-my-seats?showtimeId=${showtimeId}`);
    return response.data.data;
  },

  createBooking: async (bookingData) => {
    const response = await apiClient.post('/bookings', bookingData);
    return response.data.data;
  },

  getMyTickets: async () => {
    const response = await apiClient.get('/bookings/my-tickets');
    return response.data.data;
  },
};
