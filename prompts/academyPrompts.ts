
// New file for Academy specific prompts

export const ANALYZE_ASSET_DNA_PROMPT = (asset: string, location: string, usage: string) => `
Act as a Senior Real Estate & Tokenization Strategist.

User Inputs:
1. Asset: ${asset}
2. Location: ${location}
3. Usage: ${usage}

Task: Analyze this specific asset profile and generate a deep "Asset DNA" Identity Card, Market Insights, and Structural Models.

Output requirements:

1. **Identity Card** (Expert Language):
   - **Identity**: Precise typology, underlying business logic, operating cycle, intrinsic risks.
   - **Economic Model**: 3-5 bullet points on revenue drivers.
   - **Sector Params**: Typical benchmarks.
   - **Stage**: Current status.

2. **SWOT Analysis**: 2 Strengths, 2 Weaknesses, 2 Opportunities, 2 Threats.

3. **Market Insights** (The "Alpha"):
   - **Demand/Trend**: Specific trend in that zone (e.g. "Occupancy up 11%").
   - **Benchmarks**: Brief comparison to similar assets.
   - **Macro Risks**: Inflation, rates, tourism flows.
   - **Natural Investors**: Who buys this? (Family Office, Retail, HNWI).

4. **Tokenization Models** (3 Distinct Structures):
   - Generate 3 viable models (e.g., Equity SPV, Revenue Share, Hybrid).
   - For each: Description, Pros/Cons, Ideal Investor, Compliance Level, SPV Complexity, Potential ROI.

Return strictly JSON format:
{
  "identity_card": {
    "identity_text": "string",
    "economic_model": ["string", "string"],
    "sector_params": { "occupancy": "string", "cap_rate": "string", "returns": "string", "risks": "string" },
    "asset_stage": "string"
  },
  "swot": {
    "strengths": ["string"],
    "weaknesses": ["string"],
    "opportunities": ["string"],
    "threats": ["string"]
  },
  "market_insights": {
    "demand_trend": "string (e.g. 'Milano centro ha un’occupazione media del 72%...')",
    "benchmarks": "string",
    "macro_risks": ["string", "string"],
    "natural_investors": ["string", "string"]
  },
  "tokenization_models": [
    {
      "name": "string (e.g. Modello A – Equity frazionato)",
      "description": "string",
      "pros": ["string", "string"],
      "cons": ["string", "string"],
      "ideal_investor": "string",
      "compliance_level": "string (Low/Medium/High)",
      "spv_complexity": "string (Low/Medium/High)",
      "potential_roi": "string"
    },
    { "name": "string (Modello B)", ... },
    { "name": "string (Modello C)", ... }
  ],
  "snapshot": {
    "asset_type": "string",
    "specific_subtype": "string",
    "local_market_context": "string",
    "typical_yield": "string",
    "main_risks": ["string"]
  }
}
`;

export const GENERATE_DEEP_SWOT_PROMPT = (assetName: string, assetType: string, location: string, context: string) => `
Act as a Strategic Investment Consultant.
Perform a deep-dive SWOT Analysis for a specific asset being considered for tokenization.

Context:
- Asset: ${assetName} (${assetType})
- Location: ${location}
- Additional Context: ${context}

Task: Generate a detailed, professional SWOT matrix useful for a Business Plan or Investor Pitch.
Focus on:
- **Strengths**: Intrinsic value, location, brand, competitive advantage.
- **Weaknesses**: Operational costs, seasonality, capex needs, regulatory hurdles.
- **Opportunities**: Digital expansion, upselling, new revenue streams via tokenization, global investor access.
- **Threats**: Market downturns, competitor saturation, regulatory changes, dependency on third parties.

Output Format: Strictly JSON.
{
  "strengths": ["string", "string", "string", "string"],
  "weaknesses": ["string", "string", "string", "string"],
  "opportunities": ["string", "string", "string", "string"],
  "threats": ["string", "string", "string", "string"],
  "executive_summary": "string (A 2-sentence strategic verdict for the investor package)"
}
`;

export const GENERATE_SPV_STRATEGY_PROMPT = (country: string, investorOrigin: string, strategy: string) => `
Act as a Corporate Structuring Expert for Digital Assets.

User Context:
- Asset Jurisdiction: ${country}
- Investor Origin: ${investorOrigin}
- Strategic Priority: ${strategy}

Task: Generate 3 distinct SPV scenarios, a recommendation, and reality checks.

Scenarios:
1. **Local SPV**: The SPV is in ${country}.
2. **Foreign SPV**: The SPV is in a tax-neutral hub (e.g. Delaware, BVI, UK).
3. **Double Level SPV**: OpCo in ${country} + HoldCo abroad.

For each scenario provide:
- Name
- Description (1 sentence)
- Pros (array)
- Cons (array)
- Complexity (Low/Medium/High)
- Cost Estimate (String, e.g. "€3k setup + €2k/yr")
- Best For (Who fits this?)

Also provide:
- **AI Recommendation**: Which of the 3 is best based on the user's strategy preference?
- **Reality Checks**: 3 specific legal/banking facts about ${country} that usually trip people up (e.g. "Italian banks hate crypto", "US requires Registered Agent").

Output strictly JSON:
{
  "scenarios": [
    { "type": "local", "title": "SPV Locale (${country})", "description": "...", "pros": [], "cons": [], "complexity": "...", "cost": "...", "best_for": "..." },
    { "type": "foreign", "title": "SPV Estera", "description": "...", "pros": [], "cons": [], "complexity": "...", "cost": "...", "best_for": "..." },
    { "type": "double", "title": "SPV Doppio Livello", "description": "...", "pros": [], "cons": [], "complexity": "...", "cost": "...", "best_for": "..." }
  ],
  "recommendation": {
    "choice": "local" | "foreign" | "double",
    "reason": "string"
  },
  "reality_checks": ["string", "string", "string"]
}
`;
