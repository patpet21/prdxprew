
import { PropertyDatabaseSchema, TokenAllocation } from '../../types';

export const GENERATE_SENSITIVITY_ANALYSIS_PROMPT = (
  baseYield: number,
  baseIrr: number
) => `
Act as a Real Estate Financial Analyst.
Analyze a tokenized asset with:
- Base Yield: ${baseYield}%
- Base IRR: ${baseIrr}%

Task:
1. Calculate an "Optimistic Scenario" (+10% performance).
2. Calculate a "Conservative Scenario" (-10% performance).
3. Write a 1-sentence commentary on the Conservative scenario risk (e.g. "In a downturn, yield drops to X%, which is still acceptable for core assets...").

Output strictly JSON:
{
  "optimisticYield": number,
  "conservativeYield": number,
  "aiComment": "string"
}
`;

export const GENERATE_INVESTOR_APPEAL_PROMPT = (
  tokenPrice: number,
  allocation: TokenAllocation,
  yield_percent: number
) => `
Act as an Investment Banker ranking a deal.
Analyze:
- Token Price: $${tokenPrice}
- Investor Allocation: ${allocation.investors}%
- Yield: ${yield_percent}%

Task:
1. Assign an "Investor Appeal Score" (1-10).
2. Write a short critique (e.g. "Good yield, but sponsor retains too much equity.").

Output strictly JSON:
{
  "score": number,
  "critique": "string"
}
`;

export const GENERATE_TOKEN_BEHAVIOR_PROMPT = (
  assetType: string,
  framework: string
) => `
Act as a Token Engineer.
Describe the behavior of a ${assetType} token under ${framework}.

Task:
1. **Behavior**: How it generates returns (e.g. quarterly rent).
2. **Lifecycle**: What happens at exit/sale.
3. **Compliance**: Interaction with the framework (e.g. Whitelist requirement).

Output strictly JSON:
{
  "behavior": "string (2 sentences)",
  "lifecycle": "string (Step-by-step simple text)",
  "complianceNote": "string"
}
`;
