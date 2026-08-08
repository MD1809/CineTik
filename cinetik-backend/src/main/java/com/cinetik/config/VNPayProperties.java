package com.cinetik.config;

import lombok.Data;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
@Data
public class VNPayProperties {

    @Value("${vnpay.tmn-code:MOCK_TMN_CODE}")
    private String tmnCode;

    @Value("${vnpay.hash-secret:MOCK_HASH_SECRET}")
    private String hashSecret;

    @Value("${vnpay.pay-url:https://sandbox.vnpayment.vn/paymentv2/vpcpay.html}")
    private String payUrl;

    @Value("${vnpay.return-url:http://localhost:8080/api/v1/payments/vnpay/return}")
    private String returnUrl;

    @Value("${vnpay.version:2.1.0}")
    private String version;

    @Value("${vnpay.command:pay}")
    private String command;

    @Value("${vnpay.curr-code:VND}")
    private String currCode;

    @Value("${vnpay.locale:vn}")
    private String locale;

    @Value("${vnpay.sandbox-mock-enabled:true}")
    private boolean sandboxMockEnabled;
}
