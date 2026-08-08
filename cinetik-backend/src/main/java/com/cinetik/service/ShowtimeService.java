package com.cinetik.service;

import com.cinetik.dto.CalculatePriceRequest;
import com.cinetik.dto.CalculatePriceResponse;
import com.cinetik.dto.ShowtimeRequest;
import com.cinetik.dto.ShowtimeResponse;

import java.time.LocalDate;
import java.util.List;

public interface ShowtimeService {

    List<ShowtimeResponse> getPublicShowtimes(Long movieId, LocalDate date);

    ShowtimeResponse getShowtimeById(Long id);

    ShowtimeResponse createShowtime(ShowtimeRequest request);

    ShowtimeResponse updateShowtime(Long id, ShowtimeRequest request);

    CalculatePriceResponse calculatePrice(CalculatePriceRequest request);
}
