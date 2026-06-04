import os
import re

service_dir = "src/main/java/com/tuyenshop/service"
controller_dir = "src/main/java/com/tuyenshop/controller"

entities = ["Brand", "Category", "Color", "ProductVersion", "Product", "ProductVariant", "Order", "User"]

def fix_service(filepath, entity):
    if not os.path.exists(filepath): return
    with open(filepath, 'r') as f:
        content = f.read()

    # Revert the wrong replacements first
    content = content.replace(f"com.tuyenshop.model.com.tuyenshop.payload.response.{entity}Response", f"com.tuyenshop.model.{entity}")
    content = content.replace(f"com.tuyenshop.payload.response.{entity}Response", f"{entity}")
    content = content.replace(f"org.springframework.data.domain.Page<{entity}>", f"Page<{entity}>")
    
    # We want to change the public methods to return EntityResponse, and wrap them with mapper.
    # Add imports
    if f"import com.tuyenshop.mapper.{entity}Mapper;" not in content:
        content = content.replace(f"import com.tuyenshop.model.{entity};", f"import com.tuyenshop.model.{entity};\nimport com.tuyenshop.payload.response.{entity}Response;\nimport com.tuyenshop.mapper.{entity}Mapper;\nimport java.util.stream.Collectors;")
    
    if f"{entity}Mapper {entity.lower()}Mapper;" not in content and f"private {entity}Mapper" not in content:
        content = re.sub(rf"public class {entity}Service {{", rf"public class {entity}Service {{\n\n    @org.springframework.beans.factory.annotation.Autowired\n    private {entity}Mapper {entity.lower()}Mapper;", content)
    
    mapper_var = f"{entity.lower()}Mapper"
    
    # Replace public List<Entity> -> public List<EntityResponse>
    content = re.sub(rf"public List<{entity}> ([a-zA-Z0-9_]+)\((.*?)\)\s*{{(.*?)return (.*?);\s*}}", 
                     rf"public List<{entity}Response> \1(\2) {{\3return \4.stream().map({mapper_var}::toResponse).collect(Collectors.toList());\n    }}", 
                     content, flags=re.DOTALL)
                     
    # Replace public Page<Entity> -> public Page<EntityResponse>
    content = re.sub(rf"public Page<{entity}> ([a-zA-Z0-9_]+)\((.*?)\)\s*{{(.*?)return (.*?);\s*}}", 
                     rf"public Page<{entity}Response> \1(\2) {{\3return \4.map({mapper_var}::toResponse);\n    }}", 
                     content, flags=re.DOTALL)
                     
    # Replace public Entity -> public EntityResponse
    # This matches method signature up to return, and changes the return statement.
    # Because there might be multiple statements in the method, we'll use a regex that captures the last return.
    def replace_single_return(m):
        signature = m.group(1)
        body = m.group(2)
        ret_val = m.group(3)
        return f"public {entity}Response {signature} {{{body}return {mapper_var}.toResponse({ret_val});\n    }}"

    content = re.sub(rf"public {entity} ([a-zA-Z0-9_]+\(.*?\))\s*{{(.*?)return\s+(.*?);\s*}}", replace_single_return, content, flags=re.DOTALL)

    with open(filepath, 'w') as f:
        f.write(content)

for ent in entities:
    fix_service(os.path.join(service_dir, f"{ent}Service.java"), ent)

# Special handling for CheckoutService
checkout_filepath = os.path.join(service_dir, "CheckoutService.java")
if os.path.exists(checkout_filepath):
    with open(checkout_filepath, 'r') as f:
        content = f.read()
    content = content.replace("com.tuyenshop.payload.response.OrderResponse", "Order")
    if "OrderMapper" not in content:
        content = content.replace("import com.tuyenshop.model.Order;", "import com.tuyenshop.model.Order;\nimport com.tuyenshop.payload.response.OrderResponse;\nimport com.tuyenshop.mapper.OrderMapper;")
    if "private OrderMapper" not in content:
        content = re.sub(r"public class CheckoutService {", r"public class CheckoutService {\n\n    @org.springframework.beans.factory.annotation.Autowired\n    private OrderMapper orderMapper;", content)
    
    # Replace public Order checkout(CheckoutRequest request)
    def fix_checkout_ret(m):
        return f"public OrderResponse checkout(CheckoutRequest request) {{{m.group(1)}return orderMapper.toResponse({m.group(2)});}}"
    
    content = re.sub(r"public Order checkout\(CheckoutRequest request\) \{(.*?)return\s+(.*?);\s*\}", fix_checkout_ret, content, flags=re.DOTALL)
    
    with open(checkout_filepath, 'w') as f:
        f.write(content)

# Fix Controllers
def fix_controller(filepath, entity):
    if not os.path.exists(filepath): return
    with open(filepath, 'r') as f:
        content = f.read()
    
    # Remove AppMapper and manual mapping
    content = re.sub(r"@Autowired\s*private AppMapper appMapper;\s*", "", content)
    content = content.replace("import com.tuyenshop.mapper.AppMapper;\n", "")
    content = re.sub(r"appMapper\.\w+ToResponse\((.*?)\)", r"\1", content)
    content = re.sub(r"\.result\((.*?)\.stream\(\)\.map\(appMapper::.*?\)\.collect\(.*?\)\)", r".result(\1)", content)
    content = re.sub(r"\.result\((.*?)\.map\(appMapper::.*?\)\)", r".result(\1)", content)

    # Note: earlier we might have also had `appMapper.variantToResponse` explicitly without `appMapper.` if statically imported? No.
    # The controller methods already expect the Service to return the Response objects.
    
    with open(filepath, 'w') as f:
        f.write(content)

for ent in entities:
    fix_controller(os.path.join(controller_dir, f"{ent}Controller.java"), ent)

