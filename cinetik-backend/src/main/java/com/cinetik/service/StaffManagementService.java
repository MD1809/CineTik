package com.cinetik.service;

import com.cinetik.dto.CreateStaffRequest;
import com.cinetik.dto.ResetPasswordRequest;
import com.cinetik.dto.StaffAccountResponse;
import com.cinetik.dto.UpdateUserStatusRequest;

import java.util.List;

public interface StaffManagementService {

    StaffAccountResponse createStaff(CreateStaffRequest request);

    List<StaffAccountResponse> getAllStaffs();

    StaffAccountResponse updateStaffStatus(Long id, UpdateUserStatusRequest request);

    StaffAccountResponse resetStaffPassword(Long id, ResetPasswordRequest request);
}
