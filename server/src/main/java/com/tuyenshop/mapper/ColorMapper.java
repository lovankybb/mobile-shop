package com.tuyenshop.mapper;
import com.tuyenshop.model.Color;
import com.tuyenshop.payload.response.ColorResponse;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface ColorMapper {
    ColorResponse toResponse(Color color);
}