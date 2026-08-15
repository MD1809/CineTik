package com.cinetik.controller;

import com.cinetik.common.dto.ApiResponse;
import com.cinetik.dto.LockSeatsRequest;
import com.cinetik.dto.LockSeatsResponse;
import com.cinetik.entity.User;
import com.cinetik.repository.UserRepository;
import com.cinetik.service.SeatLockService;
import jakarta.validation.Valid;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/bookings")
@RequiredArgsConstructor
public class SeatLockController {

    private final SeatLockService seatLockService;
    private final UserRepository userRepository;

    @PostMapping("/lock-seats")
    public ResponseEntity<ApiResponse<LockSeatsResponse>> lockSeats(
            @Valid @RequestBody LockSeatsRequest request,
            Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401).body(ApiResponse.error("Bạn chưa đăng nhập"));
        }

        User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng"));

        LockSeatsResponse response = seatLockService.lockSeats(request, user.getId());
        return ResponseEntity.ok(ApiResponse.success("Giữ chỗ thành công trong 5 phút", response));
    }

    @PostMapping("/lock-single-seat")
    public ResponseEntity<ApiResponse<Boolean>> lockSingleSeat(
            @RequestBody SingleSeatLockRequest request,
            Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401).body(ApiResponse.error("Bạn chưa đăng nhập"));
        }

        User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng"));

        boolean result = seatLockService.lockSingleSeat(request.getShowtimeId(), request.getSeatId(), user.getId());
        return ResponseEntity.ok(ApiResponse.success("Tạm khóa ghế thành công", result));
    }

    @PostMapping("/release-single-seat")
    public ResponseEntity<ApiResponse<Void>> releaseSingleSeat(
            @RequestBody SingleSeatLockRequest request,
            Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401).body(ApiResponse.error("Bạn chưa đăng nhập"));
        }

        User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng"));

        seatLockService.releaseSingleSeat(request.getShowtimeId(), request.getSeatId(), user.getId());
        return ResponseEntity.ok(ApiResponse.success("Giải phóng ghế thành công", null));
    }

    @PostMapping("/release-my-seats")
    public ResponseEntity<ApiResponse<Void>> releaseMySeats(
            @RequestParam Long showtimeId,
            Authentication authentication) {
        if (authentication != null && authentication.isAuthenticated()) {
            User user = userRepository.findByEmail(authentication.getName()).orElse(null);
            if (user != null) {
                seatLockService.releaseMySeats(showtimeId, user.getId());
            }
        }
        return ResponseEntity.ok(ApiResponse.success("Giải phóng tất cả ghế thành công", null));
    }

    @Data
    public static class SingleSeatLockRequest {
        private Long showtimeId;
        private Long seatId;
    }
}
