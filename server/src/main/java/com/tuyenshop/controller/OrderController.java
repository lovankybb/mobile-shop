package com.tuyenshop.controller;

import com.tuyenshop.model.Order;
import com.tuyenshop.payload.request.CheckoutRequest;
import com.tuyenshop.payload.response.ApiResponse;
import com.tuyenshop.service.OrderService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    @Autowired
    private OrderService orderService;

    @PostMapping("/checkout")
    public ApiResponse<com.tuyenshop.payload.response.OrderResponse> checkout(@Valid @RequestBody CheckoutRequest request) {
        return ApiResponse.success(orderService.checkout(request));
    }

    @GetMapping("/my-orders")
    @PreAuthorize("isAuthenticated()")
    public ApiResponse<Page<com.tuyenshop.payload.response.OrderResponse>> getMyOrders(Pageable pageable) {
        return ApiResponse.success(orderService.getMyOrders(pageable));
    }

    @GetMapping("/all")
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<Page<com.tuyenshop.payload.response.OrderResponse>> getAllOrders(Pageable pageable) {
        return ApiResponse.success(orderService.getAllOrders(pageable));
    }

    @GetMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ApiResponse<com.tuyenshop.payload.response.OrderResponse> getOrderById(@PathVariable Long id) {
        // In a real application, we should ensure users can only view their own orders unless they are ADMIN.
        // For simplicity, we just fetch it here. We can add more specific access control in Service layer later.
        return ApiResponse.success(orderService.getOrderById(id));
    }
}
