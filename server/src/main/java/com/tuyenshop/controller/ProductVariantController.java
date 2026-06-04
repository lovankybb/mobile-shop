package com.tuyenshop.controller;

import com.tuyenshop.model.ProductVariant;
import com.tuyenshop.payload.request.ProductVariantRequest;
import com.tuyenshop.payload.response.ApiResponse;
import com.tuyenshop.payload.response.ProductVariantResponse;
import com.tuyenshop.service.ProductVariantService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/variants")
public class ProductVariantController {

    @Autowired
    private ProductVariantService variantService;

    @GetMapping("/product/{productId}")
    public ApiResponse<List<ProductVariantResponse>> getVariantsByProductId(@PathVariable Long productId) {
        List<ProductVariantResponse> responses = variantService.getVariantsByProductId(productId).stream()
                
                .collect(Collectors.toList());
        return ApiResponse.success(responses);
    }

    @GetMapping("/{id}")
    public ApiResponse<ProductVariantResponse> getVariantById(@PathVariable Long id) {
        return ApiResponse.success(variantService.getVariantById(id));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<ProductVariantResponse> createVariant(@Valid @RequestBody ProductVariantRequest request) {
        return ApiResponse.success(variantService.createVariant(request));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<ProductVariantResponse> updateVariant(@PathVariable Long id, @Valid @RequestBody ProductVariantRequest request) {
        return ApiResponse.success(variantService.updateVariant(id, request));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<Void> deleteVariant(@PathVariable Long id) {
        variantService.deleteVariant(id);
        return ApiResponse.success("Product variant deleted successfully");
    }
}
