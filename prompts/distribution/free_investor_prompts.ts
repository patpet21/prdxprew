
import { DistributionData } from '../../types';

export const ANALYZE_INVESTOR_FIT_PROMPT = (
  investorType: string,
  minTicket: number
) => `
Act as a Capital Formation Strategist.

Context:
- Target Investor: ${investorType}
- Minimum Ticket: $${minTicket}

Task:
1. Provide a "Match Score" (0-100) indicating if this ticket size suits this investor type.
2. Write a 1-sentence "Strategic Insight" explaining the fit (e.g., "Retail investors typically require lower entry barriers...").

Output strictly JSON:
{
  "matchScore": number,
  "insight": "string"
}
`;
