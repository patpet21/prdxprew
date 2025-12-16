
export const INVESTMENT_THESIS_PROMPT = (overview: any) => `
ROLE: Private Equity Deal Partner.

CONTEXT: ${JSON.stringify(overview)}

TASK:
1. Write a "Core Thesis" (The main reason to buy).
2. List 3 "Value Drivers" (How we make money).
3. List 3 "Risks" and their "Mitigations".

OUTPUT JSON:
{
  "coreThesis": "string",
  "valueDrivers": ["string", "string", "string"],
  "risks": ["string", "string", "string"],
  "mitigations": ["string", "string", "string"]
}
`;
