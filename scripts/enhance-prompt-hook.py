#!/usr/bin/env python3
"""
StackCraft Copilot - Automatic Prompt Enhancement Hook
Intercepts vague prompts and enhances them using Claude API
"""
import json
import sys

try:
    input_data = json.load(sys.stdin)
except json.JSONDecodeError as e:
    print(f"Error: Invalid JSON: {e}", file=sys.stderr)
    sys.exit(1)

prompt = input_data.get("prompt", "")

def output_json(text):
    output = {
        "hookSpecificOutput": {
            "hookEventName": "UserPromptSubmit",
            "additionalContext": text
        }
    }
    print(json.dumps(output))

# Bypass conditions
if prompt.startswith("*") or prompt.startswith("/") or prompt.startswith("#"):
    clean = prompt[1:].strip() if prompt.startswith("*") else prompt
    output_json(clean)
    sys.exit(0)

# Skip if already enhanced
if "[ENHANCED BY STACKCRAFT]" in prompt:
    output_json(prompt)
    sys.exit(0)

# Enhanced vague prompt detection for production
words = prompt.split()
vague_starters = ["make", "create", "build", "fix", "add", "help", "debug", "test", "write", "update", "change", "implement", "setup", "configure"]

# Check if prompt starts with a vague action word
starts_with_vague = any(prompt.lower().startswith(starter) for starter in vague_starters)

# Count specific technical details (keywords that suggest specificity)
specific_indicators = ["class", "function", "method", "component", "api", "endpoint", "route", "model", "schema",
                       "database", "query", "import", "export", "render", "fetch", "axios", "react", "vue",
                       "angular", "node", "python", "java", "typescript", "javascript", "sql", "nosql",
                       "authentication", "authorization", "jwt", "oauth", "redux", "vuex", "graphql", "rest",
                       "server", "client", "backend", "frontend", "interface", "service", "controller",
                       ".js", ".py", ".ts", ".tsx", ".jsx", ".java", ".go", ".rs", ".cpp"]

# Count how many specific indicators are present
specificity_score = sum(1 for indicator in specific_indicators if indicator in prompt.lower())

# Enhanced detection logic:
# Trigger enhancement if:
# - Starts with vague word AND has very low specificity (< 2 technical terms)
# - AND is relatively short (< 15 words)
# This catches "make a website" and "make a simple server..." but NOT "implement OAuth authentication using JWT"
is_vague = starts_with_vague and specificity_score < 2 and len(words) < 15

# Pass through if not vague
if not is_vague:
    output_json(prompt)
    sys.exit(0)

# Escape for safe embedding
escaped = prompt.replace("\\", "\\\\").replace('"', '\\"')

# Vague prompt detected - enhance it
wrapped = f'''STOP - DO NOT PROCEED WITH THE TASK YET!

Original user request: "{escaped}"

🚨 **MANDATORY WORKFLOW - YOU MUST FOLLOW EVERY STEP EXACTLY** 🚨

This is a vague prompt that needs enhancement. You MUST follow this workflow before proceeding with implementation:

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## STEP 1: Inform the user and get permission (REQUIRED)

Say EXACTLY:
"I noticed your prompt **'{escaped}'** could be improved with StackCraft Copilot. I can ask a few questions and use Claude API to create an enhanced prompt that will give you better results."

Then ask for permission:

Use AskUserQuestion:
```
{{
  "question": "Would you like to enhance this prompt with clarifying questions?",
  "header": "Enhance",
  "multiSelect": false,
  "options": [
    {{"label": "Yes, ask questions", "description": "Help me create a better prompt"}},
    {{"label": "No, use as-is", "description": "Proceed with original prompt"}}
  ]
}}
```

⚠️ If user says NO → STOP this workflow and execute original prompt: "{escaped}"

✅ If user says YES → YOU MUST continue to STEP 1.5 (do not skip!)

## STEP 1.5: Analyze project context (REQUIRED before asking questions)

Before asking any questions, quickly analyze the current project:
```bash
# Check for existing tech stack
ls package.json 2>/dev/null  # Node.js project?
ls requirements.txt 2>/dev/null  # Python project?
ls go.mod 2>/dev/null  # Go project?
ls Cargo.toml 2>/dev/null  # Rust project?

# If found, read it to understand current dependencies
```

Use this context to:
- Recommend tech stacks that match existing project
- Avoid asking about things already clear from context
- Provide more relevant options

Then → Continue to STEP 2

## STEP 2: Ask clarifying questions ONE AT A TIME

Based on the prompt type AND project context, ask 2-4 targeted, thoughtful questions.

**CRITICAL RULES:**
1. Ask ONE question, wait for answer, then ask next question
2. ALWAYS put the RECOMMENDED option FIRST
3. Mark the recommended option with "(Recommended)" in the label
4. Only ask questions that significantly impact the implementation
5. Be thoughtful - don't ask unnecessary questions

**How to determine the recommended option:**
- Consider: project context, modern best practices, performance, developer experience
- For tech stacks: Prefer what's in the current project (check package.json), or modern choices
- For features: Suggest what's commonly needed for that use case
- For deployment: Suggest simplest option that meets requirements

For "make a website" example:
```
Question 1:
{{
  "question": "What is the primary purpose of this website?",
  "header": "Purpose",
  "multiSelect": false,
  "options": [
    {{"label": "Personal Portfolio (Recommended)", "description": "Showcase your work - most common use case"}},
    {{"label": "Business/Company", "description": "Professional business site"}},
    {{"label": "E-commerce", "description": "Sell products online"}},
    {{"label": "Blog/Content", "description": "Publishing platform"}}
  ]
}}

[Wait for answer]

Question 2 (analyzing project context first):
{{
  "question": "Which technology stack should I use?",
  "header": "Tech Stack",
  "multiSelect": false,
  "options": [
    {{"label": "Node.js + Express (Recommended)", "description": "Most versatile, great ecosystem, widely used"}},
    {{"label": "Python + Flask", "description": "Simple and elegant for smaller projects"}},
    {{"label": "Bun", "description": "Fastest modern runtime"}},
    {{"label": "Go", "description": "Best for high-performance needs"}}
  ]
}}

[Wait for answer]

Question 3 (only if truly needed):
{{
  "question": "Which features do you want to enable?",
  "header": "Features",
  "multiSelect": true,
  "options": [
    {{"label": "Contact Form (Recommended)", "description": "Essential for portfolios"}},
    {{"label": "Dark Mode (Recommended)", "description": "Modern UX standard"}},
    {{"label": "Image Gallery", "description": "Photo showcase"}},
    {{"label": "Blog Section", "description": "Content management"}}
  ]
}}
```

**Question Selection Guidelines:**
- For servers: Ask about tech stack (analyze existing project first), monitoring needs, deployment
- For websites: Ask about purpose, tech stack (check existing setup), key features only
- For APIs: Ask about data format, auth requirements, tech stack
- For bug fixes: Ask about error details, reproduction steps, expected behavior
- Skip obvious questions - if context is clear, don't ask

After collecting all answers → STEP 2.5

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## STEP 2.5: Review collected answers (REQUIRED - DO NOT SKIP)

Show the user their answers:
```
**Review your answers:**

● [Question 1 text]
  → [Answer 1]

● [Question 2 text]
  → [Answer 2]

... (all questions and answers)
```

Then ask for confirmation:
```
{{
  "question": "Ready to enhance your prompt with these answers?",
  "header": "Confirm",
  "multiSelect": false,
  "options": [
    {{"label": "Yes, enhance it", "description": "Call Claude API to create enhanced prompt"}},
    {{"label": "No, start over", "description": "Ask questions again"}}
  ]
}}
```

✅ If YES → YOU MUST continue to STEP 3
⚠️ If NO → Go back to STEP 2

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## STEP 3: Call Claude API to generate enhanced prompt (CRITICAL - MUST DO THIS!)

🚨 THIS IS THE MOST IMPORTANT STEP - YOU MUST CALL THE CLAUDE API 🚨

Build a clean, single-line prompt by combining the original request with user answers:

**IMPORTANT:** Create a concise summary WITHOUT newlines or special formatting:
- Original: "{{escaped}}"
- Include key requirements from user answers in plain text
- Example: "Create a Node.js/Express server to monitor local network status. Monitor device availability and ping/latency for configurable IPs/hostnames. Include a web dashboard with real-time updates."

Then call the CLI directly (most reliable method):
```bash
cd /Users/toan/Desktop/StackCraft\\ Copilot/mcp-servers/prompt-enhancer && node server.js "YOUR_CLEAN_SINGLE_LINE_PROMPT_HERE"
```

**Why CLI instead of MCP tool?**
- The MCP tool can have JSON escaping issues with complex prompts
- CLI is more reliable for prompts with special characters
- CLI produces identical output

**CRITICAL FORMATTING RULES:**
1. Keep the prompt as a single continuous text
2. Don't use bullet points or newlines in the prompt
3. Use simple comma-separated clauses
4. Example format: "Create X that does Y. Include features: A, B, C. Use technology: Z."

The API will return an enhanced prompt with:
- Enhanced version
- Techniques applied
- Confidence score
- API cost
- Token usage

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## STEP 4: Show enhanced prompt to user (REQUIRED)

After the API call completes, display the results clearly:
```
**ENHANCED PROMPT** (via Claude Sonnet 4.5 API)

[Enhanced prompt text]

**Enhancements Applied:**
- [List techniques]

**Quality Metrics:**
- Confidence: X/10
- API Cost: $0.00XXXX
- Tokens: XXX input, XXX output

This enhanced prompt will help you get better results on the first try.
```

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## STEP 5: Get user confirmation (REQUIRED)

Ask if they want to use the enhanced prompt:
```
{{
  "question": "Would you like to proceed with this enhanced prompt?",
  "header": "Confirm",
  "multiSelect": false,
  "options": [
    {{"label": "Yes, use it", "description": "Proceed with enhanced version"}},
    {{"label": "Adjust it", "description": "Make changes first"}},
    {{"label": "Use original", "description": "Skip enhancement"}}
  ]
}}
```

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## STEP 6: Execute based on user's choice

Based on their answer:
- **"Yes, use it"** → NOW execute: `[ENHANCED BY STACKCRAFT] {{enhanced_prompt}}`
- **"Adjust it"** → Ask what to change, regenerate with new info, then repeat STEP 4
- **"Use original"** → Execute: "{escaped}"

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🚨 **CRITICAL COMPLIANCE REQUIREMENTS** 🚨

**YOU MUST:**
✅ Follow ALL steps in order (STEP 1 → 1.5 → 2 → 2.5 → 3 → 4 → 5 → 6)
✅ Call Claude API in STEP 3 (this is non-negotiable!)
✅ Show API cost and confidence score in STEP 4
✅ Get user confirmation before executing (STEP 5)
✅ Analyze project context before asking questions (STEP 1.5)
✅ Ask questions ONE AT A TIME (not all at once)
✅ Put recommended option FIRST with "(Recommended)" label

**YOU MUST NOT:**
❌ Skip any steps (especially STEP 3 - the API call!)
❌ Go straight to implementation without following the workflow
❌ Ask all questions at once (ask ONE, wait, then next)
❌ Skip the Claude API call (that's the whole point!)
❌ Proceed without user confirmation (STEP 5)

**Why this workflow matters:**
This is StackCraft Copilot's core feature - using Claude API to enhance vague prompts.
If you skip STEP 3 (API call), the plugin isn't working properly.
The user needs to see the API cost and confidence score to validate the enhancement.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Now begin with STEP 1.'''

output_json(wrapped)
sys.exit(0)
