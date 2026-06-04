import os
import re

controllers_dir = "src/main/java/com/tuyenshop/controller"

for filename in os.listdir(controllers_dir):
    if not filename.endswith("Controller.java"): continue
    
    filepath = os.path.join(controllers_dir, filename)
    with open(filepath, 'r') as f:
        content = f.read()
    
    # Fix method return types
    for model in ["Brand", "Category", "Color", "ProductVersion", "Product", "Order", "User"]:
        # public ApiResponse<Model>
        content = re.sub(rf"public ApiResponse<{model}>", rf"public ApiResponse<com.tuyenshop.payload.response.{model}Response>", content)
        # public ApiResponse<List<Model>>
        content = re.sub(rf"public ApiResponse<List<{model}>>", rf"public ApiResponse<List<com.tuyenshop.payload.response.{model}Response>>", content)
        # public ApiResponse<Page<Model>>
        content = re.sub(rf"public ApiResponse<Page<{model}>>", rf"public ApiResponse<Page<com.tuyenshop.payload.response.{model}Response>>", content)
        
    # Fix Order checkout missing fromEntity
    content = content.replace(".result(orderService.checkout(request))", ".result(com.tuyenshop.payload.response.OrderResponse.fromEntity(orderService.checkout(request)))")
    
    # Fix Page mappings
    content = content.replace(".result(orderService.getMyOrders(pageable))", ".result(orderService.getMyOrders(pageable).map(com.tuyenshop.payload.response.OrderResponse::fromEntity))")
    content = content.replace(".result(orderService.getAllOrders(pageable))", ".result(orderService.getAllOrders(pageable).map(com.tuyenshop.payload.response.OrderResponse::fromEntity))")
    
    with open(filepath, 'w') as f:
        f.write(content)
