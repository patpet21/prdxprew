
export const ASSET_INTELLIGENCE_PROMPT = (assetType: string, location: string, condition: string) => `
ROLE: Senior Real Estate Asset Manager.

CONTEXT:
- Asset Type: ${assetType}
- Location: ${location}
- Condition: ${condition}

TASK:
1. Identify 3 "Market Highlights" specific to this location and asset class (e.g. "Emerging tech hub drives rental demand").
2. Write a technical but persuasive "Asset Description" focusing on the physical quality and potential.

OUTPUT JSON:
{
  "marketHighlights": ["string", "string", "string"],
  "technicalDescription": "string"
}
`;
