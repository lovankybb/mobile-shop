import os

controllers_dir = "src/main/java/com/tuyenshop/controller"

# Fix OrderController
order_path = os.path.join(controllers_dir, "OrderController.java")
with open(order_path, 'r') as f:
    content = f.read()
content = content.replace("ApiResponse.<Page<Order>>builder()", "ApiResponse.<Page<com.tuyenshop.payload.response.OrderResponse>>builder()")
with open(order_path, 'w') as f:
    f.write(content)

# Fix ProductController
product_path = os.path.join(controllers_dir, "ProductController.java")
with open(product_path, 'r') as f:
    content = f.read()
content = content.replace("ApiResponse.<Page<Product>>builder()", "ApiResponse.<Page<com.tuyenshop.payload.response.ProductResponse>>builder()")
content = content.replace("ApiResponse.<org.springframework.data.domain.Page<Product>>builder()", "ApiResponse.<org.springframework.data.domain.Page<com.tuyenshop.payload.response.ProductResponse>>builder()")
with open(product_path, 'w') as f:
    f.write(content)

