package com.tuyenshop.controller;

import com.tuyenshop.model.Color;
import com.tuyenshop.payload.response.ApiResponse;
import com.tuyenshop.service.ColorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/colors")
public class ColorController {

    @Autowired
    private ColorService colorService;

    @GetMapping
    public ApiResponse<List<com.tuyenshop.payload.response.ColorResponse>> getAllColors() {
        return ApiResponse.success(colorService.getAllColors());
    }

    @GetMapping("/{id}")
    public ApiResponse<com.tuyenshop.payload.response.ColorResponse> getColorById(@PathVariable Long id) {
        return ApiResponse.success(colorService.getColorById(id));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<com.tuyenshop.payload.response.ColorResponse> createColor(@RequestBody Color color) {
        return ApiResponse.success(colorService.createColor(color));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<com.tuyenshop.payload.response.ColorResponse> updateColor(@PathVariable Long id, @RequestBody Color color) {
        return ApiResponse.success(colorService.updateColor(id, color));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<Void> deleteColor(@PathVariable Long id) {
        colorService.deleteColor(id);
        return ApiResponse.success("Color deleted successfully");
    }
}
