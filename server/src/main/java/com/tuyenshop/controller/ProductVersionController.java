package com.tuyenshop.controller;

import com.tuyenshop.model.ProductVersion;
import com.tuyenshop.payload.response.ApiResponse;
import com.tuyenshop.payload.response.ProductVersionResponse;
import com.tuyenshop.service.ProductVersionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/versions")
public class ProductVersionController {

    @Autowired
    private ProductVersionService versionService;

    @GetMapping
    public ApiResponse<List<ProductVersionResponse>> getAllVersions() {
        return ApiResponse.success(versionService.getAllVersions());
    }

    @GetMapping("/{id}")
    public ApiResponse<ProductVersionResponse> getVersionById(@PathVariable Long id) {
        return ApiResponse.success(versionService.getVersionById(id));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<ProductVersionResponse> createVersion(@RequestBody ProductVersion version) {
        return ApiResponse.success(versionService.createVersion(version));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<ProductVersionResponse> updateVersion(@PathVariable Long id, @RequestBody ProductVersion version) {
        return ApiResponse.success(versionService.updateVersion(id, version));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<Void> deleteVersion(@PathVariable Long id) {
        versionService.deleteVersion(id);
        return ApiResponse.success("Version deleted successfully");
    }
}
