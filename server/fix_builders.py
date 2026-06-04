import os
import glob
import re

for filepath in glob.glob("src/main/java/com/tuyenshop/controller/**/*.java", recursive=True):
    with open(filepath, 'r') as f:
        content = f.read()
    
    # Simple regex to replace ApiResponse.builder() with ApiResponse.<Object>builder() temporarily to see if it fixes compiler
    if "ApiResponse.builder()" in content:
        content = content.replace("ApiResponse.builder()", "ApiResponse.<Object>builder()")
        with open(filepath, 'w') as f:
            f.write(content)
