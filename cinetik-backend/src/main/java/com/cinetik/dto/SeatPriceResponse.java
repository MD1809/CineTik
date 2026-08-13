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
public class SeatPriceResponse {

    private Long id;
    private SeatType loaiGhe;
    private String tenLoaiGhe;
    private BigDecimal giaGoc;
}
