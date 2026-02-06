package com.example.HomeShop.exception.Category;

public class CategoryNotFoundException extends RuntimeException {
    public CategoryNotFoundException(String message) {
        super(message);
    }

    public CategoryNotFoundException(Long id) {
        super("Không tìm thấy danh mục với ID: " + id);
    }
}
