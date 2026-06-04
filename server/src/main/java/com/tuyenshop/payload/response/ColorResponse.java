package com.tuyenshop.payload.response;
import lombok.*;
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class ColorResponse {
    private Long id;
    private String name;
    private String hex;
    }
