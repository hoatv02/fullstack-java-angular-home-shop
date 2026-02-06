package com.example.HomeShop.exception;

import com.example.HomeShop.dto.ApiResponse;
import com.example.HomeShop.exception.Category.CategoryNotFoundException;
import com.example.HomeShop.exception.Product.ProductNotFoundException;
import com.example.HomeShop.exception.Utils.DuplicateResourceException;
import com.example.HomeShop.service.MessageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
@RequiredArgsConstructor
public class GlobalExceptionHandler {
    private final MessageService messageService;

    // Xử lý validation errors
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
        apiResponse.setMessage(messageService.getMessage(ErrorCode.INVALID_KEY.getMessageKey()));
        apiResponse.setData(errors);

        return ResponseEntity.badRequest().body(apiResponse);
    }

    // Xử lý ProductNotFoundException
    @ExceptionHandler(ProductNotFoundException.class)
    public ResponseEntity<ApiResponse<String>> handleProductNotFoundException(ProductNotFoundException ex) {
        ApiResponse<String> apiResponse = new ApiResponse<>();
        apiResponse.setCode(ErrorCode.PRODUCT_NOT_FOUND.getCode());
        apiResponse.setMessage(messageService.getMessage(ErrorCode.PRODUCT_NOT_FOUND.getMessageKey()));
        return ResponseEntity.status(ErrorCode.PRODUCT_NOT_FOUND.getStatusCode()).body(apiResponse);
    }

    // Xử lý CategoryNotFoundException
    @ExceptionHandler(CategoryNotFoundException.class)
    public ResponseEntity<ApiResponse<String>> handleCategoryNotFoundException(CategoryNotFoundException ex) {
        ApiResponse<String> apiResponse = new ApiResponse<>();
        apiResponse.setCode(ErrorCode.CATEGORY_NOT_FOUND.getCode());
        apiResponse.setMessage(messageService.getMessage(ErrorCode.CATEGORY_NOT_FOUND.getMessageKey()));
        return ResponseEntity.status(ErrorCode.CATEGORY_NOT_FOUND.getStatusCode()).body(apiResponse);
    }

    // Xử lý DuplicateResourceException
    @ExceptionHandler(DuplicateResourceException.class)
    public ResponseEntity<ApiResponse<String>> handleDuplicateResourceException(DuplicateResourceException ex) {
        ApiResponse<String> apiResponse = new ApiResponse<>();
        apiResponse.setCode(ErrorCode.DUPLICATE_RESOURCE.getCode());
        apiResponse.setMessage(messageService.getMessage(ErrorCode.DUPLICATE_RESOURCE.getMessageKey()));
        return ResponseEntity.status(ErrorCode.DUPLICATE_RESOURCE.getStatusCode()).body(apiResponse);
    }

    // Xử lý AppException
    @ExceptionHandler(AppException.class)
    public ResponseEntity<ApiResponse<String>> handleAppException(AppException ex) {
        ErrorCode errorCode = ex.getErrorCode();
        ApiResponse<String> apiResponse = new ApiResponse<>();
        apiResponse.setCode(errorCode.getCode());
        apiResponse.setMessage(messageService.getMessage(errorCode.getMessageKey()));
        return ResponseEntity.status(errorCode.getStatusCode()).body(apiResponse);
    }

    // Xử lý IllegalArgumentException
    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ApiResponse<String>> handleIllegalArgumentException(IllegalArgumentException ex) {
        ApiResponse<String> apiResponse = new ApiResponse<>();
        apiResponse.setCode(ErrorCode.INVALID_KEY.getCode());
        apiResponse.setMessage(messageService.getMessage(ErrorCode.INVALID_KEY.getMessageKey()));
        return ResponseEntity.badRequest().body(apiResponse);
    }

    // Xử lý tất cả Exception khác
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse<String>> handleException(Exception ex) {
        ApiResponse<String> apiResponse = new ApiResponse<>();
        apiResponse.setCode(ErrorCode.UNCATEGORIZED_EXCEPTION.getCode());
        apiResponse.setMessage(messageService.getMessage(ErrorCode.UNCATEGORIZED_EXCEPTION.getMessageKey()));
        apiResponse.setData(ex.getMessage());
        return ResponseEntity.internalServerError().body(apiResponse);
    }
}
