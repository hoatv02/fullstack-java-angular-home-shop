package com.example.HomeShop.controller;

import com.example.HomeShop.dto.ApiResponse;
import com.example.HomeShop.dto.RegisterDTO;
import com.example.HomeShop.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Tag(name = "Authentication", description = "Các API liên quan đến xác thực và đăng ký")
public class AuthController {
    private final UserService userService;

    @PostMapping("/register")
    @Operation(summary = "Đăng ký người dùng mới", description = "Tạo một tài khoản người dùng mới với username, password và email")
    public ResponseEntity<ApiResponse<String>> register(@Valid @RequestBody RegisterDTO registerDTO) {
        String result = userService.register(registerDTO);
        ApiResponse<String> apiResponse = new ApiResponse<>();
        apiResponse.setData(result);
        apiResponse.setMessage("Success");
        return ResponseEntity.ok(apiResponse);
    }

}
