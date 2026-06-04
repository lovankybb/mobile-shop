package com.tuyenshop.controller;

import com.tuyenshop.payload.request.CartItemRequest;
import com.tuyenshop.payload.response.ApiResponse;
import com.tuyenshop.payload.response.CartResponse;
import com.tuyenshop.service.CartService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cart")
public class CartController {

    @Autowired
    private CartService cartService;

    @GetMapping
    @PreAuthorize("isAuthenticated()")
    public ApiResponse<CartResponse> getMyCart() {
        return ApiResponse.success(cartService.getMyCart());
    }

    @PostMapping("/items")
    @PreAuthorize("isAuthenticated()")
    public ApiResponse<CartResponse> addToCart(@Valid @RequestBody CartItemRequest request) {
        return ApiResponse.success(cartService.addToCart(request));
    }

    @PutMapping("/items/{itemId}")
    @PreAuthorize("isAuthenticated()")
    public ApiResponse<CartResponse> updateCartItem(@PathVariable Long itemId, @Valid @RequestBody CartItemRequest request) {
        return ApiResponse.success(cartService.updateCartItem(itemId, request));
    }

    @DeleteMapping("/items/{itemId}")
    @PreAuthorize("isAuthenticated()")
    public ApiResponse<CartResponse> removeFromCart(@PathVariable Long itemId) {
        return ApiResponse.success(cartService.removeFromCart(itemId));
    }

    @DeleteMapping
    @PreAuthorize("isAuthenticated()")
    public ApiResponse<CartResponse> clearCart() {
        return ApiResponse.success(cartService.clearCart());
    }
}
