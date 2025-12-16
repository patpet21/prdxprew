
import { EnterpriseAI } from "../../services/ai/ai_manager";
import { ANALYZE_ECONOMICS_PROMPT, CALCULATE_FEASIBILITY_PROMPT, GENERATE_DEVELOPER_NOTES_PROMPT, GENERATE_VALUATION_NARRATIVE_PROMPT } from "../prompts/valuation_analysis.prompts";

// --- Interfaces ---

export interface ProjectContext {
  id: string;
  name: string;
  location: string;
  assetType: 'Income Property' | 'Land / Development' | 'Mixed-Use' | 'Hospitality / Resort' | 'Industrial / Warehouse' | 'Other';
  status: 'Existing asset' | 'Under renovation' | 'Ground-up development' | 'Concept phase' | 'Conversion / Change of use';
  description?: string;
  financials: {
    grossIncome?: number; // Annual
    opex?: number; // Annual
    noi?: number; // Net Operating Income
    askPrice?: number; // Optional context
  };
  size?: {
    amount: number;
    unit: 'sqm' | 'units';
  };
}

export interface ValuationAssumptions {
  model: 'cap_rate' | 'dcf_light';
  estimatedNOI: number;
  growthRateIncome: number; // %
  growthRateExpenses: number; // %
  marketCapRate: number; // %
  discountRate: number; // % (for DCF)
  exitYield: number; // % (for DCF Terminal Value)
  holdingPeriod: number; // Years
  vacancyRate: number; // %
  
  // NEW FIELDS
  totalProjectCost?: number; // CapEx + Purchase
  landCost?: number; // Acquisition

  sources: Record<string, 'User Provided' | 'AI Estimated'>;
}

export interface ValuationResultOutput {
  modelUsed: 'cap_rate' | 'dcf_light';
  valueCentral: number;
  valueLow: number;
  valueHigh: number;
  metrics: {
    noiEffective: number;
    capRateApplied: number;
    grossYield?: number;
    pricePerUnit?: number;
    irr?: number;
  };
  currency: string;
}

export interface ProjectEconomics {
  grossDevelopmentValue: number;
  developmentCost: number;
  profitMargin: number;
  yieldOnCost: number;
  commentary: string;
}

export interface FeasibilityReport {
  score: number;
  riskLevel: 'Low' | 'Medium' | 'High' | 'Critical';
  strengths: string[];
  weaknesses: string[];
  verdict: string;
}

export interface DeveloperNotes {
  constructionRisk: string;
  timelineAssessment: string;
  permittingNotes: string;
  capexRecommendations: string[];
}

export interface ValuationNarrative {
  headline: string;
  story: string;
  keyDrivers: string[];
  riskFactors: string[];
}

export interface FullValuationReport {
  project: ProjectContext;
  assumptions: ValuationAssumptions;
  valuation: ValuationResultOutput;
  economics?: ProjectEconomics;
  feasibility?: FeasibilityReport;
  developerNotes?: DeveloperNotes;
  narrative?: ValuationNarrative;
  generatedAt: string;
}

export class ValuationService {

  selectModelForProject(project: ProjectContext): 'cap_rate' | 'dcf_light' {
    if (project.assetType === 'Income Property' && project.status === 'Existing asset') {
      return 'cap_rate';
    }
    return 'dcf_light';
  }

  async buildAssumptions(project: ProjectContext): Promise<ValuationAssumptions> {
    const model = this.selectModelForProject(project);
    
    const prompt = `
      Act as a Real Estate Appraiser.
      Generate realistic financial assumptions for:
      ${project.name}, ${project.location}, ${project.assetType}.
      
      Output strictly JSON:
      {
        "estimatedNOI": number,
        "marketCapRate": number,
        "discountRate": number,
        "growthRateIncome": number,
        "growthRateExpenses": number,
        "exitYield": number,
        "vacancyRate": number,
        "estTotalCost": number,
        "estLandCost": number
      }
    `;

    const aiResult = await EnterpriseAI.generateJSON<any>("Senior Appraiser", prompt, {});
    
    const safeResult = aiResult || { estimatedNOI: project.financials.grossIncome ? project.financials.grossIncome * 0.7 : 100000, marketCapRate: 6, discountRate: 10, growthRateIncome: 2, growthRateExpenses: 2, exitYield: 7, vacancyRate: 5, estTotalCost: 2000000, estLandCost: 500000 };

    return {
      model,
      estimatedNOI: project.financials.noi || safeResult.estimatedNOI,
      marketCapRate: 5.5, // Default per requirements
      discountRate: safeResult.discountRate,
      growthRateIncome: 1.5, // Default per requirements
      growthRateExpenses: safeResult.growthRateExpenses,
      exitYield: safeResult.exitYield,
      vacancyRate: 5, // Default per requirements
      holdingPeriod: 10, // Default per requirements
      totalProjectCost: safeResult.estTotalCost,
      landCost: safeResult.estLandCost,
      sources: { 'NOI': 'AI Estimated', 'CapRate': 'AI Estimated' }
    };
  }

  runValuation(assumptions: ValuationAssumptions, project: ProjectContext): ValuationResultOutput {
    const { estimatedNOI, marketCapRate } = assumptions;
    const safeCap = Math.max(marketCapRate, 0.1);
    const valCentral = estimatedNOI / (safeCap / 100);
    
    return {
      modelUsed: assumptions.model,
      valueCentral: Math.round(valCentral),
      valueLow: Math.round(valCentral * 0.9),
      valueHigh: Math.round(valCentral * 1.1),
      metrics: {
        noiEffective: estimatedNOI,
        capRateApplied: marketCapRate,
        grossYield: (estimatedNOI / valCentral) * 100
      },
      currency: 'USD'
    };
  }

  // --- NEW METHODS ---

  async generateProjectEconomics(project: ProjectContext, valuation: ValuationResultOutput): Promise<ProjectEconomics> {
    const prompt = ANALYZE_ECONOMICS_PROMPT(project, { estimatedNOI: valuation.metrics.noiEffective, marketCapRate: valuation.metrics.capRateApplied } as any);
    return await EnterpriseAI.generateJSON<ProjectEconomics>("Financial Analyst", prompt, {
      grossDevelopmentValue: valuation.valueCentral,
      developmentCost: valuation.valueCentral * 0.7,
      profitMargin: 30,
      yieldOnCost: 8.5,
      commentary: "Solid margins."
    }) || {
      grossDevelopmentValue: 0, developmentCost: 0, profitMargin: 0, yieldOnCost: 0, commentary: "Analysis failed."
    };
  }

  async generateFeasibility(project: ProjectContext, economics: ProjectEconomics): Promise<FeasibilityReport> {
    const prompt = CALCULATE_FEASIBILITY_PROMPT(project, economics);
    return await EnterpriseAI.generateJSON<FeasibilityReport>("Risk Officer", prompt, {
      score: 80, riskLevel: 'Low', strengths: [], weaknesses: [], verdict: "Go"
    }) || { score: 0, riskLevel: 'High', strengths: [], weaknesses: [], verdict: "Error" };
  }

  async generateDeveloperNotes(project: ProjectContext): Promise<DeveloperNotes> {
    const prompt = GENERATE_DEVELOPER_NOTES_PROMPT(project);
    return await EnterpriseAI.generateJSON<DeveloperNotes>("Developer", prompt, {
      constructionRisk: "Low", timelineAssessment: "12m", permittingNotes: "Standard", capexRecommendations: []
    }) || { constructionRisk: "", timelineAssessment: "", permittingNotes: "", capexRecommendations: [] };
  }

  async generateNarrative(project: ProjectContext, valuation: ValuationResultOutput): Promise<ValuationNarrative> {
    const prompt = GENERATE_VALUATION_NARRATIVE_PROMPT(project, valuation);
    return await EnterpriseAI.generateJSON<ValuationNarrative>("Investment Writer", prompt, {
      headline: "Valuation Summary",
      story: "The asset demonstrates strong fundamentals...",
      keyDrivers: ["Location", "Market Trends"],
      riskFactors: ["Rate Volatility"]
    }) || { headline: "Valuation Report", story: "Analysis generated.", keyDrivers: [], riskFactors: [] };
  }

  async runFullWorkflow(project: ProjectContext): Promise<FullValuationReport> {
    const assumptions = await this.buildAssumptions(project);
    const valuation = this.runValuation(assumptions, project);
    
    // Parallel AI calls
    const [economics, notes, narrative] = await Promise.all([
      this.generateProjectEconomics(project, valuation),
      this.generateDeveloperNotes(project),
      this.generateNarrative(project, valuation)
    ]);
    
    const feasibility = await this.generateFeasibility(project, economics);

    return {
      project,
      assumptions,
      valuation,
      economics,
      feasibility,
      developerNotes: notes,
      narrative,
      generatedAt: new Date().toISOString()
    };
  }
}

export const valuationService = new ValuationService();
