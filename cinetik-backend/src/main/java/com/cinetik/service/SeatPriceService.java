package com.cinetik.service;

import com.cinetik.dto.SeatPriceRequest;
import com.cinetik.dto.SeatPriceResponse;

import java.util.List;

public interface SeatPriceService {

    List<SeatPriceResponse> getAllSeatPrices();

    SeatPriceResponse updateSeatPrice(Long id, SeatPriceRequest request);
}
