
export type DocStatus = 'draft' | 'review' | 'audited' | 'final';

export interface LegalClause {
  id: string;
  title: string;
  content: string;
  isAiGenerated: boolean;
  variants?: string[];
  tags: string[]; // e.g. "Governance", "Liability"
}

export interface LogicRule {
  id: string;
  condition: string; // e.g. "Jurisdiction == US"
  action: string;    // e.g. "Include Reg D Legend"
  isActive: boolean;
  impactLevel: 'High' | 'Medium' | 'Low';
}

export interface MissingClauseFinding {
  id: string;
  missingClauseName: string;
  riskReason: string;
  suggestedContent: string;
  severity: 'Critical' | 'Recommended';
}

export interface LegalProjectData {
  id: string;
  projectName: string;
  governingLaw: string; // e.g. "State of Delaware"
  disputeResolution: 'Arbitration' | 'Court' | 'Smart Contract DAO';
  investorRights: string[]; // e.g. "Pro-rata", "Info Rights"
  
  // State
  activeRules: LogicRule[];
  draftClauses: LegalClause[];
  auditFindings: MissingClauseFinding[];
  checklist: { item: string; checked: boolean }[];
  
  status: DocStatus;
  lastUpdated: string;
}

export const INITIAL_LEGAL_PROJECT: LegalProjectData = {
  id: 'new',
  projectName: '',
  governingLaw: 'Delaware',
  disputeResolution: 'Arbitration',
  investorRights: [],
  activeRules: [],
  draftClauses: [],
  auditFindings: [],
  checklist: [],
  status: 'draft',
  lastUpdated: new Date().toISOString()
};
