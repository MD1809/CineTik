package com.cinetik.dto;

import com.cinetik.entity.FBStatus;
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
public class FBItemRequest {

    @NotBlank(message = "Tên món Bắp Nước không được để trống")
    private String tenItem;

    @NotNull(message = "Giá tiền không được để trống")
    private BigDecimal giaTien;

    private String moTa;

    private String hinhAnh;

    @NotNull(message = "Trạng thái không được để trống")
    private FBStatus trangThai;
}
