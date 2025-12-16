
import { TokenizationCategory } from "../../../types";

export const SPV_STRUCTURING_PROMPT = (
  assetClass: TokenizationCategory,
  assetCountry: string,
  issuerCountry: string,
  targetInvestorRegion: string
) => `
ROLE: Senior International Corporate Lawyer & Tax Strategist.

TASK: Analyze the optimal Special Purpose Vehicle (SPV) structure for a Real World Asset tokenization project.

CONTEXT:
- Asset Class: ${assetClass}
- Asset Location: ${assetCountry}
- Issuer/Sponsor Domicile: ${issuerCountry}
- Target Investors: ${targetInvestorRegion}

ANALYSIS REQUIREMENTS:
1. Determine if a "Double SPV" (OpCo/HoldCo) structure is required to minimize tax leakage or separate liability.
2. Identify specific "Red Flags" regarding cross-border asset ownership (e.g., Foreign ownership restrictions on land).
3. Recommend the specific legal entity types for both the Asset Holder and the Token Issuer.

OUTPUT FORMAT:
Return strictly a JSON object with the following structure:
{
  "recommendedStructure": "Single SPV" | "Double SPV" | "Fund Structure",
  "primaryEntity": {
    "jurisdiction": "string",
    "form": "string (e.g. LLC, S.r.l.)",
    "role": "Asset Holder"
  },
  "secondaryEntity": {
    "jurisdiction": "string (or null if Single)",
    "form": "string",
    "role": "Token Issuer"
  },
  "reasoning": "string (Professional legal justification, max 3 sentences)",
  "riskFactors": ["string", "string"]
}
`;

export const GOVERNANCE_GENERATION_PROMPT = (
  legalForm: string,
  jurisdiction: string
) => `
ROLE: Corporate Governance Expert.

TASK: Generate a governance matrix for a ${legalForm} established in ${jurisdiction}.

CONTEXT: This entity issues security tokens. Governance must balance Investor Rights with Sponsor Operational Control.

OUTPUT FORMAT:
Return strictly a JSON object:
{
  "boardComposition": {
    "totalSeats": number,
    "sponsorSeats": number,
    "investorSeats": number,
    "independentSeats": number
  },
  "votingThresholds": {
    "ordinary": "string (e.g. >50%)",
    "extraordinary": "string (e.g. >75%)",
    "dragAlong": "string (e.g. >80%)"
  },
  "investorProtections": ["string", "string", "string"]
}
`;
