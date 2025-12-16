
export interface GlossaryTerm {
  term: string;
  definition: string;
  importance: string;
  example: string;
  jurisdiction?: string;
  category: 'legal' | 'corporate' | 'blockchain' | 'finance' | 'ops' | 'licensing';
}

export interface LicenseRequirement {
  jurisdiction: string;
  licenses: {
    name: string;
    description: string;
    holder: string;
  }[];
}

export const GLOSSARY_DATA: GlossaryTerm[] = [
  // SECTION 1 - COMPLIANCE & LEGAL
  {
    term: "Security Token",
    definition: "A digital token that represents ownership of a real-world asset (equity, debt, real estate) and is regulated as a security.",
    importance: "Subject to strict securities laws (prospectus, KYC, accredited investors).",
    example: "A token representing 1 share of a Real Estate SPV.",
    category: "legal"
  },
  {
    term: "Reg D 506(c)",
    definition: "US SEC exemption allowing general solicitation (public advertising) but restricting investment to Accredited Investors only.",
    importance: "Most common route for US real estate tokenization to raise capital online.",
    example: "Selling tokens on a website to wealthy US doctors and lawyers.",
    jurisdiction: "USA",
    category: "legal"
  },
  {
    term: "MiCA",
    definition: "Markets in Crypto-Assets Regulation. EU framework regulating crypto-assets, issuers, and service providers.",
    importance: "Provides a passporting regime for crypto services across the EEA.",
    example: "A CASP offering custody services in France can serve German clients.",
    jurisdiction: "EU",
    category: "legal"
  },
  {
    term: "Transfer Agent",
    definition: "A regulated entity responsible for maintaining the official record of ownership for securities.",
    importance: "Legally required for Reg A+ and public offerings to track who owns the tokens.",
    example: "Securitize, Vertalo.",
    jurisdiction: "USA",
    category: "legal"
  },
  {
    term: "KYC / AML",
    definition: "Know Your Customer / Anti-Money Laundering. Process of verifying identity and checking source of funds.",
    importance: "Mandatory for all security token issuers to prevent financial crime.",
    example: "Uploading a passport and selfie to SumSub before buying a token.",
    category: "legal"
  },

  // SECTION 2 - CORPORATE / SPV
  {
    term: "SPV",
    definition: "Special Purpose Vehicle. A subsidiary company created for a specific project (like holding one building).",
    importance: "Isolates financial risk. If the SPV goes bankrupt, it doesn't affect the parent company.",
    example: "Skyline Tower LLC (Delaware) holding only the Skyline Tower asset.",
    category: "corporate"
  },
  {
    term: "UBO",
    definition: "Ultimate Beneficial Owner. The actual human being who ultimately owns or controls the company.",
    importance: "Must be disclosed to banks and regulators during onboarding.",
    example: "John Doe owning 100% of a holding company which owns the SPV.",
    category: "corporate"
  },
  {
    term: "Operating Agreement",
    definition: "Legal document outlining the ownership and operating procedures of an LLC.",
    importance: "Links the digital token to legal rights (voting, dividends).",
    example: "Clause 5.1: 'Token holders are entitled to 80% of Net Operating Income'.",
    category: "corporate"
  },

  // SECTION 3 - BLOCKCHAIN
  {
    term: "ERC-3643 (T-REX)",
    definition: "The institutional standard for security tokens. Enforces compliance (KYC, whitelist) directly in the token smart contract.",
    importance: "Ensures tokens cannot be sent to unauthorized wallets, even if the user tries.",
    example: "Tokeny's T-REX protocol.",
    category: "blockchain"
  },
  {
    term: "Whitelisting",
    definition: "The process of approving a wallet address in the smart contract so it can receive tokens.",
    importance: "Without whitelisting, a compliant transfer is impossible on-chain.",
    example: "0xABC... is added to the 'US_Accredited' whitelist after passing KYC.",
    category: "blockchain"
  },
  {
    term: "Custodial Wallet",
    definition: "A wallet where a third party (like an exchange) holds the private keys.",
    importance: "Easier for beginners but relies on trust in the provider.",
    example: "Coinbase Wallet, Fireblocks.",
    category: "blockchain"
  },

  // SECTION 4 - FINANCIAL
  {
    term: "Cashflow Waterfall",
    definition: "The order in which capital distributions are paid out to different classes of investors.",
    importance: "Determines who gets paid first and how much.",
    example: "1. Return of Capital to Investors -> 2. 8% Pref Return -> 3. 80/20 Split.",
    category: "finance"
  },
  {
    term: "NAV",
    definition: "Net Asset Value. Total Value of Assets minus Total Liabilities.",
    importance: "The true 'book value' of the token share.",
    example: "Building Value ($10M) - Mortgage ($4M) = NAV ($6M).",
    category: "finance"
  },
  {
    term: "Lock-up Period",
    definition: "A timeframe during which investors cannot sell or transfer their tokens.",
    importance: "Prevents immediate dumping and complies with Reg D (1 year lock-up).",
    example: "Investors cannot trade tokens on secondary markets for 12 months.",
    category: "finance"
  },

  // SECTION 5 - OPS
  {
    term: "Escrow",
    definition: "A financial arrangement where a third party holds funds until specific conditions are met.",
    importance: "Protects investors during the fundraising phase. Funds are returned if soft cap isn't met.",
    example: "North Capital Escrow holding funds until $1M raised.",
    category: "ops"
  },
  {
    term: "Settlement",
    definition: "The final transfer of ownership and payment. In crypto, this can be instant (T+0).",
    importance: "Blockchain drastically reduces settlement time from days (T+2) to seconds.",
    example: "Atomic Swap of USDC for Real Estate Token.",
    category: "ops"
  }
];

export const LICENSING_DATA: LicenseRequirement[] = [
  {
    jurisdiction: "USA",
    licenses: [
      { name: "Broker-Dealer", description: "Required to sell securities for others or receive transaction-based compensation.", holder: "FINRA Member (e.g. Dalmore Group)" },
      { name: "Transfer Agent", description: "Required to maintain security holder records for Reg A+ / Public offerings.", holder: "SEC Registered (e.g. Securitize)" },
      { name: "ATS License", description: "Alternative Trading System. Required to operate a secondary market exchange.", holder: "tZERO, INX" }
    ]
  },
  {
    jurisdiction: "Europe (EU)",
    licenses: [
      { name: "MiCA CASP", description: "Crypto-Asset Service Provider. Custody, exchange, or advice on crypto assets.", holder: "Authorized Firm" },
      { name: "E-Money Issuer", description: "Required to issue fiat-referenced stablecoins.", holder: "Circle EU, Banks" },
      { name: "Crowdfunding", description: "ECSP License. Required to operate a platform raising up to €5M/year.", holder: "Portal Operator" }
    ]
  },
  {
    jurisdiction: "UAE (Dubai)",
    licenses: [
      { name: "VARA VASP", description: "Virtual Asset Service Provider. Mandatory for operating in Dubai.", holder: "Exchange / Broker" },
      { name: "Category 3A/4", description: "Financial license in DFSA/ADGM for arranging deals.", holder: "Investment Firm" }
    ]
  }
];
