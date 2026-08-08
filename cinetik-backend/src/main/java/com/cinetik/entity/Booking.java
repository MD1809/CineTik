package com.cinetik.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "bookings")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "ticket_code", unique = true, length = 10)
    private String ticketCode;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "showtime_id", nullable = false)
    private Showtime showtime;

    @Column(name = "tong_tien", nullable = false)
    private BigDecimal tongTien;

    @Enumerated(EnumType.STRING)
    @Column(name = "phuong_thuc_thanh_toan")
    private PaymentMethod phuongThucThanhToan;

    @Enumerated(EnumType.STRING)
    @Column(name = "trang_thai_thanh_toan", nullable = false)
    private PaymentStatus trangThaiThanhToan;

    @Enumerated(EnumType.STRING)
    @Column(name = "trang_thai_checkin", nullable = false)
    private CheckinStatus trangThaiCheckin;

    @CreationTimestamp
    @Column(name = "thoi_gian_tao", updatable = false)
    private LocalDateTime thoiGianTao;

    @Column(name = "thoi_gian_het_han_lock")
    private LocalDateTime thoiGianHetHanLock;
}
