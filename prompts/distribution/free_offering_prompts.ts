
export const GET_OFFERING_ADVICE_PROMPT = (
  mode: string,
  timeline: string
) => `
Act as a Tokenization Launch Manager.

Context:
- Offering Mode: ${mode} (e.g., Public Crowdsale, Private Placement)
- Timeline: ${timeline}

Task:
Provide a concise "Launch Strategy Note" (max 30 words).
Focus on the trade-off between speed and regulatory burden for this specific combination.

Output: Plain text string.
`;
