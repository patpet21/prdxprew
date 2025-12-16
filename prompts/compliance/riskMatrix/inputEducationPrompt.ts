
export const RISK_INPUT_EDUCATION_PROMPT = (inputs: any) => `
ROLE: Regulatory Educator.

TASK: Explain the user's specific configuration and why certain toggles are dangerous or safe.

INPUTS:
${JSON.stringify(inputs, null, 2)}

OUTPUT FORMAT:
Return strictly a JSON object:
{
  "retailRiskExplained": "string",
  "custodyImpact": "string",
  "secondaryMarketNuance": "string",
  "geoBlockingLogic": "string"
}
`;
