
import { ProjectStatus } from "./project_status.enum";

export interface ProjectIntakeData {
  projectName: string;
  assetType: 'Real Estate' | 'Business' | 'Debt' | 'Art' | 'Funds' | 'Other';
  location: string;
  goal: 'Liquidity' | 'Capital Raise' | 'Community';
  targetRaise: number;
  targetInvestor: 'Retail' | 'Accredited' | 'Institutional';
  timeline: 'ASAP' | '3-6 Months' | '6-12 Months';
  description: string;
}

export interface ProjectEntity {
  id: string;
  name: string;
  ownerId: string;
  status: ProjectStatus;
  createdAt: string;
  updatedAt: string;

  // Core data blocks
  intake: ProjectIntakeData;
  
  // AI Generated Analysis
  summary?: {
    executiveSummary: string;
    feasibilityScore: number;
    keyRisks: string[];
    recommendedStructure: string;
  };

  // Module Data (linked or embedded)
  jurisdiction?: any;      // From jurisdiction_library
  spv?: any;               // from spv_builder
  valuation?: any;         // from valuation_engine
  tokenomics?: any;        // from token_blueprint
  investorPackage?: any;   // from investor_package
}
