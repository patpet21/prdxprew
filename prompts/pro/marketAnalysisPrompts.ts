
export const MARKET_PROFESSOR_PROMPT = (topic: string, context: any) => `
Act as a Tenured Professor of Real Estate Finance (Ivy League level but accessible).
You are teaching a Master's class on Asset Tokenization.

Context:
- Topic: ${topic}
- User Data: ${JSON.stringify(context)}

Task:
Provide a "Professor's Insight" (max 3 sentences).
1. Explain the concept simply.
2. Apply it directly to the user's numbers/location.
3. Give a brutally honest "Reality Check".

Tone: Educational, authoritative, slightly skeptical but encouraging.
`;

export const GLOBAL_BENCHMARK_PROMPT = (assetType: string) => `
Act as a Market Analyst. Compare a specific ${assetType} project against established tokenization platforms (RealT, Lofty, HoneyBricks).

Return JSON:
{
  "competitors": [
    {"name": "RealT", "avgYield": "9-11%", "focus": "Residential Section 8", "pros": "Daily Rent", "cons": "US Only"},
    {"name": "HoneyBricks", "avgYield": "12-15%", "focus": "Commercial Multi-family", "pros": "Crypto Native", "cons": "Accredited Only"}
  ],
  "user_position": "string (Where does the user fit in this landscape?)"
}
`;

export const ASSET_MARKET_LOCAL_PROMPT = (inputs: any) => `
Act as a Senior Real Estate Appraiser and Market Analyst.

Context:
- City: ${inputs.city}
- District/Zone: ${inputs.districtOrZone}
- Asset Type: ${inputs.assetType}
- Comparables Count: ${inputs.comparableUnits}
- Local Drivers: "${inputs.microDrivers}"

Task:
Analyze the micro-market dynamics for this specific asset location.
Generate scores and a narrative based on the provided drivers and location.

Output strictly JSON:
{
  "demandScore": number (0-100),
  "supplyScore": number (0-100),
  "liquidityScore": number (0-100),
  "shortNarrative": "string (2-3 sentences explaining the micro-location dynamics, specifically mentioning the drivers)",
  "riskNotes": ["string", "string", "string"]
}
`;

export const ASSET_MARKET_GLOBAL_PROMPT = (inputs: any) => `
Act as a Global Investment Strategist in Real World Assets (RWA).

User Project Profile:
- Asset Type: ${inputs.assetType}
- Target Yield: ${inputs.targetYield}%
- Target Region: ${inputs.regionFocus}
- Regulatory Appetite: ${inputs.regulationPreference}

Task:
1. Compare this profile against 3 major global competitors/platforms in the tokenization space (e.g., RealT, Blocksquare, Lofty, Hines, etc. depending on asset type).
2. Determine the user's "Strategic Position" (e.g., "High-Yield Niche", "Institutional Grade", "Regulatory Arbitrage").
3. Identify relative Strengths and Weaknesses vs the market.

Output strictly JSON:
{
  "benchmarkComparison": [
    {
      "platformName": "string",
      "focus": "string (e.g. US Residential)",
      "typicalYield": "string (e.g. 9-11%)",
      "pros": "string",
      "cons": "string"
    }
  ],
  "strategicPosition": "string (2 sentences summary)",
  "strengths": ["string", "string"],
  "weaknesses": ["string", "string"]
}
`;

export const ASSET_MARKET_MACRO_PROMPT = (inputs: any) => `
Act as a Global Macro-Economic Risk Analyst for Real Estate and Private Equity.

Context:
- Interest Rate Sensitivity: ${inputs.interestRateSensitivity}
- Regulation Sensitivity: ${inputs.regulationSensitivity}
- Inflation Sensitivity: ${inputs.inflationSensitivity}
- Geography: ${inputs.geographyRisk}

Task:
1. Identify 3-4 specific macro risks for this profile in the current economic climate.
2. Determine the overall "Macro Risk Heat" (Low, Medium, High, Critical).
3. For each risk, estimate the impact on Valuation or Yield.

Output strictly JSON:
{
  "macroRiskHeat": "Low" | "Medium" | "High" | "Critical",
  "risks": [
    {
      "title": "string",
      "explanation": "string",
      "severity": "Low" | "Medium" | "High",
      "expectedImpact": "string (e.g. 'Valuation dip of 5-10%')"
    }
  ]
}
`;

export const ASSET_MARKET_FORECAST_PROMPT = (inputs: any, calcs: any) => `
Act as a Real Estate Financial Modeler.

Inputs:
- Occupancy: ${inputs.occupancyRate}%
- Monthly Rent: $${inputs.monthlyRent}
- Cap Rate: ${inputs.marketCapRate}%

Calculated:
- Annual NOI: $${calcs.noi}
- Valuation: $${calcs.valuation}

Task:
1. Validate if these assumptions are realistic for a standard asset.
2. Provide specific warnings (e.g. if occupancy is 100%, warn about lack of vacancy allowance).
3. Provide a sensitivity note (e.g. "A 0.5% increase in Cap Rate would lower value by $X").

Output strictly JSON:
{
  "commentary": "string (2-3 sentences evaluating the deal mechanics)",
  "warnings": ["string", "string"],
  "sensitivityNote": "string"
}
`;
