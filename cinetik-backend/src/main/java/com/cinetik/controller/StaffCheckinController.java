package com.cinetik.controller;

import com.cinetik.common.dto.ApiResponse;
import com.cinetik.dto.StaffCheckinRequest;
import com.cinetik.dto.StaffCheckinResponse;
import com.cinetik.service.StaffCheckinService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/staff/checkin")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('STAFF', 'ADMIN')")
public class StaffCheckinController {

    private final StaffCheckinService staffCheckinService;

    @PostMapping
    public ResponseEntity<ApiResponse<StaffCheckinResponse>> processCheckin(@Valid @RequestBody StaffCheckinRequest request) {
        StaffCheckinResponse response = staffCheckinService.processCheckin(request);
        return ResponseEntity.ok(ApiResponse.success("Soát vé check-in thành công", response));
    }

    @GetMapping("/{ticketCode}")
    public ResponseEntity<ApiResponse<StaffCheckinResponse>> getTicketDetailForStaff(@PathVariable String ticketCode) {
        StaffCheckinResponse response = staffCheckinService.getTicketDetailForStaff(ticketCode);
        return ResponseEntity.ok(ApiResponse.success("Lấy thông tin vé soát vé thành công", response));
    }
}
