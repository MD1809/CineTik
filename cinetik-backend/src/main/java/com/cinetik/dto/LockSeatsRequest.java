package com.cinetik.dto;

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
public class LockSeatsRequest {

    @NotNull(message = "ID suất chiếu không được để trống")
    private Long showtimeId;

    @NotEmpty(message = "Danh sách ghế chọn không được để trống")
    @Size(max = 8, message = "Chỉ được chọn tối đa 8 ghế cho 1 lần giữ chỗ")
    private List<Long> seatIds;
}
