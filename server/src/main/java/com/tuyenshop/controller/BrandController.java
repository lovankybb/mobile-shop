package com.tuyenshop.controller;

import com.tuyenshop.model.Brand;
import com.tuyenshop.payload.response.ApiResponse;
import com.tuyenshop.service.BrandService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/brands")
public class BrandController {

    @Autowired
    private BrandService brandService;

    @GetMapping
    public ApiResponse<List<com.tuyenshop.payload.response.BrandResponse>> getAllBrands() {
        return ApiResponse.success(brandService.getAllBrands());
    }

    @GetMapping("/{id}")
    public ApiResponse<com.tuyenshop.payload.response.BrandResponse> getBrandById(@PathVariable Long id) {
        return ApiResponse.success(brandService.getBrandById(id));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<com.tuyenshop.payload.response.BrandResponse> createBrand(@RequestBody Brand brand) {
        return ApiResponse.success(brandService.createBrand(brand));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<com.tuyenshop.payload.response.BrandResponse> updateBrand(@PathVariable Long id, @RequestBody Brand brand) {
        return ApiResponse.success(brandService.updateBrand(id, brand));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<Void> deleteBrand(@PathVariable Long id) {
        brandService.deleteBrand(id);
        return ApiResponse.success("Brand deleted successfully");
    }
}
