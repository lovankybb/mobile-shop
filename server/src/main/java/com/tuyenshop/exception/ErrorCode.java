package com.tuyenshop.exception;

import org.springframework.http.HttpStatus;
import lombok.Getter;

@Getter
public enum ErrorCode {
    UNCATEGORIZED_EXCEPTION(9999, "Uncategorized error", HttpStatus.INTERNAL_SERVER_ERROR),
    INVALID_KEY(1001, "Uncategorized error", HttpStatus.BAD_REQUEST),
    USER_EXISTED(1002, "User already existed", HttpStatus.BAD_REQUEST),
    USERNAME_INVALID(1003, "Username must be at least 3 characters", HttpStatus.BAD_REQUEST),
    INVALID_PASSWORD(1004, "Password must be at least 8 characters", HttpStatus.BAD_REQUEST),
    USER_NOT_EXISTED(1005, "User not existed", HttpStatus.NOT_FOUND),
    UNAUTHENTICATED(1006, "Unauthenticated", HttpStatus.UNAUTHORIZED),
    UNAUTHORIZED(1007, "You do not have permission", HttpStatus.FORBIDDEN),
    INVALID_CREDENTIALS(1008, "Invalid username or password", HttpStatus.BAD_REQUEST),
    PRODUCT_NOT_FOUND(2001, "Product not found", HttpStatus.NOT_FOUND),
    BRAND_NOT_FOUND(2002, "Brand not found", HttpStatus.NOT_FOUND),
    CATEGORY_NOT_FOUND(2003, "Category not found", HttpStatus.NOT_FOUND),
    COLOR_NOT_FOUND(2004, "Color not found", HttpStatus.NOT_FOUND),
    VERSION_NOT_FOUND(2005, "Version not found", HttpStatus.NOT_FOUND),
    VARIANT_NOT_FOUND(2006, "Product variant not found", HttpStatus.NOT_FOUND),
    ORDER_NOT_FOUND(3001, "Order not found", HttpStatus.NOT_FOUND),
    INSUFFICIENT_STOCK(3002, "Insufficient stock", HttpStatus.BAD_REQUEST),
    REVIEW_EXISTED(4001, "You have already reviewed this product", HttpStatus.BAD_REQUEST),
    NOT_BOUGHT_PRODUCT(4002, "You must buy the product before reviewing", HttpStatus.FORBIDDEN);

    private final int code;
    private final String message;
    private final HttpStatus statusCode;

    ErrorCode(int code, String message, HttpStatus statusCode) {
        this.code = code;
        this.message = message;
        this.statusCode = statusCode;
    }
}
