package com.example.HomeShop.exception;

import com.example.HomeShop.dto.ApiResponse;
import com.example.HomeShop.dto.RegisterDTO; // unused but keeping safe
import com.example.HomeShop.exception.AppException;
import com.example.HomeShop.exception.ErrorCode;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiResponse<Map<String, String>>> handleValidationExceptions(
            MethodArgumentNotValidException ex) {
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getAllErrors().forEach((error) -> {
            String fieldName = ((FieldError) error).getField();
            String errorMessage = error.getDefaultMessage();
            errors.put(fieldName, errorMessage);
        });

        ApiResponse<Map<String, String>> apiResponse = new ApiResponse<>();
        apiResponse.setCode(ErrorCode.INVALID_KEY.getCode());
        apiResponse.setMessage(ErrorCode.INVALID_KEY.getMessage());
        apiResponse.setData(errors);

        return ResponseEntity.badRequest().body(apiResponse);
    }

    @ExceptionHandler(AppException.class)
    public ResponseEntity<ApiResponse<String>> handleAppException(AppException ex) {
        ErrorCode errorCode = ex.getErrorCode();
        ApiResponse<String> apiResponse = new ApiResponse<>();
        apiResponse.setCode(errorCode.getCode());
        apiResponse.setMessage(errorCode.getMessage());
        return ResponseEntity.status(errorCode.getStatusCode()).body(apiResponse);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse<String>> handleException(Exception ex) {
        ApiResponse<String> apiResponse = new ApiResponse<>();
        apiResponse.setCode(ErrorCode.UNCATEGORIZED_EXCEPTION.getCode());
        apiResponse.setMessage(ErrorCode.UNCATEGORIZED_EXCEPTION.getMessage());
        apiResponse.setData(ex.getMessage());
        return ResponseEntity.internalServerError().body(apiResponse);
    }
}
