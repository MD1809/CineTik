package com.cinetik.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CinemaRoomRequest {

    @NotBlank(message = "Tên phòng chiếu không được để trống")
    private String tenPhong;

    @NotNull(message = "Số lượng ghế không được để trống")
    private Integer soLuongGhe;

    private String diagramData;

    private Integer soHang;

    private Integer soCot;
}
