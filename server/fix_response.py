import re
import glob

def find_balanced_parens(text, start):
    count = 0
    for i in range(start, len(text)):
        if text[i] == '(':
            count += 1
        elif text[i] == ')':
            count -= 1
            if count == 0:
                return i
    return -1

def fix_file(filepath):
    with open(filepath, 'r') as f:
        content = f.read()

    # Manual state machine for replacing ApiResponse.builder() chains
    # Actually, simpler: regex with greedy matches, but careful not to cross semicolons!
    
    # 1. code(X).message(Y)
    content = re.sub(
        r'ApiResponse\.builder\(\)\s*\.code\(([^)]+)\)\s*\.message\(([^)]+)\)\s*\.build\(\)',
        r'ApiResponse.error(\1, \2)',
        content
    )
    
    # 2. message(X).result(Y) -> but Y might have parens!
    # Let's just use ApiResponse.<ActualType>builder() to be 100% safe!
    # Wait, if we just do ApiResponse.success(...), we don't need to parse the arguments if we use a non-greedy regex that stops at .build()
    
    content = re.sub(
        r'ApiResponse\.builder\(\)\s*\.message\((.*?)\)\s*\.result\((.*?)\)\s*\.build\(\)',
        r'ApiResponse.success(\1, \2)',
        content,
        flags=re.DOTALL
    )
    
    content = re.sub(
        r'ApiResponse\.builder\(\)\s*\.result\((.*?)\)\s*\.build\(\)',
        r'ApiResponse.success(\1)',
        content,
        flags=re.DOTALL
    )

    content = re.sub(
        r'ApiResponse\.builder\(\)\s*\.message\((.*?)\)\s*\.build\(\)',
        r'ApiResponse.success(\1)',
        content,
        flags=re.DOTALL
    )

    content = re.sub(
        r'ApiResponse\.builder\(\)\s*\.build\(\)',
        r'ApiResponse.success(null)',
        content,
        flags=re.DOTALL
    )

    with open(filepath, 'w') as f:
        f.write(content)

for filepath in glob.glob("src/main/java/com/tuyenshop/controller/**/*.java", recursive=True):
    fix_file(filepath)

