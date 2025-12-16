
export const YIELD_SIMULATION_PROMPT = (
  annualYield: number,
  targetIrr: number,
  holdingPeriod: number
) => `
Act as a Real Estate Analyst.
Deconstruct the return profile for a deal with:
- Cash Yield: ${annualYield}%
- Target IRR: ${targetIrr}%
- Hold: ${holdingPeriod} Years

Task:
1. Estimate the **Capital Appreciation** required to hit that IRR given the Cash Yield.
2. Compare this to "Market Averages" (e.g. "This is aggressive compared to typical 8-10% IRR").
3. Generate a simple breakdown text.

Output strictly JSON:
{
  "cashComponent": number (percentage points of IRR),
  "appreciationComponent": number (percentage points of IRR),
  "marketComparison": "string",
  "breakdownText": "string"
}
`;
