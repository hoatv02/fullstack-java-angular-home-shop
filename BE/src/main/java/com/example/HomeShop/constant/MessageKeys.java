package com.example.HomeShop.constant;

/**
 * Message keys for i18n ResourceBundle
 * Chứa tất cả key của messages trong file .properties
 */
public class MessageKeys {

    // ===================================
    // ERROR MESSAGE KEYS
    // ===================================

    // Uncategorized
    public static final String ERROR_UNCATEGORIZED = "error.uncategorized";
    public static final String ERROR_INVALID_KEY = "error.invalid-key";

    // User Errors
    public static final String ERROR_USER_EXISTED = "error.user-existed";
    public static final String ERROR_USERNAME_INVALID = "error.username-invalid";
    public static final String ERROR_PASSWORD_INVALID = "error.password-invalid";
    public static final String ERROR_EMAIL_EXISTED = "error.email-existed";
    public static final String ERROR_USER_NOT_FOUND = "error.user-not-found";

    // Authentication Errors
    public static final String ERROR_INVALID_PASSWORD = "error.invalid-password";
    public static final String ERROR_INVALID_TOKEN = "error.invalid-token";
    public static final String ERROR_UNAUTHORIZED = "error.unauthorized";
    public static final String ERROR_TOKEN_EXPIRED = "error.token-expired";

    // Product Errors
    public static final String ERROR_PRODUCT_NOT_FOUND = "error.product-not-found";
    public static final String ERROR_PRODUCT_NAME_EXISTED = "error.product-name-existed";
    public static final String ERROR_INVALID_PRODUCT_DATA = "error.invalid-product-data";

    // Category Errors
    public static final String ERROR_CATEGORY_NOT_FOUND = "error.category-not-found";
    public static final String ERROR_CATEGORY_NAME_EXISTED = "error.category-name-existed";
    public static final String ERROR_INVALID_CATEGORY_DATA = "error.invalid-category-data";

    // General Resource Errors
    public static final String ERROR_DUPLICATE_RESOURCE = "error.duplicate-resource";

    // Server Errors
    public static final String ERROR_INTERNAL_SERVER = "error.internal-server";

    // ===================================
    // SUCCESS MESSAGE KEYS
    // ===================================

    // Category Success Messages
    public static final String SUCCESS_CATEGORY_GET_ALL = "success.category-get-all";
    public static final String SUCCESS_CATEGORY_GET_BY_ID = "success.category-get-by-id";
    public static final String SUCCESS_CATEGORY_CREATED = "success.category-created";
    public static final String SUCCESS_CATEGORY_UPDATED = "success.category-updated";
    public static final String SUCCESS_CATEGORY_DELETED = "success.category-deleted";

    // Product Success Messages
    public static final String SUCCESS_PRODUCT_GET_ALL = "success.product-get-all";
    public static final String SUCCESS_PRODUCT_GET_BY_ID = "success.product-get-by-id";
    public static final String SUCCESS_PRODUCT_CREATED = "success.product-created";
    public static final String SUCCESS_PRODUCT_UPDATED = "success.product-updated";
    public static final String SUCCESS_PRODUCT_DELETED = "success.product-deleted";
    public static final String SUCCESS_PRODUCT_DEACTIVATED = "success.product-deactivated";
    public static final String SUCCESS_PRODUCT_QUANTITY_UPDATED = "success.product-quantity-updated";
    public static final String SUCCESS_PRODUCT_SEARCH = "success.product-search";
    public static final String SUCCESS_PRODUCT_SEARCH_ADVANCED = "success.product-search-advanced";
    public static final String SUCCESS_PRODUCT_BY_CATEGORY = "success.product-by-category";
    public static final String SUCCESS_PRODUCT_BY_STATUS = "success.product-by-status";

    private MessageKeys() {
        // Private constructor to prevent instantiation
    }
}