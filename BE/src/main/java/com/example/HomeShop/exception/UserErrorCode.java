package com.example.HomeShop.exception;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;

@Getter
@RequiredArgsConstructor
public enum UserErrorCode implements IErrorCode {
    USERNAME_EXISTED(1001, "Tên đăng nhập đã tồn tại", HttpStatus.BAD_REQUEST),
    EMAIL_EXISTED(1002, "Email đã tồn tại", HttpStatus.BAD_REQUEST),
    PHONE_EXISTED(1003, "Số điện thoại đã tồn tại", HttpStatus.BAD_REQUEST),
    USER_NOT_FOUND(1001, "Không tìm thấy người dùng", HttpStatus.BAD_REQUEST),
    USER_INVALID(1005, "Thông tin người dùng không hợp lệ", HttpStatus.BAD_REQUEST),
    CITY_INVALID(1006, "Tỉnh/Thành phố không hợp lệ", HttpStatus.BAD_REQUEST),
    LOGIN_FAILED(1007, "Tên đăng nhập hoặc mật khẩu không chính xác", HttpStatus.UNAUTHORIZED),
    UNAUTHENTICATED(1008, "Vui lòng đăng nhập để thực hiện thao tác này", HttpStatus.UNAUTHORIZED),
    ;

    private final int code;
    private final String message;
    private final HttpStatusCode statusCode;
    private final Object data = null;
}
