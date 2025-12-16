
export const DATA_ROOM_AUDIT_PROMPT = (data: any) => `
ROLE: Compliance & Risk Auditor.

INPUT: Full Data Room Content.

TASK: Scan for "Red Flags" in the investment proposition.
- Is the IRR too high (>25%) without explanation?
- Is the location vague?
- Is the SPV structure missing?

OUTPUT JSON:
{
  "score": number (0-100),
  "flags": [
    { "area": "Financial|Legal|Market", "issue": "string", "severity": "high|medium|low" }
  ]
}
`;
