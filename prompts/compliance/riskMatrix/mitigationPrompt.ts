
export const MITIGATION_ENGINE_PROMPT = (inputs: any, riskAnalysis: any) => `
ROLE: Legal Solutions Architect.

TASK: Provide a specific remediation plan based ONLY on the identified risks.

CONTEXT:
User Inputs: ${JSON.stringify(inputs)}
Risk Analysis: ${JSON.stringify(riskAnalysis)}

OUTPUT FORMAT:
Return strictly a JSON object:
{
  "urgentFixes": ["string (Immediate actions to stop critical bleeding)"],
  "bestPractices": ["string (Operational improvements)"],
  "providerRecommendations": ["string (Types of partners needed, e.g. 'Qualified Custodian')"]
}
`;
