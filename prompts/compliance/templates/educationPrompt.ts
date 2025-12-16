
export const TEMPLATE_EDUCATION_PROMPT = (templateName: string, jurisdiction: string) => `
ROLE: Legal Educator.

TASK: Explain the purpose and regulatory significance of the "${templateName}" template in the context of ${jurisdiction} law.

OUTPUT FORMAT:
Return strictly a JSON object:
{
  "purpose": "string",
  "regulatoryMeaning": "string",
  "requiredLegalReview": "string"
}
`;
