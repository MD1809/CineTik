package com.cinetik.service;

import com.cinetik.dto.AuthResponse;
import com.cinetik.dto.LoginRequest;
import com.cinetik.dto.RegisterRequest;
import com.cinetik.dto.UserProfileResponse;

public interface AuthService {

    AuthResponse register(RegisterRequest request);

    AuthResponse login(LoginRequest request);

    UserProfileResponse getCurrentUserProfile(String email);
}
