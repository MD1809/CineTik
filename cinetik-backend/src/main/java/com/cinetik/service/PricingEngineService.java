package com.cinetik.service;

import com.cinetik.dto.CalculatePriceResponse;
import com.cinetik.entity.Seat;
import com.cinetik.entity.Showtime;

import java.math.BigDecimal;
import java.util.List;

public interface PricingEngineService {

    CalculatePriceResponse calculateTicketPrice(Showtime showtime, List<Seat> seats);

    BigDecimal getSeatBasePrice(Showtime showtime, Seat seat);
}
