#!/bin/bash
# Validates that Claude Code doesn't modify sensitive files

INPUT=$(cat)
FILE_PATH=$(echo "$INPUT" | jq -r '.tool_input.file_path // empty')

# List of patterns for sensitive files
SENSITIVE_PATTERNS=(
    "\.env"
    "\.pem$"
    "\.key$"
    "secrets/"
    "credentials"
    "password"
    "\.secret"
)

for pattern in "${SENSITIVE_PATTERNS[@]}"; do
    if echo "$FILE_PATH" | grep -qE "$pattern"; then
        echo "Blocked: Cannot modify sensitive file matching pattern: $pattern" >&2
        exit 2
    fi
done

exit 0
