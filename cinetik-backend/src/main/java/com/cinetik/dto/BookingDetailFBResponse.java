package com.cinetik.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BookingDetailFBResponse {

    private Long id;
    private Long fbItemId;
    private String tenItem;
    private BigDecimal donGia;
    private Integer soLuong;
    private BigDecimal thanhTien;
}
