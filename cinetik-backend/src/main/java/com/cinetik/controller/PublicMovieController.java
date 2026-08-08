package com.cinetik.controller;

import com.cinetik.common.dto.ApiResponse;
import com.cinetik.dto.MovieResponse;
import com.cinetik.entity.MovieStatus;
import com.cinetik.service.MovieService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/public/movies")
@RequiredArgsConstructor
public class PublicMovieController {

    private final MovieService movieService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<MovieResponse>>> getPublicMovies(@RequestParam(required = false) MovieStatus status) {
        List<MovieResponse> response = movieService.getAllPublicMovies(status);
        return ResponseEntity.ok(ApiResponse.success("Lấy danh sách phim thành công", response));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<MovieResponse>> getMovieById(@PathVariable Long id) {
        MovieResponse response = movieService.getMovieById(id);
        return ResponseEntity.ok(ApiResponse.success("Lấy chi tiết phim thành công", response));
    }
}
