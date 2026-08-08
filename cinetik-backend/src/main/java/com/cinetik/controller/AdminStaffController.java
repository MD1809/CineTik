package com.cinetik.controller;

import com.cinetik.common.dto.ApiResponse;
import com.cinetik.dto.CreateStaffRequest;
import com.cinetik.dto.ResetPasswordRequest;
import com.cinetik.dto.StaffAccountResponse;
import com.cinetik.dto.UpdateUserStatusRequest;
import com.cinetik.service.StaffManagementService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/admin/staff")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminStaffController {

    private final StaffManagementService staffManagementService;

    @PostMapping
    public ResponseEntity<ApiResponse<StaffAccountResponse>> createStaff(@Valid @RequestBody CreateStaffRequest request) {
        StaffAccountResponse response = staffManagementService.createStaff(request);
        return ResponseEntity.ok(ApiResponse.success("Tạo tài khoản nhân viên thành công", response));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<StaffAccountResponse>>> getAllStaffs() {
        List<StaffAccountResponse> response = staffManagementService.getAllStaffs();
        return ResponseEntity.ok(ApiResponse.success("Lấy danh sách nhân viên thành công", response));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<ApiResponse<StaffAccountResponse>> updateStaffStatus(
            @PathVariable Long id,
            @Valid @RequestBody UpdateUserStatusRequest request) {
        StaffAccountResponse response = staffManagementService.updateStaffStatus(id, request);
        return ResponseEntity.ok(ApiResponse.success("Cập nhật trạng thái nhân viên thành công", response));
    }

    @PutMapping("/{id}/reset-password")
    public ResponseEntity<ApiResponse<StaffAccountResponse>> resetStaffPassword(
            @PathVariable Long id,
            @Valid @RequestBody ResetPasswordRequest request) {
        StaffAccountResponse response = staffManagementService.resetStaffPassword(id, request);
        return ResponseEntity.ok(ApiResponse.success("Reset mật khẩu nhân viên thành công", response));
    }
}
