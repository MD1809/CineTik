package com.cinetik.service.impl;

import com.cinetik.config.VNPayProperties;
import com.cinetik.dto.VNPayCallbackResponse;
import com.cinetik.dto.VNPayPaymentRequest;
import com.cinetik.dto.VNPayPaymentResponse;
import com.cinetik.entity.Booking;
import com.cinetik.entity.BookingDetailSeat;
import com.cinetik.entity.PaymentStatus;
import com.cinetik.repository.BookingDetailSeatRepository;
import com.cinetik.repository.BookingRepository;
import com.cinetik.service.SeatLockService;
import com.cinetik.service.VNPayService;
import com.cinetik.util.VNPayUtils;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.text.SimpleDateFormat;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class VNPayServiceImpl implements VNPayService {

    private final VNPayProperties vnPayProperties;
    private final BookingRepository bookingRepository;
    private final BookingDetailSeatRepository bookingDetailSeatRepository;
    private final SeatLockService seatLockService;

    @Override
    public VNPayPaymentResponse createPaymentUrl(VNPayPaymentRequest request, HttpServletRequest servletRequest) {
        Booking booking = bookingRepository.findByTicketCode(request.getTicketCode())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy đơn đặt vé với mã vé: " + request.getTicketCode()));

        if (booking.getTrangThaiThanhToan() == PaymentStatus.PAID) {
            throw new RuntimeException("Đơn đặt vé này đã được thanh toán thành công trước đó");
        }

        if (vnPayProperties.isSandboxMockEnabled()) {
            String mockUrl = String.format("http://localhost:8080/api/v1/payments/vnpay/mock-pay-page?vnp_TxnRef=%s&vnp_Amount=%d",
                    booking.getTicketCode(), booking.getTongTien().longValue());
            return VNPayPaymentResponse.builder()
                    .paymentUrl(mockUrl)
                    .ticketCode(booking.getTicketCode())
                    .isMock(true)
                    .build();
        }

        Map<String, String> vnpParams = new HashMap<>();
        vnpParams.put("vnp_Version", vnPayProperties.getVersion());
        vnpParams.put("vnp_Command", vnPayProperties.getCommand());
        vnpParams.put("vnp_TmnCode", vnPayProperties.getTmnCode());
        vnpParams.put("vnp_Amount", String.valueOf(booking.getTongTien().longValue() * 100)); // VNPay amount in VND * 100
        vnpParams.put("vnp_CurrCode", vnPayProperties.getCurrCode());

        if (request.getBankCode() != null && !request.getBankCode().isBlank()) {
            vnpParams.put("vnp_BankCode", request.getBankCode());
        }

        vnpParams.put("vnp_TxnRef", booking.getTicketCode());
        vnpParams.put("vnp_OrderInfo", "Thanh toan ve xem phim CineTik ma: " + booking.getTicketCode());
        vnpParams.put("vnp_OrderType", "other");
        vnpParams.put("vnp_Locale", vnPayProperties.getLocale());
        vnpParams.put("vnp_ReturnUrl", vnPayProperties.getReturnUrl());
        vnpParams.put("vnp_IpAddr", VNPayUtils.getIpAddress(servletRequest));

        Calendar cld = Calendar.getInstance(TimeZone.getTimeZone("Etc/GMT+7"));
        SimpleDateFormat formatter = new SimpleDateFormat("yyyyMMddHHmmss");
        String vnpCreateDate = formatter.format(cld.getTime());
        vnpParams.put("vnp_CreateDate", vnpCreateDate);

        cld.add(Calendar.MINUTE, 15);
        String vnpExpireDate = formatter.format(cld.getTime());
        vnpParams.put("vnp_ExpireDate", vnpExpireDate);

        List<String> fieldNames = new ArrayList<>(vnpParams.keySet());
        Collections.sort(fieldNames);
        StringBuilder hashData = new StringBuilder();
        StringBuilder query = new StringBuilder();
        Iterator<String> itr = fieldNames.iterator();
        while (itr.hasNext()) {
            String fieldName = itr.next();
            String fieldValue = vnpParams.get(fieldName);
            if ((fieldValue != null) && (!fieldValue.isEmpty())) {
                try {
                    hashData.append(fieldName);
                    hashData.append('=');
                    hashData.append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII.toString()));

                    query.append(URLEncoder.encode(fieldName, StandardCharsets.US_ASCII.toString()));
                    query.append('=');
                    query.append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII.toString()));
                    if (itr.hasNext()) {
                        query.append('&');
                        hashData.append('&');
                    }
                } catch (Exception e) {
                    log.error("Error encoding URL parameter", e);
                }
            }
        }

        String queryUrl = query.toString();
        String vnpSecureHash = VNPayUtils.hmacSHA512(vnPayProperties.getHashSecret(), hashData.toString());
        queryUrl += "&vnp_SecureHash=" + vnpSecureHash;
        String paymentUrl = vnPayProperties.getPayUrl() + "?" + queryUrl;

        return VNPayPaymentResponse.builder()
                .paymentUrl(paymentUrl)
                .ticketCode(booking.getTicketCode())
                .isMock(false)
                .build();
    }

    @Override
    @Transactional
    public VNPayCallbackResponse processCallback(Map<String, String> queryParams) {
        String ticketCode = queryParams.get("vnp_TxnRef");
        String responseCode = queryParams.get("vnp_ResponseCode");
        String transactionNo = queryParams.get("vnp_TransactionNo");

        if (ticketCode == null) {
            throw new RuntimeException("Mã đơn hàng vnp_TxnRef không hợp lệ");
        }

        Booking booking = bookingRepository.findByTicketCode(ticketCode)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy đơn đặt vé với mã: " + ticketCode));

        boolean isSuccess = "00".equals(responseCode);
        if (isSuccess) {
            booking.setTrangThaiThanhToan(PaymentStatus.PAID);
            bookingRepository.save(booking);

            releaseBookingSeats(booking);
            return VNPayCallbackResponse.builder()
                    .ticketCode(ticketCode)
                    .responseCode(responseCode)
                    .transactionNo(transactionNo)
                    .message("Thanh toán đơn hàng thành công qua VNPay")
                    .isSuccess(true)
                    .build();
        } else {
            booking.setTrangThaiThanhToan(PaymentStatus.FAILED);
            bookingRepository.save(booking);

            releaseBookingSeats(booking);
            return VNPayCallbackResponse.builder()
                    .ticketCode(ticketCode)
                    .responseCode(responseCode)
                    .transactionNo(transactionNo)
                    .message("Thanh toán đơn hàng thất bại hoặc bị hủy")
                    .isSuccess(false)
                    .build();
        }
    }

    @Override
    @Transactional
    public VNPayCallbackResponse processMockPayment(String ticketCode, boolean isSuccess) {
        Booking booking = bookingRepository.findByTicketCode(ticketCode)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy đơn đặt vé với mã vé: " + ticketCode));

        if (isSuccess) {
            booking.setTrangThaiThanhToan(PaymentStatus.PAID);
            bookingRepository.save(booking);

            releaseBookingSeats(booking);
            return VNPayCallbackResponse.builder()
                    .ticketCode(ticketCode)
                    .responseCode("00")
                    .transactionNo("MOCK_VNP_" + System.currentTimeMillis())
                    .message("Thanh toán giả lập Dev Sandbox thành công")
                    .isSuccess(true)
                    .build();
        } else {
            booking.setTrangThaiThanhToan(PaymentStatus.FAILED);
            bookingRepository.save(booking);

            releaseBookingSeats(booking);
            return VNPayCallbackResponse.builder()
                    .ticketCode(ticketCode)
                    .responseCode("99")
                    .transactionNo("MOCK_VNP_FAILED_" + System.currentTimeMillis())
                    .message("Thanh toán giả lập Dev Sandbox thất bại")
                    .isSuccess(false)
                    .build();
        }
    }

    private void releaseBookingSeats(Booking booking) {
        try {
            List<BookingDetailSeat> seats = bookingDetailSeatRepository.findByBookingId(booking.getId());
            List<Long> seatIds = seats.stream().map(s -> s.getSeat().getId()).collect(Collectors.toList());
            seatLockService.releaseSeats(booking.getShowtime().getId(), seatIds, booking.getUser().getId());
        } catch (Exception e) {
            log.error("Failed to release seat locks for booking: {}", booking.getTicketCode(), e);
        }
    }
}
