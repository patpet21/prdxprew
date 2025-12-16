
import { TokenizationCategory } from '../../types';

export const REFINE_ASSET_DESCRIPTION_PROMPT = (currentDesc: string, assetType: string, assetName: string) => `
Act as a Senior Real Estate Investment Copywriter for a top-tier private equity fund.

Context:
- Asset Name: ${assetName}
- Asset Type: ${assetType}
- Current Draft: "${currentDesc}"

Task: 
Rewrite the draft into a compelling, high-stakes "Investment Highlight" narrative suitable for an institutional pitch deck.

Guidelines:
1. **Tone**: Sophisticated, confident, and exclusive. Avoid retail-marketing fluff.
2. **Vocabulary**: Use professional financial and architectural terminology (e.g., "capital appreciation," "strategic positioning," "turnkey," "value-add").
3. **Structure**: Start with a strong hook about the asset's unique value proposition.
4. **Focus**: Highlight the location value, physical quality, and income potential.

Constraint: Keep it under 120 words. Return plain text only.
`;

export const GENERATE_ASSET_IMAGE_PROMPT = (assetType: string, location: string) => `
Generate a photorealistic architectural rendering of a ${assetType} located in ${location}.
Style: Modern, High-end, Cinematic lighting.
`;
