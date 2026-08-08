package com.cinetik.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Entity
@Table(name = "fb_items")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FBItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "ten_item", nullable = false)
    private String tenItem;

    @Column(name = "hinh_anh")
    private String hinhAnh;

    @Column(name = "gia_tien", nullable = false)
    private BigDecimal giaTien;

    @Column(name = "mo_ta", columnDefinition = "TEXT")
    private String moTa;

    @Enumerated(EnumType.STRING)
    @Column(name = "trang_thai", nullable = false)
    private FBStatus trangThai;
}
