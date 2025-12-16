
export const INVESTOR_RULES_INPUT_EDUCATION_PROMPT = (inputs: any) => `
ROLE: Legal Tech Educator.

TASK: Explain the specific Investor Rules inputs provided by the user. 
Focus on definitions, regulatory impact, and potential pitfalls for these specific values.

INPUT DATA:
${JSON.stringify(inputs, null, 2)}

OUTPUT FORMAT:
Return strictly a JSON object:
{
  "regimeDefinition": "string (Explain the chosen regime)",
  "investorMixAnalysis": "string (Explain the impact of the Retail vs Accredited mix)",
  "usExposure": "string (Explain the implication of US Investors boolean)",
  "tradingImpact": "string (Explain how Secondary Trading affects this setup)",
  "commonMistakes": ["string", "string"]
}
`;
