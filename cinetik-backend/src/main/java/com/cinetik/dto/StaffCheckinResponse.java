package com.cinetik.dto;

import com.cinetik.entity.CheckinStatus;
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
public class StaffCheckinResponse {

    private String ticketCode;
    private CheckinStatus trangThaiCheckin;
    private LocalDateTime thoiGianCheckin;
    private String tenPhim;
    private String tenPhong;
    private LocalDateTime thoiGianBatDau;
    private List<String> danhSachGhe;
    private List<BookingDetailFBResponse> danhSachFB;
    private BigDecimal tongTien;
    private String userEmail;
    private String userHoTen;
}
