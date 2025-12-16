
import { TokenizationState } from '../../types';

export const PROJECT_IMPORTER_PROMPT = (data: any) => `
Act as a Real Estate Fund Manager.
Review the imported data fragments:
${JSON.stringify(data)}

Task: Consolidate this into a single "Project Snapshot".
Identify:
1. The strongest asset of the project.
2. The biggest gap (missing data).

Output JSON: { "summary": "string", "strongest_point": "string", "missing_data": "string" }
`;

export const VALIDATION_ENGINE_PROMPT = (project: any) => `
Act as a Compliance Auditor.
Validate the completeness of this project:
${JSON.stringify(project)}

Checklist:
1. Is the Target Raise realistic for the Asset Type?
2. Is the Jurisdiction defined?
3. Are Tokenomics balanced (supply vs price)?

Output JSON: { "score": number, "checks": [{"name": "string", "status": "pass"|"fail", "msg": "string"}] }
`;

export const COHERENCE_CHECKER_PROMPT = (project: any, type: 'LEGAL' | 'MARKET' | 'TOKEN') => `
Act as a Deal Structuring Expert.
Check for LOGICAL CONSISTENCY in the ${type} vector.

Project Context:
- Asset: ${project.asset} in ${project.location}
- SPV: ${project.spv} in ${project.jurisdiction}
- Target: ${project.investors}

Rules:
- IF Asset is Real Estate AND SPV is "Foreign Only" -> Warning (Asset usually needs local title holder).
- IF Target is "Retail" AND Reg Lane is "Reg D" -> Warning (Incompatible).
- IF Valuation is < $1M AND Structure is "Double SPV" -> Warning (Over-engineering).

Output JSON: { "status": "Coherent" | "Conflict", "conflicts": ["string"], "recommendation": "string" }
`;

export const AI_FIXER_PROMPT = (issue: string, context: string) => `
Act as a Senior Partner.
The user has this issue: "${issue}".
Context: "${context}".

Task: Rewrite or Reconfigure the strategy to fix this.
Provide a professional "Fix Suggestion".
`;
