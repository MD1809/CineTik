package com.cinetik.service;

import com.cinetik.dto.MovieRequest;
import com.cinetik.dto.MovieResponse;
import com.cinetik.entity.MovieStatus;

import java.util.List;

public interface MovieService {

    List<MovieResponse> getAllPublicMovies(MovieStatus status);

    MovieResponse getMovieById(Long id);

    MovieResponse createMovie(MovieRequest request);

    MovieResponse updateMovie(Long id, MovieRequest request);

    void deleteMovie(Long id);
}
