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
wrapped = f'''Original request: "{escaped}"

**StackCraft Copilot Notice:**
I noticed your prompt could be enhanced for better results. Let me help you refine it using Claude API.

**WORKFLOW YOU MUST FOLLOW:**

## STEP 1: Detect prompt quality
You've detected this is a vague prompt. Inform the user:

"I noticed your prompt **'{escaped}'** could be improved. I have some questions that will help me create a more effective prompt for you."

Then ask: "Would you like me to ask clarifying questions to enhance your prompt?"

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

If user says NO → execute original prompt: "{escaped}"

If user says YES → Continue to STEP 2

## STEP 2: Ask clarifying questions ONE AT A TIME

Based on the prompt type, ask 2-4 targeted questions.

**IMPORTANT: Ask ONE question, wait for answer, then ask next question.**

For "make a website" example:
```
Question 1:
{{
  "question": "What is the primary purpose of this website?",
  "header": "Purpose",
  "multiSelect": false,
  "options": [
    {{"label": "Personal Portfolio", "description": "Showcase your work"}},
    {{"label": "Business/Company", "description": "Professional business site"}},
    {{"label": "E-commerce", "description": "Sell products online"}},
    {{"label": "Blog/Content", "description": "Publishing platform"}}
  ]
}}

[Wait for answer]

Question 2:
{{
  "question": "Which technology stack should I use?",
  "header": "Tech Stack",
  "multiSelect": false,
  "options": [
    {{"label": "Next.js", "description": "React framework with SSR"}},
    {{"label": "React + Vite", "description": "Fast modern setup"}},
    {{"label": "Vue + Nuxt", "description": "Vue framework"}}
  ]
}}

[Wait for answer]

Question 3:
{{
  "question": "Which features do you want to enable?",
  "header": "Features",
  "multiSelect": true,
  "options": [
    {{"label": "Contact Form", "description": "Email contact"}},
    {{"label": "Image Gallery", "description": "Photo showcase"}},
    {{"label": "Blog Section", "description": "Content management"}},
    {{"label": "Dark Mode", "description": "Theme toggle"}}
  ]
}}
```

After collecting all answers → STEP 2.5

## STEP 2.5: Review collected answers

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

If YES → Continue to STEP 3
If NO → Go back to STEP 2

## STEP 3: Call Claude API to generate enhanced prompt

Now call the MCP tool with collected information:

**CRITICAL:** Use the MCP tool `mcp__prompt-enhancer__enhance_prompt`

If that doesn't work, run the CLI directly:
```bash
cd /Users/toan/Desktop/StackCraft\\ Copilot/mcp-servers/prompt-enhancer && node server.js "{{escaped}}"
```

The API will return an enhanced prompt with:
- Enhanced version
- Techniques applied
- Confidence score
- API cost
- Token usage

## STEP 4: Show enhanced prompt to user

Display clearly:
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

## STEP 5: Get user confirmation

Ask if they want to use it:
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

## STEP 6: Execute based on choice

- **Yes, use it** → Execute: `[ENHANCED BY STACKCRAFT] {{enhanced_prompt}}`
- **Adjust it** → Ask what to change, regenerate with new info
- **Use original** → Execute: "{escaped}"

**IMPORTANT RULES:**
1. Ask questions ONE AT A TIME (not all together)
2. MUST call Claude API via MCP tool or CLI
3. MUST show API cost (proves real API usage)
4. MUST get user confirmation before proceeding
5. Questions must be specific to the prompt type

Begin STEP 1 now.'''

output_json(wrapped)
sys.exit(0)
