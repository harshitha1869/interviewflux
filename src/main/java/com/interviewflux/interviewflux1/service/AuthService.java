package com.interviewflux.interviewflux1.service;

import com.interviewflux.interviewflux1.dto.*;
import com.interviewflux.interviewflux1.model.User;
import com.interviewflux.interviewflux1.repository.UserRepository;
import com.interviewflux.interviewflux1.model.UserStatus;
import com.interviewflux.interviewflux1.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import com.interviewflux.interviewflux1.model.Role;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;
    private final BCryptPasswordEncoder passwordEncoder;
    private final EmailService emailService; // ✅ Email service injected

    // SIGNUP
    public String signup(SignupRequest request) {

        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("Email already exists");
        }

        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .role(Role.USER)
                .status(UserStatus.ACTIVE)
                .build();

        userRepository.save(user);

        if (user.getStatus() == UserStatus.BLOCKED) {
            throw new RuntimeException("Account is blocked");
        }

        return "User registered successfully";
    }

    // LOGIN
    public AuthResponse login(LoginRequest request) {

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (user.getStatus() == UserStatus.BLOCKED) {
            throw new RuntimeException("Account is blocked. Contact Super Admin.");
        }

        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new RuntimeException("Invalid credentials");
        }

        String token = jwtUtil.generateToken(
                user.getEmail(),
                user.getRole().name()
        );

        return AuthResponse.builder()
                .token(token)
                .role(user.getRole().name())
                .username(user.getName())
                .message("Login successful")
                .build();
    }


    // CREATE ADMIN (SuperAdmin use chesthadu)
    public String createAdmin(CreateAdminRequest request) {

        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("Admin already exists");
        }

        // Generate temporary password
        String tempPassword = UUID.randomUUID().toString().substring(0,8);

        User admin = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .passwordHash(passwordEncoder.encode(tempPassword))
                .role(Role.ADMIN)
                .status(UserStatus.ACTIVE)
                .build();

        userRepository.save(admin);

        // Send credentials email
        emailService.sendAdminCredentials(
                admin.getEmail(),
                admin.getEmail(),
                tempPassword
        );

        return "Admin created successfully and credentials sent to email.";
    }
}