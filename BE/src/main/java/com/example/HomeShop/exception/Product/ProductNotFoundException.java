package com.example.HomeShop.exception.Product;

public class ProductNotFoundException extends RuntimeException {
    public ProductNotFoundException(String message) {
        super(message);
    }

    public ProductNotFoundException(Long id) {
        super("Không tìm thấy sản phẩm với ID: " + id);
    }
}
