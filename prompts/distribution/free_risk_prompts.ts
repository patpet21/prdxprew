
import { DistributionData } from '../../types';

export const ANALYZE_DISTRIBUTION_RISK_PROMPT = (
  dist: DistributionData
) => `
Act as a Compliance Risk Officer.

Context:
- Target: ${dist.targetInvestorType}
- Channels: ${dist.marketingChannels.join(', ')}
- Ticket: $${dist.minInvestment}

Task:
Identify the single biggest "Distribution Risk" (e.g., "Public solicitation for private placement", "Ticket too high for retail").
Assign a Risk Level (Low/Med/High).

Output strictly JSON:
{
  "riskLevel": "Low" | "Medium" | "High",
  "riskSummary": "string"
}
`;
