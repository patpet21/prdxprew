
export interface AuditConfigEntity {
  // Step 1: Inputs
  projectContext: {
    name: string;
    type: string;
    jurisdiction: string;
    tokenType: string;
  };

  // Step 2: Scope
  scope: {
    regulations: string[]; // e.g. ['MiCA', 'GDPR', 'OFAC']
    depth: 'Standard' | 'Deep Dive' | 'Forensic';
    includeSmartContract: boolean;
    includeMarketing: boolean;
  };

  // Step 3: Docs
  documents: {
    id: string;
    name: string;
    status: 'uploaded' | 'missing' | 'declared';
  }[];

  // Step 4: Risk Appetite
  riskTolerance: {
    regulatoryTolerance: number; // 0-100 (0 = Zero Tolerance)
    reputationalTolerance: number;
    financialExposureTolerance: number;
    operationalFrictionTolerance: number;
  };
}

export const INITIAL_AUDIT_CONFIG: AuditConfigEntity = {
  projectContext: {
    name: "Project Alpha",
    type: "Real Estate",
    jurisdiction: "US-DE",
    tokenType: "Security"
  },
  scope: {
    regulations: ['Reg D', 'AML/KYC'],
    depth: 'Standard',
    includeSmartContract: true,
    includeMarketing: false
  },
  documents: [
    { id: 'd1', name: 'Certificate of Incorporation', status: 'missing' },
    { id: 'd2', name: 'Offering Memorandum', status: 'missing' },
    { id: 'd3', name: 'Token Legal Opinion', status: 'missing' }
  ],
  riskTolerance: {
    regulatoryTolerance: 10, // Very strict
    reputationalTolerance: 20,
    financialExposureTolerance: 50,
    operationalFrictionTolerance: 60 // Willing to accept friction for safety
  }
};
