package com.cinetik.service.impl;

import com.cinetik.dto.*;
import com.cinetik.entity.*;
import com.cinetik.repository.*;
import com.cinetik.service.BookingService;
import com.cinetik.service.PricingEngineService;
import com.cinetik.service.SeatLockService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class BookingServiceImpl implements BookingService {

    private final BookingRepository bookingRepository;
    private final BookingDetailSeatRepository bookingDetailSeatRepository;
    private final BookingDetailFBRepository bookingDetailFBRepository;
    private final UserRepository userRepository;
    private final ShowtimeRepository showtimeRepository;
    private final SeatRepository seatRepository;
    private final FBItemRepository fbItemRepository;
    private final PricingEngineService pricingEngineService;
    private final SeatLockService seatLockService;

    private static final String CHARACTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    private static final SecureRandom RANDOM = new SecureRandom();

    @Override
    @Transactional
    public BookingResponse createBooking(CreateBookingRequest request, Long userId) {
        if (request.getSeatIds().size() > 8) {
            throw new RuntimeException("Chỉ được chọn tối đa 8 ghế cho 1 lần đặt vé");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng với ID: " + userId));

        Showtime showtime = showtimeRepository.findById(request.getShowtimeId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy suất chiếu với ID: " + request.getShowtimeId()));

        // Validate seats locking status
        for (Long seatId : request.getSeatIds()) {
            if (seatLockService.isSeatLockedByOther(showtime.getId(), seatId, userId)) {
                throw new RuntimeException("Ghế ID " + seatId + " đã bị giữ chỗ bởi khách hàng khác");
            }
        }

        List<Seat> seats = seatRepository.findAllById(request.getSeatIds());
        if (seats.size() != request.getSeatIds().size()) {
            throw new RuntimeException("Một số ghế đã chọn không tồn tại");
        }

        // Calculate Seats Total
        BigDecimal totalSeatPrice = BigDecimal.ZERO;
        List<SeatPriceHolder> seatHolders = new ArrayList<>();
        for (Seat seat : seats) {
            BigDecimal price = pricingEngineService.getSeatBasePrice(showtime, seat);
            totalSeatPrice = totalSeatPrice.add(price);
            seatHolders.add(new SeatPriceHolder(seat, price));
        }

        // Calculate F&B Total
        BigDecimal totalFBPrice = BigDecimal.ZERO;
        List<FBPriceHolder> fbHolders = new ArrayList<>();
        if (request.getFbItems() != null && !request.getFbItems().isEmpty()) {
            for (CreateBookingRequest.FBPurchaseItem itemReq : request.getFbItems()) {
                if (itemReq.getSoLuong() == null || itemReq.getSoLuong() <= 0) continue;
                FBItem fbItem = fbItemRepository.findById(itemReq.getFbItemId())
                        .orElseThrow(() -> new RuntimeException("Không tìm thấy sản phẩm F&B với ID: " + itemReq.getFbItemId()));

                BigDecimal itemTotal = fbItem.getGiaTien().multiply(BigDecimal.valueOf(itemReq.getSoLuong()));
                totalFBPrice = totalFBPrice.add(itemTotal);
                fbHolders.add(new FBPriceHolder(fbItem, itemReq.getSoLuong(), fbItem.getGiaTien()));
            }
        }

        BigDecimal tongTien = totalSeatPrice.add(totalFBPrice);
        String ticketCode = generateUniqueTicketCode();

        PaymentMethod method = request.getPhuongThucThanhToan() != null ? request.getPhuongThucThanhToan() : PaymentMethod.VNPAY;

        Booking booking = Booking.builder()
                .ticketCode(ticketCode)
                .user(user)
                .showtime(showtime)
                .tongTien(tongTien)
                .phuongThucThanhToan(method)
                .trangThaiThanhToan(PaymentStatus.PENDING)
                .trangThaiCheckin(CheckinStatus.UNCHECKED)
                .thoiGianHetHanLock(LocalDateTime.now().plusMinutes(5))
                .build();

        Booking savedBooking = bookingRepository.save(booking);

        // Save BookingDetailSeat
        List<BookingDetailSeat> detailSeats = new ArrayList<>();
        for (SeatPriceHolder sph : seatHolders) {
            BookingDetailSeat bds = BookingDetailSeat.builder()
                    .booking(savedBooking)
                    .seat(sph.seat)
                    .giaVe(sph.price)
                    .build();
            detailSeats.add(bds);
        }
        bookingDetailSeatRepository.saveAll(detailSeats);

        // Save BookingDetailFB
        List<BookingDetailFB> detailFBs = new ArrayList<>();
        for (FBPriceHolder fph : fbHolders) {
            BookingDetailFB bdf = BookingDetailFB.builder()
                    .booking(savedBooking)
                    .fbItem(fph.fbItem)
                    .soLuong(fph.quantity)
                    .donGia(fph.unitPrice)
                    .build();
            detailFBs.add(bdf);
        }
        bookingDetailFBRepository.saveAll(detailFBs);

        return mapToBookingResponse(savedBooking, detailSeats, detailFBs);
    }

    @Override
    public List<BookingResponse> getUserBookings(Long userId) {
        List<Booking> bookings = bookingRepository.findByUserIdOrderByThoiGianTaoDesc(userId);
        return bookings.stream().map(this::mapBookingToResponse).collect(Collectors.toList());
    }

    @Override
    public BookingResponse getBookingByTicketCode(String ticketCode) {
        Booking booking = bookingRepository.findByTicketCode(ticketCode)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy đơn đặt vé với mã vé: " + ticketCode));

        return mapBookingToResponse(booking);
    }

    private BookingResponse mapBookingToResponse(Booking booking) {
        List<BookingDetailSeat> detailSeats = bookingDetailSeatRepository.findByBookingId(booking.getId());
        List<BookingDetailFB> detailFBs = bookingDetailFBRepository.findByBookingId(booking.getId());
        return mapToBookingResponse(booking, detailSeats, detailFBs);
    }

    private BookingResponse mapToBookingResponse(Booking booking, List<BookingDetailSeat> detailSeats, List<BookingDetailFB> detailFBs) {
        MovieResponse movieResp = MovieResponse.builder()
                .id(booking.getShowtime().getMovie().getId())
                .tenPhim(booking.getShowtime().getMovie().getTenPhim())
                .daoDien(booking.getShowtime().getMovie().getDaoDien())
                .dienVien(booking.getShowtime().getMovie().getDienVien())
                .theLoai(booking.getShowtime().getMovie().getTheLoai())
                .thoiLuong(booking.getShowtime().getMovie().getThoiLuong())
                .doTuoi(booking.getShowtime().getMovie().getDoTuoi())
                .moTa(booking.getShowtime().getMovie().getMoTa())
                .posterUrl(booking.getShowtime().getMovie().getPosterUrl())
                .trailerUrl(booking.getShowtime().getMovie().getTrailerUrl())
                .trangThai(booking.getShowtime().getMovie().getTrangThai())
                .build();

        CinemaRoomResponse roomResp = CinemaRoomResponse.builder()
                .id(booking.getShowtime().getCinemaRoom().getId())
                .tenPhong(booking.getShowtime().getCinemaRoom().getTenPhong())
                .soLuongGhe(booking.getShowtime().getCinemaRoom().getSoLuongGhe())
                .diagramData(booking.getShowtime().getCinemaRoom().getDiagramData())
                .build();

        ShowtimeResponse showtimeResp = ShowtimeResponse.builder()
                .id(booking.getShowtime().getId())
                .movie(movieResp)
                .cinemaRoom(roomResp)
                .ngayChieu(booking.getShowtime().getNgayChieu())
                .thoiGianBatDau(booking.getShowtime().getThoiGianBatDau())
                .thoiGianKetThuc(booking.getShowtime().getThoiGianKetThuc())
                .bangGiaSetting(booking.getShowtime().getBangGiaSetting())
                .build();

        List<BookingDetailSeatResponse> seatResponses = detailSeats.stream().map(s ->
                BookingDetailSeatResponse.builder()
                        .id(s.getId())
                        .seatId(s.getSeat().getId())
                        .hang(s.getSeat().getHang())
                        .cot(s.getSeat().getCot())
                        .loaiGhe(s.getSeat().getLoaiGhe())
                        .giaVe(s.getGiaVe())
                        .build()
        ).collect(Collectors.toList());

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

        return BookingResponse.builder()
                .id(booking.getId())
                .ticketCode(booking.getTicketCode())
                .userId(booking.getUser().getId())
                .userEmail(booking.getUser().getEmail())
                .showtime(showtimeResp)
                .tongTien(booking.getTongTien())
                .phuongThucThanhToan(booking.getPhuongThucThanhToan())
                .trangThaiThanhToan(booking.getTrangThaiThanhToan())
                .trangThaiCheckin(booking.getTrangThaiCheckin())
                .thoiGianTao(booking.getThoiGianTao())
                .thoiGianHetHanLock(booking.getThoiGianHetHanLock())
                .seats(seatResponses)
                .fbItems(fbResponses)
                .build();
    }

    private String generateUniqueTicketCode() {
        String code;
        do {
            StringBuilder sb = new StringBuilder(10);
            for (int i = 0; i < 10; i++) {
                sb.append(CHARACTERS.charAt(RANDOM.nextInt(CHARACTERS.length())));
            }
            code = sb.toString();
        } while (bookingRepository.findByTicketCode(code).isPresent());
        return code;
    }

    private record SeatPriceHolder(Seat seat, BigDecimal price) {}
    private record FBPriceHolder(FBItem fbItem, Integer quantity, BigDecimal unitPrice) {}
}
