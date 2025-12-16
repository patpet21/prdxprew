
// LEGAL FRAMEWORK PROMPT (Legacy - Keep for compatibility if needed, but new one below is used for Academy Pro)
export const LEGAL_FRAMEWORK_PROMPT = (assetType: string, jurisdiction: string) => `
Act as a Senior International Securities Lawyer.
Context: Tokenizing ${assetType} in ${jurisdiction}.

Task: Determine the most likely Regulatory Framework.
1. Is this a Security? (Apply Howey Test or MiCA definition).
2. What is the "Safe Lane"? (e.g., Reg D 506c for US, Prospectus Exemption for EU).
3. Provide 1 "Professor's Note" on why this path is chosen.

Output JSON: { "isSecurity": boolean, "framework": "string", "reasoning": "string" }
`;

// --- ACADEMY PRO: COMPLIANCE FRAMEWORK ---

export const COMPLIANCE_FRAMEWORK_PROMPT = (inputs: any) => `
Act as a Senior Compliance Officer for Digital Assets.
Analyze the following project parameters to determine the Regulatory Framework.

GLOBAL RULE: The AI must not invent or assume anything the user did not explicitly input. All classifications must be based strictly on these inputs.

Inputs:
- Jurisdiction: ${inputs.jurisdiction}
- Asset Class: ${inputs.assetClass}
- Asset Value: ${inputs.assetValue}
- Total Investors Planned: ${inputs.totalInvestorsPlanned}
- Target Jurisdictions: ${inputs.investorJurisdictions?.join(', ') || 'None'}
- Investor Type: ${inputs.investorType}
- Marketing Model: ${inputs.marketingModel}
- Fundraising Method: ${inputs.fundraisingMethod}
- Transferability: ${inputs.transferabilityPreference}
- Distribution Model: ${inputs.distributionModel}
- Custody Model: ${inputs.custodyModel}

Task:
1. Determine "Security Status" (Security vs Utility/Payment).
2. Determine "Prospectus Requirement" (Required or Exempt).
3. Select the "Recommended Regime" (e.g., Reg D 506(c), Reg S, MiCA CASP, EU Prospectus Exemption).
4. Provide "Justification" (Why this regime applies to these specific inputs).
5. List "Limitations" (e.g., max investors, lock-up periods).
6. Analyze "Cross-Border Impact" (e.g. EU vs US friction).
7. Define "Investor Eligibility Rules" (Who can buy).
8. Define "Marketing Restrictions" (Where can you advertise).
9. Define "Transferability Consequences" (Secondary market rules).

Output strictly JSON:
{
  "securityStatus": "string",
  "prospectusRequirement": "string",
  "recommendedRegime": "string",
  "justification": ["string", "string"],
  "limitations": ["string", "string"],
  "crossBorderImpact": ["string", "string"],
  "investorEligibilityRules": ["string", "string"],
  "marketingRestrictions": ["string", "string"],
  "transferabilityConsequences": ["string", "string"]
}
`;

export const FRAMEWORK_INPUT_EDUCATION_PROMPT = (inputs: any) => `
Act as a Law Professor specializing in Securities Regulation.
Explain the inputs the student has selected and why they matter for compliance.

Inputs:
- Jurisdiction: ${inputs.jurisdiction}
- Asset Class: ${inputs.assetClass}
- Asset Value: ${inputs.assetValue}
- Investor Type: ${inputs.investorType}
- Marketing: ${inputs.marketingModel}
- Distribution: ${inputs.distributionModel}
- Custody: ${inputs.custodyModel}

Task:
1. Explain the "Legal Implication" of the chosen Asset Class and Value (e.g., does value trigger prospectus?).
2. Explain how the "Marketing Model" triggers (or avoids) public offering rules.
3. Provide a "Common Misunderstanding" related to ${inputs.investorType} investors.
4. Explain why "Custody Model" matters for this asset type.

Output strictly JSON:
{
  "assetImplication": "string",
  "marketingImplication": "string",
  "investorMisunderstanding": "string",
  "custodyImplication": "string"
}
`;

export const FRAMEWORK_OUTPUT_EDUCATION_PROMPT = (inputs: any, aiOutput: any) => `
Act as a Regulatory Consultant.
Explain the resulting framework to the client.

Selected Regime: ${aiOutput.recommendedRegime}
Status: ${aiOutput.securityStatus}

Task:
1. Explain "Why this Regime" was chosen over others based on user inputs.
2. Describe "Practical Obligations" (What does the issuer actually have to do? e.g. File Form D).
3. Provide a "Typical User" profile (Who uses this setup?).

Output strictly JSON:
{
  "regimeChoiceReason": "string",
  "practicalObligations": ["string", "string"],
  "typicalUserProfile": "string"
}
`;

// INVESTOR ELIGIBILITY PROMPT
export const INVESTOR_ELIGIBILITY_PROMPT = (framework: string) => `
Act as a Compliance Officer.
Context: Using framework ${framework}.

Task: Define Investor Eligibility.
1. Can Retail invest?
2. Is Accreditation required?
3. Are there ticket size limits?

Output JSON: { "retailAllowed": boolean, "accreditationRequired": boolean, "ticketLimit": "string", "warning": "string" }
`;

// RISK MATRIX PROMPT
export const COMPLIANCE_RISK_PROMPT = (wrapperData: any) => `
Act as a Legal Risk Auditor.
Review the following Legal Wrapper configuration:
${JSON.stringify(wrapperData)}

Task:
1. Identify 3 specific Red Flags (e.g. "Retail investors selected for Reg D offering").
2. Assign a Compliance Score (0-100).
3. Suggest 1 specific "Fix".

Output JSON: { "redFlags": ["string"], "score": number, "fixSuggestion": "string" }
`;
