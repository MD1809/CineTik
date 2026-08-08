package com.cinetik.dto;

import com.cinetik.entity.CheckinStatus;
import com.cinetik.entity.PaymentMethod;
import com.cinetik.entity.PaymentStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BookingResponse {

    private Long id;
    private String ticketCode;
    private Long userId;
    private String userEmail;
    private ShowtimeResponse showtime;
    private BigDecimal tongTien;
    private PaymentMethod phuongThucThanhToan;
    private PaymentStatus trangThaiThanhToan;
    private CheckinStatus trangThaiCheckin;
    private LocalDateTime thoiGianTao;
    private LocalDateTime thoiGianHetHanLock;
    private List<BookingDetailSeatResponse> seats;
    private List<BookingDetailFBResponse> fbItems;
}
