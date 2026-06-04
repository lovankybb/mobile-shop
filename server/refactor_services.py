import os
import re

service_dir = "src/main/java/com/tuyenshop/service"
impl_dir = "src/main/java/com/tuyenshop/service/impl"
controller_dir = "src/main/java/com/tuyenshop/controller"

entities = ["Brand", "Category", "Color", "ProductVersion", "Product", "ProductVariant", "Order"]

# Update Service Interfaces
for entity in entities:
    filepath = os.path.join(service_dir, f"{entity}Service.java")
    if not os.path.exists(filepath): continue
    
    with open(filepath, 'r') as f:
        content = f.read()
    
    # Replace return types
    content = re.sub(rf"\b{entity}\b(?!Service|Response|Repository|Mapper)", f"com.tuyenshop.payload.response.{entity}Response", content)
    content = content.replace(f"Page<com.tuyenshop.payload.response.{entity}Response>", f"org.springframework.data.domain.Page<com.tuyenshop.payload.response.{entity}Response>")
    
    with open(filepath, 'w') as f:
        f.write(content)

# Update CheckoutService
checkout_filepath = os.path.join(service_dir, "CheckoutService.java")
if os.path.exists(checkout_filepath):
    with open(checkout_filepath, 'r') as f:
        content = f.read()
    content = content.replace("Order checkout", "com.tuyenshop.payload.response.OrderResponse checkout")
    with open(checkout_filepath, 'w') as f:
        f.write(content)

# Update Service Implementations
for entity in entities:
    filepath = os.path.join(impl_dir, f"{entity}ServiceImpl.java")
    if not os.path.exists(filepath): continue
    
    with open(filepath, 'r') as f:
        content = f.read()
        
    # Inject Mapper
    if f"{entity}Mapper" not in content:
        content = content.replace("public class", f"import com.tuyenshop.mapper.{entity}Mapper;\n\npublic class")
        content = re.sub(rf"public class {entity}ServiceImpl(.*?) {{", rf"public class {entity}ServiceImpl\1 {{\n\n    @org.springframework.beans.factory.annotation.Autowired\n    private {entity}Mapper mapper;\n", content)
    
    # Replace return types in method signatures
    content = re.sub(rf"public \b{entity}\b(?!Service|Response|Repository|Mapper)", f"public com.tuyenshop.payload.response.{entity}Response", content)
    
    # Fix return statements by wrapping in mapper.toResponse
    # public Model createModel(...) { ... return repository.save(entity); } -> return mapper.toResponse(repository.save(entity));
    # Using regex to find returns of the entity type.
    # This might be tricky, so we will manually craft replacements based on common patterns.
    content = re.sub(r"return (.*?Repository\.(save|findById).*?);", r"return mapper.toResponse(\1);", content)
    
    # For lists: return repository.findAll(); -> return repository.findAll().stream().map(mapper::toResponse).collect(java.util.stream.Collectors.toList());
    content = content.replace("return repository.findAll();", "return repository.findAll().stream().map(mapper::toResponse).collect(java.util.stream.Collectors.toList());")
    # if it uses custom repository names:
    content = re.sub(r"return ([a-zA-Z0-9_]+Repository)\.findAll\(\);", r"return \1.findAll().stream().map(mapper::toResponse).collect(java.util.stream.Collectors.toList());", content)
    
    # For pages: return repository.findAll(pageable); -> return repository.findAll(pageable).map(mapper::toResponse);
    content = re.sub(r"return ([a-zA-Z0-9_]+Repository.*?\(.*?pageable.*?\));", r"return \1.map(mapper::toResponse);", content)
    
    # Exception: if we just matched something incorrectly, let's just do a specific replacement.
    
    # Fix create/update returns
    # if method returns Entity, and last line is `return entity;` or `return repository.save(entity);`
    content = re.sub(r"return ([a-z]+);\s*\}", r"return mapper.toResponse(\1);\n    }", content)
    
    # Specific fix for ProductVariantServiceImpl where it returns mapped stuff, wait, earlier we mapped in controller. 
    # The previous code in ProductVariantServiceImpl returned `ProductVariant`. So `return variant;` -> `return mapper.toResponse(variant);`
    
    with open(filepath, 'w') as f:
        f.write(content)

# Also update CheckoutServiceImpl
checkout_impl_filepath = os.path.join(impl_dir, "CheckoutServiceImpl.java")
if os.path.exists(checkout_impl_filepath):
    with open(checkout_impl_filepath, 'r') as f:
        content = f.read()
    if "OrderMapper" not in content:
        content = content.replace("public class", f"import com.tuyenshop.mapper.OrderMapper;\n\npublic class")
        content = re.sub(r"public class CheckoutServiceImpl(.*?) {", r"public class CheckoutServiceImpl\1 {\n\n    @org.springframework.beans.factory.annotation.Autowired\n    private OrderMapper mapper;\n", content)
    content = content.replace("public Order checkout", "public com.tuyenshop.payload.response.OrderResponse checkout")
    content = content.replace("return order;", "return mapper.toResponse(order);")
    content = content.replace("return savedOrder;", "return mapper.toResponse(savedOrder);")
    with open(checkout_impl_filepath, 'w') as f:
        f.write(content)

# Clean up controllers to remove AppMapper and directly return the service output
for filename in os.listdir(controller_dir):
    if not filename.endswith("Controller.java"): continue
    
    filepath = os.path.join(controller_dir, filename)
    with open(filepath, 'r') as f:
        content = f.read()
    
    # Remove AppMapper autowiring
    content = re.sub(r"@Autowired\s*private AppMapper appMapper;\s*", "", content)
    content = content.replace("import com.tuyenshop.mapper.AppMapper;\n", "")
    
    # Revert mapping in controllers
    # e.g., appMapper.brandToResponse(brandService.getBrandById(id)) -> brandService.getBrandById(id)
    content = re.sub(r"appMapper\.\w+ToResponse\((.*?)\)", r"\1", content)
    
    # e.g., service.getAll().stream().map(appMapper::brandToResponse).collect(...) -> service.getAll()
    # But wait, the service now returns List<Response> or Page<Response>, so we can just return service.getAll()
    content = re.sub(r"\.result\((.*?)\.stream\(\)\.map\(appMapper::.*?\)\.collect\(.*?\)\)", r".result(\1)", content)
    content = re.sub(r"\.result\((.*?)\.map\(appMapper::.*?\)\)", r".result(\1)", content)
    
    with open(filepath, 'w') as f:
        f.write(content)
