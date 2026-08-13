package com.cinetik.controller;

import com.cinetik.common.dto.ApiResponse;
import com.cinetik.dto.SeatPriceRequest;
import com.cinetik.dto.SeatPriceResponse;
import com.cinetik.service.SeatPriceService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
public class SeatPriceController {

    private final SeatPriceService seatPriceService;

    @GetMapping("/admin/seat-prices")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<List<SeatPriceResponse>>> getAdminSeatPrices() {
        List<SeatPriceResponse> responses = seatPriceService.getAllSeatPrices();
        return ResponseEntity.ok(ApiResponse.success("Lấy danh sách cấu hình giá gốc ghế thành công", responses));
    }

    @PutMapping("/admin/seat-prices/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<SeatPriceResponse>> updateSeatPrice(
            @PathVariable Long id,
            @Valid @RequestBody SeatPriceRequest request) {
        SeatPriceResponse response = seatPriceService.updateSeatPrice(id, request);
        return ResponseEntity.ok(ApiResponse.success("Cập nhật giá gốc ghế thành công", response));
    }

    @GetMapping("/public/seat-prices")
    public ResponseEntity<ApiResponse<List<SeatPriceResponse>>> getPublicSeatPrices() {
        List<SeatPriceResponse> responses = seatPriceService.getAllSeatPrices();
        return ResponseEntity.ok(ApiResponse.success("Lấy bảng giá gốc ghế thành công", responses));
    }
}
