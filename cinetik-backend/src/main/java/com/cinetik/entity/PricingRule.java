package com.cinetik.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Table(name = "pricing_rules")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PricingRule {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "ten_quy_tac", nullable = false)
    private String tenQuyTac;

    @Enumerated(EnumType.STRING)
    @Column(name = "loai_dieu_chinh", nullable = false)
    private AdjustmentType loaiDieuChinh;

    @Enumerated(EnumType.STRING)
    @Column(name = "hinh_thuc", nullable = false)
    private DiscountType hinhThuc;

    @Column(name = "gia_tri", nullable = false, precision = 12, scale = 2)
    private BigDecimal giaTri;

    @Enumerated(EnumType.STRING)
    @Column(name = "loai_ngay", nullable = false)
    private DayType loaiNgay;

    @Column(name = "ngay_cu_the")
    private LocalDate ngayCuThe;

    @Column(name = "gio_bat_dau")
    private LocalTime gioBatDau;

    @Column(name = "gio_ket_thuc")
    private LocalTime gioKetThuc;

    @Column(name = "trang_thai", nullable = false)
    private Boolean trangThai;
}
