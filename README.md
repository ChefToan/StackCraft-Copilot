# StackCraft Copilot 🚀

> AI-powered website tech stack analyzer with intelligent prompt engineering for Claude Code

[![Version](https://img.shields.io/badge/version-0.1.0-blue.svg)](https://github.com/yourusername/stackcraft-copilot)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)

## 🎯 Problem

Developers face three major challenges when analyzing websites:

1. **Time-consuming reverse engineering** - Manually inspecting source code, network requests, and bundled files to identify tech stacks
2. **Poor prompt quality** - Vague questions lead to incomplete or inaccurate analysis results
3. **Component-level blindness** - Existing tools detect frameworks but miss specific UI component libraries and implementations

## 💡 Solution

**StackCraft Copilot** is a Claude Code plugin that combines intelligent prompt engineering with comprehensive tech stack detection to deliver accurate, educational analysis of any website.

### Key Innovations

#### 🧠 Prompt Sage Agent
The industry's first **AI prompt engineering assistant** that transforms vague requests into highly effective analysis prompts through guided questioning:

- Asks 4 smart clarifying questions (Goal, Experience Level, Focus Areas, Output Format)
- Applies prompt engineering best practices automatically
- Tailors results to user's specific needs and background
- Shows the refined prompt for transparency and learning

#### 🔍 Stack Detective Agent
Advanced tech stack analyzer with **component-level precision**:

- **50+ technologies** across 10+ categories
- **Specific component detection** - Not just "uses shadcn/ui" but "Dialog, DropdownMenu, Select, Command components detected"
- **Version detection** when possible
- **Official documentation links** for every detected technology
- **Confidence levels** (High/Medium/Low) for honest accuracy reporting

## 🎨 Features

### Comprehensive Detection

| Category | Technologies Detected |
|----------|----------------------|
| **Frameworks** | React, Next.js, Vue, Nuxt, Angular, Svelte, Remix, Astro, Gatsby |
| **UI Components** | shadcn/ui, Radix UI, Headless UI, Material-UI, Ant Design, Chakra UI, Mantine, NextUI, DaisyUI, React Aria, Tremor |
| **CSS** | Tailwind, Bootstrap, styled-components, Emotion, CSS Modules, Stitches, Vanilla Extract |
| **State Management** | Redux, Zustand, MobX, Jotai, Recoil, Valtio, XState |
| **Build Tools** | Webpack, Vite, Parcel, Turbopack, esbuild, Rollup |
| **Data Fetching** | React Query, SWR, Apollo Client, Axios |
| **Forms** | React Hook Form, Formik, TanStack Form |
| **Animation** | Framer Motion, GSAP, React Spring, Anime.js |
| **Utilities** | clsx, cva, cmdk, Sonner |
| **Testing** | Jest, Vitest, Cypress, Playwright, Testing Library |

### Dual-Mode Experience

**Guided Mode** (`/analyze-site`) - Perfect for:
- First-time users
- Learning-focused analysis
- Complex requirements
- Customized output formats

**Quick Mode** (`/quick-analyze`) - Perfect for:
- Experienced developers
- Rapid competitive analysis
- Time-sensitive research
- Standard comprehensive reports

## 🚀 Quick Start

### Installation

```bash
# Copy plugin to Claude Code plugins directory
cp -r stackcraft-copilot ~/.claude/plugins/

# Or create a symlink
ln -s /path/to/stackcraft-copilot ~/.claude/plugins/stackcraft-copilot
```

### Usage

#### Guided Analysis (with Prompt Sage)
```bash
/analyze-site vercel.com
```

**What happens:**
1. Prompt Sage asks 4 smart questions about your goals
2. You select preferences via interactive UI
3. Refined prompt is shown for approval
4. Stack Detective performs deep analysis
5. Results tailored to your experience level and focus areas

#### Quick Analysis (Power User Mode)
```bash
/quick-analyze linear.app
```

**What happens:**
1. Immediate comprehensive analysis
2. Standard detailed report format
3. All categories covered
4. Documentation links included

## 📊 Example Output

### Tech Stack Analysis: Vercel.com

#### 🎯 Executive Summary
- Primary framework: **Next.js 14.0.3**
- UI components: **Radix UI primitives with custom styling**
- CSS approach: **Tailwind CSS with custom design tokens**
- State management: **React Context API**
- Build tool: **Turbopack (Next.js 14)**
- Notable features: Server Components, App Router, Edge Runtime

#### 📦 Detected Technologies

**Frontend Framework**
- **Next.js v14.0.3**
  - **Detection confidence:** High ✅
  - **Documentation:** https://nextjs.org/docs
  - **Key indicators:** `__NEXT_DATA__` script, `/_next/` assets, App Router structure

**UI Component Library**
- **Radix UI Primitives**
  - **Detection confidence:** High ✅
  - **Documentation:** https://www.radix-ui.com/
  - **Detected components:** Dialog, DropdownMenu, Popover, Tooltip
  - **Built with:** Unstyled primitives with custom CSS
  - **Key features:** Accessible, keyboard navigable, ARIA-compliant

**CSS Architecture**
- **Tailwind CSS**
  - **Documentation:** https://tailwindcss.com/docs
  - **Implementation:** Utility-first with custom configuration, design tokens via CSS variables

[... full detailed report continues ...]

## 🎬 Demo Videos

### Analysis Flow
1. User runs `/analyze-site airbnb.com`
2. Prompt Sage asks clarifying questions
3. User selects: Goal=Clone, Level=Mid, Focus=Frontend+CSS+State
4. Stack Detective detects: React 18, Redux Toolkit, styled-components
5. Report includes specific components, architecture patterns, learning resources

### Component Detection Showcase
1. User runs `/analyze-site ui.shadcn.com`
2. Detects shadcn/ui with specific components:
   - Dialog (`data-radix-dialog-*`)
   - Command Menu (`cmdk` library)
   - Select, DropdownMenu, Tabs
3. Shows underlying technologies: Radix UI + Tailwind + cva
4. Provides docs for each component

## 🏗️ Architecture

```
stackcraft-copilot/
├── plugin.json                 # Plugin manifest
├── agents/
│   ├── prompt-sage/           # Prompt engineering agent
│   │   ├── agent.json
│   │   └── system-prompt.md
│   └── stack-detective/       # Tech stack analyzer
│       ├── agent.json
│       └── system-prompt.md
├── commands/
│   ├── analyze-site.md        # Guided analysis
│   └── quick-analyze.md       # Quick analysis
└── utils/
    └── docs-links.json        # Documentation database
```

### Agent Workflows

**Prompt Sage Flow:**
```
User Input → Parse Intent → Ask Questions → Collect Answers →
Construct Refined Prompt → Show for Approval → Pass to Stack Detective
```

**Stack Detective Flow:**
```
Receive URL + Prompt → Fetch HTML → Detect Frameworks →
Detect UI Components → Detect CSS → Detect State Management →
Detect Build Tools → Detect Third-Party Libraries →
Compile Report → Add Documentation Links → Return Results
```

## 🔬 Technical Highlights

### Intelligent Detection Algorithms

**shadcn/ui Detection Example:**
- Looks for `data-radix-*` attributes (Radix UI primitives)
- Combined with Tailwind utility classes
- Specific component patterns (Dialog, Command, Select)
- `cmdk` library for Command Menu
- Class Variance Authority (cva) usage
- Confidence: High when all indicators present

**Framework Version Detection:**
- Parses CDN URLs for version numbers
- Checks `__NEXT_DATA__`, `__REACT__`, etc. for build info
- Analyzes chunk naming patterns
- Meta tags and generator hints

### Documentation Database
Curated collection of 100+ official documentation links organized by category:
- Frameworks, UI Components, CSS, State Management
- Build Tools, Data Fetching, Forms, Animation
- Utilities, Testing, and more

## 🎓 Educational Focus

Every analysis includes:
- **Official documentation links** for each technology
- **Getting started guides**
- **Best practices resources**
- **Learning path recommendations** (when requested)
- **Confidence levels** to teach critical thinking

## 🆚 Comparison with Existing Solutions

| Feature | StackCraft Copilot | Manual Inspection | Generic AI Analysis |
|---------|-------------------|-------------------|-------------------|
| **Prompt Engineering** | ✅ Guided refinement | ❌ N/A | ❌ No guidance |
| **Component Detection** | ✅ Specific components | ⚠️ Time-consuming | ❌ Generic only |
| **Documentation Links** | ✅ Always included | ⚠️ Manual search | ⚠️ Sometimes |
| **Tailored Experience** | ✅ Role-based | ❌ One-size-fits-all | ❌ Generic |
| **Confidence Levels** | ✅ Honest reporting | ⚠️ Uncertain | ❌ No indicators |
| **Speed** | ✅ 30-60 seconds | ❌ Hours | ⚠️ Varies |

## 🚧 Future Roadmap

### Phase 2: Code Generation
- Generate boilerplate matching detected stack
- Create component scaffolds
- Set up package.json with exact versions

### Phase 3: Comparison Mode
- Side-by-side analysis of multiple sites
- Architectural pattern comparison
- Technology trade-off analysis

### Phase 4: Advanced Features
- Performance profiling integration
- Security audit capabilities
- Accessibility compliance checking
- Migration complexity estimation

## 🤝 Contributing

We welcome contributions! Areas of interest:
- Additional technology detection patterns
- Improved accuracy algorithms
- New output formats
- Documentation improvements

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details

## 🙏 Acknowledgments

- **Claude Code** - For providing the extensibility platform
- **Radix UI, shadcn/ui, and all open-source projects** - For building amazing tools
- **Web development community** - For continuous innovation

## 📞 Contact

- GitHub: [@yourusername](https://github.com/yourusername)
- Issues: [GitHub Issues](https://github.com/yourusername/stackcraft-copilot/issues)

---

**Built with ❤️ for the hackathon**

*Empowering developers to learn from the web's best.*
