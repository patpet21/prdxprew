
import { DistributionPlanItem } from "./distribution_plan.entity";
import { UtilityRight } from "./utility_rights.entity";

export type TokenType = 'Security' | 'Revenue Share' | 'Membership' | 'Hybrid' | 'Debt' | 'Governance';
export type TokenStandard = 'ERC-3643' | 'ERC-1404' | 'BSPT' | 'ERC-20';

export interface SupplyCurvePoint {
  year: number;
  amount: number;
  inflationRate: number;
}

export interface DeFiHandoffPackage {
  handoff_package_id: string;
  contract_address: string;
  contract_abi: string;
  network: string;
  token_standard: string;
  compliance_overlay_json: string; // JSON string
  tokenomics_json: string; // JSON string
  vesting_schedule_json: string; // JSON string
  distribution_plan_json: string; // JSON string
  rights_json: string; // JSON string
  deployer_wallet: string;
  audit_hash?: string;
  status: 'draft' | 'deployed' | 'verified' | 'registered';
  delivery_method: 'api' | 'manual' | 'onchain_registration';
  timestamp: string;
}

export interface RegulatedHandoffPackage {
  handoff_package_id: string;
  provider_id: string;
  spv_summary_json: string; // JSON string
  jurisdiction_summary_json: string; // JSON string
  valuation_summary_json: string; // JSON string
  offering_terms_json: string; // JSON string
  token_blueprint_json: string; // JSON string (partial)
  kyc_rules_json: string; // JSON string
  escrow_setup_json?: string; // JSON string
  documents_required: { id: string; name: string; status: 'pending' | 'uploaded' }[];
  documents_uploaded: string[];
  status: 'draft' | 'pending' | 'sent' | 'approved' | 'rejected';
  delivery_method: 'api' | 'email' | 'manual';
  timestamp: string;
}

export interface TokenBlueprintEntity {
  id: string;
  projectId: string;
  
  // Core Config
  tokenName: string;
  tokenSymbol: string;
  tokenType: TokenType;
  tokenStandard: TokenStandard;
  
  // Economics
  totalSupply: number;
  tokenPrice: number;
  hardCap: number; // usually totalSupply * tokenPrice
  minInvestmentTicket: number;
  currency: string;
  
  // NEW: Economics Advanced
  supplyCurve: SupplyCurvePoint[];
  valuationReference: {
    valuationId?: string;
    estimatedValue: number;
    pegType: 'Hard Peg' | 'Soft Peg' | 'Free Float';
  };

  // Structure
  distributionPlan: DistributionPlanItem[];
  
  // Rights & Utility
  economicRights: string[]; // Dividends, Liquidation pref
  governanceRights: string[]; // Voting, Veto
  utilityRights: UtilityRight[];
  
  // Compliance & Restrictions
  transferRestrictions: string; // e.g. "Reg D Lockup (12m)"
  jurisdictionRules: string; // e.g. "US Accredited Only, No Sanctioned"
  riskAnalysisAi: string; // e.g. "Moderate. Standard ERC3643 reduces technical risk."
  
  // Modules
  complianceConfig?: {
      identityProvider: string;
      whitelistingMode: string;
      countryBlocklist: string[];
  };
  permissionConfig?: {
      pauseable: boolean;
      forceTransfer: boolean; // For legal recovery
      maxBalanceLimit?: number;
  };
  
  regulatoryFlags: string[];
  
  // Deployment Handoffs
  defiHandoff?: DeFiHandoffPackage;
  regulatedHandoff?: RegulatedHandoffPackage;

  createdAt: string;
  updatedAt: string;
}
