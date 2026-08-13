package com.cinetik.dto;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SeatPriceRequest {

    @NotNull(message = "Giá gốc không được để trống")
    private BigDecimal giaGoc;
}
