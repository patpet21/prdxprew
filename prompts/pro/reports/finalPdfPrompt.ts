
import { TokenizationState } from '../../../types';

const safe = (data: any) => data || {};

// 1. EXECUTIVE OVERVIEW PROMPT
export const FINAL_REPORT_EXECUTIVE_OVERVIEW = (data: TokenizationState, financials: any) => {
  const project = safe(data.projectInfo);
  const property = safe(data.property);
  const token = safe(data.proTokenDesign);
  const compliance = safe(data.proCompliance);
  
  return `
ROLE: Senior Investment Banker (Managing Director level).
TASK: Write the "Executive Overview" (Page 1) of an Institutional Investment Memorandum.

PROJECT CONTEXT:
- Name: ${project.projectName || 'Project'}
- Goal: ${project.projectGoal}
- Asset Class: ${property.category} (${property.property_type})
- Valuation: €${property.total_value?.toLocaleString() || 'TBD'}
- Target Raise: €${property.raise_amount?.toLocaleString() || 'TBD'}
- Projected IRR: ${financials?.roiSimulator?.irr || property.roi_target || 'TBD'}%
- Yield: ${financials?.yieldMetrics?.base?.coc || property.annual_yield || 'TBD'}%
- Regulatory Lane: ${compliance.primaryRegulationLane || 'Reg D / Reg S'}

INSTRUCTIONS:
1. Write 3 powerful paragraphs.
2. Paragraph 1: The Opportunity. succinctly describe the asset and the unique investment proposition.
3. Paragraph 2: Financial Driver. Explain why the returns are attractive and sustainable. Mention the IRR and Yield.
4. Paragraph 3: Strategic Structure. Briefly mention the secure legal structure (${data.jurisdiction.spvType}) and compliance safety.
5. Tone: Professional, persuasive, data-driven, confident. No fluff.

OUTPUT: Markdown text.
`;
};

// 2. HARMONIZED CHAPTERS PROMPT
export const FINAL_REPORT_CHAPTERS = (data: TokenizationState, context: any) => `
ROLE: Financial Editor & Technical Writer for Private Equity.
TASK: Generate the core chapters of the Investment Memorandum.

INPUT DATA:
${JSON.stringify(context, null, 2)}

CHAPTERS TO GENERATE (JSON KEYS):
1. **projectOverview**: Deep dive into the asset. Physical specs, location highlights, and value-add strategy.
2. **assetMarket**: Market analysis. Why this location? Why now? Mention supply/demand trends.
3. **structuralLegal**: The SPV structure (${data.jurisdiction.spvType}) and Jurisdiction (${data.jurisdiction.country}). Explain why this protects the investor (bankruptcy remoteness).
4. **tokenMechanics**: Tokenomics. Supply (${context.tokenomics?.supply}), Price, and the specific rights (Voting/Economic) attached to the token.
5. **financials**: The Numbers. Explain the Waterfall, the projected cashflows, and the exit scenario.
6. **execution**: The Roadmap. Q1-Q4 rollout plan.

REQUIREMENTS:
- Each section must be 2-3 detailed paragraphs.
- Use "Bottom Line Up Front" style.
- Integrate the specific numbers provided in the input. Do not use generic placeholders like "X%".
- Format with **Bold** for key metrics.

OUTPUT: JSON object with keys: 'projectOverview', 'assetMarket', 'structuralLegal', 'tokenMechanics', 'financials', 'execution'.
`;

// 3. MASTER RISK SUMMARY PROMPT
export const FINAL_REPORT_MASTER_RISK = (data: TokenizationState, riskData: any) => `
ROLE: Chief Risk Officer (CRO).
TASK: Generate a "Master Risk Matrix" table (Markdown).

INPUTS:
- Legal Risks: ${JSON.stringify(riskData.legal || [])}
- Financial Risks: ${JSON.stringify(riskData.financial || [])}
- Execution Risks: ${JSON.stringify(riskData.execution || [])}

REQUIREMENTS:
- Create a Markdown Table with columns: [Risk Category, Specific Threat, Probability, Mitigation Strategy].
- If specific risks are missing in input, infer standard risks for ${data.property.category} assets (e.g. Liquidity Risk, Regulatory Change, Tenant Vacancy).
- Be brutally honest but reassuring in the mitigation column.

OUTPUT: Markdown String.
`;

// 4. READINESS ASSESSMENT PROMPT
export const FINAL_REPORT_READINESS = (data: TokenizationState) => `
ROLE: Investment Committee (IC) Chair.
TASK: Provide a final "Go/No-Go" Readiness Assessment.

EVALUATION CRITERIA:
- Data Completeness: ${data.property.description ? 'High' : 'Low'}
- Financial Model: ${data.proPayout ? 'configured' : 'Basic'}
- Legal Structure: ${data.jurisdiction.spvType ? 'Defined' : 'Pending'}

OUTPUT JSON:
{
  "verdict": "Ready for Launch" | "Almost Ready" | "Needs Review",
  "score": number (0-100),
  "reasoning": "string (2 sentences justifying the score)",
  "gapAnalysis": "string (What is missing?)"
}
`;

// 5. NEXT ACTIONS PROMPT
export const FINAL_REPORT_NEXT_ACTIONS = (data: TokenizationState) => `
ROLE: Project Manager.
TASK: Create a concrete "Pre-Launch Checklist" based on the current state.

CONTEXT:
- Asset: ${data.property.category}
- Jurisdiction: ${data.jurisdiction.country}

OUTPUT: JSON Array of strings (e.g. "Engage Legal Counsel in Delaware", "Finalize Smart Contract Audit").
`;

// MASTER AGGREGATOR
export const GENERATE_FINAL_REPORT_PROMPT = (
  data: TokenizationState,
  inputs: { reportTitle: string; brandingMode: string; includeAppendix: boolean; exportMode: string },
  fullContext: any
) => {
  const project = safe(data.projectInfo);

  return `
SYSTEM ROLE: Report Compiler Orchestrator.
Using the provided project context, compile the Final Investment Report for ${project.projectName || 'Project'}.

FULL CONTEXT DATA:
${JSON.stringify(fullContext, null, 2)}

OUTPUT FORMAT:
Return strictly a JSON object:
{
  "finalReport": {
    "toc": ["Executive Overview", "Project Overview", "Asset & Market Logic", "Structural & Legal Framework", "Token & Investor Mechanics", "Financial & Unit Economics", "Execution & Timeline", "Master Risk Summary", "Readiness Assessment"],
    "sections": [
      { "title": "Executive Overview", "content": "markdown..." },
      { "title": "Project Overview", "content": "markdown..." },
      { "title": "Asset & Market Logic", "content": "markdown..." },
      { "title": "Structural & Legal Framework", "content": "markdown..." },
      { "title": "Token & Investor Mechanics", "content": "markdown..." },
      { "title": "Financial & Unit Economics", "content": "markdown..." },
      { "title": "Execution & Timeline", "content": "markdown..." },
      { "title": "Master Risk Summary", "content": "markdown (table format)..." },
      { "title": "Readiness Assessment", "content": "markdown..." }
    ]
  },
  "qualityControl": {
    "inconsistencies": ["string"],
    "missingData": ["string"],
    "validationChecklist": ["string"]
  },
  "readiness": {
    "score": number,
    "verdict": "string"
  },
  "nextActions": ["string", "string"]
}
`;
};
