
export const GENERATE_LOGIC_RULES_PROMPT = (context: any) => `
ROLE: Senior Legal Knowledge Engineer.

CONTEXT:
Project: ${context.projectName}
Jurisdiction: ${context.governingLaw}
Asset: ${context.assetType}

TASK: Identify 3-5 active "Logic Rules" that must apply to the legal documentation.
Example: "If US Investors -> Include Rule 506(c) Accredited Investor representation."

OUTPUT JSON:
{
  "rules": [
    { "condition": "string", "action": "string", "impactLevel": "High" | "Medium" | "Low" }
  ]
}
`;

export const DRAFT_CLAUSE_PROMPT = (clauseName: string, context: any) => `
ROLE: Contract Drafter (Magic Circle Firm Standard).

TASK: Draft the "${clauseName}" clause for a Tokenization Agreement.
CONTEXT:
- Law: ${context.governingLaw}
- Dispute: ${context.disputeResolution}

REQUIREMENTS:
- Use precise legal terminology.
- Include specific references to Digital Assets/Tokens where relevant.
- Provide 2 variants: "Standard" and "Investor Friendly".

OUTPUT JSON:
{
  "standard_draft": "string",
  "friendly_variant": "string"
}
`;

export const ANALYZE_MISSING_CLAUSES_PROMPT = (currentClauses: string[]) => `
ROLE: Legal Risk Auditor.

INPUT: Current Document Structure:
${currentClauses.join(', ')}

TASK: Identify 2-3 MISSING clauses that are critical for a Security Token Offering.
Focus on: Transfer Restrictions, Force Majeure (Blockchain downtime), and Tax Withholding.

OUTPUT JSON:
{
  "findings": [
    { "missingClauseName": "string", "riskReason": "string", "suggestedContent": "string", "severity": "Critical" | "Recommended" }
  ]
}
`;
