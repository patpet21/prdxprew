
export const SPV_COMPLIANCE_BANKING_PROMPT = (data: any) => `
Act as a Banking Compliance Specialist.
For an SPV in ${data.spvCountry}, analyze the banking feasibility.

Context:
- Structure: ${data.spvLegalForm}
- Activity: Asset Tokenization
- Investor Origin: ${data.investorOrigin || 'Global'}

Output strictly JSON:
{
  "pathName": "string",
  "complianceSummary": "string",
  "bankingFeasibility": "Easy" | "Medium" | "Hard",
  "bankingNotes": "string (Tips for opening accounts)"
}
`;

export const ANALYZE_SPV_COMPLEXITY_PROMPT = (data: any) => `
Act as a Legal Operations Architect.
Analyze the complexity of this SPV structure:

- Jurisdiction: ${data.spvCountry}
- Form: ${data.spvLegalForm}
- Role: ${data.spvRoleType}
- Shareholder Type: ${data.shareholderType}

Task:
1. Determine Complexity Level (Low/Medium/High).
2. Provide 3 specific Legal Notes/Warnings based on the jurisdiction and role.
3. Provide a reasoning for the complexity score.

OUTPUT JSON ONLY:
{
  "complexity": "Low" | "Medium" | "High",
  "legalNotes": ["string", "string", "string"],
  "reasoning": "string"
}
`;

export const SPV_STRUCTURE_PROMPT = (data: any) => `
Act as a Corporate Structuring Expert.
Based on the following user inputs, design the optimal SPV (Special Purpose Vehicle) structure.

Inputs:
- Jurisdiction: ${data.jurisdiction?.country}
- Asset Type: ${data.property?.category}

Task:
1. Determine the hierarchy (Single SPV vs HoldCo + OpCo).
2. Define the specific entity type (e.g. Delaware LLC, Italian SRL, Luxembourg SA).
3. Create a simple flow diagram structure.

Output strictly JSON:
{
  "structureName": "string",
  "nodes": ["Investor", "Intermediate Entity", "Issuer SPV", "Asset Owner"],
  "flowDescription": "string"
}
`;

export const SPV_EXPLANATION_PROMPT = (data: any) => `
Act as a Legal Tech Educator.
Explain WHY the recommended structure was chosen based on:
- Tax Efficiency (Withholding tax, Corporate tax)
- Investor Protection (Bankruptcy remoteness)
- Operational Cost vs Complexity

Keep it simple, beginner-friendly, and concise (max 100 words).
`;

export const SPV_REDFLAGS_PROMPT = (data: any) => `
Act as a Compliance Auditor.
Review the inputs for the following risks:
- Retail Investors in a Private Placement jurisdiction.
- Governance rights given to token holders that might trigger "Management" classification.
- Mismatch between Asset Location and SPV Jurisdiction.

Output strictly JSON:
{
  "flags": [
    { "risk": "string", "severity": "High/Medium/Low", "fix": "string" }
  ]
}
`;
