
export const GENERATE_DEFI_HANDOFF_PROMPT = (
  tokenName: string,
  tokenSymbol: string,
  tokenStandard: string,
  jurisdiction: string
) => `
ROLE: Senior Blockchain Engineer & Smart Contract Architect.

CONTEXT:
- Token: ${tokenName} (${tokenSymbol})
- Standard: ${tokenStandard}
- Jurisdiction: ${jurisdiction}

TASK: Generate a comprehensive "Deployment Handoff Package" for the developer team or provider.
This package simulates a ready-to-deploy state including contract details, configuration JSONs, and audit metadata.

REQUIREMENTS:
1. Simulate a realistic Contract Address (0x...) and Deployer Wallet.
2. Generate specific JSON configurations for Compliance (whitelist logic), Tokenomics (supply/mint), and Rights (on-chain enforcement).
3. Include a mock Audit Hash and ABI snippet.

OUTPUT FORMAT: Return strictly a JSON object:
{
  "contract_address": "string (0x...)",
  "contract_abi": "string (Short snippet of key functions)",
  "network": "string (e.g. Polygon Mainnet, Ethereum, Avalanche C-Chain)",
  "compliance_overlay_json": "string (JSON object as string representing whitelist rules)",
  "tokenomics_json": "string (JSON object as string representing supply, precision, minting)",
  "vesting_schedule_json": "string (JSON object as string)",
  "rights_json": "string (JSON object as string representing enforced rights)",
  "deployer_wallet": "string (0x...)",
  "audit_hash": "string (SHA256...)",
  "status": "deployed"
}
`;
