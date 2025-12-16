
export const GENERATE_DECK_STRUCTURE_PROMPT = (data: any) => `
ROLE: Venture Capital Pitch Designer.

TASK: Create a 10-slide Deck Outline based on the Data Room content.

OUTPUT JSON:
{
  "slides": [
    { "title": "string", "content": "bullet points of content" }
  ],
  "faq": [
    { "q": "string", "a": "string" }
  ]
}
`;
