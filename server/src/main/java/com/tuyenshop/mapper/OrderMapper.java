package com.tuyenshop.mapper;
import com.tuyenshop.model.Order;
import com.tuyenshop.model.OrderDetail;
import com.tuyenshop.payload.response.OrderResponse;
import com.tuyenshop.payload.response.OrderDetailResponse;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring", uses = {ProductVariantMapper.class})
public interface OrderMapper {
    @Mapping(source = "user.id", target = "userId")
    OrderResponse toResponse(Order order);
    
    @Mapping(source = "productVariant", target = "productVariant")
    OrderDetailResponse toResponse(OrderDetail detail);
}