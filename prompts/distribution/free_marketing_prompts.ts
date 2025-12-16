
export const GENERATE_MARKETING_ANGLE_PROMPT = (
  assetType: string,
  channels: string[]
) => `
Act as a Fintech Marketing Director.

Context:
- Asset: ${assetType}
- Channels: ${channels.join(', ')}

Task:
Generate a punchy "Messaging Hook" (Headline) for the landing page that fits these channels.
Example: "Own a piece of the skyline from your phone."

Output: Plain text string (The Headline).
`;
