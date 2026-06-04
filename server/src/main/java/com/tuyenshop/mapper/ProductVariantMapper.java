package com.tuyenshop.mapper;
import com.tuyenshop.model.ProductVariant;
import com.tuyenshop.payload.response.ProductVariantResponse;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring", uses = {ProductMapper.class})
public interface ProductVariantMapper {
    @Mapping(source = "version.id", target = "versionId")
    @Mapping(source = "version.name", target = "versionName")
    @Mapping(source = "color.id", target = "colorId")
    @Mapping(source = "color.name", target = "colorName")
    ProductVariantResponse toResponse(ProductVariant variant);
}