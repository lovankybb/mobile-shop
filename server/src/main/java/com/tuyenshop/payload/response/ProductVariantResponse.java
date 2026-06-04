package com.tuyenshop.payload.response;

import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductVariantResponse {
    private Long id;
    private BigDecimal price;
    private int stock;
    
    // relationships
    private ProductResponse product;
    
    // just names or ids for other relationships for now
    private Long versionId;
    private String versionName;
    private Long colorId;
    private String colorName;

    }
