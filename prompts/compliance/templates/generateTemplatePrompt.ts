
export const GENERATE_COMPLIANCE_TEMPLATE_PROMPT = (templateName: string, inputs: any, context: any) => `
ROLE: Senior Legal Tech Drafter.

TASK: Generate a ${templateName} document based STRICTLY on the provided project context.
Do NOT invent facts. Use placeholders [LIKE THIS] if specific data is missing.

USER INPUTS (Template Context):
- Issuer Legal Name: ${inputs.issuerLegalName || 'Pending'}
- Jurisdiction: ${inputs.jurisdictionOfIncorporation || 'Pending'}
- Token Type: ${inputs.tokenType || 'Pending'}
- Investor Rights: ${inputs.investorRights?.join(', ') || 'None'}
- Lockup Period: ${inputs.lockupPeriod || 'None'}
- Resale Restrictions: ${inputs.resaleRestrictions || 'None'}
- Distribution Method: ${inputs.distributionMethod || 'None'}
- Transferability Rules: ${inputs.transferabilityRules || 'None'}
- Risk Disclosure Level: ${inputs.riskDisclosureLevel || 'Standard'}
- Offer Size: ${inputs.offerSize || 'Pending'}
- Fund Flow: ${inputs.fundFlowModel || 'Pending'}

PREVIOUS CONTEXT (Regulatory Framework):
- Recommended Regime: ${context?.regulatoryFramework?.aiOutput?.recommendedRegime || 'Unknown'}
- Asset Class: ${context?.regulatoryFramework?.inputs?.assetClass || 'Unknown'}
- Investor Type: ${context?.investorRules?.inputs?.regulatoryRegime || 'Unknown'}

TASK INSTRUCTIONS:
1. Generate the document structure (sections).
2. Ensure clauses reflect the specific "Lockup Period", "Resale Restrictions", and "Jurisdiction".
3. Add specific "Compliance Notes" for a human lawyer to review.

OUTPUT FORMAT:
Return strictly a JSON object:
{
  "title": "string",
  "sections": [
    { "heading": "string", "content": "string (Markdown allowed)" }
  ],
  "complianceNotes": ["string", "string"],
  "placeholders": ["string"]
}
`;
