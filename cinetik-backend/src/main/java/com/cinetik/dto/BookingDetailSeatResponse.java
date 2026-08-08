package com.cinetik.dto;

import com.cinetik.entity.SeatType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BookingDetailSeatResponse {

    private Long id;
    private Long seatId;
    private String hang;
    private Integer cot;
    private SeatType loaiGhe;
    private BigDecimal giaVe;
}
