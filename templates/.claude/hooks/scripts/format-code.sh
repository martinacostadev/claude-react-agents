#!/bin/bash
# Auto-formats code after edits using Prettier

INPUT=$(cat)
FILE_PATH=$(echo "$INPUT" | jq -r '.tool_input.file_path // empty')

# Only format supported file types
if [[ "$FILE_PATH" =~ \.(ts|tsx|js|jsx|json|css|scss|md)$ ]]; then
    # Check if prettier is available
    if command -v npx &> /dev/null; then
        npx prettier --write "$FILE_PATH" 2>/dev/null || true
    fi
fi

exit 0
