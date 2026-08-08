package com.cinetik.dto;

import com.cinetik.entity.Role;
import com.cinetik.entity.UserStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StaffAccountResponse {

    private Long id;
    private String hoTen;
    private String email;
    private String soDienThoai;
    private Role vaiTro;
    private UserStatus trangThaiAcc;
    private LocalDateTime ngayTao;
}
