package com.cinetik.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Entity
@Table(name = "seat_price_configs")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SeatPriceConfig {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(name = "loai_ghe", nullable = false, unique = true)
    private SeatType loaiGhe;

    @Column(name = "ten_loai_ghe", nullable = false)
    private String tenLoaiGhe;

    @Column(name = "gia_goc", nullable = false, precision = 12, scale = 2)
    private BigDecimal giaGoc;
}
