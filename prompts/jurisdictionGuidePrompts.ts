
import { TokenizationCategory } from '../types';

export const RECOMMEND_JURISDICTION_PROMPT = (
  preferences: {
    priority: 'Speed' | 'Cost' | 'Protection' | 'Tax',
    investorType: 'Retail' | 'Accredited' | 'Institutional',
    assetType: string,
    region: string
  }
) => `
ROLE: Senior Legal Structuring Advisor.

CONTEXT:
- Priority: ${preferences.priority}
- Investor: ${preferences.investorType}
- Asset: ${preferences.assetType}
- Region: ${preferences.region}

TASK: Recommend the single best jurisdiction.

OUTPUT JSON:
{
  "country": "string (e.g. US-DE, IT, AE)",
  "reasoning": "string (2 sentences explaining why)",
  "riskLevel": "Low" | "Medium" | "High"
}
`;

export const COMPARE_COUNTRIES_PROMPT = (c1: string, c2: string) => `
ROLE: International Tax Lawyer.

TASK: Compare ${c1} vs ${c2} for asset tokenization.

OUTPUT JSON:
{
  "winner": "string",
  "comparison": [
    { "metric": "Setup Time", "c1_val": "string", "c2_val": "string" },
    { "metric": "Cost", "c1_val": "string", "c2_val": "string" },
    { "metric": "Crypto Regs", "c1_val": "string", "c2_val": "string" }
  ],
  "verdict": "string"
}
`;
