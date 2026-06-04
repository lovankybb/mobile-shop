import os

files = [
    "src/main/java/com/tuyenshop/controller/CategoryController.java",
    "src/main/java/com/tuyenshop/controller/BrandController.java",
    "src/main/java/com/tuyenshop/controller/ColorController.java",
    "src/main/java/com/tuyenshop/controller/ProductVersionController.java",
    "src/main/java/com/tuyenshop/controller/UserController.java",
    "src/main/java/com/tuyenshop/service/UserService.java"
]

for filepath in files:
    if not os.path.exists(filepath): continue
    with open(filepath, 'r') as f:
        content = f.read()
        
    # Extra parentheses from my previous regex replacements:
    # .result(service.getAll())) -> .result(service.getAll())
    content = content.replace("()))\n", "())\n")
    
    # In UserService.java:
    content = content.replace("import java.util.List", "import java.util.List;")
    
    with open(filepath, 'w') as f:
        f.write(content)

