import { DistributionData, TokenAllocation } from '../../types';

export const ANALYZE_DISTRIBUTION_STRATEGY_PROMPT = (
  dist: DistributionData,
  allocation: TokenAllocation
) => `
Act as a Capital Raising Strategist.

Context:
- Target Investor: ${dist.targetInvestorType}
- Min Ticket: $${dist.minInvestment}
- Sponsor Allocation: ${allocation.founders}%
- Treasury Allocation: ${allocation.treasury}%
- Marketing Channels: ${dist.marketingChannels.join(', ')}

Task:
1. **Sponsor Check**: Comment on if the ${allocation.founders}% sponsor allocation is standard, high, or low for this investor type.
2. **Strategy Fit**: Does a $${dist.minInvestment} ticket make sense for ${dist.targetInvestorType}?
3. **Vesting Hint**: Suggest a standard lock-up period for the Sponsor based on these parameters.

Output strictly JSON:
{
  "sponsorCheck": "string (e.g. '20% is standard for this deal type.')",
  "strategyFit": "string",
  "vestingHint": "string"
}
`;