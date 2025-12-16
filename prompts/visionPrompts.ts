
export const ANALYZE_FOUNDER_DIAGNOSTIC_PROMPT = (answers: Record<string, string>) => `
Act as a Behavioral Economist and Venture Capital Strategist.

Analyze the following founder responses to generate a "Founder Strategy Profile".

User Answers:
${JSON.stringify(answers, null, 2)}

Task:
1. Score (0-100) the following dimensions based on the answers:
   - Risk Appetite (Conservativo vs Aggressivo)
   - Vision Ambition Level (Locale vs Ecosistema)
   - Execution Capability (Esperienza operativa)
   - Time Horizon (Patience)
   - Purpose & Narrative Strength (Mission clarity)

2. Determine the "Founder Archetype" (e.g., "The Visionary Builder", "The Conservative Steward", "The Aggressive Scaler").

3. Provide a 1-sentence strategic advice tailored to this profile.

Return strictly JSON:
{
  "scores": {
    "risk_appetite": number,
    "vision_ambition": number,
    "execution_capability": number,
    "time_horizon": number,
    "purpose_narrative": number
  },
  "archetype": "string",
  "strategic_advice": "string"
}
`;

export const GENERATE_STRATEGIC_GOALS_PROMPT = (founderProfile: any, context: string) => `
Act as an Investment Banker structuring a deal.

Context:
- Founder Profile: ${JSON.stringify(founderProfile)}
- Asset Context: ${context}

Task: Construct a 3-layer Strategic Goal Framework used in investment banking.

1. **Operational Goals**: Specific to the asset (e.g. occupancy targets, renovation timeline).
2. **Financial Goals**: Raise target, IRR expectations, payback period.
3. **Governance Goals**: Control vs Liquidity balance, rights structure.

Output strictly JSON:
{
  "operational": {
    "title": "string (e.g. Value-Add Strategy)",
    "metrics": ["string", "string"],
    "timeline": "string"
  },
  "financial": {
    "target_raise_range": "string",
    "target_irr": "string",
    "payback_period": "string",
    "equity_dilution": "string"
  },
  "governance": {
    "sponsor_control": "string",
    "investor_rights": ["string", "string"],
    "transparency_level": "string"
  }
}
`;
