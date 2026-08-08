package com.cinetik.dto;

import com.cinetik.entity.PaymentMethod;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateBookingRequest {

    @NotNull(message = "ID suất chiếu không được để trống")
    private Long showtimeId;

    @NotEmpty(message = "Danh sách ghế không được để trống")
    @Size(max = 8, message = "Tối đa 8 ghế cho 1 lần đặt vé")
    private List<Long> seatIds;

    private List<FBPurchaseItem> fbItems;

    private PaymentMethod phuongThucThanhToan;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class FBPurchaseItem {
        private Long fbItemId;
        private Integer soLuong;
    }
}
