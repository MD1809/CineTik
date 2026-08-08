package com.cinetik.service;

import com.cinetik.entity.Booking;

public interface EmailService {

    void sendBookingConfirmationEmail(Booking booking);
}
