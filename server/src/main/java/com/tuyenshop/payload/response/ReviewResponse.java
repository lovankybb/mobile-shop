package com.tuyenshop.payload.response;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.time.ZonedDateTime;

@Getter
@Setter
@Builder
public class ReviewResponse {
    private Long id;
    private int rating;
    private String comment;
    private Long userId;
    private String username;
    private String avatarUrl;
    private Long productId;
    private ZonedDateTime createdAt;
}
