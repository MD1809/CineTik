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
public class FBSalesResponse {

    private Long fbItemId;
    private String tenItem;
    private long soLuongDaBan;
    private BigDecimal doanhThu;
}
