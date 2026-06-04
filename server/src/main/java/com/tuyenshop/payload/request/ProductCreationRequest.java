package com.tuyenshop.payload.request;

import com.tuyenshop.model.ProductStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
public class ProductCreationRequest {
    @NotBlank
    private String name;
    
    @NotNull
    private BigDecimal price;
    
    private BigDecimal salePrice;
    
    private String description;
    
    private Long brandId;
    
    private Long categoryId;
    
    private ProductStatus status;
    
    private String slug;
}
