package com.cinetik.service.impl;

import com.cinetik.dto.MovieRequest;
import com.cinetik.dto.MovieResponse;
import com.cinetik.entity.Movie;
import com.cinetik.entity.MovieStatus;
import com.cinetik.repository.MovieRepository;
import com.cinetik.service.MovieService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MovieServiceImpl implements MovieService {

    private final MovieRepository movieRepository;

    @Override
    public List<MovieResponse> getAllPublicMovies(MovieStatus status) {
        List<Movie> movies;
        if (status != null) {
            movies = movieRepository.findByTrangThai(status);
        } else {
            movies = movieRepository.findAll().stream()
                    .filter(m -> m.getTrangThai() != MovieStatus.NGUNG_CHIEU)
                    .collect(Collectors.toList());
        }
        return movies.stream().map(this::mapToMovieResponse).collect(Collectors.toList());
    }

    @Override
    public MovieResponse getMovieById(Long id) {
        Movie movie = movieRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy phim với ID: " + id));
        return mapToMovieResponse(movie);
    }

    @Override
    public MovieResponse createMovie(MovieRequest request) {
        Movie movie = Movie.builder()
                .tenPhim(request.getTenPhim())
                .daoDien(request.getDaoDien())
                .dienVien(request.getDienVien())
                .theLoai(request.getTheLoai())
                .thoiLuong(request.getThoiLuong())
                .doTuoi(request.getDoTuoi())
                .moTa(request.getMoTa())
                .posterUrl(request.getPosterUrl())
                .trailerUrl(request.getTrailerUrl())
                .trangThai(request.getTrangThai())
                .build();

        Movie savedMovie = movieRepository.save(movie);
        return mapToMovieResponse(savedMovie);
    }

    @Override
    public MovieResponse updateMovie(Long id, MovieRequest request) {
        Movie movie = movieRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy phim với ID: " + id));

        movie.setTenPhim(request.getTenPhim());
        movie.setDaoDien(request.getDaoDien());
        movie.setDienVien(request.getDienVien());
        movie.setTheLoai(request.getTheLoai());
        movie.setThoiLuong(request.getThoiLuong());
        movie.setDoTuoi(request.getDoTuoi());
        movie.setMoTa(request.getMoTa());
        movie.setPosterUrl(request.getPosterUrl());
        movie.setTrailerUrl(request.getTrailerUrl());
        movie.setTrangThai(request.getTrangThai());

        Movie updatedMovie = movieRepository.save(movie);
        return mapToMovieResponse(updatedMovie);
    }

    @Override
    public void deleteMovie(Long id) {
        Movie movie = movieRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy phim với ID: " + id));

        movie.setTrangThai(MovieStatus.NGUNG_CHIEU);
        movieRepository.save(movie);
    }

    private MovieResponse mapToMovieResponse(Movie movie) {
        return MovieResponse.builder()
                .id(movie.getId())
                .tenPhim(movie.getTenPhim())
                .daoDien(movie.getDaoDien())
                .dienVien(movie.getDienVien())
                .theLoai(movie.getTheLoai())
                .thoiLuong(movie.getThoiLuong())
                .doTuoi(movie.getDoTuoi())
                .moTa(movie.getMoTa())
                .posterUrl(movie.getPosterUrl())
                .trailerUrl(movie.getTrailerUrl())
                .trangThai(movie.getTrangThai())
                .build();
    }
}
