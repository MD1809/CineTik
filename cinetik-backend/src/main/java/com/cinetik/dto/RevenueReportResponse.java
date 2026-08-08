package com.cinetik.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RevenueReportResponse {

    private BigDecimal tongDoanhThu;
    private BigDecimal doanhThuVe;
    private BigDecimal doanhThuFB;
    private long tongSoDonHangThanhToan;
    private long tongSoVeDaBan;
    private LocalDate startDate;
    private LocalDate endDate;
}
