
import { TokenizationState } from '../../../types';

export const GENERATE_STORY_BUILDER_PROMPT = (
  data: TokenizationState,
  inputs: { storyDraft: string; audience: string; tone: string; length: string }
) => {
  const project = data.projectInfo || {} as any;
  const property = data.property || {} as any;
  const legal = data.jurisdiction || {} as any;
  const tokenomics = data.property || {} as any; // Assuming token data sits here or in proTokenDesign
  const financials = data.proPayout || {};

  return `
SYSTEM ROLE:
You are the Story & Credibility Professor of PropertyDEX.
Your goal is to translate raw data into a decision-grade narrative.
You DO NOT invent facts. You organize and style existing facts.

--- INPUT CONTEXT (READ ONLY) ---
Project Name: ${project.projectName}
Asset: ${property.title} (${property.property_type}) in ${property.city}, ${property.country}
Valuation: $${property.total_value}
Target Raise: $${property.raise_amount}
Legal Structure: ${legal.spvType} in ${legal.country}
Tokenomics: Yield ${property.annual_yield}%, Price $${property.token_price}
Audience: ${inputs.audience}
Tone Preference: ${inputs.tone}
User Notes (Brain Dump): "${inputs.storyDraft}"

--- TASK 1: NARRATIVE GENERATION ---
Generate 3 distinct versions of the project narrative:

1. **Institutional Version**:
   - For LPs, Funds, and Advisory Boards.
   - Tone: Sobriety, Risk-Adjusted, Data-First.
   - Structure: Context > Asset Quality > Legal Structure > Economic Logic > Risk Mitigation.
   - No "hype" words. Use terms like "Risk-adjusted returns", "Collateralized", "Audited".

2. **Simplified Version**:
   - For Introductory Calls, Non-Technical Partners, Emails.
   - Tone: Clear, Human, Linear.
   - Structure: Problem > Solution > How it works > Why it's safe.
   - Short sentences. No acronyms without explanation.

3. **Sharp Hook**:
   - For LinkedIn, Deck Covers, One-liners.
   - Max 3 sentences.
   - Must be punchy but credible.

--- TASK 2: CREDIBILITY AUDIT ---
Analyze the User Notes and the Project Context for weaknesses.
- **Missing Proof**: Data points that are crucial but missing (e.g. "Claims high yield but no historical occupancy data").
- **Overclaims**: Words that sound like guarantees or hype (e.g. "Guaranteed", "Safe", "Skyrocket").
- **Ambiguities**: Vague statements (e.g. "We will have a good legal structure").
- **Fix Suggestions**: Specific advice to improve credibility.

--- OUTPUT FORMAT ---
Return strictly a JSON object:
{
  "storyOutputs": {
    "institutional": "markdown string",
    "simplified": "markdown string",
    "hook": "string"
  },
  "audit": {
    "missingProof": ["string", "string"],
    "overclaims": ["string", "string"],
    "ambiguities": ["string", "string"],
    "fixSuggestions": ["string", "string"]
  }
}
`;
};
