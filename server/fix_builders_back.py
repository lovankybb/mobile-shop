import os
import glob

for filepath in glob.glob("src/main/java/com/tuyenshop/controller/**/*.java", recursive=True):
    with open(filepath, 'r') as f:
        content = f.read()
    
    if "ApiResponse.<Object>builder()" in content:
        content = content.replace("ApiResponse.<Object>builder()", "ApiResponse.builder()")
        with open(filepath, 'w') as f:
            f.write(content)
