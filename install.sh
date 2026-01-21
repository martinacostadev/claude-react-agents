#!/bin/bash

# Claude React Agents Installation Script
# Usage: curl -fsSL https://raw.githubusercontent.com/yourusername/claude-react-agents/main/install.sh | bash

set -e

REPO_URL="https://github.com/yourusername/claude-react-agents"
BRANCH="main"

echo "╔════════════════════════════════════════════╗"
echo "║     Claude React Agents Installer          ║"
echo "╚════════════════════════════════════════════╝"
echo ""

# Check if we're in a project directory
if [ ! -f "package.json" ]; then
    echo "⚠️  Warning: No package.json found. Are you in a project directory?"
    read -p "Continue anyway? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# Check if .claude already exists
if [ -d ".claude" ]; then
    echo "⚠️  .claude directory already exists."
    read -p "Overwrite? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "Aborted."
        exit 1
    fi
    rm -rf .claude
fi

echo "📦 Downloading Claude React Agents..."

# Create temp directory
TEMP_DIR=$(mktemp -d)
trap "rm -rf $TEMP_DIR" EXIT

# Clone repository
git clone --depth 1 --branch $BRANCH $REPO_URL "$TEMP_DIR" 2>/dev/null || {
    echo "❌ Failed to download. Trying alternative method..."
    curl -sL "$REPO_URL/archive/$BRANCH.zip" -o "$TEMP_DIR/repo.zip"
    unzip -q "$TEMP_DIR/repo.zip" -d "$TEMP_DIR"
    mv "$TEMP_DIR"/claude-react-agents-*/* "$TEMP_DIR/"
}

# Copy files
echo "📁 Installing configuration..."
cp -r "$TEMP_DIR/.claude" .
cp "$TEMP_DIR/CLAUDE.md" .

# Make hooks executable
chmod +x .claude/hooks/scripts/*.sh 2>/dev/null || true

echo ""
echo "✅ Installation complete!"
echo ""
echo "📋 Next steps:"
echo ""
echo "1. Install recommended skills:"
echo "   npx skills add vercel-labs/agent-skills"
echo "   npx skills add expo/skills"
echo ""
echo "2. (Optional) Copy local settings template:"
echo "   cp .claude/settings.local.json.example .claude/settings.local.json"
echo ""
echo "3. Start Claude Code and enjoy AI-assisted development!"
echo ""
