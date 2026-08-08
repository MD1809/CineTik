package com.cinetik.repository;

import com.cinetik.entity.BookingDetailSeat;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BookingDetailSeatRepository extends JpaRepository<BookingDetailSeat, Long> {

    List<BookingDetailSeat> findByBookingId(Long bookingId);
}
