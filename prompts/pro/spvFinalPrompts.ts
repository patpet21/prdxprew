
export const SPV_TAB5_REDFLAGS_PROMPT = (data: any) => `
Act as a Senior Legal Risk Auditor for Asset Tokenization.

Review the following project configuration data:
${JSON.stringify(data, null, 2)}

TASK:
1. Identify potential "Red Flags" across these categories: Legal, Tax, Investor Risk, Operational, Cross-border.
2. For each flag, assign a Probability (Low/Medium/High) and Impact (Low/Medium/High).
3. Provide a specific Mitigation strategy.
4. Calculate a "Total Risk Heat" score (0-100, where 100 is extremely risky).

OUTPUT JSON:
{
  "riskHeat": number,
  "flags": [
    {
      "category": "Legal" | "Tax" | "Investor" | "Execution" | "Cross-border",
      "title": "string",
      "explanation": "string",
      "probability": "Low" | "Medium" | "High",
      "impact": "Low" | "Medium" | "High",
      "mitigation": "string"
    }
  ]
}
`;

export const SPV_TAB6_BLUEPRINT_PROMPT = (data: any) => `
Act as a Corporate Structuring Architect.

Context: A user is finalizing their SPV structure for a tokenization project.
Data Collected:
${JSON.stringify(data, null, 2)}

TASK:
Generate the content for a "Legal Strategy Blueprint" document.
The tone should be professional, institutional, and actionable.

OUTPUT JSON:
{
  "executiveSummary": "string (2 paragraphs summarizing the deal structure)",
  "structureOverview": "string (Description of the entity, jurisdiction, and relationship to asset)",
  "riskOverview": "string (Summary of key risks identified)",
  "compliancePlan": "string (How investors will be onboarded and regulations met)",
  "nextSteps": ["string", "string", "string", "string"]
}
`;
