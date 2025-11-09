# StackCraft Copilot

**Claude API-powered prompt enhancement plugin**

Automatically enhances vague prompts using real Claude Sonnet 4.5 API calls before execution.

---

## Hackathon Compliance

**Requirement:** Build a Claude API-powered tool that improves developer productivity

**Our Implementation:**
- Uses Claude API directly via `@anthropic-ai/sdk`
- Proves API usage by showing real costs ($0.005-0.015 per call)
- Displays token counts (input/output)
- Improves productivity through better first-try results

**Evidence shown to user:**
```
API Cost: $0.007234
Tokens: 342 in, 976 out
Powered by Claude Sonnet 4.5 API
```

---

## How It Works

```
User types: "make a website"
    ↓
Hook intercepts (vague prompt detected)
    ↓
Calls Claude API via MCP tool (REAL API CALL)
    ↓
API returns clarifying questions
    ↓
User answers questions one at a time
    ↓
Shows enhanced prompt with API cost
    ↓
User confirms or modifies
    ↓
Executes with enhanced prompt
```

**Key difference:** Makes real Claude API calls (costs money, shows proof). Other tools just wrap prompts (free, no API).

---

## Features

- Automatic vague prompt detection
- Step-by-step clarifying questions
- User confirmation required before proceeding
- 8 specialized templates (debug, code-review, refactor, architecture, optimize, test, api, security)
- Real-time cost tracking
- Confidence scoring (1-10)
- Token usage analytics

---

## Quick Start

### 1. Install

```bash
git clone https://github.com/ChefToan/StackCraft-Copilot.git ~/.claude/plugins/stackcraft-copilot
cd ~/.claude/plugins/stackcraft-copilot/mcp-servers/prompt-enhancer
npm install
```

### 2. Add API Key

Users must provide their own Anthropic API key:

```bash
cp ~/.claude/plugins/stackcraft-copilot/.env.example ~/.claude/plugins/stackcraft-copilot/.env
nano ~/.claude/plugins/stackcraft-copilot/.env
# Add: ANTHROPIC_API_KEY=sk-ant-your-key-here
```

Get your API key: https://console.anthropic.com/settings/keys

### 3. Restart Claude Code

The hook activates automatically.

---

## Usage Example

**Input:**
```
make a website
```

**What happens:**
```
StackCraft Copilot enhancing via Claude API...

Question 1/3: What type of website?
  - Portfolio
  - E-commerce
  - Blog
  - Other

[User selects: Portfolio]

Question 2/3: Framework preference?
  - React + Next.js
  - Vue + Nuxt
  - Other

[User selects: React + Next.js]

Question 3/3: Key features needed? (select multiple)
  - Contact form
  - Project gallery
  - Blog section
  - Other

[User selects multiple features]

ENHANCED PROMPT (via Claude Sonnet 4.5 API)

Create a professional portfolio website using React and Next.js:
1. Responsive project gallery with filtering
2. Contact form with email integration
3. Blog section with MDX support
4. Dark/light mode toggle
5. SEO optimized, page loads under 2s, WCAG 2.1 AA compliant

Techniques applied: Role Assignment, Context Addition, Step-by-Step Structure
Confidence: 9/10
API Cost: $0.007234
Tokens: 342 input, 976 output

Proceed with this enhanced prompt?
  - Yes, use it
  - Modify it
  - Skip enhancement

[User confirms and Claude proceeds with enhanced prompt]
```

---

## Bypass Enhancement

Skip enhancement by prefixing with `*`:
```
* make a website
```

Slash commands automatically bypass:
```
/help
```

---

## API Costs

**Pricing:** Claude Sonnet 4.5 = $3 per 1M input tokens, $15 per 1M output tokens

**Typical costs per enhancement:**
- Simple prompt: $0.005 - $0.008
- With template: $0.010 - $0.015
- Complex enhancement: $0.015 - $0.025

**Example:** 100 enhancements per month costs approximately $1.00

---

## Templates

Specialized enhancement for different scenarios:

- **debug** - Systematic debugging approach
- **code-review** - Comprehensive code review
- **refactor** - Safe refactoring guidance
- **architecture** - System design patterns
- **optimize** - Performance improvements
- **test** - Testing strategy
- **api** - RESTful API design
- **security** - Security audit

---

## CLI Mode

Test enhancement directly from command line:

```bash
cd ~/.claude/plugins/stackcraft-copilot/mcp-servers/prompt-enhancer

# Basic enhancement
node server.js "make a website"

# With template
node server.js --template debug "fix the error"

# View usage statistics
node server.js --stats

# List all templates
node server.js --list-templates
```

---

## Architecture

```
User Input
    ↓
Hook (enhance-prompt-hook.py)
    ↓
Claude Code Session
    ↓
MCP Tool Call (mcp__prompt-enhancer__enhance_prompt)
    ↓
MCP Server (mcp-server.js)
    ↓
Claude API Call (@anthropic-ai/sdk) ← REAL API CALL
    ↓
Response with cost and token counts
    ↓
Display to user
```

---

## Proof of Claude API Usage

Every enhancement displays:
1. **API Cost** - Actual dollar amount charged to user's API key
2. **Token Counts** - Input and output tokens processed
3. **Model Information** - "Powered by Claude Sonnet 4.5 API"

This proves real API calls are made, not just prompt wrapping.

---

## License

MIT License - Copyright (c) 2024 ChefToan

---

**Links:**
- [GitHub Repository](https://github.com/ChefToan/StackCraft-Copilot)
- [Get API Key](https://console.anthropic.com/settings/keys)
- [Claude Code Documentation](https://code.claude.com/docs)
