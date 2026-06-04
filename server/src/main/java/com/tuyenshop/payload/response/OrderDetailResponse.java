package com.tuyenshop.payload.response;
import lombok.*;
import java.math.BigDecimal;
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class OrderDetailResponse {
    private Long id;
    private ProductVariantResponse productVariant;
    private BigDecimal price;
    private int quantity;
    }
