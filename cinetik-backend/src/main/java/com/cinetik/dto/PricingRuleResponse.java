package com.cinetik.dto;

import com.cinetik.entity.AdjustmentType;
import com.cinetik.entity.DayType;
import com.cinetik.entity.DiscountType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PricingRuleResponse {

    private Long id;
    private String tenQuyTac;
    private AdjustmentType loaiDieuChinh;
    private DiscountType hinhThuc;
    private BigDecimal giaTri;
    private DayType loaiNgay;
    private String ngayCuThe;
    private String gioBatDau;
    private String gioKetThuc;
    private Boolean trangThai;
}
