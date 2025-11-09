#!/bin/bash

# StackCraft Copilot Setup Script
# Automatically sets up MCP server and dependencies

set -e

PLUGIN_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )/.." && pwd )"
MCP_DIR="$PLUGIN_DIR/mcp-servers/prompt-enhancer"

echo "🚀 Setting up StackCraft Copilot..."
echo ""

# Step 1: Install MCP server dependencies
echo "📦 Installing MCP server dependencies..."
cd "$MCP_DIR"
npm install
echo "✓ Dependencies installed"
echo ""

# Step 2: Check for API key
if [ ! -f "$PLUGIN_DIR/.env" ]; then
    echo "⚠️  No .env file found"
    echo ""
    echo "Creating .env from template..."
    cp "$PLUGIN_DIR/.env.example" "$PLUGIN_DIR/.env"
    echo ""
    echo "❗ IMPORTANT: Edit the .env file and add your Anthropic API key:"
    echo "   nano $PLUGIN_DIR/.env"
    echo ""
    echo "Get your API key from: https://console.anthropic.com/settings/keys"
    echo ""
else
    echo "✓ .env file exists"
    echo ""
fi

# Step 3: Make hook executable
echo "🔧 Setting up hook..."
chmod +x "$PLUGIN_DIR/scripts/enhance-prompt-hook.py"
echo "✓ Hook configured"
echo ""

# Step 4: Test MCP server
echo "🧪 Testing MCP server..."
if cd "$MCP_DIR" && node server.js --help > /dev/null 2>&1; then
    echo "✓ MCP server works"
else
    echo "❌ MCP server test failed - check Node.js installation"
fi
echo ""

echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Add your API key to: $PLUGIN_DIR/.env"
echo "2. Restart Claude Code"
echo "3. Type any vague prompt like 'make a website' to test"
echo ""
echo "For help, visit: https://github.com/ChefToan/StackCraft-Copilot"
