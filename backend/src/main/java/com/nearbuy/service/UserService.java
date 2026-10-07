package com.nearbuy.service;

import com.nearbuy.dto.LoginRequest;
import com.nearbuy.dto.LoginResponse;
import com.nearbuy.dto.SignupRequest;
import com.nearbuy.dto.UserResponse;
import com.nearbuy.entity.Role;
import com.nearbuy.entity.User;
import com.nearbuy.exception.BadRequestException;
import com.nearbuy.exception.ConflictException;
import com.nearbuy.exception.ResourceNotFoundException;
import com.nearbuy.exception.UnauthorizedException;
import com.nearbuy.repository.UserRepository;
import com.nearbuy.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service managing user signup, login authentication, and profile lookups.
 */
@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    /**
     * Registers a new user. Rejects ADMIN role and prevents duplicate emails.
     */
    @Transactional
    public UserResponse signup(SignupRequest request) {
        if (request.getRole() == Role.ADMIN) {
            throw new BadRequestException("Admin signup is not permitted");
        }

        if (userRepository.existsByEmail(request.getEmail().trim().toLowerCase())) {
            throw new ConflictException("Email is already registered: " + request.getEmail());
        }

        User user = User.builder()
                .name(request.getName().trim())
                .email(request.getEmail().trim().toLowerCase())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(request.getRole())
                .phone(request.getPhone())
                .active(true)
                .build();

        User savedUser = userRepository.save(user);
        return mapToUserResponse(savedUser);
    }

    /**
     * Authenticates user credentials and returns a JWT token.
     */
    @Transactional(readOnly = true)
    public LoginResponse login(LoginRequest request) {
        String email = request.getEmail().trim().toLowerCase();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UnauthorizedException("Invalid email or password"));

        if (!user.isActive()) {
            throw new UnauthorizedException("Account is suspended or deactivated");
        }

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new UnauthorizedException("Invalid email or password");
        }

        String token = jwtUtil.generateToken(user.getEmail(), user.getRole(), user.getId());
        return LoginResponse.builder()
                .token(token)
                .user(mapToUserResponse(user))
                .build();
    }

    /**
     * Fetches current user profile by email.
     */
    @Transactional(readOnly = true)
    public UserResponse getCurrentUser(String email) {
        User user = userRepository.findByEmail(email.trim().toLowerCase())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return mapToUserResponse(user);
    }

    /**
     * Maps User entity to UserResponse DTO.
     */
    public UserResponse mapToUserResponse(User user) {
        return UserResponse.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole())
                .phone(user.getPhone())
                .active(user.isActive())
                .createdAt(user.getCreatedAt())
                .build();
    }
}
