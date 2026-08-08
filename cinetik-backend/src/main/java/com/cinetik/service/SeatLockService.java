package com.cinetik.service;

import com.cinetik.dto.LockSeatsRequest;
import com.cinetik.dto.LockSeatsResponse;

import java.util.List;

public interface SeatLockService {

    LockSeatsResponse lockSeats(LockSeatsRequest request, Long userId);

    List<Long> getLockedSeatsForShowtime(Long showtimeId);

    void releaseSeats(Long showtimeId, List<Long> seatIds, Long userId);

    boolean isSeatLockedByOther(Long showtimeId, Long seatId, Long userId);
}
