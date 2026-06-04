package com.tuyenshop.payload.response;
import lombok.*;
import java.time.ZonedDateTime;
import java.util.Set;
import java.util.stream.Collectors;
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class UserResponse {
    private Long id;
    private String username;
    private String email;
    private String phone;
    private String address;
    private String avatarUrl;
    private ZonedDateTime createdAt;
    private ZonedDateTime updatedAt;
    private Set<String> roles;
    }
