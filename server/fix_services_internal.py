import os
import re

service_dir = "src/main/java/com/tuyenshop/service"

entities = ["Brand", "Category", "Color", "ProductVersion", "Product", "ProductVariant"]

for ent in entities:
    filepath = os.path.join(service_dir, f"{ent}Service.java")
    if not os.path.exists(filepath): continue
    with open(filepath, 'r') as f:
        content = f.read()

    # Fix delete method: deleteBrand(Long id)
    # Replaces:
    # EntityResponse entity = getEntityById(id);
    # entityRepository.delete(entity);
    # With:
    # Entity entity = entityRepository.findById(id).orElseThrow(() -> new AppException(ErrorCode.ENTITY_NOT_FOUND));
    # entityRepository.delete(entity);
    
    # We can just look for delete method:
    content = re.sub(rf"public void delete{ent}\((.*?)\) {{(.*?){ent}Response ([a-zA-Z0-9_]+) = get{ent}ById\(id\);\s*([a-zA-Z0-9_]+Repository)\.delete\(\3\);\s*}}", 
                     rf"public void delete{ent}(\1) {{\2{ent} \3 = \4.findById(id).orElseThrow(() -> new AppException(ErrorCode.{ent.upper()}_NOT_FOUND));\n        \4.delete(\3);\n    }}", 
                     content, flags=re.DOTALL)

    # Fix update method:
    # Replaces:
    # EntityResponse entity = getEntityById(id);
    # ...
    # return mapper.toResponse(repository.save(entity));
    # With:
    # Entity entity = entityRepository.findById(id).orElseThrow(() -> new AppException(ErrorCode.ENTITY_NOT_FOUND));
    content = re.sub(rf"{ent}Response ([a-zA-Z0-9_]+) = get{ent}ById\((.*?)\);", rf"{ent} \1 = {ent.lower()}Repository.findById(\2).orElseThrow(() -> new AppException(ErrorCode.{ent.upper()}_NOT_FOUND));", content)
    # The repository might not be exactly {ent.lower()}Repository (e.g. versionRepository). Let's catch those.
    content = content.replace("productversionRepository", "versionRepository")
    content = content.replace("productvariantRepository", "variantRepository")

    with open(filepath, 'w') as f:
        f.write(content)

# Special fixes for ProductService.java
prod_filepath = os.path.join(service_dir, "ProductService.java")
if os.path.exists(prod_filepath):
    with open(prod_filepath, 'r') as f:
        content = f.read()
    
    # In search filter:
    # return productRepository.findAll((Specification<Product>) (root, query, criteriaBuilder) -> { ... }).map(productMapper::toResponse);
    # But earlier I might have messed up `.map(productMapper::toResponse)`. Let's fix getProductsByFilter explicitly.
    content = content.replace("return productRepository.findAll(spec, pageable).map(productMapper::toResponse);", "return productRepository.findAll(spec, pageable).map(productMapper::toResponse);")
    content = content.replace("return productRepository.findAll(spec, pageable);", "return productRepository.findAll(spec, pageable).map(productMapper::toResponse);")
    content = content.replace("query.orderBy(criteriaBuilder.desc(root.get(\"createdAt\")));\n            return criteriaBuilder.and(predicates.toArray(new Predicate[0])).map(productMapper::toResponse);\n        }", "query.orderBy(criteriaBuilder.desc(root.get(\"createdAt\")));\n            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));\n        }")
    
    # Also in ProductService, updateProduct:
    # ProductResponse product = getProductById(id) was replaced above, but brand fetching:
    content = content.replace("BrandResponse brand = getBrandById(", "Brand brand = brandRepository.findById(")
    content = content.replace("CategoryResponse category = getCategoryById(", "Category category = categoryRepository.findById(")
    # Let's just fix it generically:
    content = re.sub(r"BrandResponse ([a-zA-Z0-9_]+) = brandService\.getBrandById\((.*?)\);", r"Brand \1 = brandRepository.findById(\2).orElseThrow(() -> new AppException(ErrorCode.BRAND_NOT_FOUND));", content)
    content = re.sub(r"CategoryResponse ([a-zA-Z0-9_]+) = categoryService\.getCategoryById\((.*?)\);", r"Category \1 = categoryRepository.findById(\2).orElseThrow(() -> new AppException(ErrorCode.CATEGORY_NOT_FOUND));", content)

    # Missing injected repositories
    if "private BrandRepository" not in content:
        content = content.replace("public class ProductService {", "public class ProductService {\n\n    @Autowired\n    private com.tuyenshop.repository.BrandRepository brandRepository;\n\n    @Autowired\n    private com.tuyenshop.repository.CategoryRepository categoryRepository;\n")
    
    # In createProduct:
    content = re.sub(r"BrandResponse ([a-zA-Z0-9_]+) = brandService\.getBrandById\((.*?)\);", r"Brand \1 = brandRepository.findById(\2).orElseThrow(() -> new AppException(ErrorCode.BRAND_NOT_FOUND));", content)
    content = re.sub(r"CategoryResponse ([a-zA-Z0-9_]+) = categoryService\.getCategoryById\((.*?)\);", r"Category \1 = categoryRepository.findById(\2).orElseThrow(() -> new AppException(ErrorCode.CATEGORY_NOT_FOUND));", content)

    with open(prod_filepath, 'w') as f:
        f.write(content)

# Special fixes for ProductVariantService.java
var_filepath = os.path.join(service_dir, "ProductVariantService.java")
if os.path.exists(var_filepath):
    with open(var_filepath, 'r') as f:
        content = f.read()
    
    content = re.sub(r"ProductResponse ([a-zA-Z0-9_]+) = productService\.getProductById\((.*?)\);", r"Product \1 = productRepository.findById(\2).orElseThrow(() -> new AppException(ErrorCode.PRODUCT_NOT_FOUND));", content)
    content = re.sub(r"ColorResponse ([a-zA-Z0-9_]+) = colorService\.getColorById\((.*?)\);", r"Color \1 = colorRepository.findById(\2).orElseThrow(() -> new AppException(ErrorCode.COLOR_NOT_FOUND));", content)
    content = re.sub(r"ProductVersionResponse ([a-zA-Z0-9_]+) = versionService\.getVersionById\((.*?)\);", r"ProductVersion \1 = versionRepository.findById(\2).orElseThrow(() -> new AppException(ErrorCode.VERSION_NOT_FOUND));", content)
    
    if "private ProductRepository" not in content:
        content = content.replace("public class ProductVariantService {", "public class ProductVariantService {\n\n    @Autowired\n    private com.tuyenshop.repository.ProductRepository productRepository;\n\n    @Autowired\n    private com.tuyenshop.repository.ColorRepository colorRepository;\n\n    @Autowired\n    private com.tuyenshop.repository.ProductVersionRepository versionRepository;\n")
        
    with open(var_filepath, 'w') as f:
        f.write(content)

# Fix ProductVariantController static fromEntity usages
var_ctrl_filepath = "src/main/java/com/tuyenshop/controller/ProductVariantController.java"
if os.path.exists(var_ctrl_filepath):
    with open(var_ctrl_filepath, 'r') as f:
        content = f.read()
    content = content.replace("com.tuyenshop.payload.response.ProductVariantResponse.fromEntity(", "")
    content = content.replace("com.tuyenshop.payload.response.ProductVariantResponse::fromEntity", "")
    content = re.sub(r"\.result\(\s*variantService\.(.*?)\s*\)", r".result(variantService.\1)", content)
    # The above regex will strip out fromEntity if it wrapped it. But let's just make sure we do it cleanly.
    content = re.sub(r"ProductVariantResponse\.fromEntity\((.*?)\)", r"\1", content)
    content = re.sub(r"\.map\(ProductVariantResponse::fromEntity\)", r"", content)
    
    with open(var_ctrl_filepath, 'w') as f:
        f.write(content)


