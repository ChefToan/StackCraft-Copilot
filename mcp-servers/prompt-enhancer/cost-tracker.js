/**
 * Cost tracking and analytics
 */

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const LOG_FILE = join(__dirname, 'enhancement-log.jsonl');

/**
 * Log an enhancement to the tracking file
 * @param {Object} result - Enhancement result object
 * @param {string} result.original - Original prompt
 * @param {Object} result.enhanced - Enhanced prompt data
 * @param {Object} result.usage - API usage statistics
 */
export function logEnhancement(result) {
  const logEntry = {
    timestamp: new Date().toISOString(),
    original: result.original,
    confidence: result.enhanced?.confidence || 0,
    techniques: result.enhanced?.techniques || [],
    inputTokens: result.usage.inputTokens,
    outputTokens: result.usage.outputTokens,
    cost: parseFloat(result.usage.cost.total),
  };

  const line = JSON.stringify(logEntry) + '\n';

  try {
    writeFileSync(LOG_FILE, line, { flag: 'a' });
  } catch (error) {
    console.error('[Tracker] Failed to log enhancement:', error.message);
  }
}

/**
 * Load all enhancement logs from JSONL file
 * @returns {Array<Object>} Array of log entries
 */
function loadLogs() {
  if (!existsSync(LOG_FILE)) {
    return [];
  }

  try {
    const content = readFileSync(LOG_FILE, 'utf-8');
    return content
      .split('\n')
      .filter(line => line.trim())
      .map(line => JSON.parse(line));
  } catch (error) {
    console.error('[Tracker] Failed to load logs:', error.message);
    return [];
  }
}

/**
 * Calculate statistics from enhancement logs
 * @returns {Object} Statistics object with totals, averages, and top techniques
 */
export function getStats() {
  const logs = loadLogs();

  if (logs.length === 0) {
    return {
      totalEnhancements: 0,
      averageConfidence: 0,
      totalCost: 0,
      averageCost: 0,
      totalInputTokens: 0,
      totalOutputTokens: 0,
      lastEnhancement: null,
    };
  }

  const totalCost = logs.reduce((sum, log) => sum + log.cost, 0);
  const avgConfidence = logs.reduce((sum, log) => sum + log.confidence, 0) / logs.length;
  const totalInputTokens = logs.reduce((sum, log) => sum + log.inputTokens, 0);
  const totalOutputTokens = logs.reduce((sum, log) => sum + log.outputTokens, 0);

  // Count technique usage
  const techniqueCount = {};
  logs.forEach(log => {
    log.techniques.forEach(tech => {
      techniqueCount[tech] = (techniqueCount[tech] || 0) + 1;
    });
  });

  return {
    totalEnhancements: logs.length,
    averageConfidence: avgConfidence.toFixed(1),
    totalCost: totalCost.toFixed(6),
    averageCost: (totalCost / logs.length).toFixed(6),
    totalInputTokens,
    totalOutputTokens,
    lastEnhancement: logs[logs.length - 1].timestamp,
    topTechniques: Object.entries(techniqueCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([tech, count]) => ({ technique: tech, count })),
  };
}

/**
 * Format stats for display
 * @returns {string} Formatted statistics string ready for console output
 */
export function formatStats() {
  const stats = getStats();

  if (stats.totalEnhancements === 0) {
    return `
📊 Enhancement Statistics

No enhancements logged yet. Run some enhancements to see stats!

Example:
  node server.js "make a website"
`;
  }

  let output = `
📊 Enhancement Statistics

Total Enhancements: ${stats.totalEnhancements}
Average Confidence: ${stats.averageConfidence}/10

💰 Cost Analysis
Total API Cost: $${stats.totalCost}
Average Cost: $${stats.averageCost} per enhancement

🎯 Token Usage
Input Tokens: ${stats.totalInputTokens.toLocaleString()}
Output Tokens: ${stats.totalOutputTokens.toLocaleString()}
Total Tokens: ${(stats.totalInputTokens + stats.totalOutputTokens).toLocaleString()}

🔥 Top Techniques
`;

  stats.topTechniques.forEach((item, i) => {
    output += `${i + 1}. ${item.technique} (${item.count}x)\n`;
  });

  output += `\nLast Enhancement: ${new Date(stats.lastEnhancement).toLocaleString()}`;

  return output;
}

/**
 * Clear all logs (for testing purposes)
 * @returns {void}
 */
export function clearLogs() {
  if (existsSync(LOG_FILE)) {
    writeFileSync(LOG_FILE, '');
  }
}
