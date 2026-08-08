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
public class MovieSalesResponse {

    private Long movieId;
    private String tenPhim;
    private long soVeDaBan;
    private BigDecimal doanhThu;
}
