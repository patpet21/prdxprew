
export const SPV_STRUCTURE_PROMPT = `
Act as a Corporate Structuring Expert.
Based on the following user inputs, design the optimal SPV (Special Purpose Vehicle) structure.

Inputs:
- Jurisdiction: {{jurisdiction}}
- Asset Type: {{assetType}}
- Liability Needs: {{liability}}
- Governance: {{governance}}

Task:
1. Determine the hierarchy (Single SPV vs HoldCo + OpCo).
2. Define the specific entity type (e.g. Delaware LLC, Italian SRL, Luxembourg SA).
3. Create a simple flow diagram structure.

Output strictly JSON:
{
  "structureName": "string",
  "nodes": ["Investor", "Intermediate Entity", "Issuer SPV", "Asset Owner"],
  "flowDescription": "string (e.g. Investors hold tokens issued by X, which owns Y)"
}
`;

export const SPV_EXPLANATION_PROMPT = `
Act as a Legal Tech Educator.
Explain WHY the recommended structure was chosen based on:
- Tax Efficiency (Withholding tax, Corporate tax)
- Investor Protection (Bankruptcy remoteness)
- Operational Cost vs Complexity

Keep it simple, beginner-friendly, and concise (max 100 words).
`;

export const SPV_REDFLAGS_PROMPT = `
Act as a Compliance Auditor.
Review the inputs for the following risks:
- Retail Investors in a Private Placement jurisdiction.
- Governance rights given to token holders that might trigger "Management" classification.
- Mismatch between Asset Location and SPV Jurisdiction (e.g. owning Italian Real Estate via a BVI company).

Output strictly JSON:
{
  "flags": [
    { "risk": "string", "severity": "High/Medium/Low", "fix": "string (short mitigation)" }
  ]
}
`;

export const SPV_COMPLIANCE_PROMPT = `
Act as a Securities Lawyer.
Determine the Regulatory Path (Compliance Mode).
- US + Retail = Reg A+ / Reg CF
- US + Accredited = Reg D 506(c)
- EU + Public = MiCA / Prospectus Regulation
- Global + Private = Reg S

Output strictly JSON:
{
  "pathName": "string",
  "summary": "string (Plain English explanation of the rules)",
  "bankingFeasibility": "Easy / Possible / Hard / Very Hard"
}
`;
