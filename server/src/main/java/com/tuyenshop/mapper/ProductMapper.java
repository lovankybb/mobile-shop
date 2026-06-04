package com.tuyenshop.mapper;
import com.tuyenshop.model.Product;
import com.tuyenshop.payload.response.ProductResponse;
import com.tuyenshop.payload.response.ProductDetailResponse;
import com.tuyenshop.payload.response.ProductVariantSimpleResponse;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface ProductMapper {
    @Mapping(source = "brand.id", target = "brandId")
    @Mapping(source = "brand.name", target = "brandName")
    @Mapping(source = "category.id", target = "categoryId")
    @Mapping(source = "category.name", target = "categoryName")
    @Mapping(target = "image", ignore = true)
    ProductResponse toResponse(Product product);

    @Mapping(source = "brand.id", target = "brandId")
    @Mapping(source = "brand.name", target = "brandName")
    @Mapping(source = "category.id", target = "categoryId")
    @Mapping(source = "category.name", target = "categoryName")
    @Mapping(target = "images", ignore = true)
    @Mapping(target = "variants", ignore = true)
    @Mapping(target = "averageRating", ignore = true)
    @Mapping(target = "reviewCount", ignore = true)
    ProductDetailResponse toDetailResponse(Product product);

    @Mapping(source = "version.id", target = "versionId")
    @Mapping(source = "version.name", target = "versionName")
    @Mapping(source = "color.id", target = "colorId")
    @Mapping(source = "color.name", target = "colorName")
    ProductVariantSimpleResponse toVariantSimpleResponse(com.tuyenshop.model.ProductVariant variant);
}