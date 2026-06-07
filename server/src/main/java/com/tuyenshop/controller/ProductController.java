package com.tuyenshop.controller;

import com.tuyenshop.payload.request.ProductCreationRequest;
import com.tuyenshop.payload.response.ApiResponse;
import com.tuyenshop.service.ProductService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    @Autowired
    private ProductService productService;

    @GetMapping
    public ApiResponse<Page<com.tuyenshop.payload.response.ProductResponse>> getProducts(@RequestParam(required = false) String keyword, @RequestParam(required = false) Long categoryId, @RequestParam(required = false) Long brandId, @RequestParam(required = false) BigDecimal minPrice, @RequestParam(required = false) BigDecimal maxPrice, @RequestParam(required = false) Boolean featured, Pageable pageable) {
        return ApiResponse.success(productService.getProductsByFilter(keyword, categoryId, brandId, minPrice, maxPrice, featured, pageable));
    }

    @GetMapping("/{id}")
    public ApiResponse<com.tuyenshop.payload.response.ProductResponse> getProductById(@PathVariable Long id) {
        return ApiResponse.success(productService.getProductById(id));
    }

    @GetMapping("/slug/{slug}")
    public ApiResponse<com.tuyenshop.payload.response.ProductResponse> getProductBySlug(@PathVariable String slug) {
        return ApiResponse.success(productService.getProductBySlug(slug));
    }

    @GetMapping("/detail/{id}")
    public ApiResponse<com.tuyenshop.payload.response.ProductDetailResponse> getProductDetailById(@PathVariable Long id) {
        return ApiResponse.success(productService.getProductDetailById(id));
    }

    @GetMapping("/detail/slug/{slug}")
    public ApiResponse<com.tuyenshop.payload.response.ProductDetailResponse> getProductDetailBySlug(@PathVariable String slug) {
        return ApiResponse.success(productService.getProductDetailBySlug(slug));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<com.tuyenshop.payload.response.ProductResponse> createProduct(@Valid @RequestBody ProductCreationRequest request) {
        return ApiResponse.success(productService.createProduct(request));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<com.tuyenshop.payload.response.ProductResponse> updateProduct(@PathVariable Long id, @Valid @RequestBody ProductCreationRequest request) {
        return ApiResponse.success(productService.updateProduct(id, request));
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<com.tuyenshop.payload.response.ProductResponse> updateProductStatus(@PathVariable Long id, @RequestParam com.tuyenshop.model.ProductStatus status) {
        return ApiResponse.success(productService.updateProductStatus(id, status));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<Void> deleteProduct(@PathVariable Long id) {
        productService.deleteProduct(id);
        return ApiResponse.success("Product deleted successfully");
    }
}
