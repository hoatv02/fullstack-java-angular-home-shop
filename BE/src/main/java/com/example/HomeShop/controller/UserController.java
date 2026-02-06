package com.example.HomeShop.controller;

import com.example.HomeShop.dto.ApiResponse;
import com.example.HomeShop.dto.RegisterDTO;
import com.example.HomeShop.entity.User;
import com.example.HomeShop.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@Tag(name = "User", description = "Các API liên quan đến quản lý người dùng")
public class UserController {
    private final UserService userService;

    @PostMapping
    @Operation(summary = "Tạo người dùng mới", description = "Tạo một tài khoản người dùng mới (Admin)")
    public ResponseEntity<ApiResponse<User>> createUser(@Valid @RequestBody RegisterDTO registerDTO) {
        User result = userService.createUser(registerDTO);
        ApiResponse<User> apiResponse = new ApiResponse<>();
        apiResponse.setData(result);
        apiResponse.setMessage("User created successfully");
        return ResponseEntity.ok(apiResponse);
    }

    @GetMapping
    @Operation(summary = "Lấy danh sách người dùng", description = "Lấy danh sách tất cả người dùng")
    public ResponseEntity<ApiResponse<List<User>>> getUsers() {
        List<User> result = userService.getUsers();
        ApiResponse<List<User>> apiResponse = new ApiResponse<>();
        apiResponse.setData(result);
        apiResponse.setMessage("Get user list successfully");
        return ResponseEntity.ok(apiResponse);
    }
}
