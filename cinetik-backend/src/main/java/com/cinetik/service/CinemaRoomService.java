package com.cinetik.service;

import com.cinetik.dto.CinemaRoomRequest;
import com.cinetik.dto.CinemaRoomResponse;
import com.cinetik.dto.SeatResponse;
import com.cinetik.dto.UpdateSeatTypeRequest;

import java.util.List;

public interface CinemaRoomService {

    List<CinemaRoomResponse> getAllRooms();

    CinemaRoomResponse getRoomById(Long id);

    CinemaRoomResponse createRoom(CinemaRoomRequest request);

    List<SeatResponse> getSeatsByRoomId(Long roomId);

    SeatResponse updateSeatType(Long seatId, UpdateSeatTypeRequest request);
}
