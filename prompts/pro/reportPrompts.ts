
import { ProjectInfo } from '../../types';

export const INSTITUTIONAL_REPORT_PROMPT = (project: ProjectInfo, style: string) => `
Act as a Senior Investment Banker (Goldman Sachs / McKinsey level).
Style: ${style} (e.g. Conservative, Visionary, Analytical).

Context:
- Project: ${project.projectName}
- Goal: ${project.projectGoal}
- Target: ${project.targetRaiseAmount}

Task: Write an "Investment Memo" Executive Summary.
Structure:
1. **Investment Thesis**: The core "Why Invest".
2. **Risk Factors**: 3 critical risks and their mitigations (be honest).
3. **Exit Strategy**: Clear path to liquidity.

Tone: Professional, data-driven, objective. No marketing fluff.
`;

export const PITCH_DECK_PROMPT = (project: ProjectInfo) => `
Act as a Venture Capital Pitch Coach.
Create a 10-slide Deck Outline for: ${project.projectName}.

For each slide, provide:
- **Title**: Punchy headline.
- **Key Bullets**: 3 main points.
- **Visual Cue**: Description of the chart/image needed (e.g. "Hockey stick graph showing user growth").

Focus on: Problem, Solution, Market Size, Business Model, and The Ask.
`;

export const NARRATIVE_GENERATOR_PROMPT = (input: string, mode: 'Fix' | 'Expand' | 'Simplify') => `
Act as a Web3 Content Strategist and Copywriter.
Input Text: "${input}"
Mode: ${mode}

Task:
- If Fix: Correct grammar and make it sound more professional.
- If Expand: Flesh out the idea with compelling details and emotional hooks.
- If Simplify: Cut the jargon, make it understandable for a 10-year-old (ELI5).
`;

export const ROADMAP_BUILDER_PROMPT = (timeHorizon: string) => `
Act as a Technical Product Manager (PM).
Create a execution roadmap for a Tokenization Project over ${timeHorizon}.

Phases to cover:
1. **Structuring** (Legal/SPV)
2. **Tech Setup** (Smart Contracts/Platform)
3. **Marketing** (Community/PR)
4. **Launch** (STO/Distribution)

Output strictly JSON:
{
  "phases": [
    {
      "phaseName": "string",
      "durationWeeks": number,
      "estimatedCost": number,
      "milestones": ["string", "string"]
    }
  ]
}
`;

// --- NEW IC MEMO PROMPTS ---

export const GENERATE_IC_MEMO_PROMPT = (data: any) => `
Act as an Investment Committee (IC) Analyst for a real-estate/asset tokenization firm.
Use the provided project data to draft a complete, rigorous Investment Memorandum.

DATA INPUT:
${JSON.stringify(data, null, 2)}

REQUIREMENTS:
1. **Tone**: Institutional, objective, risk-aware. NO marketing fluff.
2. **Content**: Fill every section with detailed paragraphs based on the data.
3. **Gaps**: If data is missing (e.g. no specific location), write "[DATA MISSING - User to Complete]".

OUTPUT FORMAT:
Return strictly a JSON object with keys for each section:
{
  "executiveSummary": "string (High level thesis, deal size, key risk)",
  "assetSnapshot": "string (Physical specs, location analysis, condition)",
  "marketThesis": "string (Why this asset class? Why this location? Macro/Micro)",
  "structureOverview": "string (SPV details, Jurisdiction, Tax logic)",
  "investorRights": "string (Token class, voting, dividends, waterfall logic)",
  "financialHighlights": "string (NOI, IRR, Sensitivity Analysis commentary)",
  "riskRegister": "string (Bullet points of Legal, Market, and Execution risks + Mitigations)",
  "timeline": "string (Execution roadmap from now to exit)",
  "openQuestions": "string (3-5 hard questions the IC will ask)"
}
`;

export const SCAN_RED_FLAGS_PROMPT = (sectionText: string) => `
Act as a Risk Compliance Officer.
Scan the following memo section for inconsistencies, legal/compliance risk signals, unrealistic assumptions, or missing investor protections.

TEXT:
"${sectionText}"

OUTPUT FORMAT:
Return strictly a JSON object:
{
  "redFlags": [
    {
      "issue": "string",
      "severity": "High" | "Medium" | "Low",
      "fixSuggestion": "string"
    }
  ]
}
`;

export const REWRITE_CLARITY_PROMPT = (sectionText: string) => `
Act as a Senior Editor for an Investment Bank.
Rewrite the following section for maximum clarity, concision, and impact ("Bottom Line Up Front" style).
Preserve all facts. Remove fluff.

TEXT:
"${sectionText}"

OUTPUT FORMAT:
Return strictly a JSON object:
{
  "revisedText": "string",
  "explanation": "string (Short explanation of what improved)"
}
`;
