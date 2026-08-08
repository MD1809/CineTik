package com.cinetik.dto;

import com.cinetik.entity.SeatType;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateSeatTypeRequest {

    @NotNull(message = "Loại ghế không được để trống")
    private SeatType loaiGhe;
}
