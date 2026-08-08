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
};
