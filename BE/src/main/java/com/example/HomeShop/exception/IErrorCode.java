package com.example.HomeShop.exception;

import org.springframework.http.HttpStatusCode;

public interface IErrorCode {
    int getCode();

    String getMessage();

    HttpStatusCode getStatusCode();

    Object getData();
}
