#!/usr/bin/env node

/**
 * Prompt Enhancer MCP Server
 *
 * Official MCP server implementation using @modelcontextprotocol/sdk
 * Exposes prompt enhancement as an MCP tool for Claude Code integration
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import Anthropic from '@anthropic-ai/sdk';
import { logEnhancement } from './cost-tracker.js';
import { getTemplate } from './templates.js';

// Load environment variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '../../.env') });

// Initialize Claude API
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// System prompt for prompt engineering
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
 * Enhance a prompt using Claude API
 */
async function enhancePrompt(originalPrompt, templateName = null) {
  let systemPrompt = PROMPT_ENGINEERING_EXPERT;

  // Apply template if specified
  if (templateName) {
    const template = getTemplate(templateName);
    systemPrompt = template.systemPrompt + '\n\n' + PROMPT_ENGINEERING_EXPERT;
  }

  const userMessage = `Original Prompt:
"${originalPrompt}"

${templateName ? `Template: ${templateName}` : ''}

Enhance this prompt using prompt engineering best practices.`;

  const message = await anthropic.messages.create({
    model: 'claude-sonnet-4-5-20250929',
    max_tokens: 2048,
    temperature: 0.7,
    system: systemPrompt,
    messages: [{
      role: 'user',
      content: userMessage,
    }],
  });

  const responseText = message.content[0].text;

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

  // Calculate cost
  const inputCost = (message.usage.input_tokens / 1_000_000) * 3.00;
  const outputCost = (message.usage.output_tokens / 1_000_000) * 15.00;
  const cost = {
    input: inputCost.toFixed(6),
    output: outputCost.toFixed(6),
    total: (inputCost + outputCost).toFixed(6),
  };

  const result = {
    success: true,
    original: originalPrompt,
    ...enhancement,
    usage: {
      inputTokens: message.usage.input_tokens,
      outputTokens: message.usage.output_tokens,
      cost,
    },
  };

  // Log for analytics
  logEnhancement(result);

  return result;
}

// Create MCP server
const server = new Server(
  {
    name: 'prompt-enhancer',
    version: '0.2.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Define the enhance_prompt tool
server.setRequestHandler('tools/list', async () => {
  return {
    tools: [
      {
        name: 'enhance_prompt',
        description: 'Enhance a developer prompt using Claude API and prompt engineering best practices. Transforms vague prompts into highly effective ones with role assignment, context, structure, and clear specifications.',
        inputSchema: {
          type: 'object',
          properties: {
            prompt: {
              type: 'string',
              description: 'The original prompt to enhance'
            },
            template: {
              type: 'string',
              enum: ['debug', 'code-review', 'refactor', 'architecture', 'optimize', 'test', 'api', 'security'],
              description: 'Optional template to apply (debug, code-review, refactor, architecture, optimize, test, api, security)'
            }
          },
          required: ['prompt']
        },
      },
    ],
  };
});

// Handle tool calls
server.setRequestHandler('tools/call', async (request) => {
  if (request.params.name === 'enhance_prompt') {
    const { prompt, template } = request.params.arguments;

    if (!process.env.ANTHROPIC_API_KEY) {
      return {
        content: [{
          type: 'text',
          text: '❌ Error: ANTHROPIC_API_KEY environment variable not set. Please add your API key to the .env file.',
        }],
        isError: true,
      };
    }

    try {
      const result = await enhancePrompt(prompt, template);

      // Format result as markdown
      let markdown = `# ✨ Prompt Enhancement Results\n\n`;
      markdown += `## Original Prompt\n\`\`\`\n${result.original}\n\`\`\`\n\n`;

      if (result.needsClarification) {
        markdown += `## ⚠️ Clarification Needed\n\n`;
        markdown += `To provide the best enhancement, please answer:\n\n`;
        result.clarificationQuestions.forEach((q, i) => {
          markdown += `${i + 1}. ${q}\n`;
        });
      } else {
        markdown += `## 🎯 Enhanced Prompt\n\`\`\`\n${result.enhanced.prompt}\n\`\`\`\n\n`;
        markdown += `## 📋 Techniques Applied\n\n`;
        result.enhanced.techniques.forEach(t => markdown += `- ${t}\n`);
        markdown += `\n## 💡 Key Improvements\n\n`;
        result.enhanced.improvements.forEach(imp => markdown += `- ${imp}\n`);
        markdown += `\n## 📊 Confidence: ${result.enhanced.confidence}/10\n\n`;
        markdown += `## 📝 Explanation\n\n${result.explanation}\n\n`;
        markdown += `---\n\n**API Usage:** Input: ${result.usage.inputTokens} tokens | Output: ${result.usage.outputTokens} tokens | Cost: $${result.usage.cost.total}\n\n`;
        markdown += `*Powered by Claude Sonnet 4.5 API*`;
      }

      return {
        content: [{
          type: 'text',
          text: markdown,
        }],
        isError: false,
      };
    } catch (error) {
      return {
        content: [{
          type: 'text',
          text: `❌ Error: ${error.message}`,
        }],
        isError: true,
      };
    }
  }

  throw new Error(`Unknown tool: ${request.params.name}`);
});

// Start the server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);

  // Log to stderr (stdout is used for MCP protocol)
  console.error('Prompt Enhancer MCP Server running');
  console.error('Version: 0.2.0');
  console.error('API Key:', process.env.ANTHROPIC_API_KEY ? '✅ Configured' : '❌ Missing');
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
