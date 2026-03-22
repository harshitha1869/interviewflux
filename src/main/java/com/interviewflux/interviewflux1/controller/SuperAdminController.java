package com.interviewflux.interviewflux1.controller;

import com.interviewflux.interviewflux1.dto.CreateAdminRequest;
import com.interviewflux.interviewflux1.model.Role;
import com.interviewflux.interviewflux1.model.User;
import com.interviewflux.interviewflux1.model.UserStatus;   // ✅ ADD THIS
import com.interviewflux.interviewflux1.repository.UserRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/superadmin")
@RequiredArgsConstructor
public class SuperAdminController {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    @GetMapping("/admins")
    public List<User> getAllAdmins() {
        return userRepository.findByRole(Role.ADMIN);
    }

    @PostMapping("/create-admin")
    public String createAdmin(@Valid @RequestBody CreateAdminRequest request) {

        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("Admin already exists");
        }

        User admin = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .role(Role.ADMIN)
                .status(UserStatus.ACTIVE)   // ✅ VERY IMPORTANT
                .build();

        System.out.println(request.getName());
        System.out.println(request.getEmail());
        System.out.println(request.getPassword());

        userRepository.save(admin);

        return "Admin created successfully";


    }

    @PutMapping("/block-admin/{id}")
    public String blockAdmin(@PathVariable Long id) {

        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (user.getRole() != Role.ADMIN) {
            throw new RuntimeException("Only admins can be blocked");
        }

        user.setStatus(UserStatus.BLOCKED);
        userRepository.save(user);

        return "Admin blocked successfully";
    }
}