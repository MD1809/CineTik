package com.cinetik.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CinemaRoomResponse {

    private Long id;
    private String tenPhong;
    private Integer soLuongGhe;
    private String diagramData;
}
