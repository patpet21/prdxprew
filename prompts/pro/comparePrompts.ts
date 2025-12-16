
import { TokenizationCategory } from '../../types';

export const COMPARE_JURISDICTIONS_PROMPT = (j1: string, j2: string, asset: string) => `
Act as a Global Legal Strategist.
Compare Jurisdiction A (${j1}) vs Jurisdiction B (${j2}) for a ${asset} tokenization project.

Analyze:
1. **Speed**: Which is faster to set up?
2. **Cost**: Initial + Annual maintenance.
3. **Reputation**: Investor trust level.
4. **Crypto-Friendliness**: Banking and specific laws (e.g. DLT Act).

Output strictly JSON:
{
  "winner": "string (A or B or Tie)",
  "trade_offs": ["string", "string"],
  "verdict": "string (2 sentences)"
}
`;

export const COMPARE_SPV_PROMPT = (modelA: string, modelB: string) => `
Act as a Corporate Structuring Expert.
Compare SPV Model A (${modelA}) vs Model B (${modelB}).

Focus on:
1. **Liability Isolation**.
2. **Tax Leakage** (Withholding tax risks).
3. **Operational Complexity**.

Output strictly JSON: { "recommendation": "string", "pros_cons_matrix": "string" }
`;

export const COMPARE_TOKEN_TYPES_PROMPT = (typeA: string, typeB: string) => `
Act as a Token Economist.
Compare Token Type A (${typeA}) vs Type B (${typeB}).

Analyze:
1. **Investor Appeal**: Who buys this?
2. **Regulatory Friction**: How hard is it to clear compliance?
3. **Liquidity Potential**: Ease of secondary trading.

Output strictly JSON.
`;

export const COMPARE_FEES_PROMPT = (structureA: string, structureB: string) => `
Act as an Investment Analyst.
Compare Fee Structure A (${structureA}) vs Structure B (${structureB}).
Calculate the "Fee Drag" effect on long-term returns.
`;

export const COMPARE_GOVERNANCE_PROMPT = (govA: string, govB: string) => `
Act as a Governance Risk Auditor.
Compare Governance A (${govA}) vs Governance B (${govB}).
Highlight the trade-off between "Operational Speed" (Centralized) and "Investor Trust" (Decentralized).
`;

export const COMPARE_INVESTOR_FIT_PROMPT = (persona: string, asset: string) => `
Act as a Wealth Manager.
Determine the best structure fit for Investor Persona: ${persona} looking at ${asset}.
Compare "Retail Friendly" vs "Whale Friendly" setups.
`;
