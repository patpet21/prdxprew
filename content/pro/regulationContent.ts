
export const REGULATION_TERMS = {
  // TAB 1: Token Basics
  token_basics: [
    { id: 'Security Token', label: 'Security Token', desc: 'A digital token representing ownership of a real-world asset (equity, debt, real estate), fully regulated as a security.' },
    { id: 'Utility Token', label: 'Utility Token', desc: 'A token that provides access to a product or service but no ownership rights. Often less regulated.' },
    { id: 'Asset-Backed Token', label: 'Asset-Backed Token', desc: 'A token whose value is directly derived from a physical asset like gold or real estate.' },
    { id: 'Governance Token', label: 'Governance Token', desc: 'Grants voting rights in a DAO or protocol to influence decisions.' },
    { id: 'On-chain vs Off-chain Rights', label: 'On-chain vs Off-chain Rights', desc: 'On-chain: Code enforcing rights. Off-chain: Legal contract enforcing rights.' },
    { id: 'Token Cap Table', label: 'Token Cap Table', desc: 'A digital ledger showing who owns what percentage of the token supply.' }
  ],

  // TAB 2: Compliance & Identity
  compliance: [
    { id: 'KYC', label: 'KYC (Know Your Customer)', desc: 'Mandatory ID verification process for investors.' },
    { id: 'KYB', label: 'KYB (Know Your Business)', desc: 'Verification of corporate entities investing in your project.' },
    { id: 'KYT', label: 'KYT (Know Your Transaction)', desc: 'Monitoring crypto transactions for illicit activity.' },
    { id: 'AML Screening', label: 'AML Screening', desc: 'Checking names against global watchlists for money laundering.' },
    { id: 'Sanctions Screening', label: 'Sanctions Screening', desc: 'Ensuring investors are not on OFAC or UN sanctions lists.' },
    { id: 'Travel Rule', label: 'Travel Rule', desc: 'Requirement to share sender/receiver info for crypto transfers above a threshold.' },
    { id: 'ZK-KYC', label: 'ZK-KYC', desc: 'Zero-Knowledge Proof KYC. Verifying identity without revealing personal data.' },
    { id: 'Regulated Wallet', label: 'Regulated Wallet / Whitelist', desc: 'A wallet address approved by the smart contract to hold tokens.' },
    { id: 'Transfer Restrictions', label: 'Transfer Restrictions (ERC-3643)', desc: 'Smart contract rules blocking unauthorized transfers.' },
    { id: 'Transfer Agent', label: 'Transfer Agent (TA)', desc: 'A regulated entity that maintains the official record of security ownership.' },
    { id: 'Registrar', label: 'Registrar', desc: 'The system of record for securities.' }
  ],

  // TAB 3: Legal Entities & Roles
  entities: [
    { id: 'SPV', label: 'SPV / SPE', desc: 'Special Purpose Vehicle. A company created solely to hold the asset and isolate risk.' },
    { id: 'Issuer Entity', label: 'Issuer Entity', desc: 'The legal entity that mints and sells the tokens.' },
    { id: 'Asset Owner Entity', label: 'Asset Owner Entity', desc: 'The entity holding the title deed (often the SPV).' },
    { id: 'Holding Company', label: 'Holding Company', desc: 'A parent company that owns the SPV shares.' },
    { id: 'Fund', label: 'Fund (AIF/RAIF)', desc: 'Pooled investment vehicle regulated under fund laws.' },
    { id: 'Beneficial Ownership', label: 'Beneficial Ownership', desc: 'The ultimate human owner(s) of the structure.' },
    { id: 'Trustee', label: 'Trustee', desc: 'A fiduciary holding assets on behalf of beneficiaries.' },
    { id: 'Custodian', label: 'Custodian', desc: 'A regulated entity safeguarding digital assets.' },
    { id: 'Escrow Agent', label: 'Escrow Agent', desc: 'Holds funds neutrally until deal conditions are met.' },
    { id: 'Placement Agent', label: 'Placement Agent', desc: 'A licensed firm that helps sell the securities to investors.' },
    { id: 'Broker-Dealer', label: 'Broker-Dealer', desc: 'US regulated firm buying/selling securities for others.' },
    { id: 'RIA', label: 'Registered Investment Advisor', desc: 'Advisor providing investment advice for a fee.' },
    { id: 'AIFM', label: 'AIFM', desc: 'Alternative Investment Fund Manager (EU).' },
    { id: 'MLRO', label: 'MLRO', desc: 'Money Laundering Reporting Officer. Responsible for AML compliance.' }
  ],

  // TAB 4: Market Structure
  market: [
    { id: 'Primary Offering', label: 'Primary Offering', desc: 'The initial sale of tokens from issuer to investors (STO).' },
    { id: 'Secondary Trading', label: 'Secondary Trading', desc: 'Trading tokens between investors after the initial sale.' },
    { id: 'Order Book', label: 'Order Book', desc: 'List of buy and sell orders on an exchange.' },
    { id: 'AMM', label: 'AMM', desc: 'Automated Market Maker. A DEX algorithm for trading without an order book.' },
    { id: 'Liquidity Pools', label: 'Liquidity Pools', desc: 'Crowdsourced pools of tokens locked in a smart contract to facilitate trading.' },
    { id: 'ATS', label: 'ATS (US)', desc: 'Alternative Trading System. A US regulated venue for trading securities.' },
    { id: 'MTF', label: 'MTF (EU)', desc: 'Multilateral Trading Facility. An EU regulated trading venue.' },
    { id: 'CEX vs DEX', label: 'CEX vs DEX', desc: 'Centralized (Company-run) vs Decentralized (Code-run) Exchanges.' },
    { id: 'Settlement', label: 'Settlement & Clearing', desc: 'Finalizing the trade and transferring ownership.' }
  ],

  // TAB 5: Frameworks (Static Definitions)
  frameworks: [
    { 
        id: 'EU_MiCA', 
        label: 'EU: MiCA (Markets in Crypto-Assets)', 
        desc: 'The comprehensive EU regulation. Defines CASPs (Crypto Asset Service Providers) and sets strict rules for issuers, especially stablecoins. Utility tokens are regulated; Security Tokens fall under MiFID II.' 
    },
    { 
        id: 'US_SEC', 
        label: 'US: SEC Regulations', 
        desc: 'The SEC treats most asset tokens as securities. Reg D 506(c) allows general solicitation for accredited investors. Reg S is for offshore. Public offerings need Reg A+ or S-1.' 
    },
    { 
        id: 'UK_FCA', 
        label: 'UK: FCA Sandbox & Rules', 
        desc: 'The UK FCA focuses on anti-money laundering and consumer protection. Security tokens are "Specified Investments". E-money rules apply to payment tokens.' 
    }
  ]
};
