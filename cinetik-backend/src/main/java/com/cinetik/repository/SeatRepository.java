package com.cinetik.repository;

import com.cinetik.entity.Seat;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SeatRepository extends JpaRepository<Seat, Long> {

    List<Seat> findByCinemaRoomId(Long roomId);

    List<Seat> findByCinemaRoomIdOrderByHangAscCotAsc(Long roomId);
}
