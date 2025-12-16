
import { TokenizationState } from '../../types';

export const GENERATE_EXECUTIVE_SUMMARY_PROMPT = (data: TokenizationState) => `
Act as a Senior Investment Analyst writing a Deal Memo.

Data:
- Project: ${data.projectInfo.projectName} (${data.property.property_type})
- Location: ${data.property.city}, ${data.property.country}
- Valuation: ${data.property.total_value}
- Tokenomics: Yield ${data.property.annual_yield}%, Raise ${data.property.raise_amount}
- Structure: ${data.jurisdiction.spvType} in ${data.jurisdiction.country}

Task: Write a professional "Executive Summary" (max 80 words).
Focus on: Asset quality, financial return potential, and structural safety.
Tone: Institutional, persuasive, objective.
`;

export const GENERATE_PROJECT_SCORES_PROMPT = (data: TokenizationState) => `
Act as a Risk Algorithm.
Evaluate project: ${data.projectInfo.projectName}.

Task: Assign 4 scores (0-100) based on heuristics:
1. **Deal Feasibility**: (Is the raise realistic for the valuation?)
2. **Investor Readiness**: (Are yields and allocation attractive?)
3. **Compliance Fit**: (Is the framework correct for the region?)
4. **Tokenomics Strength**: (Is the supply/price logic sound?)

Output strictly JSON:
{
  "feasibility": number,
  "readiness": number,
  "compliance": number,
  "tokenomics": number
}
`;

export const GENERATE_RED_FLAGS_NEXT_STEPS_PROMPT = (data: TokenizationState) => `
Act as a Deal Consultant.

Task:
1. Identify 3 "Red Flags" or risks based on the data (e.g. High Sponsor allocation, low yield, complex jurisdiction).
2. Suggest 3 "Next Steps" to profesionalize the deal (e.g. Legal opinion, Data Room setup).

Output strictly JSON:
{
  "redFlags": ["string", "string", "string"],
  "nextSteps": ["string", "string", "string"]
}
`;
