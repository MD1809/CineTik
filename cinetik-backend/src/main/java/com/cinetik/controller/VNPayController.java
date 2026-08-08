package com.cinetik.controller;

import com.cinetik.common.dto.ApiResponse;
import com.cinetik.dto.VNPayCallbackResponse;
import com.cinetik.dto.VNPayPaymentRequest;
import com.cinetik.dto.VNPayPaymentResponse;
import com.cinetik.service.VNPayService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/payments/vnpay")
@RequiredArgsConstructor
public class VNPayController {

    private final VNPayService vnPayService;

    @PostMapping("/create-url")
    public ResponseEntity<ApiResponse<VNPayPaymentResponse>> createPaymentUrl(
            @Valid @RequestBody VNPayPaymentRequest request,
            HttpServletRequest servletRequest) {
        VNPayPaymentResponse response = vnPayService.createPaymentUrl(request, servletRequest);
        return ResponseEntity.ok(ApiResponse.success("Tạo URL thanh toán thành công", response));
    }

    @GetMapping("/return")
    public ResponseEntity<ApiResponse<VNPayCallbackResponse>> handleReturn(@RequestParam Map<String, String> queryParams) {
        VNPayCallbackResponse response = vnPayService.processCallback(queryParams);
        return ResponseEntity.ok(ApiResponse.success("Xử lý kết quả thanh toán VNPay thành công", response));
    }

    @GetMapping("/ipn")
    public ResponseEntity<ApiResponse<VNPayCallbackResponse>> handleIPN(@RequestParam Map<String, String> queryParams) {
        VNPayCallbackResponse response = vnPayService.processCallback(queryParams);
        return ResponseEntity.ok(ApiResponse.success("Xử lý Webhook IPN VNPay thành công", response));
    }

    @PostMapping("/mock-pay")
    public ResponseEntity<ApiResponse<VNPayCallbackResponse>> mockPay(
            @RequestParam String ticketCode,
            @RequestParam(defaultValue = "true") boolean isSuccess) {
        VNPayCallbackResponse response = vnPayService.processMockPayment(ticketCode, isSuccess);
        return ResponseEntity.ok(ApiResponse.success("Xử lý giả lập thanh toán Dev Sandbox thành công", response));
    }
}
