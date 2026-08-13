package com.cinetik.dto;

import com.cinetik.entity.AdjustmentType;
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
    private List<AppliedAdjustmentDetail> appliedAdjustments;
    private List<SeatPriceDetail> details;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class AppliedAdjustmentDetail {
        private String tenQuyTac;
        private AdjustmentType loaiDieuChinh;
        private BigDecimal soTien; // Số tiền phụ thu (+) hoặc giảm giá (-)
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SeatPriceDetail {
        private Long seatId;
        private String hang;
        private Integer cot;
        private SeatType loaiGhe;
        private BigDecimal giaGoc;
        private BigDecimal tongPhuThu;
        private BigDecimal tongGiamGia;
        private BigDecimal donGia; // Don gia cuoi cung = Max(0, giaGoc + tongPhuThu - tongGiamGia)
    }
}
