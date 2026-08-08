package com.cinetik.dto;

import com.cinetik.entity.FBStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FBItemResponse {

    private Long id;
    private String tenItem;
    private BigDecimal giaTien;
    private String moTa;
    private String hinhAnh;
    private FBStatus trangThai;
}
