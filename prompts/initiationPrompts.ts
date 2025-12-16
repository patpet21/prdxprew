
import { TokenizationCategory } from '../types';

export const REFINE_CONCEPT_PROMPT = (rawInput: string) => `
Act as a Senior Investment Banker and Copywriter.
The user is describing a project idea in plain English: "${rawInput}".

Task:
1. Identify the most likely **Asset Class** (Real Estate, Business, Debt, etc.).
2. Generate a **Professional Title** for the project.
3. Rewrite the description into a **Professional Investment Summary** (Institutional tone, <60 words).
4. Suggest a **Primary Goal** (Capital Raise, Liquidity, etc.).

Return strictly JSON:
{
  "suggestedTitle": "string",
  "assetClass": "string (Real Estate | Business | Art | Debt | Funds | Other)",
  "professionalDescription": "string",
  "primaryGoal": "string"
}
`;

export const SUGGEST_TARGET_RAISE_PROMPT = (category: string, subType: string) => `
Act as a Market Analyst.
Based on the asset class "${category}" and subtype "${subType}", suggest a realistic **Target Raise** range.

Return strictly JSON:
{
  "min": number,
  "max": number,
  "default": number,
  "reasoning": "string (very short explanation)"
}
`;
