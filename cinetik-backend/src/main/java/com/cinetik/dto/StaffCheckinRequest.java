package com.cinetik.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StaffCheckinRequest {

    @NotBlank(message = "Mã vé không được để trống")
    private String ticketCode;
}
