
import { TokenizationState } from '../../types';

export const GENERATE_PROJECT_DNA_PROMPT = (data: TokenizationState) => `
Act as a Deal Architect.
Analyze the user's full simulation state:

Asset: ${data.property.title} (${data.property.property_type}) in ${data.property.city}
Structure: ${data.jurisdiction.spvType} in ${data.jurisdiction.country}
Compliance: ${data.compliance.regFramework} (${data.compliance.targetInvestorType})
Tokenomics: ${data.property.total_tokens} tokens @ $${data.property.token_price}
Distribution: ${data.distribution.marketingChannels.join(', ')}

Task: Write a "Project DNA" summary (max 40 words).
Style: Institutional, concise, summarizing the core identity of the deal.
Example: "A $5M value-add Hospitality offering in Italy, structured via a local S.r.l. SPV, targeting Accredited investors through a compliant Reg S framework."
`;
