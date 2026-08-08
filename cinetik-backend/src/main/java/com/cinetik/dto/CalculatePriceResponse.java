package com.cinetik.dto;

import com.cinetik.entity.SeatType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CalculatePriceResponse {

    private Long showtimeId;
    private BigDecimal tongTien;
    private List<SeatPriceDetail> details;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SeatPriceDetail {
        private Long seatId;
        private String hang;
        private Integer cot;
        private SeatType loaiGhe;
        private BigDecimal donGia;
    }
}
