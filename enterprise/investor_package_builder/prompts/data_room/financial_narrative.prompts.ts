
export const FINANCIAL_NARRATIVE_PROMPT = (metrics: any) => `
ROLE: Investment Banking Analyst.

DATA:
- Valuation: ${metrics.valuation}
- NOI: ${metrics.noi}
- IRR: ${metrics.irr}%
- Cap Rate: ${metrics.capRate}%

TASK: Write a "Financial Story" paragraph. Explain why these numbers represent a good investment.
Connect the Cap Rate to the risk profile. Explain the IRR drivers (Cashflow vs Appreciation).

OUTPUT: Plain Text String (Markdown).
`;
