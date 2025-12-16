
export const DECISION_MATRIX_JURISDICTION_PROMPT = (inputs: any) => `
SYSTEM ROLE:
You are a Senior International Legal Strategist and Quantitative Risk Analyst for Digital Assets.

INPUT DATA:
- Jurisdiction A: ${inputs.optionA}
- Jurisdiction B: ${inputs.optionB}
- Asset Context: ${inputs.assetContext}
- Target Investor: ${inputs.investorType}
- Timeline Constraint: ${inputs.timeline}
- Budget Range: ${inputs.budget}

TASK:
Perform a "Head-to-Head" deep dive comparison.
1. **Scoring**: Assign scores (0-10) for 6 specific vectors.
2. **The Verdict**: Who wins and exactly why (trade-off analysis).
3. **Red Flags**: Specific regulatory traps for these jurisdictions with this asset type.
4. **Best-Fit Scenario**: When to choose A vs B.

OUTPUT FORMAT:
Return strictly a JSON object:
{
  "scores": {
    "regClarity": { "A": number, "B": number },
    "setupFriction": { "A": number, "B": number },
    "costEfficiency": { "A": number, "B": number },
    "investorAccess": { "A": number, "B": number },
    "reportingBurden": { "A": number, "B": number },
    "enforcementRisk": { "A": number, "B": number }
  },
  "winner": "string (Name of winner)",
  "verdict": "string (2 paragraphs explaining the strategic trade-off. Be concrete about costs and legal precedent.)",
  "redFlags": [
    { "jurisdiction": "string", "risk": "string", "mitigation": "string" },
    { "jurisdiction": "string", "risk": "string", "mitigation": "string" }
  ],
  "recommendation": {
    "chooseAIf": "string",
    "chooseBIf": "string"
  }
}
`;

export const DECISION_MATRIX_SPV_PROMPT = (inputs: any) => `
SYSTEM ROLE:
You are a Senior Corporate Architect and Tokenization Professor.
Your goal is to explain SPV structures to a non-legal founder, score them objectively, and predict failure modes.

INPUT DATA:
- Structure A: ${inputs.structureA}
- Structure B: ${inputs.structureB}
- Asset Complexity: ${inputs.complexity}
- Distribution Model: ${inputs.distribution}

TASK 1: DIDACTIC EXPLANATION
For each structure, write a mini-paragraph explaining EXACTLY where the asset sits, where the money flows, and who holds the liability.
Target audience: Intelligent Founder (not a lawyer).

TASK 2: REASONED SCORECARD (0-10)
Assign scores for:
- Bankruptcy Remote Strength
- Tax/Ops Complexity
- Investor Familiarity
- Bankability
- Cost Efficiency
IMPORTANT: For each score, provide a 1-sentence "reason" linked to the user's inputs.

TASK 3: FAILURE MODES (The "Real World" Value)
Identify 2 specific ways each structure fails in practice (e.g. "Bank account frozen due to complex ownership", "Double taxation on exit").
Provide a "Preventative Action" for each.

TASK 4: CONDITIONAL RECOMMENDATION
Do not just pick a winner. Explain the trade-off.
"Recommend X because Y. However, switch to Z if..."

OUTPUT FORMAT:
Return strictly a JSON object:
{
  "explanations": {
    "structureA": "string",
    "structureB": "string"
  },
  "scorecard": {
    "bankruptcyRemote": { "A": number, "B": number, "reason": "string" },
    "taxOps": { "A": number, "B": number, "reason": "string" },
    "investorComfort": { "A": number, "B": number, "reason": "string" },
    "bankability": { "A": number, "B": number, "reason": "string" },
    "costEfficiency": { "A": number, "B": number, "reason": "string" }
  },
  "failureModes": [
    { "structure": "string (A or B)", "mode": "string", "prevention": "string" },
    { "structure": "string", "mode": "string", "prevention": "string" },
    { "structure": "string", "mode": "string", "prevention": "string" }
  ],
  "recommendation": {
    "primary": "string (The Verdict)",
    "alternative": "string (The 'If/Then' scenario)"
  }
}
`;

export const DECISION_MATRIX_TOKEN_PROMPT = (inputs: any) => `
SYSTEM ROLE:
You are a Token Engineer and Securities Analyst. 
Teach the user that a token is a CONTRACT, not a marketing tool.

INPUT DATA:
- Target Return Style: ${inputs.returnStyle} (Income/Growth/Blended)
- Liquidity Expectations: ${inputs.liquidity}
- Investor Risk Tolerance: ${inputs.riskTolerance}

TASK 1: TRADE-OFF MATRIX (Textual)
For Equity, Debt, and Revenue Share models, explain:
- "The Deal": What the investor actually gets.
- "The Sacrifice": What the issuer/investor gives up.
- "Failure Mode": When this model breaks (e.g. Equity with no exit).
- "Do Not Use If": A hard constraint.

TASK 2: INVESTOR FIT
For each model, analyze suitability for Retail, Family Offices, and Institutions.
Use specific terms like "Prospectus", "Fixed Income", "Cap Table clutter".

TASK 3: REGULATORY SENSITIVITY
Analyze implied claims, reporting rigidity, and governance friction.

TASK 4: RECOMMENDATION
Recommend the best model based on inputs.
Provide a conditional "Second Best".

OUTPUT FORMAT:
Return strictly a JSON object:
{
  "models": {
    "equity": {
      "deal": "string",
      "sacrifice": "string",
      "failureMode": "string",
      "doNotUseIf": "string",
      "investorFit": { "retail": "string", "familyOffice": "string", "institutional": "string" },
      "regSensitivity": { "claim": "string", "reporting": "string" }
    },
    "debt": { ...same structure... },
    "revenue": { ...same structure... }
  },
  "recommendation": {
    "primary": "string (Name)",
    "reason": "string",
    "secondBest": "string",
    "condition": "string (Works until...)"
  }
}
`;

export const DECISION_MATRIX_FEES_PROMPT = (inputs: any) => `
SYSTEM ROLE:
You are an Investment Committee Officer (LP Side) and Financial Engineer.
Your goal is to tear apart the proposed fee structures and predict how the market will react.

INPUT DATA:
- Horizon: ${inputs.horizon} Years
- Avg Ticket: $${inputs.avgTicket}
-- MODEL A --
- Management Fee: ${inputs.modelA.mgmt}%
- Carry (Performance): ${inputs.modelA.carry}%
- Setup Fee: ${inputs.modelA.setup}%
- Servicing: ${inputs.modelA.service}%
-- MODEL B --
- Management Fee: ${inputs.modelB.mgmt}%
- Carry (Performance): ${inputs.modelB.carry}%
- Setup Fee: ${inputs.modelB.setup}%
- Servicing: ${inputs.modelB.service}%

TASK 1: INVESTOR REACTION FORECAST
Write a "Brutally Honest Feedback" paragraph for each model as if you were a potential investor declining (or accepting) the deal.
Highlight exactly which fee triggers a "Red Flag" (e.g. "Front-loading fees via Setup looks greedy").

TASK 2: ECONOMICS SANITY CHECK
Calculate the approximate "Fee Drag" over the horizon.
Translate this into human terms: "Model A eats X% of the investor's capital before they see a dollar."

TASK 3: SCORING (0-10)
Score both models on:
- Investor Friendliness
- Sponsor Sustainability (Can the issuer survive?)
- Market Competitiveness

TASK 4: SUGGESTED FIXES
Suggest 3 specific structural changes (e.g. "Add a Hurdle Rate", "Lower Mgmt, Raise Carry") to make the losing model viable.

OUTPUT FORMAT:
Return strictly a JSON object:
{
  "modelA": {
    "reaction": "string",
    "dragAnalysis": "string",
    "scores": { "friendliness": number, "sustainability": number, "competitiveness": number }
  },
  "modelB": {
    "reaction": "string",
    "dragAnalysis": "string",
    "scores": { "friendliness": number, "sustainability": number, "competitiveness": number }
  },
  "fixes": ["string", "string", "string"],
  "verdict": "string (Which one wins and why)"
}
`;

export const DECISION_MATRIX_GOVERNANCE_PROMPT = (inputs: any) => `
SYSTEM ROLE:
You are a Corporate Governance Attorney and DAO Architect.
Your goal is to design the "Operating System" for the legal entity, balancing Speed vs Trust.

INPUT DATA:
- Desired Execution Speed: ${inputs.speed}/10 (10 = Instant)
- Compliance Strictness: ${inputs.compliance}/10 (10 = Bank Grade)
- Community Involvement: ${inputs.community}/10 (10 = Full DAO)

TASK 1: GOVERNANCE RECOMMENDATION
Recommend either:
- "Manager-Managed" (Centralized GP)
- "Member-Managed" (Decentralized/DAO)
- "Hybrid Board" (Shared Control)

Provide specific justification based on the input mix.
Example: "High Compliance + High Speed = Manager-Managed. Do not use DAO here."

TASK 2: SCORING MATRIX (0-10)
Score the recommended model on:
- Decision Speed
- Liability Exposure (High score = High risk for individual members)
- Investor Trust (Institutional view)
- Auditability
- Dispute Risk

Provide a short "Reason" for each score.

TASK 3: PRACTICAL CLAUSES (The "Golden Clauses")
Write 3 specific, non-obvious clauses needed for this specific setup.
Examples: "Deadlock Provision", "Drag-Along Threshold", "Emergency Veto".
Explain *why* each clause saves the founder from future pain.

OUTPUT FORMAT:
Return strictly a JSON object:
{
  "recommendation": {
    "model": "string",
    "tagline": "string (e.g. 'The Dictator Model' or 'The Coop Model')",
    "rationale": "string (2 sentences)",
    "idealPhase": "string (e.g. 'Seed Stage' vs 'Maturity')"
  },
  "scores": {
    "speed": { "score": number, "reason": "string" },
    "liability": { "score": number, "reason": "string" },
    "trust": { "score": number, "reason": "string" },
    "auditability": { "score": number, "reason": "string" },
    "disputeRisk": { "score": number, "reason": "string" }
  },
  "clauses": [
    { "title": "string", "mechanism": "string", "whyItMatters": "string" },
    { "title": "string", "mechanism": "string", "whyItMatters": "string" },
    { "title": "string", "mechanism": "string", "whyItMatters": "string" }
  ]
}
`;

export const DECISION_MATRIX_INVESTOR_FIT_PROMPT = (inputs: any) => `
SYSTEM ROLE:
You are a Capital Raising Strategist and Behavioral Economist.
Your goal is to validate if the user's project actually fits their target investor, or if they are dreaming.

INPUT DATA:
- Target Investor A: ${inputs.investorA}
- Target Investor B: ${inputs.investorB}
- Ticket Range: ${inputs.ticketRange}
- Reporting Level: ${inputs.reportingLevel}
- Acquisition Channel: ${inputs.acquisitionChannel}

TASK 1: FIT SUMMARY (Brutally Honest)
For each investor type:
- "Reality Status": Is this realistic? (e.g. "Delusional" vs "High Fit").
- "The Friction": Why will this investor say NO? (e.g. "Family Offices don't buy via Twitter ads").
- "The Win": Why might they say YES?

TASK 2: COST TO ACQUIRE (CAC) ESTIMATE
- Estimate the qualitative CAC (High/Med/Low) for each.
- Explain the logic (e.g. "Retail requires heavy ads = High CAC per $ raised").

TASK 3: WHAT TO CHANGE (Strategic Pivot)
Suggest 3 concrete moves to make the project suitable for the *other* investor or to fix the current one.
e.g. "To get Family Offices, increase min ticket to $250k and hire a placement agent."

OUTPUT FORMAT:
Return strictly a JSON object:
{
  "investorA": {
    "name": "string",
    "realityStatus": "string (e.g. 'Optimistic')",
    "frictionPoint": "string",
    "winningHook": "string",
    "cacEstimate": "Low/Med/High",
    "cacReasoning": "string"
  },
  "investorB": {
    "name": "string",
    "realityStatus": "string",
    "frictionPoint": "string",
    "winningHook": "string",
    "cacEstimate": "Low/Med/High",
    "cacReasoning": "string"
  },
  "pivotMoves": [
    { "move": "string", "impact": "string" },
    { "move": "string", "impact": "string" },
    { "move": "string", "impact": "string" }
  ],
  "verdict": "string (Which path is financially viable?)"
}
`;

export const DECISION_MATRIX_FINAL_SYNTHESIS_PROMPT = (matrixData: any) => `
SYSTEM ROLE:
You are the Chief Investment Officer (CIO) summarizing a complex deal structure.

INPUT DATA (The entire decision matrix):
${JSON.stringify(matrixData, null, 2)}

TASK:
Create a "Master Decision Report".
1. **The Stack**: Summarize the final chosen path for Jurisdiction, SPV, Token, Fees, Governance, Investor.
2. **The Logic**: Write an 8-10 line executive narrative justifying this specific combination.
3. **Top 5 Risks**: Synthesize the red flags from all previous steps into the top 5 deadliest risks.
4. **Immediate Actions**: What should the founder do next week?
5. **Advisor Conclusion**: A final "Green Light / Yellow Light / Red Light" verdict with a condition.

OUTPUT FORMAT:
Return strictly a JSON object:
{
  "theStack": {
    "jurisdiction": "string",
    "spv": "string",
    "token": "string",
    "fees": "string",
    "governance": "string",
    "investor": "string"
  },
  "narrative": "string",
  "topRisks": [
    { "risk": "string", "mitigation": "string" }
  ],
  "immediateActions": ["string", "string", "string"],
  "advisorConclusion": {
    "status": "Green Light" | "Yellow Light" | "Red Light",
    "condition": "string (e.g. 'Viable provided you secure a local director...')"
  }
}
`;

export const DECISION_MATRIX_JURISDICTIONS_PROMPT = DECISION_MATRIX_JURISDICTION_PROMPT;
