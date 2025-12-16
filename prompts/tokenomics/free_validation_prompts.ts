
export const TOKEN_SENSE_CHECK_PROMPT = (
  raiseAmount: number,
  totalSupply: number,
  tokenPrice: number
) => `
Act as a Token Economist.
Analyze these inputs for a Real World Asset token:
- Target Raise: $${raiseAmount}
- Total Supply: ${totalSupply}
- Token Price: $${tokenPrice}

Task:
1. Determine if the **Token Price** is psychologically weird for RWA (e.g., < $1 or > $10,000). Standard is $10-$1000.
2. Determine if **Supply** is too high/low (e.g., billions of tokens for a house is weird).
3. If weird, suggest a "Correction" (e.g., "Set Price to $50, Supply to ${raiseAmount / 50}").

Output strictly JSON:
{
  "isReasonable": boolean,
  "issue": "string (e.g. 'Supply is too high for this raise amount')",
  "suggestion": {
    "price": number,
    "supply": number,
    "reason": "string (Short explanation)"
  }
}
`;
