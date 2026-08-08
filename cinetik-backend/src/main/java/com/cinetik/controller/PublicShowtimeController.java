package com.cinetik.controller;

import com.cinetik.common.dto.ApiResponse;
import com.cinetik.dto.CalculatePriceRequest;
import com.cinetik.dto.CalculatePriceResponse;
import com.cinetik.dto.ShowtimeResponse;
import com.cinetik.service.ShowtimeService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/v1/public/showtimes")
@RequiredArgsConstructor
public class PublicShowtimeController {

    private final ShowtimeService showtimeService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<ShowtimeResponse>>> getPublicShowtimes(
            @RequestParam(required = false) Long movieId,
            @RequestParam(required = false) LocalDate date) {
        List<ShowtimeResponse> showtimes = showtimeService.getPublicShowtimes(movieId, date);
        return ResponseEntity.ok(ApiResponse.success("Lấy danh sách suất chiếu thành công", showtimes));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ShowtimeResponse>> getShowtimeById(@PathVariable Long id) {
        ShowtimeResponse showtime = showtimeService.getShowtimeById(id);
        return ResponseEntity.ok(ApiResponse.success("Lấy chi tiết suất chiếu thành công", showtime));
    }

    @PostMapping("/calculate-price")
    public ResponseEntity<ApiResponse<CalculatePriceResponse>> calculatePrice(@Valid @RequestBody CalculatePriceRequest request) {
        CalculatePriceResponse response = showtimeService.calculatePrice(request);
        return ResponseEntity.ok(ApiResponse.success("Tính giá vé thành công", response));
    }
}
