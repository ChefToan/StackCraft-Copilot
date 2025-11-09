# Analyze Site Command

You are executing the **StackCraft Copilot /analyze-site** command. This command provides an intelligent, guided website tech stack analysis experience.

## Command Overview

This command analyzes any live website to detect its tech stack (frameworks, libraries, CSS architecture, build tools, etc.) with intelligent prompt engineering guidance.

## Workflow

### Step 1: Parse User Input

The user will provide a website URL in one of these formats:
- `/analyze-site https://example.com`
- `/analyze-site example.com` (you'll add https://)
- `/analyze-site https://example.com with detailed analysis`

Extract the URL and any additional context from their input.

### Step 2: Invoke Prompt Sage Agent

Launch the `prompt-sage` agent to refine the user's request:

```
Use the Task tool to launch the prompt-sage agent with:

"The user wants to analyze {URL}.

Guide them through creating an effective analysis prompt by:
1. Asking about their primary goal (learn, clone, competitive analysis, etc.)
2. Determining their experience level (junior, mid, senior, non-technical)
3. Identifying focus areas (frontend, CSS, state management, performance, etc.)
4. Choosing output format (detailed report, quick summary, learning guide)

Use the AskUserQuestion tool to collect their preferences, then construct a refined, detailed prompt for the stack-detective agent.

Return the refined prompt for user approval."
```

### Step 3: Get User Approval

The prompt-sage agent will present a refined prompt. Wait for user confirmation:
- If "yes" → Proceed to Step 4
- If "edit" → Let user modify the prompt
- If "cancel" → Abort and ask if they want a quick analysis instead

### Step 4: Invoke Stack Detective Agent

Launch the `stack-detective` agent with the refined prompt:

```
Use the Task tool to launch the stack-detective agent with:

"{REFINED_PROMPT from prompt-sage}

Website URL: {URL}

Use the WebFetch tool to retrieve the website HTML and analyze:
1. Frontend framework (React, Vue, Angular, Next.js, Svelte, etc.) with version
2. CSS architecture (Tailwind, Bootstrap, styled-components, CSS Modules, etc.)
3. State management (Redux, Zustand, MobX, Context API, etc.)
4. Build tools (Webpack, Vite, Parcel, Turbopack)
5. Third-party libraries and integrations
6. Architectural patterns (SSR, SSG, CSR, ISR)
7. Performance optimizations

For EVERY detected technology, provide:
- Exact name and version (if detectable)
- Official documentation link
- Confidence level (High/Medium/Low)
- Key detection indicators

Format output according to user's requested format: {OUTPUT_FORMAT}
Tailor explanations to experience level: {EXPERIENCE_LEVEL}
Focus on areas: {FOCUS_AREAS}"
```

### Step 5: Present Results

Once the stack-detective agent completes analysis, present the results to the user with:

```markdown
# ✅ Analysis Complete for {Website Name}

{AGENT_OUTPUT}

---

💡 **What's next?**
- `/analyze-site [another-url]` - Analyze another website
- Ask me questions about any detected technology
- Request deeper analysis on specific aspects
- (Future) Use `/clone-site` to generate boilerplate code
```

## Example Usage

**Example 1: Simple Request**
```
User: /analyze-site netflix.com
→ Prompt Sage asks 4 questions
→ User answers: Goal=Learning, Level=Junior, Focus=All, Format=Learning Guide
→ Stack Detective analyzes with educational focus
→ Returns beginner-friendly guide with learning resources
```

**Example 2: Detailed Request**
```
User: /analyze-site airbnb.com as a senior developer focusing on state management and performance
→ Prompt Sage detects detailed intent, asks minimal clarifying questions
→ Stack Detective performs deep dive on state and performance
→ Returns technical analysis with architecture insights
```

## Error Handling

If errors occur:
- **Invalid URL:** Ask user to provide a valid website URL
- **Website unreachable:** Inform user the site couldn't be fetched (firewall, geo-blocking, etc.)
- **No clear tech stack:** Analyze what's visible, note limitations of external analysis
- **Agent failure:** Provide fallback basic analysis using WebFetch directly

## Important Notes

- Always start with prompt-sage unless user explicitly says "quick analyze"
- Ensure every detected technology has a documentation link
- Be honest about detection confidence levels
- Tailor depth and language to user's experience level
- Focus analysis on user's stated goals (learning vs. rebuilding vs. comparison)

## User Experience Goal

Make users feel like they have an expert consultant who:
1. Asks the right questions to understand their needs
2. Delivers precisely targeted analysis
3. Provides actionable insights with learning resources
4. Respects their time by focusing on what matters to them

Execute this command with care and intelligence. This is the flagship feature of StackCraft Copilot! 🚀
