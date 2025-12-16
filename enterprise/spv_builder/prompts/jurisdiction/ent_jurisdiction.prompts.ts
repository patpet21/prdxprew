
export const ENT_GENERATE_JURISDICTION_SHORTLIST_PROMPT = (
  category: string,
  regionPreference: string,
  projectGoal: string
) => `
ROLE: Senior Legal Structuring Advisor (Enterprise Tier).

CONTEXT:
- Asset Class: ${category}
- Project Goal: ${projectGoal}
- Preferred Region: ${regionPreference}

TASK: Recommend the top 3 specific jurisdictions (Countries or States) for this institutional project.
Focus on "Regulatory Clarity", "Tax Efficiency", and "Institutional Trust".

OUTPUT FORMAT: JSON
{
  "recommendations": [
    {
      "code": "string (e.g. US-DE, SG, CH)",
      "name": "string",
      "matchScore": number (80-99),
      "reason": "string (1 short sentence why)"
    }
  ],
  "summary": "string (Strategic summary)"
}
`;

export const ENT_GENERATE_SPV_MODEL_STRATEGY_PROMPT = (
  category: string,
  geoIntent: string,
  targetRegions: string[]
) => `
ROLE: Cross-Border Corporate Tax Strategist (Enterprise).

CONTEXT:
- Asset Class: ${category}
- Geo Intent: ${geoIntent}
- Investor Targets: ${targetRegions.join(', ') || 'Global'}

TASK: Analyze SPV Structuring Model:
1. **Local Only**: Single entity in asset jurisdiction.
2. **Foreign Only**: Single entity in tax-neutral jurisdiction.
3. **Double SPV**: OpCo (Local) + HoldCo (Foreign).

OUTPUT FORMAT: JSON
{
  "recommendedModel": "Local" | "Foreign" | "Double",
  "reasoning": "string (Tax/legal logic)",
  "riskFactor": "string"
}
`;
