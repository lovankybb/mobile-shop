package com.tuyenshop.mapper;
import com.tuyenshop.model.Category;
import com.tuyenshop.payload.response.CategoryResponse;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface CategoryMapper {
    CategoryResponse toResponse(Category category);
}