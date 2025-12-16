
export type TokenizationCategory = 'Real Estate' | 'Business' | 'Art' | 'Debt' | 'Funds' | 'Energy' | 'Other';

export interface UserProfile {
  id: string;
  full_name: string;
  email: string;
  country: string;
  kyc_verified: boolean;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
  is_pro_member?: boolean;
}

export interface Project {
  id: string;
  title: string;
  category: TokenizationCategory;
  total_value: number;
  valuation: number;
  status: string;
  progress: number;
  imageColor: string;
  lastUpdated: string;
  image_url?: string;
  imageUrl?: string;
  description: string;
  location: string;
  annual_yield: number;
  apy: number;
  min_invest_tokens: number;
  minTicket: number;
  raise_amount: number;
  targetRaise: number;
  irr: number;
  gross_profit: number;
  token_price: number;
  total_tokens: number;
  available_tokens: number;
  occupancy_rate: number;
  construction_year: number;
  total_units: number;
  interior_size_sqm: number;
  asset_type: string;
  property_type: string;
  risk_score: number;
  sponsor: string;
  property_manager: string;
  payout_type: string;
  distribution_frequency: string;
  lockup_months: number;
  exit_strategy: string;
  visibility: string;
  featured: boolean;
  is_user_created: boolean;
  management_fee_percentage?: number;
  sponsor_commitment_eur?: number;
  loan_interest_rate?: number;
  appreciation_rate?: number;
  completion_date?: string;
  city?: string;
  country?: string;
  renovated_status?: string;
  expected_start_date?: string;
  hard_cap?: number;
}

export interface SecondaryListing {
  id: string;
  projectId: string;
  projectTitle: string;
  projectSymbol: string;
  category: string;
  amount: number;
  pricePerToken: number;
  navPerToken: number;
  seller: string;
  postedTime: string;
}

export interface Investment {
  id: string;
  user_id: string;
  property_id: string;
  tokens_owned: number;
  investment_amount: number;
  purchase_date: string;
}

export interface Order {
  id: string;
  user_id: string;
  property_id: string;
  tokens: number;
  unit_price_cents: number;
  gross_amount_cents: number;
  status: string;
  tx_type: 'buy' | 'sell';
  created_at: string;
}

export interface ProjectInfo {
  projectName: string;
  projectGoal: string;
  assetClass: TokenizationCategory;
  targetRaiseAmount: number;
  description: string;
  website?: string;
  sponsorEntityName?: string;
  primaryContactName?: string;
  primaryContactEmail?: string;
  primaryContactPhone?: string;
  sponsorRegistrationState?: string;
  sponsorDirectorsCount?: number;
  sponsorBusinessActivity?: string;
  valueProposition?: string;
  investmentModel?: string;
  geoIntent?: string;
  targetInvestorType?: string;
  launchSpeed?: string;
  raiseAmountMin?: number;
  raiseRationale?: string;
  minTicketSize?: number; // Added to fix access error
}

export interface EntityDetails {
  companyName: string;
  directors: string[];
  shareholders: string[];
  shareCapital: number;
  registeredAddress: string;
  registrationState?: string;
  formationAgent?: string;
  governanceType?: string;
}

export interface DetailedSpvProfile {
  spvCountry?: string;
  spvLegalForm?: string;
  spvLabel?: string;
  spvRoleType?: 'asset_holder' | 'holding' | 'issuer' | 'fund_vehicle';
  spvLegalNameHint?: string;
  spvPurposeShort?: string;
  holdsRealAsset?: boolean;
  issuesTokens?: boolean;
  connectedToOtherSpv?: boolean;
  numberOfDirectors?: number;
  shareholderType?: 'Single' | 'Multiple' | 'Nominee';
  localDirectorRequired?: boolean;
  governanceNotesAi?: string;
  bankAccountNeeded?: boolean;
  localBankPreferred?: boolean;
  kycKybRequirementsAi?: string;
  regulatoryBody?: string;
  setupTimeEstimate?: string;
  setupCostEstimateRange?: string;
  legalPartnerRequired?: boolean;
  legalPartnerType?: 'Local' | 'International';
  complexityLevel?: 'Low' | 'Medium' | 'High';
  knownTaxAdvantages?: string;
  isForeignToAssetCountry?: boolean;
  localSpvRequired?: boolean;
  aiData?: {
    complexity: 'Low' | 'Medium' | 'High';
    legalNotes: string[];
    reasoning: string;
  };
}

export interface JurisdictionData {
  country: string;
  region: string;
  spvType: string;
  regulatoryRegime: string;
  entityDetails: EntityDetails;
  // Pro fields
  baseContext?: any;
  targetRegions?: string[];
  complianceProfile?: any;
  detailedSpv?: DetailedSpvProfile;
  sensitiveFlags?: string[];
  complianceLane?: string;
}

export interface PropertyDatabaseSchema {
  // Subset or full Project
  title: string;
  description: string;
  location: string;
  image_url: string;
  total_value: number;
  token_price: number;
  total_tokens: number;
  available_tokens: number;
  min_invest_tokens: number;
  annual_yield: number;
  gross_profit: number;
  soft_cap: number;
  hard_cap: number;
  raise_amount: number;
  total_costs: number;
  property_type: string;
  category: TokenizationCategory;
  status: string;
  visibility: string;
  featured: boolean;
  is_user_created: boolean;
  risk_score: number;
  occupancy_rate: number;
  appreciation_rate: number;
  leverage_ratio: number;
  loan_interest_rate: number;
  total_units: number;
  bedrooms: number;
  bathrooms: number;
  interior_size_sqm: number;
  exterior_size_sqm: number;
  heating_type: string;
  building_class: string;
  renovated_status: string;
  platform_fees: number;
  mediator_fees: number;
  management_fee_percentage: number;
  investor_share_percentage: number;
  sponsor_commitment_eur: number;
  rent_type: string;
  rent_subsidy: boolean;
  payout_type: string;
  distribution_frequency: string;
  lockup_months: number;
  income_start_date: string;
  city?: string;
  country?: string;
  roi_target?: number;
  completion_date?: string;
  sponsor?: string;
  property_manager?: string;
  // Added fields to fix errors
  asset_type?: string;
  construction_year?: number;
  expected_start_date?: string;
}

export interface ComplianceData {
  kycProvider: string;
  accreditationRequired: boolean;
  amlCheckEnabled: boolean;
  jurisdictionRestrictions: string[];
  regFramework: string;
  retentionPolicy: string;
  whitelistingMode: string;
  targetInvestorType?: string;
  minInvestment?: number;
  maxInvestment?: number;
  marketingChannels?: string[]; 
}

export interface DistributionData {
  targetInvestorType: string;
  minInvestment: number;
  maxInvestment: number;
  marketingChannels: string[];
  offeringType?: string;
  offeringTimeline?: string;
  marketingHook?: string;
  riskAssessment?: any;
}

export interface TokenAllocation {
  founders: number;
  investors: number;
  treasury: number;
  advisors: number;
}

// --- NEW INTERFACE FOR BUSINESS PLAN ---
export interface FreeBusinessPlan {
    projectIdentification?: string;
    executiveSummary?: string;
    assetOverview?: string;
    projectStatusTimeline?: string;
    marketLocationAnalysis?: string;
    businessModel?: string;
    legalStructureSpv?: string;
    regulatoryCompliance?: string;
    tokenModelDefinition?: string;
    tokenomicsPricing?: string;
    capitalStructure?: string;
    useOfFunds?: string;
    revenueStreams?: string;
    costStructure?: string;
    financialProjections?: string;
    investorReturns?: string;
    payoutDistribution?: string;
    treasuryManagement?: string;
    riskAnalysis?: string;
    mitigationStrategies?: string;
    operationalManagement?: string;
    technologyInfrastructure?: string;
    roadmapMilestones?: string;
    exitScenarios?: string;
    projectReadinessScore?: string;
    keyAssumptions?: string;
    finalReview?: string;
    [key: string]: string | undefined; // Allow dynamic indexing
}

// PRO TYPES
export interface ProMarketData {
    assetIndustry?: string;
    assetStage?: string;
    artistName?: string;
    artYear?: number;
    artMedium?: string;
    assetSubtype?: string;
    sizeMetric?: 'sqm' | 'sqft';
    assetSize?: number;
    yearBuilt?: number;
    assetCondition?: string;
    assetDescription?: string;
    locationCountry?: string;
    locationRegion?: string;
    locationCity?: string;
    microLocationScore?: number;
    neighborhoodSentiment?: string;
    geoDataLinked?: boolean;
    auditedValuation?: number;
    noi?: number;
    capRate?: number;
    appraisalValue?: number;
    valuationMethod?: string;
    aiValuationRange?: { min: number, max: number, confidence: number };
    avgPriceSqmCity?: number;
    revenue?: number;
    ebitda?: number;
    growthRate?: number;
    collateralValue?: number;
    capacityMw?: number;
    ppaRate?: number;
    supplyDemandIndicator?: string;
    liquidityScore?: string;
    rentalGrowthRate?: number;
    avgDaysOnMarket?: number;
    marketSentimentText?: string;
    countryRiskIndex?: number;
    marketRiskIndex?: number;
    assetRiskIndex?: number;
    structuralRiskNotes?: string;
    politicalRiskNotes?: string;
    globalRiskGrade?: string;
    
    // Financials
    revenueTypePrimary?: string;
    annualRevenueCurrent?: number;
    annualRevenueStabilized?: number;
    revenueGrowthExpectation?: number;
    revenueVolatilityScore?: number;
    
    opexAnnual?: number;
    capexAnnual?: number;
    taxExpense?: number;
    mgmtFees?: number;
    expenseStabilityScore?: number;
    
    equityExisting?: number;
    equityTargetRaise?: number;
    seniorDebtAmount?: number;
    mezzanineDebtAmount?: number;
    capitalStackCommentAi?: string;
    
    returnProfileType?: string;
    noiAnnual?: number;
    netCashflowAnnual?: number;
    paybackPeriodYears?: number;
    exitMultiple?: number;
    
    investorYieldTarget?: number;
    projectedIrr?: number;
    equityMultiple?: number;

    downsideScenarioYield?: number;
    breakEvenOccupancy?: number;
    interestRateShockImpact?: number;
    upsideScenarioYield?: number;
    aiRiskComment?: string;
    
    financialHealthScore?: number;
    riskReturnBalance?: string;
    redFlags?: string[];
    strengths?: string[];
    aiNextStepRecommendation?: string;
}

export interface ProComplianceData {
    assetIsSecurity?: boolean;
    primaryRegulationLane?: string;
    aiLaneExplanation?: string;
    tokenClassification?: string;
    prospectusRequirement?: string;
    recommendedRegime?: string;
    
    investorTypeAllowed?: string;
    minTicketSize?: number;
    maxTicketSize?: number;
    investorLimit?: number;
    
    kycRequired?: boolean;
    amlScreeningRequired?: boolean;
    enhancedDueDiligence?: boolean;
    providerPreference?: string;
    
    blockUsInvestors?: boolean;
    blockEuRetail?: boolean;
    blockSanctionedCountries?: boolean;
    allowGlobalInvestors?: boolean;
    
    offeringMode?: string;
    tokenIssuanceStyle?: string;
    distributionLockupMonths?: number;
    secondaryMarketPolicy?: string;
    
    needsPrivatePlacementMem?: boolean;
    needsKiidOrKid?: boolean;
    needsWhitepaper?: boolean;
    needsFinancialStatements?: boolean;
    
    regulatoryRiskScore?: number;
    investorRiskScore?: number;
    geoRiskScore?: number;
    redFlags?: string[];
    
    aiComplianceComment?: string;
}

export interface ProTokenDesignData {
    tokenName?: string;
    tokenSymbol?: string;
    tokenStandard?: string;
    tokenClass?: string;
    totalSupply?: number;
    initialIssuePrice?: number;
    
    valueBackingType?: string;
    distributionMechanism?: string;
    yieldTargetPercent?: number;
    reinvestmentPolicy?: string;
    redemptionPolicy?: string;
    
    investorsPercentage?: number;
    issuerTeamPercentage?: number;
    partnersAdvisorsPercentage?: number;
    treasuryReservePercentage?: number;
    ecosystemRewardsPercentage?: number;
    capTableCheckSumValid?: boolean;
    
    votingRightsEnabled?: boolean;
    voteWeightModel?: string;
    governanceScope?: string;
    informationRights?: boolean;
    
    lockupInvestorsPeriod?: number;
    lockupTeamPeriod?: number;
    vestingTeamModel?: string;
    earlyExitPenalties?: boolean;
    
    accessBenefitsEnabled?: boolean;
    accessBenefitsDescription?: string;
    loyaltyTiersEnabled?: boolean;
    loyaltyTiersModel?: string;
    
    tokenCoherenceScore?: number;
    investorFriendliness?: string;
    overComplexityFlag?: boolean;
    mainRisks?: string[];
    suggestions?: string[];
    rights?: string[];
    vesting?: any;
    tokenModel?: string;
}

export interface ProDistributionData {
    primaryInvestorType?: string;
    investorSegments?: string[];
    geographicFocus?: string;
    
    minTicketSize?: number;
    maxTicketSize?: number;
    averageExpectedTicket?: number;
    allocationTargetPercent?: number;
    aiTicketRecommendation?: string;
    
    directWebsite?: boolean;
    cryptoExchange?: boolean;
    launchpadPartner?: boolean;
    brokerDealerPartner?: boolean;
    privateNetwork?: boolean;
    offlineDistribution?: boolean;
    
    kycRequired?: boolean;
    accreditationCheck?: boolean;
    amlScreening?: boolean;
    whitelistingModel?: string;
    
    secondaryAllowed?: boolean;
    lockupPeriod?: number;
    redemptionPolicy?: string;
    
    distributionReadinessScore?: number;
    investorRiskLevel?: string;
    redFlags?: string[];
    bestChannelCombo?: string;
    nextStepRecommendation?: string;
}

export interface ProPayoutData {
    payoutType?: string;
    payoutBasedOn?: string;
    payoutMethod?: string;
    payoutToken?: string;
    
    frequency?: string;
    firstPayoutDelay?: number;
    payoutScheduleNotes?: string;
    
    treasuryAccountType?: string;
    multiSigRequired?: boolean;
    treasuryManagerRole?: string;
    transparencyLevel?: string;
    
    reserveFundEnabled?: boolean;
    reserveTargetPercent?: number;
    emergencyBufferMonths?: number;
    aiReserveRationale?: string;
    
    allocationOpCosts?: number;
    allocationInvestors?: number;
    allocationTreasury?: number;
    allocationReserves?: number;
    
    payoutSustainabilityScore?: number;
    overDistributionFlag?: boolean;
    liquidityRisk?: string;
    investorFriendliness?: string;
    finalRecommendations?: string[];
}

export interface ProReportsData {
    executiveSummary?: any;
    feasibility?: any;
    compliance?: any;
    blueprint?: any;
    roadmap?: any;
    finalBrief?: any;
    // Added missing fields
    pitchDeck?: any;
    storyBuilder?: any;
    executionMap?: any;
}

export interface ProContext {
    valuationMethod?: string;
    complianceType?: string;
    tokenModel?: string;
    spvStrategy?: string;
    payoutType?: string;
    mode?: string;
    enabledSteps?: string[];
    optionalSteps?: string[];
}

export interface DeploymentData {
    legal: {
        spvName: string;
        documentsStatus: {
            termSheet: string;
            offeringMemo: string;
            operatingAgreement: string;
        };
        status: string;
    };
    smartContract: {
        chain: string;
        standard: string;
        status: string;
        address?: string;
    };
    custody: {
        provider: string;
        coldStorage: boolean;
        status: string;
    };
    kyc: {
        regimes: string[];
        status: string;
    };
    marketplace: {
        eligibilityChecks: Record<string, boolean>;
        listingStatus: string;
    };
    goLive: {
        isLive: boolean;
        launchDate?: string;
    };
}

export interface TokenizationState {
  projectInfo: ProjectInfo;
  jurisdiction: JurisdictionData;
  property: PropertyDatabaseSchema;
  compliance: ComplianceData;
  tokenAllocation: TokenAllocation;
  distribution: DistributionData;
  tokenStrategy?: any;
  aiTokenomicsInsight?: string;
  deployment?: DeploymentData;
  
  // Pro Fields
  proContext?: ProContext;
  proMarketData?: ProMarketData;
  proCompliance?: ProComplianceData;
  proTokenDesign?: ProTokenDesignData;
  proDistribution?: ProDistributionData;
  proPayout?: ProPayoutData;
  proReports?: ProReportsData;
}

export interface StepProps {
  data: TokenizationState;
  updateData: (section: keyof TokenizationState, payload: any) => void;
  onValidationChange: (isValid: boolean) => void;
  activeTabId?: string;
  onTabChange?: (tabId: string) => void;
  onNext?: () => void;
  isLoggedIn?: boolean;
  onLogin?: () => void;
}

export type DashboardTab = 'OVERVIEW' | 'ASSETS' | 'TRADING' | 'WALLET' | 'STAKING' | 'DOCS' | 'SETTINGS' | 'TASKS';

export interface AssetData {
    category: string;
    assetType?: string;
    assetName: string;
    valuation: number;
    address?: string;
    description?: string;
    financials: {
        noi?: number;
        revenue?: number;
        ebitda?: number;
        occupancyRate?: number;
        existingDebt?: number;
    };
    generatedBusinessPlan?: string;
}

export interface QuizData {
    topic: string;
    questions: {
        question: string;
        options: string[];
        correctIndex: number;
        explanation: string;
    }[];
}

export interface TokenizabilityReport {
    isTokenizable: boolean;
    confidenceScore: number;
    recommendedStructure: string;
    mainVerdict: string;
    analysisPoints: string[];
    nextSteps: string;
}

export interface MatchmakerResult {
    jurisdiction: string;
    entityType: string;
    reasoning: string;
    complianceNote: string;
    pros: string[];
    cons: string[];
}

export interface AiRiskReport {
    score: number;
    level: 'Low' | 'Medium' | 'High';
    warnings: string[];
    opportunities: string[];
    legalRoadmap: string[];
}

export interface SpvDatasheet {
    minCapital: string;
    setupTime: string;
    taxImplications: string;
}

export interface AcademyModuleState {
    id: string;
    completed: boolean;
    lastUpdated: string;
    userNotes?: string;
    quizScore?: number;
    // Store tool-specific state
    [key: string]: any; 
}

export interface AcademyState {
    modules: Record<string, AcademyModuleState>;
    meta: {
        totalProgress: number;
        currentModuleId: string;
        startDate: string;
        certificateIssued: boolean;
    };
    // Domain-specific storage for tools (simplified flat structure or nested)
    assetMarket?: any;
    financials?: any;
    legalCompliance?: any;
    tokenomics?: any;
    distribution?: any;
    payout?: any;
}

export interface UserRole {
  role: string;
}

export interface Transaction {
    id: string;
    // ... other props
}

export interface StakingPool {
    id: string;
    name: string;
    assetSymbol: string;
    apr: number;
    lockPeriodDays: number;
    tvl: number;
    userStaked: number;
    rewardsEarned: number;
    color: string;
    description: string;
}

export interface ProAnalysisData {
    score: number;
    insightTitle: string;
    metrics: { label: string, value: string, trend?: 'up'|'down' }[];
    bulletPoints: string[];
    recommendation: string;
}

export interface AiResponse {
    text: string;
    [key: string]: any;
}

export interface CaseStudy {
    title: string;
    location: string;
    year: string;
    assetValue: string;
    summary: string;
    keyTakeaway: string;
    successFactor: string;
}
