# Quick Analyze Command

You are executing the **StackCraft Copilot /quick-analyze** command. This command provides fast tech stack analysis without prompt refinement, ideal for experienced users who know exactly what they want.

## Command Overview

This command skips the prompt-sage agent and goes directly to stack-detective with sensible defaults.

## Workflow

### Step 1: Parse Input

Extract the website URL from user input:
- `/quick-analyze https://example.com`
- `/quick-analyze example.com`

### Step 2: Direct Stack Analysis

Immediately launch the `stack-detective` agent with default comprehensive analysis:

```
Use the Task tool to launch the stack-detective agent with:

"Analyze {URL} with comprehensive tech stack detection.

Use WebFetch to retrieve and analyze:

## Frontend Technologies
1. **Framework Detection** (React, Vue, Angular, Next.js, Svelte, Remix, etc.)
   - Exact version if possible
   - Detection confidence level

2. **UI Component Libraries** (NEW!)
   - shadcn/ui (check for Radix UI primitives, specific component patterns)
   - Radix UI (unstyled primitives)
   - Headless UI (Tailwind Labs)
   - Material-UI / MUI
   - Ant Design
   - Chakra UI
   - Mantine
   - NextUI
   - DaisyUI
   - React Aria (Adobe)

3. **CSS Architecture**
   - Framework (Tailwind, Bootstrap, Bulma, etc.)
   - CSS-in-JS (styled-components, Emotion, Stitches, Vanilla Extract)
   - CSS Modules
   - Utility libraries (clsx, classnames, cva)

4. **State Management**
   - Redux, Zustand, MobX, Jotai, Recoil, Valtio
   - React Context API
   - Server state (React Query, SWR, RTK Query)

5. **Build Tools**
   - Webpack, Vite, Parcel, Turbopack, esbuild, Rollup

6. **Form Libraries**
   - React Hook Form, Formik, React Final Form

7. **Animation Libraries**
   - Framer Motion, GSAP, React Spring, Anime.js

8. **Third-Party Integrations**
   - Analytics, Auth providers, Payment processors, CDNs

## Output Format

Provide a **Quick Summary** format:

```markdown
# Tech Stack: {Website Name}

## Core Stack
**Framework:** {Name + Version} → [Docs](link)
**CSS:** {Approach} → [Docs](link)
**State:** {Library} → [Docs](link)
**Build:** {Tool} → [Docs](link)

## UI Components
{Component Library} → [Docs](link)
└─ {Specific components detected}

## Key Libraries
- {Library 1} - {Purpose} → [Docs](link)
- {Library 2} - {Purpose} → [Docs](link)

## Architecture
**Rendering:** {SSR/SSG/CSR/ISR}
**Performance:** {Key optimizations}

## Confidence
✅ High: {Technologies with definitive proof}
⚠️ Medium: {Strong indicators}
❓ Low: {Educated guesses}
```

Include official documentation links for every detected technology."
```

### Step 3: Present Results

Display the stack-detective output directly without additional commentary.

## Use Cases

Perfect for:
- Experienced developers who want quick results
- Analyzing multiple sites quickly
- When you already know what you're looking for
- Time-sensitive competitive analysis

## Difference from /analyze-site

| Feature | /analyze-site | /quick-analyze |
|---------|---------------|----------------|
| Prompt Refinement | ✅ Yes (guided questions) | ❌ No |
| Customization | ✅ High (tailored to user) | ⚠️ Standard defaults |
| Speed | Slower (interactive) | ✅ Fast (immediate) |
| Output Detail | Variable (user choice) | Quick summary |
| Best For | First-time users, learning | Experienced users, speed |

Execute this command for users who value speed and know what they want! ⚡
