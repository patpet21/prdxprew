
export const INVESTOR_RULES_OUTPUT_EDUCATION_PROMPT = (inputs: any, validationResult: any) => `
ROLE: Strategic Compliance Consultant.

TASK: Provide a post-analysis educational breakdown based on the validation result.

INPUTS:
${JSON.stringify(inputs, null, 2)}

VALIDATION RESULT:
${JSON.stringify(validationResult, null, 2)}

OUTPUT FORMAT:
Return strictly a JSON object:
{
  "resultInterpretation": "string (What does PASS/FAIL mean practically here?)",
  "compositionImpact": "string (How the specific investor counts affected the result)",
  "nextSteps": ["string", "string", "string"]
}
`;
