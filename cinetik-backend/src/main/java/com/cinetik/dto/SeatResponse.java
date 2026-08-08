package com.cinetik.dto;

import com.cinetik.entity.SeatType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SeatResponse {

    private Long id;
    private Long roomId;
    private String hang;
    private Integer cot;
    private SeatType loaiGhe;
}
