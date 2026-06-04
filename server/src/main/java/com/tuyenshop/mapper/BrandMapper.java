package com.tuyenshop.mapper;
import com.tuyenshop.model.Brand;
import com.tuyenshop.payload.response.BrandResponse;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface BrandMapper {
    BrandResponse toResponse(Brand brand);
}