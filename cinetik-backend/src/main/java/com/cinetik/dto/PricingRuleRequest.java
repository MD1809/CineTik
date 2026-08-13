package com.cinetik.dto;

import com.cinetik.entity.AdjustmentType;
import com.cinetik.entity.DayType;
import com.cinetik.entity.DiscountType;
import jakarta.validation.constraints.NotBlank;
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
public class PricingRuleRequest {

    @NotBlank(message = "Tên quy tắc không được để trống")
    private String tenQuyTac;

    @NotNull(message = "Loại điều chỉnh (SURCHARGE/DISCOUNT) không được để trống")
    private AdjustmentType loaiDieuChinh;

    @NotNull(message = "Hình thức (FIXED_AMOUNT/PERCENTAGE) không được để trống")
    private DiscountType hinhThuc;

    @NotNull(message = "Giá trị không được để trống")
    private BigDecimal giaTri;

    @NotNull(message = "Loại ngày áp dụng không được để trống")
    private DayType loaiNgay;

    private String ngayCuThe; // Format YYYY-MM-DD (VD: "2026-02-14")

    private String gioBatDau; // Format HH:mm (VD: "18:00")
    private String gioKetThuc; // Format HH:mm (VD: "22:00")

    private Boolean trangThai;
}
