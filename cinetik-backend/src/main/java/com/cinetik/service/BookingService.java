package com.cinetik.service;

import com.cinetik.dto.CreateBookingRequest;
import com.cinetik.dto.BookingResponse;

import java.util.List;

public interface BookingService {

    BookingResponse createBooking(CreateBookingRequest request, Long userId);

    List<BookingResponse> getUserBookings(Long userId);

    BookingResponse getBookingByTicketCode(String ticketCode);
}
