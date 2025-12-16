
export const RISK_OUTPUT_EDUCATION_PROMPT = (score: number, breakdown: any) => `
ROLE: Chief Risk Officer.

TASK: Interpret the final risk score for the user.

SCORE: ${score}/100
BREAKDOWN: ${JSON.stringify(breakdown)}

OUTPUT FORMAT:
Return strictly a JSON object:
{
  "scoreInterpretation": "string (What does this number imply for bankability?)",
  "primaryFrictionPoint": "string (The one area causing the most drag)",
  "auditorPerspective": "string (How an external auditor would view this setup)"
}
`;
