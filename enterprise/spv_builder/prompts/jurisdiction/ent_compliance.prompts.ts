
export const ENT_COMPLIANCE_RISK_PROMPT = (
  jurisdiction: string,
  investorTypes: string[],
  assetClass: string
) => `
ROLE: Senior Compliance Officer (Enterprise Financial Services).

CONTEXT:
- Jurisdiction: ${jurisdiction}
- Asset: ${assetClass}
- Investor Types: ${investorTypes.join(', ')}

TASK: Perform a Regulatory Risk Assessment.
1. Identify "Red Flags" regarding cross-border solicitation (e.g. Reverse Solicitation rules).
2. Determine if a Prospectus or Offering Memorandum is mandatory.
3. Assign a "Regulatory Friction Score" (0-100).

OUTPUT FORMAT: JSON
{
  "riskScore": number,
  "requiredDocs": ["string", "string"],
  "redFlags": ["string"],
  "recommendation": "string"
}
`;
