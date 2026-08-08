package com.cinetik.service.impl;

import com.cinetik.dto.CalculatePriceResponse;
import com.cinetik.entity.Seat;
import com.cinetik.entity.SeatType;
import com.cinetik.entity.Showtime;
import com.cinetik.service.PricingEngineService;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.DayOfWeek;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class PricingEngineServiceImpl implements PricingEngineService {

    private final ObjectMapper objectMapper;

    @Override
    public CalculatePriceResponse calculateTicketPrice(Showtime showtime, List<Seat> seats) {
        BigDecimal tongTien = BigDecimal.ZERO;
        List<CalculatePriceResponse.SeatPriceDetail> details = new ArrayList<>();

        for (Seat seat : seats) {
            BigDecimal price = getSeatBasePrice(showtime, seat);
            tongTien = tongTien.add(price);

            details.add(CalculatePriceResponse.SeatPriceDetail.builder()
                    .seatId(seat.getId())
                    .hang(seat.getHang())
                    .cot(seat.getCot())
                    .loaiGhe(seat.getLoaiGhe())
                    .donGia(price)
                    .build());
        }

        return CalculatePriceResponse.builder()
                .showtimeId(showtime.getId())
                .tongTien(tongTien)
                .details(details)
                .build();
    }

    @Override
    public BigDecimal getSeatBasePrice(Showtime showtime, Seat seat) {
        BigDecimal basePrice = getDefaultPriceForSeatType(seat.getLoaiGhe());

        if (showtime.getBangGiaSetting() != null && !showtime.getBangGiaSetting().isBlank()) {
            try {
                JsonNode root = objectMapper.readTree(showtime.getBangGiaSetting());
                String seatTypeKey = seat.getLoaiGhe().name();
                if (root.has(seatTypeKey)) {
                    basePrice = new BigDecimal(root.get(seatTypeKey).asText());
                }
            } catch (Exception e) {
                log.warn("Could not parse showtime price setting JSON, using default: {}", e.getMessage());
            }
        }

        // Weekend surcharge (+10,000 VND on Sat / Sun)
        if (showtime.getNgayChieu() != null) {
            DayOfWeek day = showtime.getNgayChieu().getDayOfWeek();
            if (day == DayOfWeek.SATURDAY || day == DayOfWeek.SUNDAY) {
                basePrice = basePrice.add(new BigDecimal("10000"));
            }
        }

        return basePrice;
    }

    private BigDecimal getDefaultPriceForSeatType(SeatType seatType) {
        if (seatType == SeatType.VIP) {
            return new BigDecimal("100000");
        } else if (seatType == SeatType.COUPLE) {
            return new BigDecimal("150000");
        }
        return new BigDecimal("80000"); // SINGLE
    }
}
