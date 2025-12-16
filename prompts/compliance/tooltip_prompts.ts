
export const GENERATE_TOOLTIP_DEFINITIONS = `
Act as a UX Copywriter for a Fintech App.
Generate definitions that are extremely short (max 20 words) and simple (ELI5 - Explain Like I'm 5).
These will be used as UI Tooltips.

Terms to define:
- Escrow
- Custodial
- Non-Custodial
- RWA (Real World Asset)
- KYC (Know Your Customer)
- AML (Anti Money Laundering)
- Transfer Agent
- ATS (Alternative Trading System)
- Lock-up
- Whitelisting
- Reg D
- Reg S
- MiCA
- CASP
- VASP

Output format: STRICTLY JSON array of objects.
[
  { "term": "Escrow", "short_definition": "A neutral safe that holds money until the deal is done." },
  ...
]
`;
