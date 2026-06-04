import os

mapper_dir = "src/main/java/com/tuyenshop/mapper"
os.makedirs(mapper_dir, exist_ok=True)

if os.path.exists(os.path.join(mapper_dir, "AppMapper.java")):
    os.remove(os.path.join(mapper_dir, "AppMapper.java"))

mappers = {
    "BrandMapper.java": """package com.tuyenshop.mapper;
import com.tuyenshop.model.Brand;
import com.tuyenshop.payload.response.BrandResponse;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface BrandMapper {
    BrandResponse toResponse(Brand brand);
}""",
    
    "CategoryMapper.java": """package com.tuyenshop.mapper;
import com.tuyenshop.model.Category;
import com.tuyenshop.payload.response.CategoryResponse;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface CategoryMapper {
    CategoryResponse toResponse(Category category);
}""",
    
    "ColorMapper.java": """package com.tuyenshop.mapper;
import com.tuyenshop.model.Color;
import com.tuyenshop.payload.response.ColorResponse;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface ColorMapper {
    ColorResponse toResponse(Color color);
}""",
    
    "ProductVersionMapper.java": """package com.tuyenshop.mapper;
import com.tuyenshop.model.ProductVersion;
import com.tuyenshop.payload.response.ProductVersionResponse;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface ProductVersionMapper {
    ProductVersionResponse toResponse(ProductVersion version);
}""",
    
    "UserMapper.java": """package com.tuyenshop.mapper;
import com.tuyenshop.model.Role;
import com.tuyenshop.model.User;
import com.tuyenshop.payload.response.UserResponse;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface UserMapper {
    UserResponse toResponse(User user);
    
    default String roleToString(Role role) {
        return role != null ? role.getName() : null;
    }
}""",

    "ProductVariantMapper.java": """package com.tuyenshop.mapper;
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
}""",

    "ProductMapper.java": """package com.tuyenshop.mapper;
import com.tuyenshop.model.Product;
import com.tuyenshop.payload.response.ProductResponse;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface ProductMapper {
    @Mapping(source = "brand.id", target = "brandId")
    @Mapping(source = "brand.name", target = "brandName")
    @Mapping(source = "category.id", target = "categoryId")
    @Mapping(source = "category.name", target = "categoryName")
    ProductResponse toResponse(Product product);
}""",

    "OrderMapper.java": """package com.tuyenshop.mapper;
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
}"""
}

for filename, content in mappers.items():
    with open(os.path.join(mapper_dir, filename), 'w') as f:
        f.write(content)
        
