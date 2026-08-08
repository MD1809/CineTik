package com.cinetik.service.impl;

import com.cinetik.dto.CreateStaffRequest;
import com.cinetik.dto.ResetPasswordRequest;
import com.cinetik.dto.StaffAccountResponse;
import com.cinetik.dto.UpdateUserStatusRequest;
import com.cinetik.entity.Role;
import com.cinetik.entity.User;
import com.cinetik.entity.UserStatus;
import com.cinetik.repository.UserRepository;
import com.cinetik.service.StaffManagementService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class StaffManagementServiceImpl implements StaffManagementService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public StaffAccountResponse createStaff(CreateStaffRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email đã được đăng ký sử dụng trong hệ thống");
        }

        User staff = User.builder()
                .hoTen(request.getHoTen())
                .email(request.getEmail())
                .matKhau(passwordEncoder.encode(request.getMatKhau()))
                .soDienThoai(request.getSoDienThoai())
                .vaiTro(Role.STAFF)
                .trangThaiAcc(UserStatus.ACTIVE)
                .build();

        User savedStaff = userRepository.save(staff);
        return mapToStaffAccountResponse(savedStaff);
    }

    @Override
    public List<StaffAccountResponse> getAllStaffs() {
        return userRepository.findByVaiTro(Role.STAFF).stream()
                .map(this::mapToStaffAccountResponse)
                .collect(Collectors.toList());
    }

    @Override
    public StaffAccountResponse updateStaffStatus(Long id, UpdateUserStatusRequest request) {
        User staff = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy tài khoản nhân viên với ID: " + id));

        if (staff.getVaiTro() != Role.STAFF) {
            throw new RuntimeException("Tài khoản được chọn không phải là Nhân viên");
        }

        staff.setTrangThaiAcc(request.getTrangThaiAcc());
        User updatedStaff = userRepository.save(staff);
        return mapToStaffAccountResponse(updatedStaff);
    }

    @Override
    public StaffAccountResponse resetStaffPassword(Long id, ResetPasswordRequest request) {
        User staff = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy tài khoản nhân viên với ID: " + id));

        if (staff.getVaiTro() != Role.STAFF) {
            throw new RuntimeException("Tài khoản được chọn không phải là Nhân viên");
        }

        staff.setMatKhau(passwordEncoder.encode(request.getMatKhauMoi()));
        User updatedStaff = userRepository.save(staff);
        return mapToStaffAccountResponse(updatedStaff);
    }

    private StaffAccountResponse mapToStaffAccountResponse(User user) {
        return StaffAccountResponse.builder()
                .id(user.getId())
                .hoTen(user.getHoTen())
                .email(user.getEmail())
                .soDienThoai(user.getSoDienThoai())
                .vaiTro(user.getVaiTro())
                .trangThaiAcc(user.getTrangThaiAcc())
                .ngayTao(user.getNgayTao())
                .build();
    }
}
