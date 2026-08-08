package com.cinetik.controller;

import com.cinetik.common.dto.ApiResponse;
import com.cinetik.dto.CinemaRoomRequest;
import com.cinetik.dto.CinemaRoomResponse;
import com.cinetik.dto.SeatResponse;
import com.cinetik.dto.UpdateSeatTypeRequest;
import com.cinetik.service.CinemaRoomService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/admin/rooms")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminRoomController {

    private final CinemaRoomService cinemaRoomService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<CinemaRoomResponse>>> getAllRooms() {
        List<CinemaRoomResponse> rooms = cinemaRoomService.getAllRooms();
        return ResponseEntity.ok(ApiResponse.success("Lấy danh sách phòng chiếu thành công", rooms));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<CinemaRoomResponse>> getRoomById(@PathVariable Long id) {
        CinemaRoomResponse room = cinemaRoomService.getRoomById(id);
        return ResponseEntity.ok(ApiResponse.success("Lấy chi tiết phòng chiếu thành công", room));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<CinemaRoomResponse>> createRoom(@Valid @RequestBody CinemaRoomRequest request) {
        CinemaRoomResponse response = cinemaRoomService.createRoom(request);
        return ResponseEntity.ok(ApiResponse.success("Tạo phòng chiếu thành công", response));
    }

    @GetMapping("/{id}/seats")
    public ResponseEntity<ApiResponse<List<SeatResponse>>> getRoomSeats(@PathVariable Long id) {
        List<SeatResponse> seats = cinemaRoomService.getSeatsByRoomId(id);
        return ResponseEntity.ok(ApiResponse.success("Lấy sơ đồ ghế phòng chiếu thành công", seats));
    }

    @PutMapping("/seats/{seatId}")
    public ResponseEntity<ApiResponse<SeatResponse>> updateSeatType(
            @PathVariable Long seatId,
            @Valid @RequestBody UpdateSeatTypeRequest request) {
        SeatResponse response = cinemaRoomService.updateSeatType(seatId, request);
        return ResponseEntity.ok(ApiResponse.success("Cập nhật loại ghế thành công", response));
    }
}
