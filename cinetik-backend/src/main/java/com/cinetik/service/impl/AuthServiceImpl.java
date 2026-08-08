package com.cinetik.service.impl;

import com.cinetik.dto.AuthResponse;
import com.cinetik.dto.LoginRequest;
import com.cinetik.dto.RegisterRequest;
import com.cinetik.dto.UserProfileResponse;
import com.cinetik.entity.Role;
import com.cinetik.entity.User;
import com.cinetik.entity.UserStatus;
import com.cinetik.repository.UserRepository;
import com.cinetik.security.JwtTokenProvider;
import com.cinetik.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;

    @Override
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email đã được đăng ký sử dụng trong hệ thống");
        }

        User user = User.builder()
                .hoTen(request.getHoTen())
                .email(request.getEmail())
                .matKhau(passwordEncoder.encode(request.getMatKhau()))
                .soDienThoai(request.getSoDienThoai())
                .vaiTro(Role.CUSTOMER)
                .trangThaiAcc(UserStatus.ACTIVE)
                .build();

        User savedUser = userRepository.save(user);
        String token = jwtTokenProvider.generateToken(savedUser.getEmail(), savedUser.getVaiTro().name());

        return AuthResponse.builder()
                .accessToken(token)
                .user(mapToUserProfile(savedUser))
                .build();
    }

    @Override
    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Email hoặc mật khẩu không chính xác"));

        if (!passwordEncoder.matches(request.getMatKhau(), user.getMatKhau())) {
            throw new RuntimeException("Email hoặc mật khẩu không chính xác");
        }

        if (user.getTrangThaiAcc() == UserStatus.LOCKED) {
            throw new RuntimeException("Tài khoản của bạn hiện đang bị khóa");
        }

        String token = jwtTokenProvider.generateToken(user.getEmail(), user.getVaiTro().name());

        return AuthResponse.builder()
                .accessToken(token)
                .user(mapToUserProfile(user))
                .build();
    }

    @Override
    public UserProfileResponse getCurrentUserProfile(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy tài khoản người dùng"));

        return mapToUserProfile(user);
    }

    private UserProfileResponse mapToUserProfile(User user) {
        return UserProfileResponse.builder()
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
