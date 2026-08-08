package com.cinetik.service.impl;

import com.cinetik.dto.BookingDetailFBResponse;
import com.cinetik.entity.Booking;
import com.cinetik.entity.BookingDetailFB;
import com.cinetik.entity.BookingDetailSeat;
import com.cinetik.repository.BookingDetailFBRepository;
import com.cinetik.repository.BookingDetailSeatRepository;
import com.cinetik.service.EmailService;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.thymeleaf.context.Context;
import org.thymeleaf.spring6.SpringTemplateEngine;

import java.math.BigDecimal;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailServiceImpl implements EmailService {

    private final JavaMailSender mailSender;
    private final SpringTemplateEngine templateEngine;
    private final BookingDetailSeatRepository bookingDetailSeatRepository;
    private final BookingDetailFBRepository bookingDetailFBRepository;

    @Value("${spring.mail.username:cinetik.cinema@gmail.com}")
    private String fromEmail;

    @Override
    @Async("taskExecutor")
    public void sendBookingConfirmationEmail(Booking booking) {
        log.info("Starting async email sending task for booking: {}", booking.getTicketCode());
        try {
            List<BookingDetailSeat> detailSeats = bookingDetailSeatRepository.findByBookingId(booking.getId());
            List<BookingDetailFB> detailFBs = bookingDetailFBRepository.findByBookingId(booking.getId());

            String seatLabels = detailSeats.stream()
                    .map(s -> s.getSeat().getHang() + s.getSeat().getCot())
                    .collect(Collectors.joining(", "));

            List<BookingDetailFBResponse> fbResponses = detailFBs.stream().map(f ->
                    BookingDetailFBResponse.builder()
                            .id(f.getId())
                            .fbItemId(f.getFbItem().getId())
                            .tenItem(f.getFbItem().getTenItem())
                            .donGia(f.getDonGia())
                            .soLuong(f.getSoLuong())
                            .thanhTien(f.getDonGia().multiply(BigDecimal.valueOf(f.getSoLuong())))
                            .build()
            ).collect(Collectors.toList());

            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("HH:mm - dd/MM/yyyy");
            String formattedShowtime = booking.getShowtime().getThoiGianBatDau().format(formatter);

            Context context = new Context();
            context.setVariable("userHoTen", booking.getUser().getHoTen());
            context.setVariable("ticketCode", booking.getTicketCode());
            context.setVariable("tenPhim", booking.getShowtime().getMovie().getTenPhim());
            context.setVariable("tenPhong", booking.getShowtime().getCinemaRoom().getTenPhong());
            context.setVariable("thoiGianBatDau", formattedShowtime);
            context.setVariable("danhSachGhe", seatLabels);
            context.setVariable("danhSachFB", fbResponses);
            context.setVariable("tongTien", booking.getTongTien());

            String htmlContent = templateEngine.process("ticket-confirmation", context);

            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            helper.setFrom(fromEmail);
            helper.setTo(booking.getUser().getEmail());
            helper.setSubject("[CineTik] Vé xem phim & Xác nhận đơn hàng thành công - Mã vé: " + booking.getTicketCode());
            helper.setText(htmlContent, true);

            mailSender.send(message);
            log.info("Successfully sent booking confirmation email to: {}", booking.getUser().getEmail());
        } catch (Exception e) {
            log.warn("Could not send booking confirmation email for ticket {}: {}", booking.getTicketCode(), e.getMessage());
        }
    }
}
