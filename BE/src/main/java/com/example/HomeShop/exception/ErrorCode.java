package com.example.HomeShop.exception;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;

@Getter
public enum ErrorCode {
    UNCATEGORIZED_EXCEPTION(9999, "Uncategorized error", HttpStatus.INTERNAL_SERVER_ERROR),
    INVALID_KEY(1001, "Uncategorized error", HttpStatus.BAD_REQUEST),
    USER_EXISTED(1002, "User existed", HttpStatus.BAD_REQUEST),
    USERNAME_INVALID(1003, "Username must be at least 3 characters", HttpStatus.BAD_REQUEST),
    PASSWORD_INVALID(1004, "Password must be at least 8 characters", HttpStatus.BAD_REQUEST),

    // Code: 400
    EMAIL_EXISTED(400, "Email đã tồn tại", HttpStatus.BAD_REQUEST),

    // Code: 404
    USER_NOT_FOUND(404, "Không tìm thấy user", HttpStatus.NOT_FOUND),

    // Code: 401
    INVALID_PASSWORD(401, "Mật khẩu không đúng", HttpStatus.UNAUTHORIZED),
    INVALID_TOKEN(401, "Token không hợp lệ", HttpStatus.UNAUTHORIZED),
    UNAUTHORIZED(401, "Unauthorized - Missing or invalid token", HttpStatus.UNAUTHORIZED),
    TOKEN_EXPIRED(401, "Token hết hạn", HttpStatus.UNAUTHORIZED),

    // Code: 500
    INTERNAL_SERVER(500, "Internal server", HttpStatus.INTERNAL_SERVER_ERROR);

    ErrorCode(int code, String message, HttpStatusCode statusCode) {
        this.code = code;
        this.message = message;
        this.statusCode = statusCode;
        this.data = null;
    }

    private int code;
    private String message;
    private HttpStatusCode statusCode;
    private Object data;
}
