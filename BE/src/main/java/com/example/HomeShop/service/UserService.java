package com.example.HomeShop.service;

import com.example.HomeShop.dto.RegisterDTO;
import com.example.HomeShop.entity.User;
import com.example.HomeShop.exception.AppException;
import com.example.HomeShop.exception.ErrorCode;
import com.example.HomeShop.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Transactional
    public String register(RegisterDTO registerDTO) {
        if (userRepository.existsByUsername(registerDTO.getUsername())) {
            throw new AppException(ErrorCode.USER_EXISTED);
        }
        if (userRepository.existsByEmail(registerDTO.getEmail())) {
            throw new AppException(ErrorCode.USER_EXISTED);
        }
        if (userRepository.existsByPhone(registerDTO.getPhone())) {
            throw new AppException(ErrorCode.USER_EXISTED);
        }
        if (userRepository.existsByCity(registerDTO.getCity())) {
            throw new AppException(ErrorCode.USER_EXISTED);
        }

        User user = User.builder()
                .username(registerDTO.getUsername())
                .password(passwordEncoder.encode(registerDTO.getPassword()))
                .email(registerDTO.getEmail())
                .phone(registerDTO.getPhone())
                .city(registerDTO.getCity())
                .address(registerDTO.getAddress())
                .build();

        userRepository.save(user);
        return "Đăng ký thành công";
    }

    public User createUser(RegisterDTO registerDTO) {
        if (userRepository.existsByUsername(registerDTO.getUsername())) {
            throw new AppException(ErrorCode.USER_EXISTED);
        }
        if (userRepository.existsByEmail(registerDTO.getEmail())) {
            throw new AppException(ErrorCode.USER_EXISTED);
        }
        // ... simplistic check for brevity, or reuse logic

        User user = User.builder()
                .username(registerDTO.getUsername())
                .password(passwordEncoder.encode(registerDTO.getPassword()))
                .email(registerDTO.getEmail())
                .phone(registerDTO.getPhone())
                .city(registerDTO.getCity())
                .address(registerDTO.getAddress())
                .build();

        return userRepository.save(user);
    }

    public java.util.List<User> getUsers() {
        return userRepository.findAll();
    }
}
