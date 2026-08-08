package com.cinetik.repository;

import com.cinetik.entity.BookingDetailFB;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BookingDetailFBRepository extends JpaRepository<BookingDetailFB, Long> {

    List<BookingDetailFB> findByBookingId(Long bookingId);
}
