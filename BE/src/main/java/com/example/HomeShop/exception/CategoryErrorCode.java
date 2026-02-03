package com.example.HomeShop.exception;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;

@Getter
@RequiredArgsConstructor
public enum CategoryErrorCode implements IErrorCode {

    CATEGORY_NAME_EXISTED(
            2001,
            "Tên danh mục đã tồn tại",
            HttpStatus.BAD_REQUEST
    ),

    CATEGORY_SLUG_EXISTED(
            2002,
            "Slug danh mục đã tồn tại",
            HttpStatus.BAD_REQUEST
    ),

    CATEGORY_NOT_FOUND(
            2003,
            "Không tìm thấy danh mục",
            HttpStatus.NOT_FOUND
    ),

    CATEGORY_PARENT_NOT_FOUND(
            2004,
            "Không tìm thấy danh mục cha",
            HttpStatus.BAD_REQUEST
    ),

    CATEGORY_INVALID(
            2005,
            "Thông tin danh mục không hợp lệ",
            HttpStatus.BAD_REQUEST
    );
    private final int code;
    private final String message;
    private final HttpStatusCode statusCode;
    private final Object data = null;
}