package com.cinetik.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ShowtimeResponse {

    private Long id;
    private MovieResponse movie;
    private CinemaRoomResponse cinemaRoom;
    private LocalDate ngayChieu;
    private LocalDateTime thoiGianBatDau;
    private LocalDateTime thoiGianKetThuc;
    private String bangGiaSetting;
    private List<AdjustmentDetail> appliedSurcharges;
    private List<AdjustmentDetail> appliedDiscounts;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class AdjustmentDetail {
        private String tenQuyTac;
        private String hinhThuc; // FIXED_AMOUNT / PERCENTAGE
        private BigDecimal giaTri;
        private String formattedDisplay; // VD: "15.000 VNĐ (Phụ thu Giờ Cao Điểm Tối)" hoặc "-10% (Giảm giá Suất Chiếu Sớm)"
    }
}
