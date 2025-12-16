
export interface PartnerFormField {
  id: string;
  label: string;
  type: 'text' | 'number' | 'select' | 'file';
  placeholder?: string;
  options?: string[];
  required: boolean;
}

export interface TokenizationPartner {
  id: string;
  name: string;
  type: 'Protocol' | 'Issuer Platform' | 'Exchange' | 'White Label';
  regions: ('EU' | 'US' | 'Global' | 'Asia')[];
  license: string;
  blockchain: string;
  logo: string;
  description: string;
  minAssetValue: string;
  integrationSteps: string[];
  // New Fields
  formFields: PartnerFormField[];
  aiHints: string; // Context for the AI advisor
}

export const TOKENIZATION_PARTNERS: TokenizationPartner[] = [
  // EU FOCUSED
  {
    id: 'blocksquare',
    name: 'Blocksquare',
    type: 'Protocol',
    regions: ['EU', 'Global'],
    license: 'MiCA Compliant Structure (Slovenia)',
    blockchain: 'Ethereum / Oceanpoint',
    logo: '🟦',
    description: 'Leading infrastructure for real estate tokenization. Provides white-label marketplace and legal bridge.',
    minAssetValue: '€500k',
    integrationSteps: [
      'Register Property in Land Registry',
      'Sign Corporate Resolution for Tokenization',
      'Submit KYB for Corporate Entity',
      'Mint 100,000 BSPT Tokens'
    ],
    aiHints: "Blocksquare operates on a specific 'Certified Tenant' model. Ensure the corporate resolution explicitly mentions the Oceanpoint protocol bridge.",
    formFields: [
        { id: 'corporate_resolution', label: 'Corporate Resolution Status', type: 'select', options: ['Drafted', 'Signed', 'Not Started'], required: true },
        { id: 'land_registry_id', label: 'Land Registry ID', type: 'text', placeholder: 'e.g. LR-12345-IT', required: true },
        { id: 'admin_wallet', label: 'Admin Wallet (ETH)', type: 'text', placeholder: '0x...', required: true }
    ]
  },
  {
    id: 'tokeny',
    name: 'Tokeny Solutions',
    type: 'Issuer Platform',
    regions: ['EU', 'Global'],
    license: 'T-REX Standard (ERC-3643)',
    blockchain: 'Polygon / Ethereum',
    logo: '🦖',
    description: 'Institutional-grade compliance. Uses ONCHAINID for automated identity enforcement.',
    minAssetValue: '€5M',
    integrationSteps: [
      'Setup ONCHAINID for Issuer',
      'Configure Identity Registry',
      'Deploy T-REX Smart Contract Suite',
      'Appoint Recovery Agent'
    ],
    aiHints: "Tokeny requires an ONCHAINID setup. Focus on the 'Recovery Agent' appointment in the SPV bylaws to ensure lost keys can be recovered legally.",
    formFields: [
        { id: 'onchainid_status', label: 'ONCHAINID Setup', type: 'select', options: ['Pending', 'Active'], required: true },
        { id: 'compliance_agent', label: 'Compliance Agent Name', type: 'text', placeholder: 'e.g. Law Firm LLP', required: true },
        { id: 'recovery_agent', label: 'Recovery Agent Name', type: 'text', placeholder: 'e.g. Trustee Corp', required: true }
    ]
  },
  
  // US FOCUSED
  {
    id: 'realt',
    name: 'RealT',
    type: 'Issuer Platform',
    regions: ['US', 'Global'],
    license: 'Delaware Series LLC (Reg D/S)',
    blockchain: 'Gnosis Chain',
    logo: '🏠',
    description: 'Fractional ownership of US residential real estate. Daily rent payouts via USDC.',
    minAssetValue: '€100k',
    integrationSteps: [
      'Form Delaware Series LLC',
      'File Form D with SEC',
      'Sign Property Management Agreement',
      'Transfer Deed to LLC'
    ],
    aiHints: "RealT focuses on daily rent output. Ensure your cashflow model supports high-frequency distribution logic.",
    formFields: [
        { id: 'series_llc_name', label: 'Series LLC Name', type: 'text', placeholder: 'RealT Series - 123 Main St', required: true },
        { id: 'form_d_cik', label: 'SEC CIK Number (Form D)', type: 'text', placeholder: '000...', required: false },
        { id: 'prop_mgmt', label: 'Property Manager', type: 'text', placeholder: 'Mgmt Co Name', required: true }
    ]
  },
  {
    id: 'securitize',
    name: 'Securitize',
    type: 'Issuer Platform',
    regions: ['US', 'Global'],
    license: 'SEC Registered Transfer Agent',
    blockchain: 'Avalanche / Polygon',
    logo: '🛡️',
    description: 'Full-stack issuance and lifecycle management. Cap table management and secondary market access.',
    minAssetValue: '€10M',
    integrationSteps: [
      'Complete Issuer Due Diligence',
      'Configure DS Protocol',
      'Integrate Transfer Agent API',
      'Issue Digital Securities'
    ],
    aiHints: "Securitize is a Transfer Agent. The cap table is the master record. Ensure your shareholder agreement explicitly names Securitize as the registrar.",
    formFields: [
        { id: 'transfer_agent_agreement', label: 'Transfer Agent Agreement', type: 'file', required: true },
        { id: 'issuer_did', label: 'Issuer DID', type: 'text', placeholder: 'did:sec:...', required: true }
    ]
  },

  // GLOBAL / OTHER
  {
    id: 'digishares',
    name: 'DigiShares',
    type: 'White Label',
    regions: ['Global', 'EU', 'US'],
    license: 'Technology Provider',
    blockchain: 'Polymesh / Ethereum',
    logo: '🌐',
    description: 'White-label platform for tokenizing assets, managing investors, and trading.',
    minAssetValue: '€1M',
    integrationSteps: [
      'Customize Investor Dashboard',
      'Setup Payment Gateway',
      'Configure Cap Table Rules',
      'Launch STO'
    ],
    aiHints: "DigiShares is a white-label tech provider. You control the legal structure entirely. Focus on the 'Payment Gateway' integration for fiat onboarding.",
    formFields: [
        { id: 'brand_color', label: 'Brand Hex Color', type: 'text', placeholder: '#000000', required: false },
        { id: 'domain_name', label: 'Portal Domain', type: 'text', placeholder: 'invest.myproject.com', required: true }
    ]
  }
];
