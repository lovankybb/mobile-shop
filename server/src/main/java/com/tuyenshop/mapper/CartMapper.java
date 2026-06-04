package com.tuyenshop.mapper;

import com.tuyenshop.model.Cart;
import com.tuyenshop.model.CartItem;
import com.tuyenshop.payload.response.CartItemResponse;
import com.tuyenshop.payload.response.CartResponse;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;

import java.math.BigDecimal;
import java.util.stream.Collectors;

@Mapper(componentModel = "spring")
public interface CartMapper {

    @Mapping(target = "items", ignore = true)
    @Mapping(target = "totalAmount", ignore = true)
    CartResponse toResponse(Cart cart);

    @Mapping(source = "productVariant.id", target = "variantId")
    @Mapping(source = "productVariant.product.name", target = "productName")
    @Mapping(source = "productVariant.color.name", target = "colorName")
    @Mapping(source = "productVariant.version.name", target = "versionName")
    @Mapping(source = "productVariant.price", target = "price")
    @Mapping(target = "productImage", expression = "java(getFirstImageUrl(item))")
    @Mapping(target = "subTotal", expression = "java(calculateSubTotal(item))")
    CartItemResponse toItemResponse(CartItem item);

    default String getFirstImageUrl(CartItem item) {
        if (item.getProductVariant() != null && 
            item.getProductVariant().getProduct() != null && 
            item.getProductVariant().getProduct().getImages() != null && 
            !item.getProductVariant().getProduct().getImages().isEmpty()) {
            return item.getProductVariant().getProduct().getImages().get(0).getUrl();
        }
        return null;
    }

    default BigDecimal calculateSubTotal(CartItem item) {
        if (item.getProductVariant() != null && item.getProductVariant().getPrice() != null) {
            return item.getProductVariant().getPrice().multiply(BigDecimal.valueOf(item.getQuantity()));
        }
        return BigDecimal.ZERO;
    }
}
