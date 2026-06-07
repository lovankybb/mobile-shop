package com.tuyenshop.payload.response;
import lombok.*;
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class BrandResponse {
    private Long id;
    private String name;
    private String logo;
    private String description;
}
