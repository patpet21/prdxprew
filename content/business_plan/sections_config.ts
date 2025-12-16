
export const SECTIONS_CONFIG: Record<string, { title: string; fields: { name: string; label: string; placeholder: string; type?: 'text'|'textarea'|'number' }[] }> = {
  projectIdentification: {
    title: "Project Identification",
    fields: [
      { name: 'name', label: 'Project Name', placeholder: 'e.g. Skyline Tower' },
      { name: 'sponsor', label: 'Sponsor / Issuer', placeholder: 'e.g. Acme Capital' },
      { name: 'date', label: 'Date', placeholder: 'e.g. October 2023' },
      { name: 'version', label: 'Version', placeholder: 'e.g. 1.0 Draft' }
    ]
  },
  executiveSummary: {
    title: "Executive Summary",
    fields: [
      { name: 'opportunity', label: 'The Opportunity', placeholder: 'Why is this deal unique?', type: 'textarea' },
      { name: 'ask', label: 'Capital Ask', placeholder: 'e.g. $5M Equity' },
      { name: 'roi', label: 'Proj. ROI / IRR', placeholder: 'e.g. 15% IRR' }
    ]
  },
  assetOverview: {
    title: "Asset Overview",
    fields: [
      { name: 'type', label: 'Asset Type', placeholder: 'e.g. Commercial Office' },
      { name: 'location', label: 'Location', placeholder: 'e.g. New York, NY' },
      { name: 'specs', label: 'Key Specs', placeholder: 'e.g. 50,000 sqft, Class A' },
      { name: 'condition', label: 'Condition', placeholder: 'e.g. Newly Renovated' }
    ]
  },
  projectStatusTimeline: {
    title: "Project Status",
    fields: [
      { name: 'phase', label: 'Current Phase', placeholder: 'e.g. Pre-Acquisition' },
      { name: 'milestones', label: 'Next Milestones', placeholder: 'e.g. Closing, Renovation' },
      { name: 'launchDate', label: 'Target Launch', placeholder: 'e.g. Q1 2024' }
    ]
  },
  marketLocationAnalysis: {
    title: "Market Analysis",
    fields: [
      { name: 'area', label: 'Target Area', placeholder: 'e.g. Downtown Miami' },
      { name: 'trends', label: 'Market Trends', placeholder: 'e.g. Rising demand for tech offices', type: 'textarea' },
      { name: 'demographics', label: 'Demographics', placeholder: 'e.g. Young professionals' }
    ]
  },
  businessModel: {
    title: "Business Model",
    fields: [
      { name: 'revenueSource', label: 'Revenue Source', placeholder: 'e.g. Long-term leases' },
      { name: 'pricing', label: 'Pricing Strategy', placeholder: 'e.g. Premium market rates' },
      { name: 'operations', label: 'Ops Strategy', placeholder: 'e.g. Lean management' }
    ]
  },
  legalStructureSpv: {
    title: "Legal Structure",
    fields: [
      { name: 'jurisdiction', label: 'Jurisdiction', placeholder: 'e.g. Delaware' },
      { name: 'entityType', label: 'Entity Type', placeholder: 'e.g. LLC' },
      { name: 'assetHolder', label: 'Asset Holder', placeholder: 'e.g. SPV directly holds title' }
    ]
  },
  regulatoryCompliance: {
    title: "Compliance",
    fields: [
      { name: 'regime', label: 'Regime', placeholder: 'e.g. Reg D 506(c)' },
      { name: 'kyc', label: 'KYC Requirement', placeholder: 'e.g. Mandatory for all' },
      { name: 'restrictions', label: 'Restrictions', placeholder: 'e.g. 1 year lockup' }
    ]
  },
  tokenModelDefinition: {
    title: "Token Model",
    fields: [
      { name: 'tokenType', label: 'Token Type', placeholder: 'e.g. Security Token' },
      { name: 'standard', label: 'Standard', placeholder: 'e.g. ERC-3643' },
      { name: 'classification', label: 'Classification', placeholder: 'e.g. Equity Share' }
    ]
  },
  tokenomicsPricing: {
    title: "Tokenomics",
    fields: [
      { name: 'supply', label: 'Total Supply', placeholder: 'e.g. 1,000,000' },
      { name: 'price', label: 'Token Price', placeholder: 'e.g. $10.00' },
      { name: 'valuation', label: 'Valuation', placeholder: 'e.g. $10M' }
    ]
  },
  capitalStructure: {
    title: "Capital Stack",
    fields: [
      { name: 'equity', label: 'Equity %', placeholder: '30' },
      { name: 'debt', label: 'Debt %', placeholder: '60' },
      { name: 'tokenFloat', label: 'Token Float %', placeholder: '10' }
    ]
  },
  useOfFunds: {
    title: "Use of Funds",
    fields: [
      { name: 'acquisition', label: 'Acquisition ($)', placeholder: '3,000,000' },
      { name: 'capex', label: 'Renovation ($)', placeholder: '500,000' },
      { name: 'fees', label: 'Fees & Legal ($)', placeholder: '100,000' },
      { name: 'reserves', label: 'Reserves ($)', placeholder: '50,000' }
    ]
  },
  revenueStreams: {
    title: "Revenue",
    fields: [
      { name: 'primary', label: 'Primary Income', placeholder: 'e.g. Rental Income' },
      { name: 'secondary', label: 'Secondary Income', placeholder: 'e.g. Parking fees' },
      { name: 'growth', label: 'Annual Growth %', placeholder: '3%' }
    ]
  },
  costStructure: {
    title: "Costs",
    fields: [
      { name: 'fixed', label: 'Fixed Costs', placeholder: 'e.g. Insurance, Tax' },
      { name: 'variable', label: 'Variable', placeholder: 'e.g. Maintenance, Utilities' },
      { name: 'mgmtFee', label: 'Mgmt Fee', placeholder: 'e.g. 2% of Gross Rev' }
    ]
  },
  financialProjections: {
    title: "Projections",
    fields: [
      { name: 'y1', label: 'Year 1 NOI', placeholder: '$200,000' },
      { name: 'y5', label: 'Year 5 NOI', placeholder: '$250,000' },
      { name: 'exitCap', label: 'Exit Cap Rate', placeholder: '5.5%' }
    ]
  },
  investorReturns: {
    title: "Returns",
    fields: [
      { name: 'irr', label: 'Target IRR', placeholder: '15%' },
      { name: 'yield', label: 'Cash Yield', placeholder: '6%' },
      { name: 'multiple', label: 'Equity Multiple', placeholder: '1.8x' }
    ]
  },
  payoutDistribution: {
    title: "Payouts",
    fields: [
      { name: 'frequency', label: 'Frequency', placeholder: 'Quarterly' },
      { name: 'method', label: 'Method', placeholder: 'USDC Airdrop' },
      { name: 'reinvestment', label: 'Reinvestment', placeholder: 'Allowed / Not Allowed' }
    ]
  },
  treasuryManagement: {
    title: "Treasury",
    fields: [
      { name: 'custody', label: 'Custody Solution', placeholder: 'e.g. Fireblocks' },
      { name: 'reservesRule', label: 'Reserve Rule', placeholder: 'e.g. 5% of Gross Rev' },
      { name: 'multisig', label: 'Multisig', placeholder: '2-of-3 Signers' }
    ]
  },
  riskAnalysis: {
    title: "Risk Analysis",
    fields: [
      { name: 'marketRisk', label: 'Market Risk', placeholder: 'e.g. Vacancy increase' },
      { name: 'opsRisk', label: 'Ops Risk', placeholder: 'e.g. Cost overruns' },
      { name: 'regRisk', label: 'Regulatory Risk', placeholder: 'e.g. Law changes' }
    ]
  },
  mitigationStrategies: {
    title: "Mitigation",
    fields: [
      { name: 'mitigation1', label: 'Market Mitigation', placeholder: 'e.g. Long-term leases' },
      { name: 'mitigation2', label: 'Ops Mitigation', placeholder: 'e.g. Fixed-price contracts' }
    ]
  },
  operationalManagement: {
    title: "Operations",
    fields: [
      { name: 'manager', label: 'Asset Manager', placeholder: 'Company Name' },
      { name: 'pm', label: 'Property Manager', placeholder: 'Company Name' },
      { name: 'reporting', label: 'Reporting Freq', placeholder: 'Quarterly' }
    ]
  },
  technologyInfrastructure: {
    title: "Tech Stack",
    fields: [
      { name: 'chain', label: 'Blockchain', placeholder: 'e.g. Polygon' },
      { name: 'platform', label: 'Issuance Platform', placeholder: 'e.g. Tokeny' },
      { name: 'wallet', label: 'Investor Wallet', placeholder: 'e.g. MetaMask / Custodial' }
    ]
  },
  roadmapMilestones: {
    title: "Roadmap",
    fields: [
      { name: 'q1', label: 'Q1 Goal', placeholder: 'Structuring & Legal' },
      { name: 'q2', label: 'Q2 Goal', placeholder: 'Tech Setup & Pre-sale' },
      { name: 'q3', label: 'Q3 Goal', placeholder: 'Public Sale & Closing' },
      { name: 'q4', label: 'Q4 Goal', placeholder: 'First Distribution' }
    ]
  },
  exitScenarios: {
    title: "Exit Strategy",
    fields: [
      { name: 'scenarioA', label: 'Plan A', placeholder: 'e.g. Asset Sale in Yr 5' },
      { name: 'scenarioB', label: 'Plan B', placeholder: 'e.g. Refinance & Hold' },
      { name: 'horizon', label: 'Time Horizon', placeholder: '5-7 Years' }
    ]
  },
  projectReadinessScore: {
    title: "Readiness",
    fields: [
      { name: 'legal', label: 'Legal Status', placeholder: 'Draft / Final' },
      { name: 'tech', label: 'Tech Status', placeholder: 'Selected / Deployed' },
      { name: 'capital', label: 'Capital Status', placeholder: 'Soft Circled / Committed' }
    ]
  },
  keyAssumptions: {
    title: "Assumptions",
    fields: [
      { name: 'inflation', label: 'Inflation Rate', placeholder: '2%' },
      { name: 'occupancy', label: 'Vacancy Rate', placeholder: '5%' },
      { name: 'growth', label: 'Rent Growth', placeholder: '3%' }
    ]
  },
  finalReview: {
    title: "Final Review",
    fields: [
      { name: 'verdict', label: 'Final Verdict', placeholder: 'Ready for Launch' },
      { name: 'strengths', label: 'Key Strengths', placeholder: 'Location, Team' },
      { name: 'signoff', label: 'Sign-off By', placeholder: 'Investment Committee' }
    ]
  }
};
