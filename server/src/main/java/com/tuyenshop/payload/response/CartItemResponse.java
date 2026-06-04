package com.tuyenshop.payload.response;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
@Builder
public class CartItemResponse {
    private Long id;
    private Long variantId;
    private String productName;
    private String productImage;
    private String colorName;
    private String versionName;
    private BigDecimal price;
    private int quantity;
    private BigDecimal subTotal;
}
