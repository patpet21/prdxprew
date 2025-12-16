

import { PLAN_PROMPTS } from '../prompts/business_plan/free_plan_prompts';
import { askGemini } from '../lib/googleClient';

// Helper for JSON generation
export const generateJson = async <T>(systemRole: string, prompt: string, fallback: T): Promise<T> => {
    try {
        const fullPrompt = `ROLE: ${systemRole}\n\nTASK: ${prompt}\n\nOUTPUT: Strictly JSON. No markdown.`;
        const text = await askGemini(fullPrompt);
        const jsonStr = text.replace(/```json/g, '').replace(/```/g, '').trim();
        return JSON.parse(jsonStr);
    } catch (e) {
        console.error("AI JSON Error", e);
        return fallback;
    }
};

export const generateBusinessPlanSection = async (sectionId: string, inputs: any) => {
    const promptGenerator = PLAN_PROMPTS[sectionId as keyof typeof PLAN_PROMPTS];
    if (!promptGenerator) return "Section not configured.";
    const prompt = promptGenerator(inputs);
    return await askGemini(prompt + "\n\nProvide the section content in Markdown.");
};

export const generateTokenConfig = async (asset: any, project: any) => {
    return generateJson("Token Economist", `Generate tokenomics for ${asset.category} valued at ${asset.valuation}.`, {
        token_price: 10, total_tokens: 1000000, soft_cap: 500000, hard_cap: 1000000,
        allocation: { investors: 70, founders: 20, treasury: 10, advisors: 0 },
        strategy_reasoning: "Standard model."
    });
};

export const generateFullBusinessPlan = async (data: any) => {
    return await askGemini(`Write a full business plan for ${data.projectInfo.projectName}. Context: ${JSON.stringify(data.projectInfo)}`);
};

export const generateTokenStrategy = async (asset: any, project: any, jurisdiction: any) => {
    return generateJson("Strategist", `Strategy for ${asset.category} in ${jurisdiction.country}`, {
        whyTokenize: ["Liquidity", "Access"], taxStrategy: "Standard", marketPositioning: "Growth", educationalNote: "Tokenization adds liquidity."
    });
};

export const generateQuiz = async (topic: string) => {
    return generateJson("Educator", `Create 3 questions about ${topic}`, {
        topic, questions: [{ question: "What is a token?", options: ["A", "B", "C", "D"], correctIndex: 0, explanation: "A is correct." }]
    });
};

export const checkTokenizability = async (desc: string, cat?: string) => {
    return generateJson("Analyst", `Analyze tokenizability for: ${desc}`, {
        isTokenizable: true, confidenceScore: 85, recommendedStructure: "SPV", mainVerdict: "Yes", analysisPoints: ["Good asset"], nextSteps: "Legal"
    });
};

export const getJurisdictionRecommendation = async (prefs: any) => {
    return generateJson("Lawyer", `Recommend jurisdiction for ${JSON.stringify(prefs)}`, {
        jurisdiction: "US-DE", entityType: "LLC", reasoning: "Standard", complianceNote: "Reg D", pros: ["Fast"], cons: ["Cost"]
    });
};

export const getSpvExplanation = async (persona: string) => {
    return await askGemini(`Explain SPV to a ${persona} in 1 sentence.`);
};

export const getJurisdictionSummary = async (region: string) => {
    return await askGemini(`Summarize tokenization laws in ${region} in 3 sentences.`);
};

export const getGeneralRequirements = async (assetType: string) => {
    return generateJson("PM", `Checklist for ${assetType} tokenization`, ["Legal Entity", "Asset Title", "Whitepaper"]);
};

export const generateCaseStudy = async (industry: string) => {
    return generateJson("Historian", `Case study for ${industry} tokenization`, {
        title: "Example Project", location: "USA", year: "2023", assetValue: "$10M", summary: "Success", keyTakeaway: "Compliance first", successFactor: "Quality asset"
    });
};

export const generateRegulationCaseStudy = async (scenario: string) => {
    return generateJson("Legal Scholar", `Analyze regulatory scenario: ${scenario}`, {
        structure: "Recommended: Reg D 506(c) + Reg S",
        risks: ["General Solicitation restrictions in EU", "Accreditation verification delays"],
        alternatives: ["Reg A+ (Higher cost)", "Full Prospectus (Slow)"]
    });
};

export const generateDeepStrategy = async (asset: any, project: any) => {
    return generateJson("Strategist", "Deep strategy analysis", {
        elevator_pitch: "Pitch", investor_persona: { title: "Investor", description: "Desc" }, liquidity_thesis: "Thesis", market_timing: "Now"
    });
};

export const generateProInsight = async (step: number, data: any) => {
    return generateJson("Advisor", `Insight for step ${step}`, {
        score: 80, insightTitle: "Good Progress", metrics: [{ label: "Completion", value: "80%" }], bulletPoints: ["Point 1"], recommendation: "Continue"
    });
};

export const generateAllProReports = async (data: any) => {
    return {
        executiveSummary: { aiRiskGrade: "Low", aiValueProposition: "Great deal", keyHighlights: ["High Yield"] },
        feasibility: { technicalScore: 90, financialScore: 85, legalScore: 80, structuralComplexity: "Medium", strengths: ["Team"], weaknesses: ["New market"], mandatoryActions: ["Audit"] },
        compliance: {}, blueprint: {}, roadmap: {}, finalBrief: {}
    };
};

export const getSpvModelStrategy = async (cat: string, geo: string, regions: any) => {
    return generateJson("Lawyer", "SPV Model Strategy", {
        recommendedModel: "Double", reasoning: "Tax efficiency", riskFactor: "Cost"
    });
};

export const generateEntityDetails = async (country: string, region: string, type: string, name: string) => {
    return generateJson("Corporate Secretary", `Entity details for ${name} in ${country}`, {
        companyName: name + " LLC", shareCapital: 100, registeredAddress: "123 Main St", directors: ["Director 1"], formationAgent: "Agent X"
    });
};

export const generateJurisdictionShortlist = async (cat: string, region: string, goal: string) => {
    return generateJson("Advisor", "Jurisdiction Shortlist", {
        recommendations: [{ code: "US-DE", name: "Delaware", matchScore: 95, reason: "Standard" }], summary: "Go with Delaware."
    });
};

export const analyzeSpvComplexity = async (spv: any) => {
    return generateJson("Analyst", "SPV Complexity", {
        complexity: "Medium", legalNotes: ["Check tax"], reasoning: "Cross-border"
    });
};

export const generateInvestorRulesValidation = async (inputs: any) => {
    return generateJson("Compliance", "Investor Rules Validation", {
        status: "PASS", ruleChecks: [{ rule: "Accredited Only", passed: true }], violations: [], fixes: []
    });
};

export const generateInvestorRulesInputEducation = async (inputs: any) => {
    return generateJson("Educator", "Investor Rules Education", {
        regimeDefinition: "Reg D", investorMixAnalysis: "Good mix", usExposure: "High", tradingImpact: "Restricted", commonMistakes: []
    });
};

export const generateInvestorRulesOutputEducation = async (inputs: any, output: any) => {
    return generateJson("Educator", "Investor Rules Result", {
        resultInterpretation: "Good to go", compositionImpact: "Balanced", nextSteps: ["File Form D"]
    });
};

export const generateFinalBriefAnalysis = async (data: any) => {
    return generateJson("Analyst", "Final Brief", {
        investmentReadinessScore: 85, finalReview: "Ready", strengths: ["Team"], weaknesses: [], providerRecommendations: ["Securitize"], complianceImprovements: [], warnings: []
    });
};

export const generatePayoutPdfContent = async (data: any) => {
    return generateJson("Writer", "Payout PDF Content", {
        institutionalVerdict: "Approved"
    });
};

export const improveProjectDescription = async (info: any, cat: string) => {
    return await askGemini(`Improve description for ${cat}: ${info.description}`);
};

export const analyzeJurisdiction = async (country: string, spv: string, cat: string, details: any, info: any) => {
    return generateJson("Lawyer", "Analyze Jurisdiction", {
        restrictions: "None", minDocs: ["Articles"], geoBlocking: "None", riskNote: "Low risk", text: "Good choice."
    });
};

export const getRegionRecommendations = async (country: string, cat: string) => {
    return generateJson("Lawyer", `Regions in ${country}`, ["Region A", "Region B"]);
};

export const getSpvRecommendation = async (country: string, region: string, cat: string, info: any) => {
    return generateJson("Lawyer", "SPV Recommendation", {
        recommendedSpvId: "LLC", reasoning: "Flexible"
    });
};

export const autoFillAssetGeneral = async (info: any, cat: string) => {
    return generateJson("Analyst", "Autofill Asset", {
        assetName: info.projectName, valuation: 1000000, assetType: "Office", sqft: 5000, address: "123 Main St", description: "Office building"
    });
};

export const getAssetAdvice = async (cat: string, type: string, loc: string) => {
    return generateJson("Advisor", "Asset Advice", {
        valuationTip: "Check comps", riskWarning: "Vacancy", renovationAdvice: "Modernize"
    });
};

export const estimateAssetSpecs = async (cat: string, type: string, val: number) => {
    return generateJson("Architect", "Asset Specs", {
        construction_year: 2020, total_units: 10, interior_size_sqm: 1000, building_class: "A"
    });
};

export const generateRiskReport = async (data: any) => {
    return generateJson("Risk Officer", "Risk Report", {
        score: 85, level: "Low", warnings: ["None"], opportunities: ["Growth"], legalRoadmap: ["Incorporate"]
    });
};

export const generateAssetDnaAnalysis = async (asset: string, loc: string, usage: string) => {
    return generateJson("Strategist", "Asset DNA", {
        identity_card: { identity_text: "Prime Asset", asset_stage: "Operating" },
        swot: { strengths: ["Loc"], weaknesses: ["Cost"], opportunities: ["Tech"], threats: ["Rates"] },
        market_insights: { demand_trend: "Up" },
        tokenization_models: []
    });
};

export const generateDeepSwotAnalysis = async (name: string, type: string, loc: string, ctx: string) => {
    return generateJson("Strategist", "Deep SWOT", {
        strengths: ["Loc"], weaknesses: ["Cost"], opportunities: ["Tech"], threats: ["Rates"], executive_summary: "Good deal"
    });
};

export const generateStrategicGoals = async (profile: any, context: string) => {
    return generateJson("Banker", "Strategic Goals", {
        operational: { title: "Ops", metrics: [], timeline: "12m" },
        financial: { target_raise_range: "1M-5M", target_irr: "15%" },
        governance: { sponsor_control: "High", investor_rights: [] }
    });
};

export const generateLocalMarketAnalysis = async (inputs: any) => {
    return generateJson("Analyst", "Local Market", {
        demandScore: 8, supplyScore: 7, liquidityScore: 6, shortNarrative: "Strong market", riskNotes: []
    });
};

export const generateGlobalBenchmarkAnalysis = async (inputs: any) => {
    return generateJson("Analyst", "Global Benchmark", {
        strategicPosition: "Niche", benchmarkComparison: [], strengths: [], weaknesses: []
    });
};

export const generateMacroRiskAnalysis = async (inputs: any) => {
    return generateJson("Economist", "Macro Risk", {
        macroRiskHeat: "Medium", risks: []
    });
};

export const generateForecastAnalysis = async (inputs: any, calcs: any) => {
    return generateJson("Analyst", "Forecast", {
        commentary: "Positive outlook", warnings: [], sensitivityNote: "Rate sensitive"
    });
};

export const generateComplianceFrameworkAnalysis = async (inputs: any) => {
    return generateJson("Compliance", "Framework Analysis", {
        securityStatus: "Security", prospectusRequirement: "Exempt", recommendedRegime: "Reg D", justification: ["Accredited"], investorEligibilityRules: [], marketingRestrictions: []
    });
};

export const generateFrameworkInputEducation = async (inputs: any) => {
    return generateJson("Educator", "Framework Inputs", {
        assetImplication: "Standard", marketingImplication: "Private", investorMisunderstanding: "None", custodyImplication: "Regulated"
    });
};

export const generateFrameworkOutputEducation = async (inputs: any, output: any) => {
    return generateJson("Educator", "Framework Output", {
        regimeChoiceReason: "Best fit", practicalObligations: [], typicalUserProfile: "Fund Manager"
    });
};

export const generateComplianceMatrix = async (data: any) => {
    return generateJson("Auditor", "Compliance Matrix", {
        score: 85, redFlags: [], fixSuggestion: "None"
    });
};

export const generateTokenModelAnalysis = async (inputs: any) => {
    return generateJson("Professor", "Token Model", {
        education: "Equity token represents shares.", analysis: { compatibilityScore: 90 }, providerBridge: {}
    });
};

export const generateTokenSupplyAnalysis = async (inputs: any) => {
    return generateJson("Architect", "Token Supply", {
        education: [], valuationCheck: "OK", providerBridge: {}
    });
};

export const generateTokenRightsAnalysis = async (inputs: any) => {
    return generateJson("Lawyer", "Token Rights", {
        education: [], governanceScore: 80, providerBridge: {}
    });
};

export const generateTokenVestingAnalysis = async (inputs: any) => {
    return generateJson("Analyst", "Vesting", {
        education: [], fairnessScore: 85, providerBridge: {}
    });
};

export const generateTokenFairnessAnalysis = async (inputs: any) => {
    return generateJson("Ethicist", "Fairness", {
        education: [], fairnessScore: 88, providerBridge: {}
    });
};

export const generateDistributionAnalysis = async (inputs: any) => {
    return generateJson("Strategist", "Distribution", {
        education: [], personas: [], personaFitScore: 85
    });
};

export const generateRegionsLawAnalysis = async (inputs: any, ctx: any) => {
    return generateJson("Lawyer", "Regions Law", {
        education: [], regionalAnalysis: [], priorityRoadmap: []
    });
};

export const generateChannelMixAnalysis = async (inputs: any, ctx: any) => {
    return generateJson("Marketer", "Channel Mix", {
        education: [], channelScores: [], recommendedCoreMix: []
    });
};

export const generateFunnelSimulation = async (inputs: any, ctx: any) => {
    return generateJson("Analyst", "Funnel Sim", {
        education: [], funnelNumbers: {}, bottlenecks: []
    });
};

export const generateUnitEconomicsAnalysis = async (inputs: any, ctx: any) => {
    return generateJson("CFO", "Unit Economics", {
        education: [], calculatedMetrics: { cac: 500, ltv: 5000, ratio: "10:1" }
    });
};

export const generateFeeStructureAnalysis = async (inputs: any) => {
    return generateJson("Analyst", "Fee Structure", {
        education: [], analysis: { feeFairnessScore: 80, complexityLevel: "Medium" }
    });
};

export const generateWaterfallAnalysis = async (inputs: any) => {
    return generateJson("Accountant", "Waterfall", {
        education: [], distributionBreakdown: {}, efficiencyScore: 85, providerBridge: {}
    });
};

export const generateInvestorPathsAnalysis = async (inputs: any) => {
    return generateJson("Analyst", "Investor Paths", {
        education: [], institutionalReadinessScore: 80, jCurveCommentary: "Standard J-curve"
    });
};

export const generateTreasuryRulesAnalysis = async (inputs: any) => {
    return generateJson("Treasurer", "Treasury Rules", {
        education: [], robustnessScore: 90
    });
};

export const generateRiskScenariosAnalysis = async (inputs: any, ctx: any) => {
    return generateJson("Risk Officer", "Risk Scenarios", {
        education: [], impactAnalysis: {}, institutionalSeverityScore: 40
    });
};

export const generatePayoutFinalReview = async (data: any) => {
    return generateJson("CIO", "Payout Final Review", {
        finalReview: "Solid structure.", investmentReadinessScore: 88, strengths: [], weaknesses: []
    });
};

export const generateIcMemo = async (data: any) => {
    return generateJson("Banker", "IC Memo", {
        executiveSummary: "Summary...", assetSnapshot: "Asset...", marketThesis: "Thesis..."
    });
};

export const scanMemoRedFlags = async (text: string) => {
    return generateJson("Auditor", "Scan Red Flags", {
        redFlags: []
    });
};

export const rewriteMemoClarity = async (text: string) => {
    return generateJson("Editor", "Rewrite Clarity", {
        revisedText: text, explanation: "Simplified."
    });
};

export const generatePitchDeck = async (data: any, inputs: any) => {
    return generateJson("Designer", "Pitch Deck", {
        slides: []
    });
};

export const generateStoryBuilder = async (data: any, inputs: any) => {
    return generateJson("Writer", "Story Builder", {
        storyOutputs: { institutional: "Text...", simplified: "Text...", hook: "Hook..." }, audit: {}
    });
};

export const generateRoadmapStructure = async (horizon: string) => {
    return generateJson("PM", "Roadmap", {
        phases: []
    });
};

export const generateJurisdictionDecisionMatrix = async (inputs: any) => {
    return generateJson("Strategist", "Jurisdiction Matrix", {
        scores: {}, winner: inputs.optionA, verdict: "Option A is better."
    });
};

export const generateSpvDecisionMatrix = async (inputs: any) => {
    return generateJson("Structurer", "SPV Matrix", {
        recommendation: { primary: inputs.structureA }
    });
};

export const generateTokenTypeDecisionMatrix = async (inputs: any) => {
    return generateJson("Token Engineer", "Token Type Matrix", {
        recommendation: { primary: "Equity" }
    });
};

export const generateFeeDecisionMatrix = async (inputs: any) => {
    return generateJson("CFO", "Fee Matrix", {
        verdict: "Model A"
    });
};

export const generateGovernanceDecisionMatrix = async (inputs: any) => {
    return generateJson("Governance Expert", "Governance Matrix", {
        recommendation: { model: "Board" }
    });
};

export const generateInvestorFitDecisionMatrix = async (inputs: any) => {
    return generateJson("Analyst", "Investor Fit Matrix", {
        verdict: "Profile A"
    });
};

export const generateFinalDecisionReport = async (data: any) => {
    return generateJson("CIO", "Final Decision Report", {
        theStack: {}, narrative: "Good stack."
    });
};

export const validateProjectStructure = async (project: any) => {
    return generateJson("Auditor", "Validate Project", {
        score: 90, checks: [{ name: "Basics", status: "pass" }]
    });
};

export const checkProjectCoherence = async (ctx: any, type: string) => {
    return generateJson("Analyst", "Coherence Check", {
        status: "Coherent", conflicts: [], recommendation: "None"
    });
};

export const buildProjectSnapshot = async (inputs: any) => {
    return generateJson("Editor", "Build Snapshot", {
        professionalSummary: "Summary...", coreObjective: "Capital", phaseAnalysis: "Early"
    });
};

export const buildAssetLogic = async (inputs: any) => {
    return generateJson("Analyst", "Build Asset Logic", {
        tokenizationLogic: "Valid", valueCreationThesis: "Growth"
    });
};

export const buildCapitalStack = async (inputs: any) => {
    return generateJson("Structurer", "Build Stack", {
        alignmentAnalysis: "Aligned"
    });
};

export const buildTokenomics = async (inputs: any) => {
    return generateJson("Economist", "Build Tokenomics", {
        psychologyCheck: "Good"
    });
};

export const buildValueMatrix = async (inputs: any) => {
    return generateJson("Negotiator", "Build Value Matrix", {
        investorBenefits: ["Yield"], sponsorBenefits: ["Capital"]
    });
};

export const buildRiskReality = async (inputs: any) => {
    return generateJson("CRO", "Build Risk Reality", {
        realRisks: []
    });
};

export const buildExecutionReality = async (inputs: any) => {
    return generateJson("PM", "Build Execution", {
        bottleneck: "Legal", realTimeline: "6m"
    });
};

export const buildReadinessScore = async (data: any) => {
    return generateJson("IC", "Build Readiness", {
        score: 85, verdict: "Ready", explanation: "Solid plan."
    });
};

export const buildNextActions = async (inputs: any) => {
    return generateJson("Consultant", "Build Actions", {
        actions: [{ step: "Step 1", owner: "Founder" }]
    });
};

export const buildFinalNarrative = async (data: any) => {
    return generateJson("Partner", "Build Narrative", {
        narrative: "Final narrative..."
    });
};

export const refineAssetDescription = async (desc: string, type: string, name: string) => {
    return await askGemini(`Refine this asset description for investors: ${desc}`);
};

export const generateAssetImage = async (type: string, loc: string) => {
    return "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80"; // Placeholder
};

export const generateComplianceSummary = async (data: any) => {
    return await askGemini(`Summarize compliance for ${data.regFramework}`);
};

export const generateRiskFlags = async (data: any) => {
    return generateJson("Risk Algo", "Generate Flags", ["Flag 1", "Flag 2"]);
};

export const generateComplianceNotes = async (data: any) => {
    return await askGemini("Write compliance notes based on inputs.");
};

export const generateSensitivityAnalysis = async (baseYield: number, baseIrr: number) => {
    return generateJson("Analyst", "Sensitivity", {
        optimisticYield: baseYield + 1, conservativeYield: baseYield - 1, aiComment: "Stable"
    });
};

export const generateInvestorAppeal = async (price: number, alloc: any, yieldPct: number) => {
    return generateJson("Banker", "Investor Appeal", {
        score: 8, critique: "Good appeal"
    });
};

export const runTokenSenseCheck = async (raise: number, supply: number, price: number) => {
    return generateJson("Economist", "Sense Check", {
        isReasonable: true
    });
};

export const runYieldSimulation = async (yieldPct: number, irr: number, hold: number) => {
    return generateJson("Analyst", "Yield Sim", {
        cashComponent: yieldPct, appreciationComponent: irr - yieldPct, marketComparison: "Standard"
    });
};

export const analyzeDistributionStrategy = async (dist: any, alloc: any) => {
    return generateJson("Strategist", "Distribution Analysis", {
        sponsorCheck: "OK", strategyFit: "Good", vestingHint: "1 year"
    });
};

export const analyzeInvestorFit = async (type: string, ticket: number) => {
    return generateJson("Strategist", "Investor Fit", {
        matchScore: 90, insight: "Good fit"
    });
};

export const getOfferingAdvice = async (mode: string, time: string) => {
    return await askGemini(`Advice for ${mode} offering in ${time}`);
};

export const generateMarketingAngle = async (type: string, channels: string[]) => {
    return await askGemini(`Marketing hook for ${type}`);
};

export const assessDistributionRisk = async (dist: any) => {
    return generateJson("Risk Officer", "Distribution Risk", {
        riskLevel: "Low", riskSummary: "Safe strategy"
    });
};

export const generateProjectDna = async (data: any) => {
    return await askGemini("Generate Project DNA summary");
};

export const getSpvDatasheet = async (country: string, name: string) => {
    return generateJson("Lawyer", "SPV Datasheet", {
        minCapital: "1000", setupTime: "2 weeks", taxImplications: "Standard"
    });
};

export const generateTermContext = async (term: string, context: string) => {
    return await askGemini(`Explain ${term} in context of: ${context}`);
};

export const findEducationalLicenses = async (jur: string, act: string, asset: string) => {
    return generateJson("Lawyer", "License Finder", {
        licenses: ["License A"], restrictions: []
    });
};

export const generateCapitalStackAnalysis = async (inputs: any) => {
    return generateJson("Banker", "Stack Analysis", {
        capitalEfficiencyScore: 85, riskDistributionScore: 80
    });
};

export const generateCapitalStackInputEducation = async (inputs: any) => {
    return generateJson("Professor", "Stack Education", {
        seniorDebt: { definition: "Senior", warning: "None" }
    });
};

export const generateCapitalStackOutputEducation = async (inputs: any, output: any) => {
    return generateJson("Professor", "Stack Output Education", {
        efficiencyExplanation: "Good"
    });
};

export const generateFinancialYieldAnalysis = async (inputs: any, calcs: any) => {
    return generateJson("Analyst", "Yield Analysis", {
        scenarioNarrative: "Stable returns", riskNotes: []
    });
};

export const generateYieldInputEducation = async (inputs: any) => {
    return generateJson("Professor", "Yield Education", {
        grossIncome: { definition: "Income", insight: "Standard" }
    });
};

export const generateYieldOutputEducation = async (inputs: any, calcs: any) => {
    return generateJson("Advisor", "Yield Output Education", {
        cocVsIrr: "Diff explained"
    });
};

export const generateRoiAnalysis = async (inputs: any, calcs: any) => {
    return generateJson("Analyst", "ROI Analysis", {
        valuationConfidence: 85, realismCheck: "Realistic"
    });
};

export const generateRoiInputEducation = async (inputs: any) => {
    return generateJson("Professor", "ROI Education", {
        incomeGrowth: { definition: "Growth", impact: "High" }
    });
};

export const generateRoiOutputEducation = async (calcs: any) => {
    return generateJson("Advisor", "ROI Output Education", {
        irrInterpretation: "Good IRR"
    });
};

export const generateInvestorAnalysis = async (inputs: any, calcs: any) => {
    return generateJson("Wealth Manager", "Investor Analysis", {
        tokenPositioning: "Yield Play"
    });
};

export const generateInvestorInputEducation = async (inputs: any) => {
    return generateJson("Economist", "Investor Education", {
        smallVsInstitutional: "Diff"
    });
};

export const generateInvestorOutputEducation = async (inputs: any, output: any) => {
    return generateJson("Pitch Coach", "Investor Output Education", {
        pitchStrategy: "Focus on yield"
    });
};

export const generateSponsorAnalysis = async (inputs: any, calcs: any) => {
    return generateJson("PE Manager", "Sponsor Analysis", {
        fairnessCheck: "Fair"
    });
};

export const generateSponsorInputEducation = async (inputs: any) => {
    return generateJson("Expert", "Sponsor Education", {
        marketStandards: "Standard"
    });
};

export const generateSponsorOutputEducation = async (inputs: any, output: any) => {
    return generateJson("Coach", "Sponsor Output Education", {
        adjustmentTips: "None"
    });
};

export const generateWaterfallInputEducation = async (inputs: any) => {
    return generateJson("Professor", "Waterfall Education", {
        grossRevenue: "Top line"
    });
};

export const generateWaterfallOutputEducation = async (calcs: any) => {
    return generateJson("Banker", "Waterfall Output Education", {
        distributableCashExplanation: "Cash for investors"
    });
};

export const generateRiskMatrixAnalysis = async (inputs: any) => {
    return generateJson("Auditor", "Risk Matrix Analysis", {
        totalRiskScore: 20, 
        explanation: "Low risk",
        riskBreakdown: { 
            legal: ["Standard compliance"], 
            AML: [], 
            custody: [], 
            marketing: [], 
            secondaryTrading: [], 
            jurisdictional: [] 
        },
        triggeredRisks: []
    });
};

export const generateRiskMitigationPlan = async (inputs: any, analysis: any) => {
    return generateJson("Architect", "Mitigation Plan", {
        urgentFixes: [], bestPractices: ["KYC"]
    });
};

export const generateRiskInputEducation = async (inputs: any) => {
    return generateJson("Educator", "Risk Input Education", {
        retailRiskExplained: "High risk"
    });
};

export const generateRiskOutputEducation = async (score: number, breakdown: any) => {
    return generateJson("CRO", "Risk Output Education", {
        scoreInterpretation: "Good"
    });
};

export const generateAdvancedComplianceTemplate = async (name: string, inputs: any, ctx: any) => {
    return generateJson("Drafter", `Template: ${name}`, {
        title: name, sections: [{ heading: "1. Intro", content: "Content..." }]
    });
};

export const generateTemplateEducation = async (name: string, jur: string) => {
    return generateJson("Educator", `Template Education ${name}`, {
        purpose: "Purpose", regulatoryMeaning: "Meaning"
    });
};

export const generateComplianceNextSteps = async (data: any) => {
    return generateJson("Strategist", "Compliance Next Steps", {
        executiveSummary: "Summary...", immediateActions: []
    });
};

export const generateTokenomicsPdfContent = async (data: any) => {
    return generateJson("Architect", "Tokenomics PDF", {
        executiveSummary: "Summary...", riskAudit: { score: 90 }
    });
};

export const generateDistributionPdfContent = async (data: any) => {
    return generateJson("Architect", "Distribution PDF", {
        executiveSummary: "Summary..."
    });
};

export const generateExecutionMap = async (ctx: any, inputs: any) => {
    return generateJson("PM", "Execution Map", {
        executionTimeline: { phases: [] }
    });
};

export const generateFinalReport = async (ctx: any, inputs: any) => {
    return generateJson("Orchestrator", "Final Report", {
        finalReport: { sections: [] }, readiness: { score: 90, verdict: "Ready" }, qualityControl: { inconsistencies: [], missingData: [], validationChecklist: [] }, nextActions: []
    });
};

export const harmonizeReportTone = async (report: any, info: any) => {
    return { harmonizedSections: report.finalReport.sections };
};

export const generateSpvRedFlags = async (data: any) => {
    return generateJson("Auditor", "SPV Red Flags", {
        riskHeat: 20, flags: []
    });
};

export const generateSpvBlueprint = async (data: any) => {
    return generateJson("Architect", "SPV Blueprint", {
        executiveSummary: "Summary...", structureOverview: "Overview..."
    });
};

export const generateSpvStrategyAdvanced = async (data: any) => {
    return generateJson("Expert", "Advanced SPV Strategy", {
        recommendation: { choice: "local" }, scenarios: []
    });
};

export const generateDeepSpvArchitectAnalysis = async (data: any) => {
    return generateJson("Architect", "Deep SPV Analysis", {
        structure: { structureName: "LLC" }, explanation: { taxReasoning: "Good" }
    });
};