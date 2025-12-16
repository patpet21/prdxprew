
export const VALUATION_NARRATIVE_PROMPT = (
    assetName: string,
    valuationValue: number,
    methodology: string,
    keyMetrics: any
  ) => `
  ROLE: Investment Banking Associate.
  
  TASK: Write a "Deal Memo" executive summary for the valuation of ${assetName}.
  
  DATA:
  - Valuation: $${valuationValue.toLocaleString()}
  - Method: ${methodology}
  - Key Metrics: ${JSON.stringify(keyMetrics)}
  
  GUIDELINES:
  - Tone: Institutional, confident, objective.
  - Focus on "Value Drivers" (why is it worth this much?) and "Market Context".
  - Do not use filler words. Be concise.
  
  OUTPUT FORMAT:
  Return strictly a JSON object:
  {
    "headline": "string (Punchy 5-7 word title)",
    "executiveSummary": "string (2 paragraphs markdown)",
    "bullCase": "string (1 sentence)",
    "bearCase": "string (1 sentence)"
  }
  `;
  
  export const STRESS_TEST_PROMPT = (
    currentValuation: number,
    assetType: string
  ) => `
  ROLE: Financial Risk Analyst.
  
  TASK: Perform a stress test on a ${assetType} asset valued at $${currentValuation.toLocaleString()}.
  
  SCENARIOS:
  1. Interest Rate Shock (+200bps)
  2. Vacancy/Revenue Shock (-15% Revenue)
  3. Market Liquidity Crisis (Cap Rate expansion +1%)
  
  OUTPUT FORMAT:
  Return strictly a JSON object:
  {
    "scenarios": [
      {
        "name": "string",
        "impactPercentage": number (negative for loss),
        "revisedValuation": number,
        "mitigationStrategy": "string"
      }
    ],
    "resilienceScore": number (0-100)
  }
  `;
