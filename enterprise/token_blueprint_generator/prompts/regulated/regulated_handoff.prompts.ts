
export const GENERATE_REGULATED_HANDOFF_PROMPT = (
  providerName: string,
  projectContext: any,
  formData: any
) => `
ROLE: Investment Banking Operations Specialist.

CONTEXT:
- Project: ${projectContext.projectName} (${projectContext.assetType})
- Jurisdiction: ${projectContext.jurisdictionCode}
- Provider: ${providerName}
- Configuration Data: ${JSON.stringify(formData)}

TASK: Generate a "Provider Handoff Package".
This is a structured JSON payload that will be sent via API to the provider to initiate the onboarding and tokenization process.

REQUIREMENTS:
1. **SPV Summary**: Extract entity details and structure.
2. **Offering Terms**: Define Reg D/S details based on context.
3. **Documents**: List the specific documents this provider needs (e.g. Certificate of Incorporation, UBO List).
4. **Token Spec**: A subset of tokenomics relevant for issuance.

OUTPUT FORMAT: Return strictly a JSON object:
{
  "spv_summary": { "legal_name": "string", "entity_type": "string", "jurisdiction": "string" },
  "jurisdiction_summary": { "code": "string", "regulator": "string" },
  "valuation_summary": { "nav": number, "currency": "string" },
  "offering_terms": { "regulation": "string", "lockup": "string", "investor_type": "string" },
  "token_blueprint_partial": { "symbol": "string", "standard": "string" },
  "kyc_rules": { "provider": "string", "level": "string" },
  "documents_required": [
    { "id": "doc_1", "name": "string (e.g. Articles of Incorporation)", "status": "pending" },
    { "id": "doc_2", "name": "string (e.g. UBO Declaration)", "status": "pending" }
  ]
}
`;
