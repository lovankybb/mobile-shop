import os
import re

def fix_product_service():
    filepath = "src/main/java/com/tuyenshop/service/ProductService.java"
    with open(filepath, 'r') as f:
        content = f.read()

    content = content.replace("return criteriaBuilder.and(predicates.toArray(new Predicate[0])).map(productMapper::toResponse);", "return criteriaBuilder.and(predicates.toArray(new Predicate[0]));")
    
    content = content.replace("Product product = getProductById(id);", "Product product = productRepository.findById(id).orElseThrow(() -> new AppException(ErrorCode.PRODUCT_NOT_FOUND));")
    content = content.replace("Brand brand = brandService.getBrandById(request.getBrandId());", "Brand brand = brandRepository.findById(request.getBrandId()).orElseThrow(() -> new AppException(ErrorCode.BRAND_NOT_FOUND));")
    content = content.replace("Category category = categoryService.getCategoryById(request.getCategoryId());", "Category category = categoryRepository.findById(request.getCategoryId()).orElseThrow(() -> new AppException(ErrorCode.CATEGORY_NOT_FOUND));")

    with open(filepath, 'w') as f:
        f.write(content)

def fix_product_variant_service():
    filepath = "src/main/java/com/tuyenshop/service/ProductVariantService.java"
    if not os.path.exists(filepath): return
    with open(filepath, 'r') as f:
        content = f.read()
    
    content = content.replace("ProductVariant variant = getVariantById(id);", "ProductVariant variant = variantRepository.findById(id).orElseThrow(() -> new AppException(ErrorCode.VARIANT_NOT_FOUND));")
    content = content.replace("Product product = productService.getProductById(request.getProductId());", "Product product = productRepository.findById(request.getProductId()).orElseThrow(() -> new AppException(ErrorCode.PRODUCT_NOT_FOUND));")
    content = content.replace("Color color = colorService.getColorById(request.getColorId());", "Color color = colorRepository.findById(request.getColorId()).orElseThrow(() -> new AppException(ErrorCode.COLOR_NOT_FOUND));")
    content = content.replace("ProductVersion version = versionService.getVersionById(request.getVersionId());", "ProductVersion version = versionRepository.findById(request.getVersionId()).orElseThrow(() -> new AppException(ErrorCode.VERSION_NOT_FOUND));")

    with open(filepath, 'w') as f:
        f.write(content)

def fix_color_service():
    filepath = "src/main/java/com/tuyenshop/service/ColorService.java"
    if not os.path.exists(filepath): return
    with open(filepath, 'r') as f:
        content = f.read()
    content = content.replace("Color color = getColorById(id);", "Color color = colorRepository.findById(id).orElseThrow(() -> new AppException(ErrorCode.COLOR_NOT_FOUND));")
    with open(filepath, 'w') as f:
        f.write(content)

def fix_product_version_service():
    filepath = "src/main/java/com/tuyenshop/service/ProductVersionService.java"
    if not os.path.exists(filepath): return
    with open(filepath, 'r') as f:
        content = f.read()
    content = content.replace("ProductVersion version = getVersionById(id);", "ProductVersion version = versionRepository.findById(id).orElseThrow(() -> new AppException(ErrorCode.VERSION_NOT_FOUND));")
    with open(filepath, 'w') as f:
        f.write(content)

def fix_brand_service():
    filepath = "src/main/java/com/tuyenshop/service/BrandService.java"
    if not os.path.exists(filepath): return
    with open(filepath, 'r') as f:
        content = f.read()
    content = content.replace("Brand brand = getBrandById(id);", "Brand brand = brandRepository.findById(id).orElseThrow(() -> new AppException(ErrorCode.BRAND_NOT_FOUND));")
    with open(filepath, 'w') as f:
        f.write(content)

def fix_category_service():
    filepath = "src/main/java/com/tuyenshop/service/CategoryService.java"
    if not os.path.exists(filepath): return
    with open(filepath, 'r') as f:
        content = f.read()
    content = content.replace("Category category = getCategoryById(id);", "Category category = categoryRepository.findById(id).orElseThrow(() -> new AppException(ErrorCode.CATEGORY_NOT_FOUND));")
    with open(filepath, 'w') as f:
        f.write(content)


fix_product_service()
fix_product_variant_service()
fix_color_service()
fix_product_version_service()
fix_brand_service()
fix_category_service()

