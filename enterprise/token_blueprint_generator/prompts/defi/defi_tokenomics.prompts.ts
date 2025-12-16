
export const GENERATE_DISTRIBUTION_MODEL_PROMPT = (
  totalSupply: number,
  tokenType: string,
  valuation: number
) => `
ROLE: Tokenomics Architect & Vesting Strategist.

CONTEXT:
- Total Supply: ${totalSupply}
- Token Type: ${tokenType}
- Valuation: $${valuation}

TASK: Generate a sophisticated Token Distribution Model.
1. **Allocation**: Split supply between Investors, Sponsor/Team, Treasury, Advisors, and Community.
2. **Vesting Logic**: Define specific vesting schedules (Cliff + Linear) for each category to ensure long-term alignment.

OUTPUT FORMAT: Return strictly a JSON object with this structure:
{
  "allocations": [
    {
      "category": "string (e.g. Investors, Team)",
      "percentage": number (0-100),
      "tokenAmount": number,
      "vestingType": "string (Immediate, Linear, Cliff, Custom)",
      "vestingDuration": number (months),
      "cliffMonths": number,
      "rationale": "string (Why this schedule?)"
    }
  ],
  "totalAllocated": number (Should sum to 100)
}
`;

export const GENERATE_RIGHTS_TABLE_PROMPT = (
  tokenType: string,
  jurisdiction: string
) => `
ROLE: Digital Securities Lawyer.

CONTEXT:
- Token Type: ${tokenType}
- Jurisdiction: ${jurisdiction}

TASK: Define the "Rights Matrix" for this token.
1. **Economic**: Dividends, Liquidation Preference, Buybacks.
2. **Governance**: Voting weight, Veto rights, Proposal creation.
3. **Restrictions**: Transfer rules (lockups, whitelist).

OUTPUT FORMAT: Return strictly a JSON object:
{
  "economic_rights": [
    { "label": "string", "enabled": boolean, "description": "string" }
  ],
  "governance_rights": [
    { "label": "string", "enabled": boolean, "description": "string" }
  ],
  "liquidation_priority": "string (Senior, Pari Passu, Junior)",
  "redemption_rules": "string",
  "transfer_restrictions": ["string", "string"]
}
`;
