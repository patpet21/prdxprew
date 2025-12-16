
export const PLAN_PROMPTS = {
  projectIdentification: (inputs: any) => `
    Act as a Corporate Secretary. Draft the "Project Identification" section.
    Data: Name: ${inputs.name}, Sponsor: ${inputs.sponsor}, Date: ${inputs.date}, Version: ${inputs.version}.
    Output: A clean table-like summary of project metadata and contact details.
  `,
  executiveSummary: (inputs: any) => `
    Act as a Senior Investment Analyst. Write an "Executive Summary".
    Context: Opportunity: ${inputs.opportunity}, Ask: ${inputs.ask}, ROI: ${inputs.roi}.
    Output: A powerful 2-paragraph hook summarizing the deal, the problem solved, and the financial upside.
  `,
  assetOverview: (inputs: any) => `
    Act as a Real Estate Appraiser. Write the "Asset Overview".
    Data: Type: ${inputs.type}, Location: ${inputs.location}, Specs: ${inputs.specs}, Condition: ${inputs.condition}.
    Output: Technical description of the asset, highlighting physical attributes and quality.
  `,
  projectStatusTimeline: (inputs: any) => `
    Act as a Project Manager. Write "Project Status & Timeline".
    Current Phase: ${inputs.phase}. Key Milestones: ${inputs.milestones}. Launch Date: ${inputs.launchDate}.
    Output: A chronological narrative of where the project stands and the next 12 months.
  `,
  marketLocationAnalysis: (inputs: any) => `
    Act as a Market Researcher. Write "Market & Location Analysis".
    Area: ${inputs.area}. Trends: ${inputs.trends}. Demographics: ${inputs.demographics}.
    Output: Analysis of the micro-market, demand drivers, and location scoring.
  `,
  businessModel: (inputs: any) => `
    Act as a Strategy Consultant. Write the "Business Model".
    Revenue Source: ${inputs.revenueSource}. Pricing: ${inputs.pricing}. Operations: ${inputs.operations}.
    Output: How the asset actually makes money (e.g., rental yields, arbitrage, sales).
  `,
  legalStructureSpv: (inputs: any) => `
    Act as a Corporate Lawyer. Write "Legal Structure & SPV".
    Jurisdiction: ${inputs.jurisdiction}. Entity Type: ${inputs.entityType}. Asset Holder: ${inputs.assetHolder}.
    Output: Explanation of the SPV setup, bankruptcy remoteness, and ownership chain.
  `,
  regulatoryCompliance: (inputs: any) => `
    Act as a Compliance Officer. Write "Regulatory & Compliance Framework".
    Regime: ${inputs.regime} (e.g., Reg D/MiCA). KYC: ${inputs.kyc}. Restrictions: ${inputs.restrictions}.
    Output: Validation of the regulatory path and investor eligibility rules.
  `,
  tokenModelDefinition: (inputs: any) => `
    Act as a Token Engineer. Write "Token Model Definition".
    Token Type: ${inputs.tokenType}. Standard: ${inputs.standard}. Utility/Security: ${inputs.classification}.
    Output: Technical definition of the token, its rights, and its smart contract standard (ERC-3643 etc).
  `,
  tokenomicsPricing: (inputs: any) => `
    Act as a CFO. Write "Tokenomics & Pricing".
    Supply: ${inputs.supply}. Price: ${inputs.price}. Valuation: ${inputs.valuation}.
    Output: The math behind the token price, market cap, and dilution logic.
  `,
  capitalStructure: (inputs: any) => `
    Act as an Investment Banker. Write "Capital Structure".
    Equity: ${inputs.equity}%. Debt: ${inputs.debt}%. Token Float: ${inputs.tokenFloat}%.
    Output: Breakdown of the capital stack (LTV, Equity split) and seniority.
  `,
  useOfFunds: (inputs: any) => `
    Act as a Financial Controller. Write "Use of Funds".
    Acquisition: ${inputs.acquisition}. Capex: ${inputs.capex}. Fees: ${inputs.fees}. Reserves: ${inputs.reserves}.
    Output: A breakdown of how every dollar raised will be spent.
  `,
  revenueStreams: (inputs: any) => `
    Act as a Revenue Analyst. Write "Revenue Streams".
    Primary: ${inputs.primary}. Secondary: ${inputs.secondary}. Growth: ${inputs.growth}%.
    Output: Detailed forecast of income sources.
  `,
  costStructure: (inputs: any) => `
    Act as an Operations Manager. Write "Cost Structure".
    Fixed Costs: ${inputs.fixed}. Variable: ${inputs.variable}. Mgmt Fee: ${inputs.mgmtFee}.
    Output: Analysis of OPEX and CAPEX requirements.
  `,
  financialProjections: (inputs: any) => `
    Act as a Financial Modeler. Write "Financial Projections".
    Year 1 NOI: ${inputs.y1}. Year 5 NOI: ${inputs.y5}. Exit Cap: ${inputs.exitCap}.
    Output: 5-year outlook commentary referencing key financial metrics.
  `,
  investorReturns: (inputs: any) => `
    Act as an Investor Relations Officer. Write "Investor Returns".
    Target IRR: ${inputs.irr}%. Cash Yield: ${inputs.yield}%. Multiple: ${inputs.multiple}x.
    Output: Explanation of the return profile (Cash-on-Cash vs Appreciation).
  `,
  payoutDistribution: (inputs: any) => `
    Act as a Treasury Manager. Write "Payout & Distribution Strategy".
    Frequency: ${inputs.frequency}. Method: ${inputs.method}. Reinvestment: ${inputs.reinvestment}.
    Output: How and when investors get paid (Smart Contract automation vs Manual).
  `,
  treasuryManagement: (inputs: any) => `
    Act as a Risk Manager. Write "Treasury Management Strategy".
    Custody: ${inputs.custody}. Reserves: ${inputs.reservesRule}. Multisig: ${inputs.multisig}.
    Output: Policies for holding funds, reserves, and treasury security.
  `,
  riskAnalysis: (inputs: any) => `
    Act as a Risk Auditor. Write "Risk Analysis".
    Market Risk: ${inputs.marketRisk}. Operational: ${inputs.opsRisk}. Regulatory: ${inputs.regRisk}.
    Output: Honest assessment of potential failure points.
  `,
  mitigationStrategies: (inputs: any) => `
    Act as a Strategic Advisor. Write "Mitigation Strategies".
    For Market Risk: ${inputs.mitigation1}. For Ops Risk: ${inputs.mitigation2}.
    Output: How the project protects against the identified risks.
  `,
  operationalManagement: (inputs: any) => `
    Act as a COO. Write "Operational & Management Structure".
    Asset Manager: ${inputs.manager}. Property Mgmt: ${inputs.pm}. Reporting: ${inputs.reporting}.
    Output: Who runs the asset day-to-day and how they are incentivized.
  `,
  technologyInfrastructure: (inputs: any) => `
    Act as a CTO. Write "Technology & Infrastructure".
    Blockchain: ${inputs.chain}. Platform: ${inputs.platform}. Wallet: ${inputs.wallet}.
    Output: The tech stack ensuring security, transparency, and liquidity.
  `,
  roadmapMilestones: (inputs: any) => `
    Act as a Product Owner. Write "Roadmap & Milestones".
    Q1: ${inputs.q1}. Q2: ${inputs.q2}. Q3: ${inputs.q3}. Q4: ${inputs.q4}.
    Output: Execution timeline with key deliverables.
  `,
  exitScenarios: (inputs: any) => `
    Act as an Exit Strategist. Write "Exit Scenarios".
    Scenario A: ${inputs.scenarioA}. Scenario B: ${inputs.scenarioB}. Horizon: ${inputs.horizon}.
    Output: How investors get their principal back (Sale, Refi, Secondary Market).
  `,
  projectReadinessScore: (inputs: any) => `
    Act as an Auditor. Write "Project Readiness Score".
    Legal Ready: ${inputs.legal}. Tech Ready: ${inputs.tech}. Capital Ready: ${inputs.capital}.
    Output: Assessment of launch readiness.
  `,
  keyAssumptions: (inputs: any) => `
    Act as a Data Analyst. Write "Key Assumptions & Disclaimers".
    Inflation: ${inputs.inflation}. Occupancy: ${inputs.occupancy}. Growth: ${inputs.growth}.
    Output: The variables underpinning the model.
  `,
  finalReview: (inputs: any) => `
    Act as the CEO. Write "Final Review & Validation".
    Verdict: ${inputs.verdict}. Strengths: ${inputs.strengths}. Sign-off: ${inputs.signoff}.
    Output: Closing statement and commitment to execution.
  `
};
