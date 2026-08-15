package com.cinetik.repository;

import com.cinetik.entity.BookingDetailSeat;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BookingDetailSeatRepository extends JpaRepository<BookingDetailSeat, Long> {

    List<BookingDetailSeat> findByBookingId(Long bookingId);

    @Query("SELECT bds.seat.id FROM BookingDetailSeat bds WHERE bds.booking.showtime.id = :showtimeId AND bds.booking.trangThaiThanhToan = com.cinetik.entity.PaymentStatus.PAID")
    List<Long> findSoldSeatIdsByShowtimeId(@Param("showtimeId") Long showtimeId);
}
