
export const TOKEN_MODEL_PROMPT = (assetType: string) => `
Act as a Token Engineering Professor.
Recommend the optimal Token Model for a '${assetType}' asset.
Compare:
1. Equity Token (Hard asset ownership)
2. Revenue Share Token (Cashflow only)
3. Hybrid (Debt + Kicker)

Explain how a VC would value each model in terms of exit liquidity and regulatory friction.
`;

export const SUPPLY_PRICING_PROMPT = (supply: number, price: number, valuation: number) => `
Act as a Market Maker for Digital Assets.
Analyze this configuration:
- Total Supply: ${supply}
- Price per Token: $${price}
- Implied FDV (Fully Diluted Valuation): $${valuation}

Provide a "Psychological Pricing Analysis":
1. Is this "Retail Friendly" (low price, high supply) or "Institutional" (high price, low supply)?
2. Does the FDV match market norms for this asset class?
3. Suggest one adjustment to optimize for secondary market liquidity.
`;

export const GOVERNANCE_RIGHTS_PROMPT = (rights: string[]) => `
Act as a Governance Risk Auditor.
Review these proposed investor rights: ${rights.join(', ')}.

Verdict:
1. Is this "Sponsor Heavy" or "Community Heavy"?
2. Identify one missing right that would make this "Investment Grade" (e.g. Tag-along rights, Audit rights).
`;

export const VESTING_SCHEDULE_PROMPT = (sponsorLockup: number, investorLockup: number) => `
Act as a Venture Capitalist reviewing a Cap Table.
Review Vesting:
- Sponsor Lockup: ${sponsorLockup} months
- Investor Lockup: ${investorLockup} months

Critique:
1. Is the Sponsor sufficiently incentivized to stay?
2. Are Investors dumping too early?
3. Recommend a standard "Cliff" and "Vesting" period for this asset class.
`;

export const FAIRNESS_SCORE_PROMPT = (data: any) => `
Act as an Ethical Tokenomics Auditor.
Calculate a "Fairness Score" (0-100) for this structure.
Input Data: ${JSON.stringify(data)}

Criteria:
- Sponsor vs Investor Split
- Governance Power balance
- Exit Liquidity terms

Return strictly JSON: { "score": number, "verdict": "string", "corrections": ["string"] }
`;
