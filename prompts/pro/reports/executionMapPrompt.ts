
import { TokenizationState } from '../../../types';

export const EXECUTION_MAP_CORE_PROMPT = `
1. **EXECUTION PLAN (CORE)**
   - Generate sequential, realistic phases (minimum 6).
   - For each phase, estimate duration (in weeks) and specific deliverables.
   - Define "Owners" (Who does the work? e.g. Legal Counsel, Tech Vendor, Sponsor).
   - Define "Dependencies" (What must be done before this starts?).
   - **Constraint:** No generic phases. Use operational language specific to Tokenization (e.g. "Smart Contract Audit", "SPV Incorporation", "Whitelisting").
`;

export const EXECUTION_MAP_FAILURE_MODES_PROMPT = `
2. **FAILURE MODES**
   - For every phase identified above, list 2-3 specific "Failure Modes".
   - Explain briefly WHY they happen and the impact on the timeline.
   - **Constraint:** Be pessimistic. Highlight where money and time are lost.
`;

export const EXECUTION_MAP_COACH_TIP_PROMPT = `
3. **COACH TIP**
   - For every phase, provide ONE specific, high-level piece of advice from a Senior Project Manager.
   - Focus on error prevention.
`;

export const EXECUTION_MAP_RISK_SIMULATOR_PROMPT = `
4. **RISK SIMULATOR (TEXTUAL)**
   - For every phase, simulate 3 scenarios:
     a) **Budget Cut:** What breaks if we spend 50% less here?
     b) **Acceleration:** What happens if we try to do this in half the time?
     c) **Dependency Ignored:** What happens if we skip the previous step?
   - Provide concrete consequences (e.g., "Legal fines", "Smart contract exploit", "Liquidity crunch").
`;

export const GENERATE_EXECUTION_MAP_PROMPT = (
  data: TokenizationState,
  inputs: { timeHorizonMonths: number; estimatedBudget: number; jurisdictionComplexity: string }
) => {
  const projectInfo = data.projectInfo || {} as any;
  const jurisdiction = data.jurisdiction || {} as any;
  const property = data.property || {} as any;
  const compliance = data.compliance || {} as any;

  return `
SYSTEM ROLE:
You are the Senior Program Director for Institutional Digital Assets.
Your goal is to build a "Battle-Tested" Execution Map. This is a decision tool, not a roadmap.

--- PROJECT CONTEXT (READ ONLY) ---
Project: ${projectInfo.projectName || 'Project'}
Asset: ${property.category || 'Asset'} (${property.total_value || 0})
Structure: ${jurisdiction.spvType || 'SPV'} in ${jurisdiction.country || 'Jurisdiction'}
Compliance Lane: ${compliance.regFramework || 'Framework'}
Target Investor: ${compliance.targetInvestorType || 'Investor'}
User Constraints: ${inputs.timeHorizonMonths} Months Horizon, Budget ~$${inputs.estimatedBudget}

--- INSTRUCTIONS ---
Combine the following logic blocks into a single structured JSON response.

${EXECUTION_MAP_CORE_PROMPT}

${EXECUTION_MAP_FAILURE_MODES_PROMPT}

${EXECUTION_MAP_COACH_TIP_PROMPT}

${EXECUTION_MAP_RISK_SIMULATOR_PROMPT}

--- OUTPUT FORMAT ---
Return strictly a JSON object with this structure:
{
  "education": ["string", "string"],
  "executionTimeline": {
    "phases": [
      {
        "phaseName": "string",
        "durationWeeks": number,
        "budgetRange": "string (e.g. $5k - $10k)",
        "deliverables": ["string", "string"],
        "owners": ["string", "string"],
        "dependencies": ["string"],
        "failureModes": ["string (Mode: Impact)"],
        "riskSeverity": number (1-5),
        "coachTip": "string",
        "riskSimulator": {
            "budgetCut": "string",
            "acceleration": "string",
            "ignoredDependency": "string"
        }
      }
    ]
  },
  "benchmarkComparison": ["string (e.g. 'This timeline is aggressive compared to market std')"],
  "recommendations": [
      { "type": "Critical", "text": "string" }
  ],
  "reasoningWhyThisStepExists": "string"
}
`;
};
