package com.cinetik.controller;

import com.cinetik.common.dto.ApiResponse;
import com.cinetik.dto.SeatResponse;
import com.cinetik.service.CinemaRoomService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/public/rooms")
@RequiredArgsConstructor
public class PublicRoomController {

    private final CinemaRoomService cinemaRoomService;

    @GetMapping("/{id}/seats")
    public ResponseEntity<ApiResponse<List<SeatResponse>>> getRoomSeats(@PathVariable Long id) {
        List<SeatResponse> seats = cinemaRoomService.getSeatsByRoomId(id);
        return ResponseEntity.ok(ApiResponse.success("Lấy sơ đồ ghế thành công", seats));
    }
}
