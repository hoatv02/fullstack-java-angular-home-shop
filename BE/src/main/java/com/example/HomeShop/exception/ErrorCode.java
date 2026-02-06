package com.example.HomeShop.exception;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;

@Getter
@RequiredArgsConstructor
public enum ErrorCode implements IErrorCode {
    UNCATEGORIZED_EXCEPTION(9999, "Có lỗi xảy ra, vui lòng thử lại sau", HttpStatus.INTERNAL_SERVER_ERROR),
    INVALID_KEY(1001, "Dữ liệu gửi lên không hợp lệ", HttpStatus.BAD_REQUEST),
    USER_EXISTED(1002, "User existed", HttpStatus.BAD_REQUEST),
    USERNAME_INVALID(1003, "Username must be at least 3 characters", HttpStatus.BAD_REQUEST),
    PASSWORD_INVALID(1004, "Password must be at least 8 characters", HttpStatus.BAD_REQUEST),

    // Code: 401
    INVALID_PASSWORD(401, "Mật khẩu không đúng", HttpStatus.UNAUTHORIZED),
    INVALID_TOKEN(401, "Token không hợp lệ", HttpStatus.UNAUTHORIZED),
    UNAUTHORIZED(401, "Unauthorized - Missing or invalid token", HttpStatus.UNAUTHORIZED),
    TOKEN_EXPIRED(401, "Token hết hạn", HttpStatus.UNAUTHORIZED),

    // Code: 500
    INTERNAL_SERVER(500, "Internal server error", HttpStatus.INTERNAL_SERVER_ERROR);

    private final int code;
    private final String message;
    private final HttpStatusCode statusCode;
    private final Object data = null;
}
