package com.cinetik.service;

import com.cinetik.dto.VNPayCallbackResponse;
import com.cinetik.dto.VNPayPaymentRequest;
import com.cinetik.dto.VNPayPaymentResponse;
import jakarta.servlet.http.HttpServletRequest;

import java.util.Map;

public interface VNPayService {

    VNPayPaymentResponse createPaymentUrl(VNPayPaymentRequest request, HttpServletRequest servletRequest);

    VNPayCallbackResponse processCallback(Map<String, String> queryParams);

    VNPayCallbackResponse processMockPayment(String ticketCode, boolean isSuccess);
}
