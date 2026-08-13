import apiClient from './apiClient';

export const adminService = {
  // Movies Management
  getAllMovies: async () => {
    const response = await apiClient.get('/public/movies');
    return response.data.data;
  },

  createMovie: async (movieData) => {
    const response = await apiClient.post('/admin/movies', movieData);
    return response.data.data;
  },

  updateMovie: async (id, movieData) => {
    const response = await apiClient.put(`/admin/movies/${id}`, movieData);
    return response.data.data;
  },

  deleteMovie: async (id) => {
    const response = await apiClient.delete(`/admin/movies/${id}`);
    return response.data.data;
  },

  // Rooms & Seats Management
  getAllRooms: async () => {
    const response = await apiClient.get('/admin/rooms');
    return response.data.data;
  },

  createRoom: async (roomData) => {
    const response = await apiClient.post('/admin/rooms', roomData);
    return response.data.data;
  },

  getRoomSeats: async (roomId) => {
    const response = await apiClient.get(`/admin/rooms/${roomId}/seats`);
    return response.data.data;
  },

  updateSeatType: async (seatId, loaiGhe) => {
    const response = await apiClient.put(`/admin/rooms/seats/${seatId}`, { loaiGhe });
    return response.data.data;
  },

  // Showtimes & Pricing Management
  getAllShowtimes: async (movieId, date) => {
    const params = {};
    if (movieId) params.movieId = movieId;
    if (date) params.date = date;
    const response = await apiClient.get('/public/showtimes', { params });
    return response.data.data;
  },

  createShowtime: async (showtimeData) => {
    const response = await apiClient.post('/admin/showtimes', showtimeData);
    return response.data.data;
  },

  updateShowtime: async (id, showtimeData) => {
    const response = await apiClient.put(`/admin/showtimes/${id}`, showtimeData);
    return response.data.data;
  },

  // F&B Management
  getAllFBItems: async () => {
    const response = await apiClient.get('/admin/fb-items');
    return response.data.data;
  },

  createFBItem: async (fbData) => {
    const response = await apiClient.post('/admin/fb-items', fbData);
    return response.data.data;
  },

  updateFBItem: async (id, fbData) => {
    const response = await apiClient.put(`/admin/fb-items/${id}`, fbData);
    return response.data.data;
  },

  deleteFBItem: async (id) => {
    const response = await apiClient.delete(`/admin/fb-items/${id}`);
    return response.data.data;
  },

  // Staff Management
  getAllStaff: async () => {
    const response = await apiClient.get('/admin/staff');
    return response.data.data;
  },

  createStaff: async (staffData) => {
    const response = await apiClient.post('/admin/staff', staffData);
    return response.data.data;
  },

  updateStaffStatus: async (id, trangThaiAcc) => {
    const response = await apiClient.put(`/admin/staff/${id}/status`, { trangThaiAcc });
    return response.data.data;
  },

  resetStaffPassword: async (id, matKhauMoi) => {
    const response = await apiClient.put(`/admin/staff/${id}/reset-password`, { matKhauMoi });
    return response.data.data;
  },

  // Reports & Analytics
  getRevenueReport: async (startDate, endDate) => {
    const params = {};
    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;
    const response = await apiClient.get('/admin/reports/revenue', { params });
    return response.data.data;
  },

  getMovieSalesReport: async (startDate, endDate) => {
    const params = {};
    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;
    const response = await apiClient.get('/admin/reports/movies', { params });
    return response.data.data;
  },

  getFBSalesReport: async (startDate, endDate) => {
    const params = {};
    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;
    const response = await apiClient.get('/admin/reports/fb-items', { params });
    return response.data.data;
  },

  // Dynamic Pricing & Surcharges / Discounts Management
  getAllPricingRules: async () => {
    const response = await apiClient.get('/admin/pricing-rules');
    return response.data.data;
  },

  createPricingRule: async (ruleData) => {
    const response = await apiClient.post('/admin/pricing-rules', ruleData);
    return response.data.data;
  },

  updatePricingRule: async (id, ruleData) => {
    const response = await apiClient.put(`/admin/pricing-rules/${id}`, ruleData);
    return response.data.data;
  },

  deletePricingRule: async (id) => {
    const response = await apiClient.delete(`/admin/pricing-rules/${id}`);
    return response.data.data;
  },

  // Base Seat Price Config Management
  getAllSeatPrices: async () => {
    const response = await apiClient.get('/admin/seat-prices');
    return response.data.data;
  },

  updateSeatPrice: async (id, giaGoc) => {
    const response = await apiClient.put(`/admin/seat-prices/${id}`, { giaGoc });
    return response.data.data;
  },
};
