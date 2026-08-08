package com.cinetik.controller;

import com.cinetik.common.dto.ApiResponse;
import com.cinetik.dto.BookingResponse;
import com.cinetik.dto.CreateBookingRequest;
import com.cinetik.entity.User;
import com.cinetik.repository.UserRepository;
import com.cinetik.service.BookingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/bookings")
@RequiredArgsConstructor
public class BookingController {

    private final BookingService bookingService;
    private final UserRepository userRepository;

    @PostMapping
    public ResponseEntity<ApiResponse<BookingResponse>> createBooking(
            @Valid @RequestBody CreateBookingRequest request,
            Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401).body(ApiResponse.error("Bạn chưa đăng nhập"));
        }

        User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy thông tin người dùng"));

        BookingResponse response = bookingService.createBooking(request, user.getId());
        return ResponseEntity.ok(ApiResponse.success("Khởi tạo đơn đặt vé thành công", response));
    }

    @GetMapping("/my-tickets")
    public ResponseEntity<ApiResponse<List<BookingResponse>>> getMyTickets(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401).body(ApiResponse.error("Bạn chưa đăng nhập"));
        }

        User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy thông tin người dùng"));

        List<BookingResponse> responses = bookingService.getUserBookings(user.getId());
        return ResponseEntity.ok(ApiResponse.success("Lấy danh sách vé thành công", responses));
    }

    @GetMapping("/{ticketCode}")
    public ResponseEntity<ApiResponse<BookingResponse>> getBookingByTicketCode(@PathVariable String ticketCode) {
        BookingResponse response = bookingService.getBookingByTicketCode(ticketCode);
        return ResponseEntity.ok(ApiResponse.success("Lấy thông tin đơn đặt vé thành công", response));
    }
}
