package com.cinetik.service.impl;

import com.cinetik.dto.FBSalesResponse;
import com.cinetik.dto.MovieSalesResponse;
import com.cinetik.dto.RevenueReportResponse;
import com.cinetik.entity.Booking;
import com.cinetik.entity.BookingDetailFB;
import com.cinetik.entity.BookingDetailSeat;
import com.cinetik.entity.PaymentStatus;
import com.cinetik.repository.BookingDetailFBRepository;
import com.cinetik.repository.BookingDetailSeatRepository;
import com.cinetik.repository.BookingRepository;
import com.cinetik.service.ReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReportServiceImpl implements ReportService {

    private final BookingRepository bookingRepository;
    private final BookingDetailSeatRepository bookingDetailSeatRepository;
    private final BookingDetailFBRepository bookingDetailFBRepository;

    @Override
    public RevenueReportResponse getRevenueReport(LocalDate startDate, LocalDate endDate) {
        List<Booking> paidBookings = getPaidBookingsInDateRange(startDate, endDate);

        BigDecimal doanhThuVe = BigDecimal.ZERO;
        BigDecimal doanhThuFB = BigDecimal.ZERO;
        long tongSoVeDaBan = 0;

        for (Booking booking : paidBookings) {
            List<BookingDetailSeat> seats = bookingDetailSeatRepository.findByBookingId(booking.getId());
            tongSoVeDaBan += seats.size();
            for (BookingDetailSeat seat : seats) {
                if (seat.getGiaVe() != null) {
                    doanhThuVe = doanhThuVe.add(seat.getGiaVe());
                }
            }

            List<BookingDetailFB> fbs = bookingDetailFBRepository.findByBookingId(booking.getId());
            for (BookingDetailFB fb : fbs) {
                if (fb.getDonGia() != null && fb.getSoLuong() != null) {
                    BigDecimal itemTotal = fb.getDonGia().multiply(BigDecimal.valueOf(fb.getSoLuong()));
                    doanhThuFB = doanhThuFB.add(itemTotal);
                }
            }
        }

        BigDecimal tongDoanhThu = doanhThuVe.add(doanhThuFB);

        return RevenueReportResponse.builder()
                .tongDoanhThu(tongDoanhThu)
                .doanhThuVe(doanhThuVe)
                .doanhThuFB(doanhThuFB)
                .tongSoDonHangThanhToan(paidBookings.size())
                .tongSoVeDaBan(tongSoVeDaBan)
                .startDate(startDate)
                .endDate(endDate)
                .build();
    }

    @Override
    public List<MovieSalesResponse> getMovieSalesReports(LocalDate startDate, LocalDate endDate) {
        List<Booking> paidBookings = getPaidBookingsInDateRange(startDate, endDate);

        Map<Long, MovieSalesHolder> movieMap = new HashMap<>();

        for (Booking booking : paidBookings) {
            Long movieId = booking.getShowtime().getMovie().getId();
            String tenPhim = booking.getShowtime().getMovie().getTenPhim();

            MovieSalesHolder holder = movieMap.computeIfAbsent(movieId, k -> new MovieSalesHolder(movieId, tenPhim));

            List<BookingDetailSeat> seats = bookingDetailSeatRepository.findByBookingId(booking.getId());
            holder.soVeDaBan += seats.size();
            for (BookingDetailSeat seat : seats) {
                if (seat.getGiaVe() != null) {
                    holder.doanhThu = holder.doanhThu.add(seat.getGiaVe());
                }
            }
        }

        return movieMap.values().stream()
                .map(h -> MovieSalesResponse.builder()
                        .movieId(h.movieId)
                        .tenPhim(h.tenPhim)
                        .soVeDaBan(h.soVeDaBan)
                        .doanhThu(h.doanhThu)
                        .build())
                .sorted(Comparator.comparing(MovieSalesResponse::getDoanhThu).reversed())
                .collect(Collectors.toList());
    }

    @Override
    public List<FBSalesResponse> getFBSalesReports(LocalDate startDate, LocalDate endDate) {
        List<Booking> paidBookings = getPaidBookingsInDateRange(startDate, endDate);

        Map<Long, FBSalesHolder> fbMap = new HashMap<>();

        for (Booking booking : paidBookings) {
            List<BookingDetailFB> fbs = bookingDetailFBRepository.findByBookingId(booking.getId());
            for (BookingDetailFB fb : fbs) {
                Long fbItemId = fb.getFbItem().getId();
                String tenItem = fb.getFbItem().getTenItem();

                FBSalesHolder holder = fbMap.computeIfAbsent(fbItemId, k -> new FBSalesHolder(fbItemId, tenItem));
                holder.soLuongDaBan += fb.getSoLuong();
                if (fb.getDonGia() != null) {
                    BigDecimal itemTotal = fb.getDonGia().multiply(BigDecimal.valueOf(fb.getSoLuong()));
                    holder.doanhThu = holder.doanhThu.add(itemTotal);
                }
            }
        }

        return fbMap.values().stream()
                .map(h -> FBSalesResponse.builder()
                        .fbItemId(h.fbItemId)
                        .tenItem(h.tenItem)
                        .soLuongDaBan(h.soLuongDaBan)
                        .doanhThu(h.doanhThu)
                        .build())
                .sorted(Comparator.comparing(FBSalesResponse::getDoanhThu).reversed())
                .collect(Collectors.toList());
    }

    private List<Booking> getPaidBookingsInDateRange(LocalDate startDate, LocalDate endDate) {
        LocalDateTime startDateTime = (startDate != null) ? startDate.atStartOfDay() : LocalDateTime.of(2000, 1, 1, 0, 0);
        LocalDateTime endDateTime = (endDate != null) ? endDate.atTime(LocalTime.MAX) : LocalDateTime.of(2099, 12, 31, 23, 59, 59);

        return bookingRepository.findAll().stream()
                .filter(b -> b.getTrangThaiThanhToan() == PaymentStatus.PAID)
                .filter(b -> b.getThoiGianTao() != null && !b.getThoiGianTao().isBefore(startDateTime) && !b.getThoiGianTao().isAfter(endDateTime))
                .collect(Collectors.toList());
    }

    private static class MovieSalesHolder {
        Long movieId;
        String tenPhim;
        long soVeDaBan = 0;
        BigDecimal doanhThu = BigDecimal.ZERO;

        MovieSalesHolder(Long movieId, String tenPhim) {
            this.movieId = movieId;
            this.tenPhim = tenPhim;
        }
    }

    private static class FBSalesHolder {
        Long fbItemId;
        String tenItem;
        long soLuongDaBan = 0;
        BigDecimal doanhThu = BigDecimal.ZERO;

        FBSalesHolder(Long fbItemId, String tenItem) {
            this.fbItemId = fbItemId;
            this.tenItem = tenItem;
        }
    }
}
