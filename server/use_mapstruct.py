import os
import re

response_dir = "src/main/java/com/tuyenshop/payload/response"
controllers_dir = "src/main/java/com/tuyenshop/controller"

# 1. Strip fromEntity from Response classes
for filename in os.listdir(response_dir):
    if not filename.endswith("Response.java"): continue
    if filename == "ApiResponse.java": continue
    
    filepath = os.path.join(response_dir, filename)
    with open(filepath, 'r') as f:
        content = f.read()
    
    # Simple regex to remove the fromEntity method:
    # Match "public static <Class> fromEntity" until the end of the file, then put back the closing brace
    content = re.sub(r"public static \w+Response fromEntity.*?^}", "}", content, flags=re.DOTALL | re.MULTILINE)
    
    with open(filepath, 'w') as f:
        f.write(content)

# 2. Update controllers to use AppMapper
mappings = {
    "BrandController.java": "brandToResponse",
    "CategoryController.java": "categoryToResponse",
    "ColorController.java": "colorToResponse",
    "ProductVersionController.java": "versionToResponse",
    "ProductController.java": "productToResponse",
    "ProductVariantController.java": "variantToResponse",
    "OrderController.java": "orderToResponse",
    "UserController.java": "userToResponse"
}

for filename, method_name in mappings.items():
    filepath = os.path.join(controllers_dir, filename)
    if not os.path.exists(filepath): continue
    with open(filepath, 'r') as f:
        content = f.read()
    
    # Insert AppMapper import and autowire
    if "AppMapper" not in content:
        content = content.replace("import org.springframework.web.bind.annotation.*;", "import org.springframework.web.bind.annotation.*;\nimport com.tuyenshop.mapper.AppMapper;")
        class_name = filename.replace(".java", "")
        autowire_str = f"public class {class_name} {{\n\n    @Autowired\n    private AppMapper appMapper;"
        content = re.sub(rf"public class {class_name} {{", autowire_str, content)
    
    model = filename.replace("Controller.java", "")
    
    # Replace single entity map
    content = re.sub(rf"com\.tuyenshop\.payload\.response\.{model}Response\.fromEntity\((.*?)\)", rf"appMapper.{method_name}(\1)", content)
    
    # Replace list/page map method reference
    content = content.replace(f"com.tuyenshop.payload.response.{model}Response::fromEntity", f"appMapper::{method_name}")
    
    with open(filepath, 'w') as f:
        f.write(content)

