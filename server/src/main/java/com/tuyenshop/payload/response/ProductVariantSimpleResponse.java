package com.tuyenshop.payload.response;

import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductVariantSimpleResponse {
    private Long id;
    private BigDecimal price;
    private int stock;
    
    private Long versionId;
    private String versionName;
    private Long colorId;
    private String colorName;
}
