package com.example.HomeShop.exception;

import com.example.HomeShop.constant.MessageKeys;
import lombok.Getter;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;

@Getter
public enum ErrorCode {
    UNCATEGORIZED_EXCEPTION(9999, MessageKeys.ERROR_UNCATEGORIZED, HttpStatus.INTERNAL_SERVER_ERROR),
    INVALID_KEY(1001, MessageKeys.ERROR_INVALID_KEY, HttpStatus.BAD_REQUEST),
    USER_EXISTED(1002, MessageKeys.ERROR_USER_EXISTED, HttpStatus.BAD_REQUEST),
    USERNAME_INVALID(1003, MessageKeys.ERROR_USERNAME_INVALID, HttpStatus.BAD_REQUEST),
    PASSWORD_INVALID(1004, MessageKeys.ERROR_PASSWORD_INVALID, HttpStatus.BAD_REQUEST),

    //Code: 400 - Bad Request
    EMAIL_EXISTED(400, MessageKeys.ERROR_EMAIL_EXISTED, HttpStatus.BAD_REQUEST),
    DUPLICATE_RESOURCE(400, MessageKeys.ERROR_DUPLICATE_RESOURCE, HttpStatus.BAD_REQUEST),
    PRODUCT_NAME_EXISTED(400, MessageKeys.ERROR_PRODUCT_NAME_EXISTED, HttpStatus.BAD_REQUEST),
    CATEGORY_NAME_EXISTED(400, MessageKeys.ERROR_CATEGORY_NAME_EXISTED, HttpStatus.BAD_REQUEST),
    INVALID_PRODUCT_DATA(400, MessageKeys.ERROR_INVALID_PRODUCT_DATA, HttpStatus.BAD_REQUEST),
    INVALID_CATEGORY_DATA(400, MessageKeys.ERROR_INVALID_CATEGORY_DATA, HttpStatus.BAD_REQUEST),

    //Code: 404 - Not Found
    USER_NOT_FOUND(404, MessageKeys.ERROR_USER_NOT_FOUND, HttpStatus.NOT_FOUND),
    PRODUCT_NOT_FOUND(404, MessageKeys.ERROR_PRODUCT_NOT_FOUND, HttpStatus.NOT_FOUND),
    CATEGORY_NOT_FOUND(404, MessageKeys.ERROR_CATEGORY_NOT_FOUND, HttpStatus.NOT_FOUND),

    //Code: 401 - Unauthorized
    INVALID_PASSWORD(401, MessageKeys.ERROR_INVALID_PASSWORD, HttpStatus.UNAUTHORIZED),
    INVALID_TOKEN(401, MessageKeys.ERROR_INVALID_TOKEN, HttpStatus.UNAUTHORIZED),
    UNAUTHORIZED(401, MessageKeys.ERROR_UNAUTHORIZED, HttpStatus.UNAUTHORIZED),
    TOKEN_EXPIRED(401, MessageKeys.ERROR_TOKEN_EXPIRED, HttpStatus.UNAUTHORIZED),

    //Code: 500 - Internal Server Error
    INTERNAL_SERVER(500, MessageKeys.ERROR_INTERNAL_SERVER, HttpStatus.INTERNAL_SERVER_ERROR);

    ErrorCode(int code, String messageKey, HttpStatusCode statusCode) {
        this.code = code;
        this.messageKey = messageKey; // Lưu key thay vì message cứng
        this.statusCode = statusCode;
        this.data = null;
    }

    private int code;
    private String messageKey; // Thay đổi từ "message" thành "messageKey"
    private HttpStatusCode statusCode;
    private Object data;
}
