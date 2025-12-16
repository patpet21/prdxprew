
import { TokenizationState } from '../../types';

export const GENERATE_SPV_DETAILS_PROMPT = (data: TokenizationState) => `
Act as a Corporate Structuring Specialist.
Context: 
- Jurisdiction: ${data.jurisdiction.country}
- Entity Type: ${data.jurisdiction.spvType}
- Asset: ${data.property.category}

Task: Generate a precise "SPV Formation Setup" summary.
1. Confirm the specific legal structure name for this jurisdiction.
2. List 2 key formation documents required (e.g. "Articles of Association", "Operating Agreement").
3. Mention one specific "Compliance Hook" (e.g. "Registered Agent required").

Output strictly JSON:
{
  "structureName": "string",
  "keyDocuments": ["string", "string"],
  "complianceHook": "string"
}
`;

export const GENERATE_TOKEN_FRAMEWORK_PROMPT = (data: TokenizationState) => `
Act as a Blockchain Compliance Architect.
Context:
- Asset: ${data.property.category}
- Regulation: ${data.compliance.regFramework}
- Investor: ${data.compliance.targetInvestorType}

Task: Define the "Token Legal Framework".
1. Select the standard (ERC-3643 or ERC-1400).
2. Define the "Asset classification" on-chain (e.g. "Restricted Security Token").
3. Define the primary restriction logic (e.g. "Hard-lock for 12 months").

Output strictly JSON:
{
  "standard": "string",
  "classification": "string",
  "restrictionLogic": "string"
}
`;
