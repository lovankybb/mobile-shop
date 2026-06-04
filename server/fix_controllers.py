import os
import re

controllers_dir = "src/main/java/com/tuyenshop/controller"

replacements = {
    "BrandController.java": [
        (r"ApiResponse<List<Brand>>", r"ApiResponse<List<com.tuyenshop.payload.response.BrandResponse>>"),
        (r"\.result\(brandService\.getAllBrands\(\)\)", r".result(brandService.getAllBrands().stream().map(com.tuyenshop.payload.response.BrandResponse::fromEntity).collect(java.util.stream.Collectors.toList()))"),
        (r"ApiResponse<Brand>", r"ApiResponse<com.tuyenshop.payload.response.BrandResponse>"),
        (r"\.result\(brandService\.getBrandById\((.*?)\)\)", r".result(com.tuyenshop.payload.response.BrandResponse.fromEntity(brandService.getBrandById(\1)))"),
        (r"\.result\(brandService\.createBrand\((.*?)\)\)", r".result(com.tuyenshop.payload.response.BrandResponse.fromEntity(brandService.createBrand(\1)))"),
        (r"\.result\(brandService\.updateBrand\((.*?)\)\)", r".result(com.tuyenshop.payload.response.BrandResponse.fromEntity(brandService.updateBrand(\1)))")
    ],
    "CategoryController.java": [
        (r"ApiResponse<List<Category>>", r"ApiResponse<List<com.tuyenshop.payload.response.CategoryResponse>>"),
        (r"\.result\(categoryService\.getAllCategories\(\)\)", r".result(categoryService.getAllCategories().stream().map(com.tuyenshop.payload.response.CategoryResponse::fromEntity).collect(java.util.stream.Collectors.toList()))"),
        (r"ApiResponse<Category>", r"ApiResponse<com.tuyenshop.payload.response.CategoryResponse>"),
        (r"\.result\(categoryService\.getCategoryById\((.*?)\)\)", r".result(com.tuyenshop.payload.response.CategoryResponse.fromEntity(categoryService.getCategoryById(\1)))"),
        (r"\.result\(categoryService\.createCategory\((.*?)\)\)", r".result(com.tuyenshop.payload.response.CategoryResponse.fromEntity(categoryService.createCategory(\1)))"),
        (r"\.result\(categoryService\.updateCategory\((.*?)\)\)", r".result(com.tuyenshop.payload.response.CategoryResponse.fromEntity(categoryService.updateCategory(\1)))")
    ],
    "ColorController.java": [
        (r"ApiResponse<List<Color>>", r"ApiResponse<List<com.tuyenshop.payload.response.ColorResponse>>"),
        (r"\.result\(colorService\.getAllColors\(\)\)", r".result(colorService.getAllColors().stream().map(com.tuyenshop.payload.response.ColorResponse::fromEntity).collect(java.util.stream.Collectors.toList()))"),
        (r"ApiResponse<Color>", r"ApiResponse<com.tuyenshop.payload.response.ColorResponse>"),
        (r"\.result\(colorService\.getColorById\((.*?)\)\)", r".result(com.tuyenshop.payload.response.ColorResponse.fromEntity(colorService.getColorById(\1)))"),
        (r"\.result\(colorService\.createColor\((.*?)\)\)", r".result(com.tuyenshop.payload.response.ColorResponse.fromEntity(colorService.createColor(\1)))"),
        (r"\.result\(colorService\.updateColor\((.*?)\)\)", r".result(com.tuyenshop.payload.response.ColorResponse.fromEntity(colorService.updateColor(\1)))")
    ],
    "ProductVersionController.java": [
        (r"ApiResponse<List<ProductVersion>>", r"ApiResponse<List<com.tuyenshop.payload.response.ProductVersionResponse>>"),
        (r"\.result\(versionService\.getAllVersions\(\)\)", r".result(versionService.getAllVersions().stream().map(com.tuyenshop.payload.response.ProductVersionResponse::fromEntity).collect(java.util.stream.Collectors.toList()))"),
        (r"ApiResponse<ProductVersion>", r"ApiResponse<com.tuyenshop.payload.response.ProductVersionResponse>"),
        (r"\.result\(versionService\.getVersionById\((.*?)\)\)", r".result(com.tuyenshop.payload.response.ProductVersionResponse.fromEntity(versionService.getVersionById(\1)))"),
        (r"\.result\(versionService\.createVersion\((.*?)\)\)", r".result(com.tuyenshop.payload.response.ProductVersionResponse.fromEntity(versionService.createVersion(\1)))"),
        (r"\.result\(versionService\.updateVersion\((.*?)\)\)", r".result(com.tuyenshop.payload.response.ProductVersionResponse.fromEntity(versionService.updateVersion(\1)))")
    ],
    "OrderController.java": [
        (r"ApiResponse<List<Order>>", r"ApiResponse<List<com.tuyenshop.payload.response.OrderResponse>>"),
        (r"\.result\(orderService\.getAllOrders\(\)\)", r".result(orderService.getAllOrders().stream().map(com.tuyenshop.payload.response.OrderResponse::fromEntity).collect(java.util.stream.Collectors.toList()))"),
        (r"\.result\(orderService\.getMyOrders\(\)\)", r".result(orderService.getMyOrders().stream().map(com.tuyenshop.payload.response.OrderResponse::fromEntity).collect(java.util.stream.Collectors.toList()))"),
        (r"ApiResponse<Order>", r"ApiResponse<com.tuyenshop.payload.response.OrderResponse>"),
        (r"\.result\(orderService\.getOrderById\((.*?)\)\)", r".result(com.tuyenshop.payload.response.OrderResponse.fromEntity(orderService.getOrderById(\1)))"),
        (r"\.result\(orderService\.updateOrderStatus\((.*?)\)\)", r".result(com.tuyenshop.payload.response.OrderResponse.fromEntity(orderService.updateOrderStatus(\1)))"),
        (r"\.result\(checkoutService\.checkout\((.*?)\)\)", r".result(com.tuyenshop.payload.response.OrderResponse.fromEntity(checkoutService.checkout(\1)))")
    ],
    "ProductController.java": [
        (r"ApiResponse<org\.springframework\.data\.domain\.Page<Product>>", r"ApiResponse<org.springframework.data.domain.Page<com.tuyenshop.payload.response.ProductResponse>>"),
        (r"\.result\(productService\.searchProducts\((.*?)\)\)", r".result(productService.searchProducts(\1).map(com.tuyenshop.payload.response.ProductResponse::fromEntity))"),
        (r"ApiResponse<Product>", r"ApiResponse<com.tuyenshop.payload.response.ProductResponse>"),
        (r"\.result\(productService\.getProductById\((.*?)\)\)", r".result(com.tuyenshop.payload.response.ProductResponse.fromEntity(productService.getProductById(\1)))"),
        (r"\.result\(productService\.getProductBySlug\((.*?)\)\)", r".result(com.tuyenshop.payload.response.ProductResponse.fromEntity(productService.getProductBySlug(\1)))"),
        (r"\.result\(productService\.createProduct\((.*?)\)\)", r".result(com.tuyenshop.payload.response.ProductResponse.fromEntity(productService.createProduct(\1)))"),
        (r"\.result\(productService\.updateProduct\((.*?)\)\)", r".result(com.tuyenshop.payload.response.ProductResponse.fromEntity(productService.updateProduct(\1)))")
    ],
    "UserController.java": [
        (r"ApiResponse<List<User>>", r"ApiResponse<List<com.tuyenshop.payload.response.UserResponse>>"),
        (r"\.result\(userRepository\.findAll\(\)\)", r".result(userRepository.findAll().stream().map(com.tuyenshop.payload.response.UserResponse::fromEntity).collect(java.util.stream.Collectors.toList()))"),
        (r"ApiResponse<User>", r"ApiResponse<com.tuyenshop.payload.response.UserResponse>"),
        (r"\.result\(user\)", r".result(com.tuyenshop.payload.response.UserResponse.fromEntity(user))")
    ]
}

for filename, rules in replacements.items():
    filepath = os.path.join(controllers_dir, filename)
    if os.path.exists(filepath):
        with open(filepath, 'r') as f:
            content = f.read()
        
        for pattern, replacement in rules:
            content = re.sub(pattern, replacement, content, flags=re.DOTALL)
            
        with open(filepath, 'w') as f:
            f.write(content)

