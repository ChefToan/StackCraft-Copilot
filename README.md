# 🚀 StackCraft Copilot

**Claude API-powered prompt enhancement plugin**

Transform vague prompts into professional ones using AI-driven prompt engineering.

---

## Features

✅ 8 domain-specific templates (debug, code-review, refactor, architecture, optimize, test, api, security)
✅ MCP server integration for Claude Code
✅ Real-time cost tracking & analytics
✅ Confidence scoring (1-10)
✅ Powered by Claude Sonnet 4.5

---

## Quick Start

### 1. Install Plugin

```bash
git clone https://github.com/ChefToan/StackCraft-Copilot.git ~/.claude/plugins/stackcraft-copilot
cd ~/.claude/plugins/stackcraft-copilot/mcp-servers/prompt-enhancer
npm install
```

### 2. Add Your API Key

**Option A:** Using .env file (recommended)
```bash
cp ~/.claude/plugins/stackcraft-copilot/.env.example ~/.claude/plugins/stackcraft-copilot/.env
nano ~/.claude/plugins/stackcraft-copilot/.env
# Replace 'your-api-key-here' with your key from: https://console.anthropic.com/settings/keys
```

**Option B:** Set environment variable
```bash
export ANTHROPIC_API_KEY="your-api-key-here"
```

### 3. Restart Claude Code & Use

```bash
# In Claude Code:
/enhance-prompt "make a website"
/enhance-prompt "fix error" --template debug
```

---

## Example

**Input:** `/enhance-prompt "make a website"`

**Output:**
```
✨ Act as a senior full-stack developer.

Create a website with:
1. Purpose & audience
2. Tech stack (React/Vue, Tailwind)
3. Key features
4. Responsive design
5. Deployment

📊 Confidence: 9/10 | 💰 $0.007
```

---

## CLI Mode

```bash
node server.js "your prompt"
node server.js --template security "review code"
node server.js --stats
```

---

MIT © ChefToan | [GitHub](https://github.com/ChefToan/StackCraft-Copilot)
