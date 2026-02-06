package com.example.HomeShop.exception.Utils.Enums;

public class Constant {

    public enum ProductStatus {
        ACTIVE,      // 4 usages
        INACTIVE,    // 1 usage
        OUT_OF_STOCK // 4 usages
    }

    public enum OrderStatus {
        PENDING,
        PROCESSING,
        SHIPPED,
        DELIVERED,
        CANCELLED
    }

    public enum UserRole {
        ADMIN,
        USER,
        MODERATOR
    }
}

