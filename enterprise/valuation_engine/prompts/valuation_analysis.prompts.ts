
import { ProjectContext, ValuationAssumptions } from "../services/valuation_service";

export const ANALYZE_ECONOMICS_PROMPT = (project: ProjectContext, assumptions: ValuationAssumptions) => `
ROLE: Real Estate Financial Analyst.
TASK: Generate a Project Economic Analysis.

CONTEXT:
Project: ${project.name} (${project.assetType} - ${project.status})
Location: ${project.location}
Financials: NOI $${assumptions.estimatedNOI}, Cap Rate ${assumptions.marketCapRate}%

OUTPUT JSON:
{
  "grossDevelopmentValue": number,
  "developmentCost": number,
  "profitMargin": number,
  "yieldOnCost": number,
  "commentary": "string (2 sentences)"
}
`;

export const CALCULATE_FEASIBILITY_PROMPT = (project: ProjectContext, economics: any) => `
ROLE: Investment Committee Risk Officer.
TASK: Calculate Feasibility Score (0-100) and Risk Assessment.

INPUT:
Asset: ${project.assetType}
Stage: ${project.status}
Profit Margin: ${economics.profitMargin}%

OUTPUT JSON:
{
  "score": number (0-100),
  "riskLevel": "Low" | "Medium" | "High" | "Critical",
  "strengths": ["string", "string"],
  "weaknesses": ["string", "string"],
  "verdict": "string (Go / No-Go recommendation)"
}
`;

export const GENERATE_DEVELOPER_NOTES_PROMPT = (project: ProjectContext) => `
ROLE: Senior Property Developer / Construction Manager.
TASK: Write technical notes for the development phase.

CONTEXT:
Asset: ${project.assetType}
Stage: ${project.status}
Location: ${project.location}

OUTPUT JSON:
{
  "constructionRisk": "string",
  "timelineAssessment": "string",
  "permittingNotes": "string",
  "capexRecommendations": ["string", "string"]
}
`;

export const GENERATE_VALUATION_NARRATIVE_PROMPT = (project: ProjectContext, valuation: any) => `
ROLE: Real Estate Investment Writer.
TASK: Write an Investment Narrative for the valuation report.

CONTEXT:
Project: ${project.name} (${project.assetType} - ${project.status})
Valuation: ${valuation.currency} ${valuation.valueCentral}
Metrics: Cap Rate ${valuation.metrics.capRateApplied}%, NOI ${valuation.metrics.noiEffective}

OUTPUT JSON:
{
  "headline": "string (Punchy title)",
  "story": "string (2 paragraphs description)",
  "keyDrivers": ["string", "string", "string"],
  "riskFactors": ["string", "string", "string"]
}
`;
