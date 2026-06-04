package com.tuyenshop.payload.request;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
public class ProductVariantRequest {
    @NotNull
    private Long productId;
    
    @NotNull
    private BigDecimal price;
    
    private Long versionId;
    
    private Long colorId;
    
    private int stock;
}
