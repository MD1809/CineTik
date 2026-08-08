package com.cinetik.service.impl;

import com.cinetik.dto.BookingDetailFBResponse;
import com.cinetik.dto.StaffCheckinRequest;
import com.cinetik.dto.StaffCheckinResponse;
import com.cinetik.entity.*;
import com.cinetik.repository.BookingDetailFBRepository;
import com.cinetik.repository.BookingDetailSeatRepository;
import com.cinetik.repository.BookingRepository;
import com.cinetik.service.StaffCheckinService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class StaffCheckinServiceImpl implements StaffCheckinService {

    private final BookingRepository bookingRepository;
    private final BookingDetailSeatRepository bookingDetailSeatRepository;
    private final BookingDetailFBRepository bookingDetailFBRepository;

    @Override
    @Transactional
    public StaffCheckinResponse processCheckin(StaffCheckinRequest request) {
        String ticketCode = request.getTicketCode();
        Booking booking = bookingRepository.findByTicketCode(ticketCode)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy vé hợp lệ với mã: " + ticketCode));

        if (booking.getTrangThaiThanhToan() != PaymentStatus.PAID) {
            throw new RuntimeException("Vé mã: " + ticketCode + " chưa được thanh toán thành công (Trạng thái: "
                    + booking.getTrangThaiThanhToan() + "). Không thể thực hiện check-in!");
        }

        if (booking.getTrangThaiCheckin() == CheckinStatus.CHECKED_IN) {
            throw new RuntimeException("Mã vé: " + ticketCode + " đã được check-in trước đó! Cảnh báo nguy cơ sử dụng vé trùng lặp!");
        }

        booking.setTrangThaiCheckin(CheckinStatus.CHECKED_IN);
        Booking updatedBooking = bookingRepository.save(booking);

        log.info("Ticket check-in success: ticketCode={}, user={}", ticketCode, booking.getUser().getEmail());
        return mapToStaffCheckinResponse(updatedBooking, LocalDateTime.now());
    }

    @Override
    public StaffCheckinResponse getTicketDetailForStaff(String ticketCode) {
        Booking booking = bookingRepository.findByTicketCode(ticketCode)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy vé hợp lệ với mã: " + ticketCode));

        return mapToStaffCheckinResponse(booking, null);
    }

    private StaffCheckinResponse mapToStaffCheckinResponse(Booking booking, LocalDateTime checkinTime) {
        List<BookingDetailSeat> detailSeats = bookingDetailSeatRepository.findByBookingId(booking.getId());
        List<BookingDetailFB> detailFBs = bookingDetailFBRepository.findByBookingId(booking.getId());

        List<String> seatLabels = detailSeats.stream()
                .map(s -> s.getSeat().getHang() + s.getSeat().getCot())
                .collect(Collectors.toList());

        List<BookingDetailFBResponse> fbResponses = detailFBs.stream().map(f ->
                BookingDetailFBResponse.builder()
                        .id(f.getId())
                        .fbItemId(f.getFbItem().getId())
                        .tenItem(f.getFbItem().getTenItem())
                        .donGia(f.getDonGia())
                        .soLuong(f.getSoLuong())
                        .thanhTien(f.getDonGia().multiply(java.math.BigDecimal.valueOf(f.getSoLuong())))
                        .build()
        ).collect(Collectors.toList());

        return StaffCheckinResponse.builder()
                .ticketCode(booking.getTicketCode())
                .trangThaiCheckin(booking.getTrangThaiCheckin())
                .thoiGianCheckin(checkinTime != null ? checkinTime : LocalDateTime.now())
                .tenPhim(booking.getShowtime().getMovie().getTenPhim())
                .tenPhong(booking.getShowtime().getCinemaRoom().getTenPhong())
                .thoiGianBatDau(booking.getShowtime().getThoiGianBatDau())
                .danhSachGhe(seatLabels)
                .danhSachFB(fbResponses)
                .tongTien(booking.getTongTien())
                .userEmail(booking.getUser().getEmail())
                .userHoTen(booking.getUser().getHoTen())
                .build();
    }
}
