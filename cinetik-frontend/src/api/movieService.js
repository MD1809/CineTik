import apiClient from './apiClient';

export const movieService = {
  getMovies: async (status, genre) => {
    const params = {};
    if (status) params.trangThai = status;
    if (genre && genre !== 'Tất cả') params.theLoai = genre;
    const response = await apiClient.get('/public/movies', { params });
    return response.data.data;
  },

  getMovieById: async (id) => {
    const response = await apiClient.get(`/public/movies/${id}`);
    return response.data.data;
  },

  getShowtimesByMovie: async (movieId) => {
    const response = await apiClient.get('/public/showtimes', { params: { movieId } });
    return response.data.data;
  },
};
