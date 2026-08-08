package com.cinetik.repository;

import com.cinetik.entity.Showtime;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface ShowtimeRepository extends JpaRepository<Showtime, Long> {

    List<Showtime> findByMovieId(Long movieId);

    List<Showtime> findByNgayChieu(LocalDate ngayChieu);

    List<Showtime> findByMovieIdAndNgayChieu(Long movieId, LocalDate ngayChieu);

    List<Showtime> findByCinemaRoomIdAndNgayChieu(Long cinemaRoomId, LocalDate ngayChieu);
}
