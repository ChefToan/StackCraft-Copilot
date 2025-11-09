# StackCraft Copilot

**Claude API-powered automatic prompt enhancement**

Automatically intercepts vague prompts and enhances them using Claude Sonnet 4.5 API.

---

## How It Works

**Automatic Workflow:**

1. You type a vague prompt: `make a website`
2. Hook detects it's vague and intercepts
3. Asks: "I noticed your prompt could be improved. Would you like clarifying questions?"
4. If yes → asks targeted questions ONE AT A TIME
5. After answers → calls Claude API to generate enhanced prompt
6. Shows enhanced version with API cost proof
7. Asks: "Proceed with this enhanced prompt?"
8. If yes → executes enhanced version, if no → adjusts or uses original

**No slash commands needed** - just type naturally and the hook handles everything.

---

## Hackathon Compliance

**Requirement:** Build a Claude API-powered tool that improves developer productivity

**Proof of Claude API usage:**
- Shows real API cost: $0.005-0.015 per enhancement
- Displays token counts: input/output
- Uses `@anthropic-ai/sdk` for direct API calls
- User pays with their own API key

**Example output:**
```
API Cost: $0.007234
Tokens: 342 input, 976 output
Powered by Claude Sonnet 4.5 API
```

---

## Installation

### Option 1: Automatic Setup (Recommended)

```bash
# Clone the repository
git clone https://github.com/ChefToan/StackCraft-Copilot.git ~/.claude/plugins/stackcraft-copilot

# Run setup script
cd ~/.claude/plugins/stackcraft-copilot
bash scripts/setup.sh
```

The setup script will:
- Install MCP server dependencies (`npm install`)
- Create `.env` file from template
- Configure the hook
- Test the installation

**Then:**
1. Edit `.env` and add your Anthropic API key
2. Restart Claude Code

### Option 2: Manual Setup

```bash
# Clone repository
git clone https://github.com/ChefToan/StackCraft-Copilot.git ~/.claude/plugins/stackcraft-copilot

# Install dependencies
cd ~/.claude/plugins/stackcraft-copilot/mcp-servers/prompt-enhancer
npm install

# Create .env file
cd ~/.claude/plugins/stackcraft-copilot
cp .env.example .env
nano .env  # Add your API key

# Make hook executable
chmod +x scripts/enhance-prompt-hook.py

# Restart Claude Code
```

### Get API Key

Sign up at https://console.anthropic.com/settings/keys

---

## Usage Example

**You type:**
```
make a website
```

**What happens:**

```
[Hook intercepts]

I noticed your prompt "make a website" could be improved.
I have some questions that will help create a more effective prompt.

Would you like to enhance this prompt with clarifying questions?
  - Yes, ask questions
  - No, use as-is

[You select: Yes, ask questions]

Question 1/3: What is the primary purpose of this website?
  - Personal Portfolio
  - Business/Company
  - E-commerce
  - Blog/Content

[You answer: Personal Portfolio]

Question 2/3: Which technology stack should I use?
  - Next.js
  - React + Vite
  - Vue + Nuxt

[You answer: Next.js]

Question 3/3: Which features do you want to enable? (select multiple)
  - Contact Form
  - Image Gallery
  - Blog Section
  - Dark Mode
  - Animations

[You select: Image Gallery, Dark Mode, Animations]

[Calls Claude API...]

ENHANCED PROMPT (via Claude Sonnet 4.5 API)

Create a modern personal portfolio website using Next.js 14 with:

1. Technology Stack:
   - Next.js 14 (App Router)
   - React 18
   - Tailwind CSS
   - TypeScript

2. Core Features:
   - Responsive image gallery with lightbox
   - Dark/light mode toggle with system preference detection
   - Smooth page transitions and scroll animations
   - Mobile-first responsive design

3. Structure:
   - Hero section with introduction
   - Projects gallery with filtering
   - About section
   - Contact information

4. Technical Requirements:
   - Fast page loads (< 2s)
   - SEO optimized with metadata
   - Accessible (WCAG 2.1 AA)
   - Performance score > 90

Enhancements Applied:
- Role assignment (senior developer)
- Context addition (technical specifications)
- Step-by-step structure
- Output specification (deliverables)

Quality Metrics:
- Confidence: 9/10
- API Cost: $0.007234
- Tokens: 342 input, 976 output

Would you like to proceed with this enhanced prompt?
  - Yes, use it
  - Adjust it
  - Use original

[You select: Yes, use it]

[ENHANCED BY STACKCRAFT] Create a modern personal portfolio...
[Claude proceeds with enhanced prompt]
```

---

## Features

- **Automatic detection** - No commands needed, just type naturally
- **Smart questioning** - One question at a time, context-aware
- **Real Claude API calls** - Direct integration with Anthropic API
- **Cost transparency** - Shows actual API costs
- **User confirmation** - Always asks before proceeding
- **8 specialized templates** - Auto-selected based on prompt type

---

## Bypass Enhancement

**Skip enhancement** with `*` prefix:
```
* make a website
```

**Slash commands** auto-bypass:
```
/help
```

---

## API Costs

**Pricing:** $3/$15 per 1M tokens (input/output)

**Per enhancement:**
- Simple: $0.005 - $0.008
- With context: $0.010 - $0.015
- Complex: $0.015 - $0.025

**Monthly estimate:** 100 enhancements ≈ $1.00

---

## Templates

Auto-selected based on prompt type:

- **debug** - Systematic debugging
- **code-review** - Code quality review
- **refactor** - Safe code improvements
- **architecture** - System design
- **optimize** - Performance tuning
- **test** - Testing strategies
- **api** - API development
- **security** - Security assessment

---

## CLI Testing

Test enhancement manually:

```bash
cd ~/.claude/plugins/stackcraft-copilot/mcp-servers/prompt-enhancer

# Basic test
node server.js "make a website"

# With template
node server.js --template debug "fix error"

# View stats
node server.js --stats
```

---

## Architecture

```
User types: "make a website"
    ↓
Hook intercepts (enhance-prompt-hook.py)
    ↓
Wraps with enhancement workflow
    ↓
Claude asks clarifying questions
    ↓
Collects user answers
    ↓
Calls MCP tool
    ↓
MCP server calls Claude API (@anthropic-ai/sdk) ← REAL $ API CALL
    ↓
Returns enhanced prompt + cost
    ↓
Shows to user for confirmation
    ↓
Executes enhanced version
```

---

## Troubleshooting

**"No MCP servers configured" error?**
- Run the setup script: `bash ~/.claude/plugins/stackcraft-copilot/scripts/setup.sh`
- Ensure `.env` file exists with your API key
- Restart Claude Code completely (quit and reopen)
- Check dependencies installed: `ls ~/.claude/plugins/stackcraft-copilot/mcp-servers/prompt-enhancer/node_modules`

**Hook not intercepting prompts?**
- Verify hook file exists: `ls ~/.claude/plugins/stackcraft-copilot/hooks/hooks.json`
- Make script executable: `chmod +x ~/.claude/plugins/stackcraft-copilot/scripts/enhance-prompt-hook.py`
- Restart Claude Code
- Try with `*` bypass to test: `* make a website` (should NOT trigger hook)

**MCP tool not found during enhancement?**
- Ensure API key is in `.env` file: `cat ~/.claude/plugins/stackcraft-copilot/.env`
- Run manual test: `cd ~/.claude/plugins/stackcraft-copilot/mcp-servers/prompt-enhancer && node server.js "test"`
- Check for errors in terminal
- Verify Node.js version: `node --version` (need >= 18.0.0)

**No API cost shown?**
- This means API wasn't called
- Check API key is valid at https://console.anthropic.com/settings/keys
- Test CLI mode directly: `node server.js "make a website"`
- Look for error messages in Claude Code console

**Still not working?**
- Delete and reinstall:
  ```bash
  rm -rf ~/.claude/plugins/stackcraft-copilot
  git clone https://github.com/ChefToan/StackCraft-Copilot.git ~/.claude/plugins/stackcraft-copilot
  cd ~/.claude/plugins/stackcraft-copilot
  bash scripts/setup.sh
  ```
- Check GitHub issues: https://github.com/ChefToan/StackCraft-Copilot/issues

---

## License

MIT License - Copyright (c) 2024 ChefToan

---

**Links:**
- [GitHub](https://github.com/ChefToan/StackCraft-Copilot)
- [Get API Key](https://console.anthropic.com/settings/keys)
- [Claude Code Docs](https://code.claude.com/docs)
