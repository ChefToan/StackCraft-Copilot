#!/usr/bin/env node

/**
 * Prompt Enhancer - Claude API-Powered Tool
 *
 * Helps developers write better prompts by applying prompt engineering techniques
 * through the Claude API. Improves developer productivity by teaching better
 * AI interaction patterns.
 *
 * @version 0.2.0
 * @features Templates, Cost Tracking, TypeScript types
 */

import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import Anthropic from '@anthropic-ai/sdk';
import { getTemplate, listTemplates } from './templates.js';
import { logEnhancement, formatStats } from './cost-tracker.js';

// Load .env from project root
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '../../.env') });

// Initialize Claude API client
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

/**
 * Prompt Engineering System Prompt
 */
const PROMPT_ENGINEERING_EXPERT = `You are an expert prompt engineering consultant specializing in helping developers write better prompts for AI tools.

Your role is to transform vague, unclear, or ineffective prompts into highly effective ones using these techniques:

1. **Role Assignment**: Add expert personas (e.g., "Act as a senior software architect...")
2. **Context Addition**: Include relevant technical context and constraints
3. **Step-by-Step Structure**: Break complex requests into clear steps
4. **Output Specification**: Define exactly what format the response should take
5. **Example Provision**: Add examples when helpful
6. **Constraint Definition**: Specify limitations, requirements, preferences

When enhancing a prompt, you should:
- Ask clarifying questions if the request is very vague
- Apply appropriate prompt engineering techniques
- Explain WHY each enhancement improves the prompt
- Show both the original and enhanced versions
- Provide a confidence score (1-10) for the enhancement

Return your response in this JSON structure:
{
  "needsClarification": boolean,
  "clarificationQuestions": ["question1", "question2"] or null,
  "enhanced": {
    "prompt": "The enhanced prompt",
    "techniques": ["technique1", "technique2"],
    "improvements": ["improvement1", "improvement2"],
    "confidence": 1-10
  },
  "explanation": "Why this enhancement works better"
}`;

/**
 * Enhance a developer's prompt using Claude API
 * @param {string} originalPrompt - The original prompt to enhance
 * @param {Object} context - Optional context for enhancement
 * @param {string} [context.template] - Template name to use
 * @param {string} [context.goal] - User's goal (learning, production, debugging, etc.)
 * @param {string} [context.experienceLevel] - Experience level (junior, mid-level, senior, expert)
 * @param {string} [context.domain] - Domain (web-development, backend, devops, etc.)
 * @returns {Promise<Object>} Enhancement result with enhanced prompt and metadata
 */
async function enhancePrompt(originalPrompt, context = {}) {
  try {
    // Use template if specified
    let systemPrompt = PROMPT_ENGINEERING_EXPERT;
    if (context.template) {
      const template = getTemplate(context.template);
      systemPrompt = template.systemPrompt + '\n\n' + PROMPT_ENGINEERING_EXPERT;
      console.error(`[Template] Using "${template.name}" template`);
    }

    const userMessage = `Original Prompt:
"${originalPrompt}"

${context.goal ? `User's Goal: ${context.goal}` : ''}
${context.experienceLevel ? `Experience Level: ${context.experienceLevel}` : ''}
${context.domain ? `Domain: ${context.domain}` : ''}
${context.template ? `Template: ${context.template}` : ''}

Enhance this prompt using prompt engineering best practices.`;

    console.error('[API] Calling Claude API for prompt enhancement...');

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-5-20250929',
      max_tokens: 2048,
      temperature: 0.7,
      system: systemPrompt,
      messages: [
        {
          role: 'user',
          content: userMessage,
        },
      ],
    });

    const responseText = message.content[0].text;
    console.error('[API] Received response from Claude API');

    // Parse JSON response
    const jsonMatch = responseText.match(/```json\s*([\s\S]*?)\s*```/) ||
                     responseText.match(/\{[\s\S]*\}/);

    let enhancement;
    if (jsonMatch) {
      const jsonStr = jsonMatch[1] || jsonMatch[0];
      enhancement = JSON.parse(jsonStr);
    } else {
      throw new Error('Failed to parse JSON from Claude response');
    }

    return {
      success: true,
      original: originalPrompt,
      ...enhancement,
      usage: {
        inputTokens: message.usage.input_tokens,
        outputTokens: message.usage.output_tokens,
        cost: calculateCost(message.usage),
      },
    };
  } catch (error) {
    console.error('[API] Error:', error);
    throw new Error(`Prompt enhancement failed: ${error.message}`);
  }
}

/**
 * Calculate approximate cost for API usage
 * @param {Object} usage - Token usage object from Claude API
 * @param {number} usage.input_tokens - Number of input tokens used
 * @param {number} usage.output_tokens - Number of output tokens used
 * @returns {Object} Cost breakdown with input, output, and total costs
 */
function calculateCost(usage) {
  // Claude Sonnet 4.5 pricing
  const inputCostPer1M = 3.00;  // $3 per 1M input tokens
  const outputCostPer1M = 15.00; // $15 per 1M output tokens

  const inputCost = (usage.input_tokens / 1_000_000) * inputCostPer1M;
  const outputCost = (usage.output_tokens / 1_000_000) * outputCostPer1M;

  return {
    input: inputCost.toFixed(6),
    output: outputCost.toFixed(6),
    total: (inputCost + outputCost).toFixed(6),
  };
}

/**
 * Format enhancement result as markdown
 * @param {Object} result - Enhancement result object
 * @returns {string} Formatted markdown string
 */
function formatMarkdown(result) {
  let md = `# Prompt Enhancement Results\n\n`;

  md += `## Original Prompt\n`;
  md += `\`\`\`\n${result.original}\n\`\`\`\n\n`;

  if (result.needsClarification) {
    md += `## ⚠️ Clarification Needed\n\n`;
    md += `To provide the best enhancement, please answer:\n\n`;
    result.clarificationQuestions.forEach((q, i) => {
      md += `${i + 1}. ${q}\n`;
    });
    md += `\n`;
    return md;
  }

  md += `## ✨ Enhanced Prompt\n`;
  md += `\`\`\`\n${result.enhanced.prompt}\n\`\`\`\n\n`;

  md += `## 🎯 Techniques Applied\n\n`;
  result.enhanced.techniques.forEach(t => {
    md += `- ${t}\n`;
  });
  md += `\n`;

  md += `## 💡 Key Improvements\n\n`;
  result.enhanced.improvements.forEach(imp => {
    md += `- ${imp}\n`;
  });
  md += `\n`;

  md += `## 📊 Confidence Score: ${result.enhanced.confidence}/10\n\n`;

  md += `## 📝 Explanation\n\n`;
  md += `${result.explanation}\n\n`;

  md += `---\n\n`;
  md += `**API Usage:**\n`;
  md += `- Input tokens: ${result.usage.inputTokens}\n`;
  md += `- Output tokens: ${result.usage.outputTokens}\n`;
  md += `- Estimated cost: $${result.usage.cost.total}\n\n`;

  md += `*Powered by Claude Sonnet 4.5 API*\n`;

  return md;
}

/**
 * CLI interface with template and stats support
 */
async function cli() {
  const args = process.argv.slice(2);

  // Handle special commands
  if (args.includes('--stats')) {
    console.log(formatStats());
    process.exit(0);
  }

  if (args.includes('--list-templates') || args.includes('--templates')) {
    console.log('\n📚 Available Templates\n');
    listTemplates().forEach(t => {
      console.log(`${t.key.padEnd(15)} - ${t.description}`);
      console.log(`${''.padEnd(15)}   Example: ${t.exampleUse}\n`);
    });
    process.exit(0);
  }

  if (args.length === 0 || args.includes('--help') || args.includes('-h')) {
    console.log(`
📝 Prompt Enhancer - Claude API-Powered Tool v0.2.0

Usage:
  node server.js "Your prompt here"
  node server.js --template <name> "Your prompt"
  node server.js --stats
  node server.js --list-templates

Options:
  --template <name>    Use a specific template (debug, code-review, refactor, etc.)
  --stats              Show enhancement statistics
  --list-templates     List all available templates
  --help, -h           Show this help

Examples:
  node server.js "make a website"
  node server.js --template debug "fix the error"
  node server.js --template code-review "review this code"
  node server.js --stats

Environment:
  ANTHROPIC_API_KEY    Your Anthropic API key (required)

Features:
  ✅ Claude API integration
  ✅ 8 built-in templates
  ✅ Cost tracking
  ✅ Confidence scoring (1-10)
`);
    process.exit(args.length === 0 ? 1 : 0);
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    console.error('❌ Error: ANTHROPIC_API_KEY environment variable not set');
    console.error('   Set it with: export ANTHROPIC_API_KEY="your-key"');
    process.exit(1);
  }

  // Parse template flag
  let template = null;
  let promptArgs = [...args];

  const templateIndex = args.findIndex(arg => arg === '--template' || arg === '-t');
  if (templateIndex !== -1 && args[templateIndex + 1]) {
    template = args[templateIndex + 1];
    promptArgs = args.filter((_, i) => i !== templateIndex && i !== templateIndex + 1);
  }

  const originalPrompt = promptArgs.join(' ');

  if (!originalPrompt.trim()) {
    console.error('❌ Error: No prompt provided');
    process.exit(1);
  }

  console.log('🔄 Enhancing your prompt using Claude API...\n');

  try {
    const context = template ? { template } : {};
    const result = await enhancePrompt(originalPrompt, context);

    // Log to cost tracker
    logEnhancement(result);

    const markdown = formatMarkdown(result);
    console.log(markdown);

    if (!result.needsClarification) {
      console.log('✅ Prompt enhanced successfully!');
      console.log(`💰 Cost: $${result.usage.cost.total}`);
      console.log(`📊 Confidence: ${result.enhanced.confidence}/10`);
      if (template) {
        console.log(`🎯 Template: ${template}`);
      }
      console.log('\n💡 Tip: Run "node server.js --stats" to see your usage statistics');
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

/**
 * MCP Server mode (for Claude Code integration)
 */
async function mcpServer() {
  const stdinBuffer = [];

  process.stdin.on('data', (chunk) => {
    stdinBuffer.push(chunk);
  });

  process.stdin.on('end', async () => {
    try {
      const input = Buffer.concat(stdinBuffer).toString();
      const request = JSON.parse(input);

      if (request.method === 'enhance') {
        const { prompt, context } = request.params;

        const result = await enhancePrompt(prompt, context);
        const markdown = formatMarkdown(result);

        const response = {
          jsonrpc: '2.0',
          id: request.id,
          result: {
            ...result,
            markdown,
          },
        };

        process.stdout.write(JSON.stringify(response) + '\n');
      } else {
        throw new Error(`Unknown method: ${request.method}`);
      }
    } catch (error) {
      const errorResponse = {
        jsonrpc: '2.0',
        id: 1,
        error: {
          code: -32603,
          message: error.message,
        },
      };
      process.stdout.write(JSON.stringify(errorResponse) + '\n');
    }
  });
}

// Determine mode based on how the script is called
// Check if we have command line arguments or if this is an interactive terminal
const isCliMode = process.argv.length > 2 || process.stdin.isTTY !== false;

if (isCliMode) {
  // CLI mode
  cli();
} else {
  // MCP Server mode (piped input, no arguments)
  mcpServer();
}

export { enhancePrompt, formatMarkdown };
