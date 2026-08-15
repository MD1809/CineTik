package com.cinetik.service;

import com.cinetik.dto.LockSeatsRequest;
import com.cinetik.dto.LockSeatsResponse;
import com.cinetik.dto.ShowtimeSeatStatusResponse;

import java.util.List;

public interface SeatLockService {

    LockSeatsResponse lockSeats(LockSeatsRequest request, Long userId);

    boolean lockSingleSeat(Long showtimeId, Long seatId, Long userId);

    void releaseSingleSeat(Long showtimeId, Long seatId, Long userId);

    List<Long> getLockedSeatsForShowtime(Long showtimeId);

    void releaseSeats(Long showtimeId, List<Long> seatIds, Long userId);

    void releaseMySeats(Long showtimeId, Long userId);

    boolean isSeatLockedByOther(Long showtimeId, Long seatId, Long userId);

    List<ShowtimeSeatStatusResponse> getShowtimeSeatsStatus(Long showtimeId, Long userId);
}
