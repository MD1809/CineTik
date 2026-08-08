package com.cinetik.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class VNPayCallbackResponse {

    private String ticketCode;
    private String responseCode;
    private String transactionNo;
    private String message;
    private boolean isSuccess;
}
