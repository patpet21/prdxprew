
export const BUILD_PROJECT_SNAPSHOT_PROMPT = (inputs: any) => `
ROLE: Senior Investment Editor.
TASK: Rewrite the user's rough project description into a "Project Snapshot" for an Institutional Memo.
INPUT: ${JSON.stringify(inputs)}

REQUIREMENTS:
1. Create a "Professional Summary" (3 sentences).
2. Define the "Core Objective" clearly (Liquidity vs Capital vs Community).
3. Explain the "Phase" (Concept vs Pre-Dev vs Operating).

OUTPUT JSON: { "professionalSummary": "string", "coreObjective": "string", "phaseAnalysis": "string" }
`;

export const BUILD_ASSET_LOGIC_PROMPT = (inputs: any) => `
ROLE: Real Estate Asset Manager.
TASK: Validate WHY this asset works for tokenization.
INPUT: ${JSON.stringify(inputs)}

REQUIREMENTS:
1. "Tokenization Logic": Why tokenize this instead of selling it normally?
2. "Value Creation": Where does the extra value come from? (Liquidity premium, operational efficiency?).

OUTPUT JSON: { "tokenizationLogic": "string", "valueCreationThesis": "string" }
`;

export const BUILD_CAPITAL_STACK_PROMPT = (inputs: any) => `
ROLE: Private Equity Structurer.
TASK: Analyze the Capital Stack and Incentive Alignment.
INPUT: ${JSON.stringify(inputs)}

REQUIREMENTS:
1. Analyze "Sponsor vs Investor" alignment. Is the sponsor putting enough skin in the game?
2. Identify "Conflict Points" (e.g. Sponsor gets paid before Investors).
3. Provide a "Payout Hierarchy" summary.

OUTPUT JSON: { "alignmentAnalysis": "string", "conflictPoints": ["string"], "payoutHierarchy": "string" }
`;

export const BUILD_TOKENOMICS_PROMPT = (inputs: any) => `
ROLE: Behavioral Economist & Token Engineer.
TASK: Analyze Token Price Psychology and Supply.
INPUT: ${JSON.stringify(inputs)}

REQUIREMENTS:
1. "Psychology Check": Is the price too high (illiquid) or too low (meme-like)?
2. "Optimal Supply": Suggest a supply count that looks "Institutional".
3. "Simulation": What happens if demand is low? (Liquidity risk).

OUTPUT JSON: { "psychologyCheck": "string", "optimalSupplySuggestion": "string", "liquiditySimulation": "string" }
`;

export const BUILD_VALUE_MATRIX_PROMPT = (inputs: any) => `
ROLE: Deal Negotiator.
TASK: Create a trade-off matrix between Investor and Sponsor.
INPUT: ${JSON.stringify(inputs)}

REQUIREMENTS:
1. List "Investor Benefits" vs "Sponsor Benefits".
2. Identify who is taking the "Excess Risk".
3. Identify who holds the "Excess Upside".

OUTPUT JSON: { "investorBenefits": ["string"], "sponsorBenefits": ["string"], "riskHolder": "string", "upsideHolder": "string" }
`;

export const BUILD_RISK_REALITY_PROMPT = (inputs: any) => `
ROLE: Chief Risk Officer (CRO).
TASK: Perform a "Reality Check" on risks. Not generic risks, but specific ones.
INPUT: ${JSON.stringify(inputs)}

REQUIREMENTS:
1. Top 3 "Real Risks" (e.g. Construction delay, Regulatory freeze).
2. Probability vs Impact for each.
3. Concrete Mitigation (not generic).

OUTPUT JSON: { "realRisks": [{ "risk": "string", "prob": "High/Med/Low", "impact": "High/Med/Low", "mitigation": "string" }] }
`;

export const BUILD_EXECUTION_REALITY_PROMPT = (inputs: any) => `
ROLE: Project Manager.
TASK: Define the "Execution Reality".
INPUT: ${JSON.stringify(inputs)}

REQUIREMENTS:
1. Identify the #1 Bottleneck (e.g. Legal, Tech, Fundraising).
2. Estimate "Real Time to Live" (usually 2x what founders think).

OUTPUT JSON: { "bottleneck": "string", "realTimeline": "string", "resourceGap": "string" }
`;

export const BUILD_READINESS_SCORE_PROMPT = (fullData: any) => `
ROLE: Investment Committee.
TASK: Assign a final Readiness Score.
INPUT: ${JSON.stringify(fullData)}

REQUIREMENTS:
1. Score (0-100).
2. "Verdict": Ready / Needs Work / Not Viable.
3. Explanation.

OUTPUT JSON: { "score": number, "verdict": "string", "explanation": "string" }
`;

export const BUILD_NEXT_ACTIONS_PROMPT = (inputs: any) => `
ROLE: Strategy Consultant.
TASK: List 7-10 Operational Next Actions.
INPUT: ${JSON.stringify(inputs)}

REQUIREMENTS:
1. Must be concrete (e.g. "Draft IM", "Open Bank Account").
2. Assign logical owners.

OUTPUT JSON: { "actions": [{ "step": "string", "owner": "string" }] }
`;

export const BUILD_FINAL_NARRATIVE_PROMPT = (allData: any) => `
ROLE: Senior Partner at an Advisory Firm.
TASK: Write the Final Advisory Report Narrative.
INPUT: All previous steps data.

REQUIREMENTS:
1. Write a cohesive "Advisory Opinion" (3 paragraphs).
2. Synthesize the Strengths, Risks, and Execution path into a narrative flow.
3. Tone: Professional, encouraging but cautious.

OUTPUT JSON: { "narrative": "markdown string" }
`;
