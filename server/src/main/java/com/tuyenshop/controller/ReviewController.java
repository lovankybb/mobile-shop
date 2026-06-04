package com.tuyenshop.controller;

import com.tuyenshop.payload.request.ReviewRequest;
import com.tuyenshop.payload.response.ApiResponse;
import com.tuyenshop.payload.response.ReviewResponse;
import com.tuyenshop.service.ReviewService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/reviews")
public class ReviewController {

    @Autowired
    private ReviewService reviewService;

    @GetMapping("/product/{productId}")
    public ApiResponse<Page<ReviewResponse>> getProductReviews(@PathVariable Long productId, Pageable pageable) {
        return ApiResponse.success(reviewService.getProductReviews(productId, pageable));
    }

    @PostMapping
    @PreAuthorize("isAuthenticated()")
    public ApiResponse<ReviewResponse> postReview(@Valid @RequestBody ReviewRequest request) {
        return ApiResponse.success(reviewService.postReview(request));
    }
}
