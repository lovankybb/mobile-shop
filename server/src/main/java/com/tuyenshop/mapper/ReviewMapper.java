package com.tuyenshop.mapper;

import com.tuyenshop.model.Review;
import com.tuyenshop.payload.response.ReviewResponse;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface ReviewMapper {

    @Mapping(source = "user.id", target = "userId")
    @Mapping(source = "user.username", target = "username")
    @Mapping(source = "user.avatarUrl", target = "avatarUrl")
    @Mapping(source = "product.id", target = "productId")
    ReviewResponse toResponse(Review review);
}
