
import { TokenizationState } from '../../../types';

export const GENERATE_PITCH_DECK_PROMPT = (
  data: TokenizationState,
  inputs: { investorType: string; deckStyle: string; coreMessage: string }
) => {
  const projectInfo = data.projectInfo || {} as any;
  const financial = data.proPayout || {}; // Access Pro Financials
  const spv = data.jurisdiction?.detailedSpv || {};

  return `
SYSTEM ROLE:
You are the Pitch Deck Architect for an Institutional Investment Committee.
Your goal is to write the *actual content* of a 10-slide deck. No placeholders.
Target Audience: ${inputs.investorType}.

INPUT DATA:
- Project: ${projectInfo.projectName || 'Project'} (${projectInfo.assetClass || 'Asset'})
- Goal: ${projectInfo.projectGoal || 'Goal'}
- Target Raise: ${projectInfo.targetRaiseAmount || 0}
- SPV: ${spv.spvLegalForm || 'SPV'} in ${data.jurisdiction?.country || 'Jurisdiction'}
- Financials: ${financial.payoutType || 'Yield'} model

TASK: Generate the content for these 10 slides.

1. **Title Card**: Precise positioning.
   - Title: Non-marketing, descriptive.
   - Subtitle: Asset + Structure + Goal.
   - Snapshot: Investor Type, Return Range, Horizon.
   
2. **The Problem**: Market friction.
   - Main Text: 1 paragraph explaining the structural barrier.
   - Bullets: 3-5 context points.
   - Speaker Notes: What to say to show empathy/authority.

3. **The Solution**: Why Tokenization?
   - Description: How this specific structure solves the problem.
   - Value Add: Why it's better than a REIT or direct buy.

4. **Structure Snapshot**: The mechanics.
   - Explain the SPV, Capital Flow, and Token Role.
   - Must be technically accurate for an LP/Advisor.

5. **Market**: The Opportunity.
   - Relevant market description.
   - Benchmarks (vs traditional).
   - Demand validation.

6. **Financial Highlights**: The Engine.
   - Explain the Logic of Return (not just numbers).
   - Key Levers (Occupancy? Appreciation? arbitrage?).
   - Critical Assumptions.

7. **Distribution**: Go-to-Market.
   - Channels used.
   - Investor type per channel.
   - Impact on CAC and Compliance.

8. **Risks & Mitigation**: Maturity check.
   - Real risks (Liquidity, Regs).
   - Concrete mitigations.
   - One unmitigable risk (be honest).

9. **Execution Roadmap**: Feasibility.
   - Narrative summary of the plan.
   - Key dependencies (Legal -> Tech -> Raise).

10. **The Ask**: Clarity.
    - Capital amount & Use of Funds.
    - What the investor gets (Terms).
    - What happens next.

OUTPUT FORMAT:
Return strictly a JSON object with this structure:
{
  "slides": [
    {
      "id": "slide_1",
      "type": "Title",
      "title": "string",
      "subtitle": "string",
      "snapshot": { "target": "string", "return": "string", "horizon": "string" },
      "speakerNotes": "string"
    },
    {
      "id": "slide_2", // ... and so on for all 10
      "type": "Content",
      "title": "string",
      "mainText": "string",
      "bullets": ["string", "string", "string"],
      "visualCue": "string",
      "speakerNotes": "string"
    }
  ]
}
`;
};
