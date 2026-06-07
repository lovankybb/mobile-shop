package com.tuyenshop.payload.response;

import lombok.*;

import java.math.BigDecimal;
import java.time.ZonedDateTime;
import java.util.List;
import java.util.Set;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductResponse {
    private Long id;
    private String name;
    private BigDecimal price;
    private BigDecimal salePrice;
    private String description;
    private String status;
    private String slug;
    private ZonedDateTime createdAt;
    private ZonedDateTime updatedAt;
    private String image;
    
    // Add these fields later if we have BrandResponse and CategoryResponse
    private Long brandId;
    private String brandName;
    private Long categoryId;
    private String categoryName;
    
    private Boolean featured;

    }
