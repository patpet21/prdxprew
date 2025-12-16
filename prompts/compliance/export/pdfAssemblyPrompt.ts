
export const COMPLIANCE_PDF_ASSEMBLY_PROMPT = (data: any) => `
ROLE: Senior Legal Operations Manager & Compliance Strategist.

TASK: Generate a "Next Steps & Executive Summary" for the final page of the Compliance Blueprint PDF.

GLOBAL RULE: Do not hallucinate. Base all advice STRICTLY on the provided input data.

INPUT DATA:
- Framework: ${data.framework?.aiOutput?.recommendedRegime || 'Not Set'}
- Security Status: ${data.framework?.aiOutput?.securityStatus || 'Unknown'}
- Risk Score: ${data.riskMatrix?.aiOutput?.totalRiskScore || 'N/A'} / 100
- Investor Type: ${data.investorRules?.inputs?.regulatoryRegime || 'N/A'}
- Critical Risks: ${JSON.stringify(data.riskMatrix?.aiOutput?.triggeredRisks || [])}

OUTPUT FORMAT:
Return strictly a JSON object:
{
  "executiveSummary": "string (2-3 sentences professionally summarizing the chosen regulatory strategy and risk posture)",
  "immediateActions": ["string", "string", "string", "string"],
  "longTermMaintenance": ["string", "string"]
}

LOGIC GUIDELINES:
- If Risk Score < 60, the first immediate action MUST be "Engage specialized legal counsel for manual review of high-risk flags."
- If "Retail" investors are involved, mention Prospectus/Reg A+ filing requirements in actions.
- Tailor long-term maintenance to the specific regime (e.g. "Annual Form D renewal" for Reg D).
`;
