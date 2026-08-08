package com.cinetik.service.impl;

import com.cinetik.dto.CinemaRoomRequest;
import com.cinetik.dto.CinemaRoomResponse;
import com.cinetik.dto.SeatResponse;
import com.cinetik.dto.UpdateSeatTypeRequest;
import com.cinetik.entity.CinemaRoom;
import com.cinetik.entity.Seat;
import com.cinetik.entity.SeatType;
import com.cinetik.repository.CinemaRoomRepository;
import com.cinetik.repository.SeatRepository;
import com.cinetik.service.CinemaRoomService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CinemaRoomServiceImpl implements CinemaRoomService {

    private final CinemaRoomRepository cinemaRoomRepository;
    private final SeatRepository seatRepository;

    @Override
    public List<CinemaRoomResponse> getAllRooms() {
        return cinemaRoomRepository.findAll().stream()
                .map(this::mapToRoomResponse)
                .collect(Collectors.toList());
    }

    @Override
    public CinemaRoomResponse getRoomById(Long id) {
        CinemaRoom room = cinemaRoomRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy phòng chiếu với ID: " + id));
        return mapToRoomResponse(room);
    }

    @Override
    @Transactional
    public CinemaRoomResponse createRoom(CinemaRoomRequest request) {
        int rows = (request.getSoHang() != null && request.getSoHang() > 0) ? request.getSoHang() : 5;
        int cols = (request.getSoCot() != null && request.getSoCot() > 0) ? request.getSoCot() : 10;
        int totalSeats = rows * cols;

        String diagramData = request.getDiagramData();
        if (diagramData == null || diagramData.isBlank()) {
            diagramData = String.format("{\"rows\": %d, \"cols\": %d}", rows, cols);
        }

        CinemaRoom room = CinemaRoom.builder()
                .tenPhong(request.getTenPhong())
                .soLuongGhe(totalSeats)
                .diagramData(diagramData)
                .build();

        CinemaRoom savedRoom = cinemaRoomRepository.save(room);

        List<Seat> seats = new ArrayList<>();
        for (int r = 0; r < rows; r++) {
            String rowLabel = String.valueOf((char) ('A' + r));
            SeatType defaultType = SeatType.SINGLE;
            if (r == rows - 2 && rows >= 4) {
                defaultType = SeatType.VIP;
            } else if (r == rows - 1 && rows >= 5) {
                defaultType = SeatType.COUPLE;
            }

            for (int c = 1; c <= cols; c++) {
                Seat seat = Seat.builder()
                        .cinemaRoom(savedRoom)
                        .hang(rowLabel)
                        .cot(c)
                        .loaiGhe(defaultType)
                        .build();
                seats.add(seat);
            }
        }
        seatRepository.saveAll(seats);

        return mapToRoomResponse(savedRoom);
    }

    @Override
    public List<SeatResponse> getSeatsByRoomId(Long roomId) {
        if (!cinemaRoomRepository.existsById(roomId)) {
            throw new RuntimeException("Không tìm thấy phòng chiếu với ID: " + roomId);
        }
        return seatRepository.findByCinemaRoomIdOrderByHangAscCotAsc(roomId).stream()
                .map(this::mapToSeatResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public SeatResponse updateSeatType(Long seatId, UpdateSeatTypeRequest request) {
        Seat seat = seatRepository.findById(seatId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy ghế với ID: " + seatId));

        seat.setLoaiGhe(request.getLoaiGhe());
        Seat updatedSeat = seatRepository.save(seat);
        return mapToSeatResponse(updatedSeat);
    }

    private CinemaRoomResponse mapToRoomResponse(CinemaRoom room) {
        return CinemaRoomResponse.builder()
                .id(room.getId())
                .tenPhong(room.getTenPhong())
                .soLuongGhe(room.getSoLuongGhe())
                .diagramData(room.getDiagramData())
                .build();
    }

    private SeatResponse mapToSeatResponse(Seat seat) {
        return SeatResponse.builder()
                .id(seat.getId())
                .roomId(seat.getCinemaRoom().getId())
                .hang(seat.getHang())
                .cot(seat.getCot())
                .loaiGhe(seat.getLoaiGhe())
                .build();
    }
}
