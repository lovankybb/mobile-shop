package com.tuyenshop.mapper;
import com.tuyenshop.model.ProductVersion;
import com.tuyenshop.payload.response.ProductVersionResponse;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface ProductVersionMapper {
    ProductVersionResponse toResponse(ProductVersion version);
}