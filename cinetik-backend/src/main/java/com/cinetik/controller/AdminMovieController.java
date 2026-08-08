package com.cinetik.controller;

import com.cinetik.common.dto.ApiResponse;
import com.cinetik.dto.MovieRequest;
import com.cinetik.dto.MovieResponse;
import com.cinetik.service.MovieService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/admin/movies")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminMovieController {

    private final MovieService movieService;

    @PostMapping
    public ResponseEntity<ApiResponse<MovieResponse>> createMovie(@Valid @RequestBody MovieRequest request) {
        MovieResponse response = movieService.createMovie(request);
        return ResponseEntity.ok(ApiResponse.success("Thêm mới phim thành công", response));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<MovieResponse>> updateMovie(
            @PathVariable Long id,
            @Valid @RequestBody MovieRequest request) {
        MovieResponse response = movieService.updateMovie(id, request);
        return ResponseEntity.ok(ApiResponse.success("Cập nhật thông tin phim thành công", response));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteMovie(@PathVariable Long id) {
        movieService.deleteMovie(id);
        return ResponseEntity.ok(ApiResponse.success("Xóa phim thành công", null));
    }
}
