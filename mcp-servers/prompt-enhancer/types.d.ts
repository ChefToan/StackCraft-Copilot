/**
 * TypeScript type definitions for StackCraft Copilot Prompt Enhancer
 */

export interface EnhancementContext {
  goal?: 'learning' | 'production' | 'debugging' | 'code-review' | 'refactoring';
  experienceLevel?: 'junior' | 'mid-level' | 'senior' | 'expert';
  domain?: 'web-development' | 'backend' | 'devops' | 'mobile' | 'data-science' | 'general';
  template?: string;
}

export interface EnhancedPrompt {
  prompt: string;
  techniques: string[];
  improvements: string[];
  confidence: number; // 1-10
}

export interface Enhancement {
  needsClarification: boolean;
  clarificationQuestions: string[] | null;
  enhanced: EnhancedPrompt;
  explanation: string;
}

export interface APIUsage {
  inputTokens: number;
  outputTokens: number;
  cost: {
    input: string;
    output: string;
    total: string;
  };
}

export interface EnhancementResult {
  success: boolean;
  original: string;
  needsClarification: boolean;
  clarificationQuestions?: string[];
  enhanced: EnhancedPrompt;
  explanation: string;
  usage: APIUsage;
  timestamp?: string;
}

export interface EnhancementStats {
  totalEnhancements: number;
  averageConfidenceImprovement: number;
  totalCost: number;
  averageCost: number;
  lastEnhancement: string;
}

export interface PromptTemplate {
  name: string;
  description: string;
  systemPrompt: string;
  exampleUse: string;
}
