
import { ProMarketData } from '../../types';

export const ANALYZE_REVENUE_VOLATILITY = (data: ProMarketData, category: string) => `
Act as a Financial Risk Analyst.
Analyze the revenue stability for a ${category} asset.

Context:
- Revenue Source: ${data.revenueTypePrimary}
- Current Revenue: ${data.annualRevenueCurrent}
- Stabilized Revenue: ${data.annualRevenueStabilized}
- Growth Rate: ${data.revenueGrowthExpectation}%

Task:
1. Provide a "Volatility Score" from 1 (Very Stable) to 5 (Highly Volatile).
2. Write a 1-sentence explanation of why (e.g. "Long-term leases provide stability" or "Hospitality revenue fluctuates seasonally").

Output strictly JSON: { "score": number, "reasoning": "string" }
`;

export const ANALYZE_EXPENSE_STABILITY = (data: ProMarketData, category: string) => `
Act as an Asset Manager.
Analyze the operating expense profile for a ${category} asset.

Context:
- OPEX: ${data.opexAnnual}
- CAPEX: ${data.capexAnnual}
- Management Fees: ${data.mgmtFees}

Task:
1. Provide a "Stability Score" from 1 (Predictable) to 5 (Unpredictable).
2. Write a 1-sentence risk note regarding cost overruns (e.g. "High capex suggests renovation risk").

Output strictly JSON: { "score": number, "reasoning": "string" }
`;

export const GENERATE_CAPITAL_STACK_COMMENT = (data: ProMarketData) => `
Act as a Real Estate Investment Banker.
Analyze this Capital Stack structure:

- Equity (Existing): ${data.equityExisting}
- Senior Debt: ${data.seniorDebtAmount}
- Mezzanine: ${data.mezzanineDebtAmount}
- Target Raise (Tokenized Equity): ${data.equityTargetRaise}

Task:
Write a concise, professional 2-sentence comment on the leverage risk and equity balance. Mention LTV if high.

Return strictly JSON: { "comment": "string" }
`;

export const FINANCIAL_CAPITAL_STACK_PROMPT = (inputs: any) => `
Act as a Real Estate Investment Banker.
Analyze the following Capital Stack structure for a tokenized asset project.

Inputs:
- Senior Debt: ${inputs.seniorDebtPercent}% (Rate: ${inputs.seniorInterestRate}%)
- Mezzanine Debt: ${inputs.mezzanineDebtPercent}% (Rate: ${inputs.mezzInterestRate}%)
- Tokenized Equity: ${inputs.tokenizedEquityPercent}% (Target Yield: ${inputs.targetTokenYield}%)
- Sponsor Equity: ${inputs.sponsorEquityPercent}%
- Promote: ${inputs.sponsorPromoteCarry}% over ${inputs.sponsorPromoteThreshold}% hurdle

Task:
1. Calculate a "Capital Efficiency Score" (0-100). Higher is better (optimized cost of capital vs risk).
2. Calculate a "Risk Distribution Score" (0-100). Higher means better risk sharing.
3. Provide "Investor Appeal Notes" (pros/cons for the token buyer).
4. Provide "Sponsor Benefit Notes" (why this is good/bad for the sponsor).
5. Identify "Structural WeakSpots" (e.g., "High leverage detected", "Low skin in the game").

Output strictly JSON:
{
  "capitalEfficiencyScore": number,
  "riskDistributionScore": number,
  "investorAppealNotes": ["string", "string"],
  "sponsorBenefitNotes": ["string", "string"],
  "structuralWeakSpots": ["string", "string"]
}
`;

export const CAPITAL_STACK_INPUT_EDUCATION_PROMPT = (inputs: any) => `
Act as a Professor of Real Estate Finance.
Explain the Capital Stack inputs provided by the student.

Inputs:
- Senior Debt: ${inputs.seniorDebtPercent}%
- Mezzanine: ${inputs.mezzanineDebtPercent}%
- Token Equity: ${inputs.tokenizedEquityPercent}%
- Sponsor Equity: ${inputs.sponsorEquityPercent}%

Task:
For each component, provide a simple "Definition", "Why it matters", and a "Warning" based on the specific percentage used.
Example: If Senior Debt is 0%, warn about lost leverage benefits. If >70%, warn about foreclosure risk.

Output strictly JSON:
{
  "seniorDebt": { "definition": "string", "whyItMatters": "string", "warning": "string" },
  "mezzanine": { "definition": "string", "whyItMatters": "string", "warning": "string" },
  "tokenEquity": { "definition": "string", "whyItMatters": "string", "warning": "string" },
  "sponsorEquity": { "definition": "string", "whyItMatters": "string", "warning": "string" }
}
`;

export const CAPITAL_STACK_OUTPUT_EDUCATION_PROMPT = (inputs: any, analysis: any) => `
Act as a Financial Consultant.
Explain the analysis results to the user in simple terms.

Analysis:
- Efficiency Score: ${analysis.capitalEfficiencyScore}
- Risk Score: ${analysis.riskDistributionScore}
- Weak Spots: ${JSON.stringify(analysis.structuralWeakSpots)}

Task:
1. Explain what "Capital Efficiency" means in this context and how to improve it.
2. Explain "Risk Distribution" and how the token holder is protected (or not).
3. Provide 3 specific "Improvement Suggestions".

Output strictly JSON:
{
  "efficiencyExplanation": "string",
  "riskExplanation": "string",
  "improvementSuggestions": ["string", "string", "string"]
}
`;

export const FINANCIAL_YIELD_PROMPT = (inputs: any, calcs: any) => `
Act as a Real Estate Financial Analyst.
Analyze the Yield Metrics for this project.

Inputs:
- Gross Income: $${inputs.grossIncomeAnnual}
- OpEx: $${inputs.operatingExpensesAnnual}
- Debt Service: $${inputs.debtServiceAnnual}
- Target Token Yield: ${inputs.tokenYieldTarget}%

Calculated Results:
- Cash-on-Cash (Base): ${calcs.base.coc}%
- IRR (Base): ${calcs.base.irr}%
- IRR (Optimistic): ${calcs.optimistic.irr}%

Task:
1. Write a "Scenario Narrative" explaining the Base Case performance.
2. Provide "Risk Notes" (e.g. if DSCR is low, or if returns depend heavily on appreciation).
3. Assess "Investor Segment Fit" (e.g. "Suitable for Core-Plus investors").
4. Provide a "Realism Check" on the assumptions.

Output strictly JSON:
{
  "scenarioNarrative": "string",
  "riskNotes": ["string", "string"],
  "investorSegmentFit": ["string", "string"],
  "realismCheck": "string"
}
`;

export const YIELD_METRICS_INPUT_EDUCATION_PROMPT = (inputs: any) => `
Act as a Professor of Finance.
Explain these Yield Metrics inputs to a student.

Inputs:
- Gross Income ($${inputs.grossIncomeAnnual})
- OpEx ($${inputs.operatingExpensesAnnual})
- Debt Service ($${inputs.debtServiceAnnual})
- Token Yield Target (${inputs.tokenYieldTarget}%)

Task: For each, explain the "Definition", "Why it matters", and give a specific "Insight" based on the user's value.

Output strictly JSON:
{
  "grossIncome": { "definition": "string", "whyItMatters": "string", "insight": "string" },
  "opex": { "definition": "string", "whyItMatters": "string", "insight": "string" },
  "debtService": { "definition": "string", "whyItMatters": "string", "insight": "string" },
  "tokenYield": { "definition": "string", "whyItMatters": "string", "insight": "string" }
}
`;

export const YIELD_METRICS_OUTPUT_EDUCATION_PROMPT = (inputs: any, calcs: any) => `
Act as an Investment Advisor.
Explain the output metrics:
- Cash-on-Cash (CoC): ${calcs.base.coc}%
- IRR: ${calcs.base.irr}%

Task:
1. Explain the difference between CoC and IRR.
2. Provide "Professional Insight" on these specific numbers.
3. Describe "Investor Expectations" for this return profile.

Output strictly JSON:
{
  "cocVsIrr": "string",
  "professionalInsight": "string",
  "investorExpectations": "string"
}
`;

export const GENERATE_STRESS_TEST_COMMENT = (data: ProMarketData) => `
Act as a Risk Manager.
Evaluate the resilience of this asset based on these stress test inputs:

- Downside Yield: ${data.downsideScenarioYield}% (if -20% Rev)
- Break-even Occupancy: ${data.breakEvenOccupancy}%
- Interest Rate Shock Impact: ${data.interestRateShockImpact}

Task:
Provide a risk verdict: "Resilient", "Fragile", or "Moderate".
Write a short explanation focusing on the Break-even point.

Return strictly JSON: { "verdict": "string", "comment": "string" }
`;

export const GENERATE_FINANCIAL_SUMMARY = (data: ProMarketData) => `
Act as a Chief Investment Officer (CIO).
Generate a final "Financial Health Summary" for the Sidebar Copilot.

Inputs:
- Volatility: ${data.revenueVolatilityScore}/5
- Stability: ${data.expenseStabilityScore}/5
- IRR: ${data.projectedIrr}%
- Equity Multiple: ${data.equityMultiple}x

Task:
1. Score (0-100)
2. Risk/Return Balance (Low/Balanced/Aggressive)
3. 2 Red Flags
4. 2 Strengths
5. Next Step Recommendation

Return strictly JSON: 
{ 
  "score": number, 
  "balance": "string", 
  "redFlags": ["string", "string"], 
  "strengths": ["string", "string"], 
  "nextStep": "string" 
}
`;

export const ROI_SIMULATOR_PROMPT = (inputs: any, calcs: any) => `
Act as a Real Estate Financial Analyst.
Review the ROI Simulation for this project.

Inputs:
- Income Growth: ${inputs.incomeGrowthRate}%
- Vacancy Rate: ${inputs.vacancyRate}%
- Opex: ${inputs.opexPercent}% of Gross Revenue
- Exit Cap Rate: ${inputs.exitCapRate}%
- Holding Period: ${inputs.holdingPeriodYears} Years

Calculated:
- NOI Year 1: $${calcs.noiYear1}
- Exit Valuation: $${calcs.exitValuation}
- Equity Multiple: ${calcs.equityMultiple}x
- IRR: ${calcs.irr}%

Task:
1. Provide a "Realism Check" on the assumptions (e.g. is 5% growth too high?).
2. List 2 "Stress Test Notes" (what if exit cap expands?).
3. Assess "Exit Risk" (liquidity at end of term).
4. Assign a "Valuation Confidence" score (0-100).

Output strictly JSON:
{
  "realismCheck": "string",
  "stressTestNotes": ["string", "string"],
  "exitRisk": "string",
  "valuationConfidence": number
}
`;

export const ROI_INPUT_EDUCATION_PROMPT = (inputs: any) => `
Act as a Finance Professor.
Explain the ROI Simulation inputs to a student.

Inputs:
- Income Growth Rate (${inputs.incomeGrowthRate}%)
- Vacancy Rate (${inputs.vacancyRate}%)
- Opex Percent (${inputs.opexPercent}%)
- Exit Cap Rate (${inputs.exitCapRate}%)
- Holding Period (${inputs.holdingPeriodYears} Years)

Task: For each, explain the "Definition", "Impact on ROI" (if it goes up/down), and "Common Mistakes".

Output strictly JSON:
{
  "incomeGrowth": { "definition": "string", "impact": "string", "mistake": "string" },
  "vacancy": { "definition": "string", "impact": "string", "mistake": "string" },
  "opex": { "definition": "string", "impact": "string", "mistake": "string" },
  "exitCap": { "definition": "string", "impact": "string", "mistake": "string" },
  "holdPeriod": { "definition": "string", "impact": "string", "mistake": "string" }
}
`;

export const ROI_OUTPUT_EDUCATION_PROMPT = (calcs: any) => `
Act as an Investment Advisor.
Explain the ROI Simulation results.

Metrics:
- NOI: Net Operating Income
- Valuation: Exit Price
- Equity Multiple: ${calcs.equityMultiple}x
- IRR: ${calcs.irr}%

Task:
1. Explain what "Equity Multiple" tells the investor vs "IRR".
2. Interpret the ${calcs.irr}% IRR specifically (Good/Bad for this asset class?).

Output strictly JSON:
{
  "multipleVsIrr": "string",
  "irrInterpretation": "string"
}
`;

export const FINANCIAL_INVESTOR_PROMPT = (inputs: any, calcs: any) => `
Act as a Private Wealth Manager.
Analyze the deal from the *Investor's Perspective*.

Inputs:
- Initial Ticket: $${inputs.initialTicket}
- Payout Frequency: ${inputs.payoutFrequency}
- Net Yield: ${inputs.tokenNetYield}%
- Hold Period: ${inputs.expectedHoldPeriod} Years

Calculated:
- Annual Payout: $${calcs.annualPayout}
- Lifetime Return: $${calcs.lifetimeReturns}

Task:
1. Identify the "Investor Persona Fit" (e.g., Passive Income Seeker, Speculator).
2. Assess "Risk Perception" based on yield vs hold period.
3. Suggest a "Messaging Strategy" for marketing this token.
4. Define "Token Positioning" (e.g., "High Yield / Low Liquidity").

Output strictly JSON:
{
  "investorPersonaFit": ["string", "string"],
  "riskPerception": ["string", "string"],
  "messagingStrategy": ["string", "string"],
  "tokenPositioning": "string"
}
`;

export const INVESTOR_VIEW_INPUT_EDUCATION_PROMPT = (inputs: any) => `
Act as a Behavioral Economist.
Explain the psychological impact of the Investor View inputs.

Inputs:
- Ticket Size: $${inputs.initialTicket}
- Frequency: ${inputs.payoutFrequency}
- Yield: ${inputs.tokenNetYield}%

Task:
1. Explain how "Small Investors" think vs "Institutions" regarding ticket size.
2. Explain how "Payout Frequency" affects trust and engagement.
3. Discuss realistic vs unrealistic yield expectations.

Output strictly JSON:
{
  "smallVsInstitutional": "string",
  "frequencyTrust": "string",
  "yieldRealism": "string"
}
`;

export const INVESTOR_VIEW_OUTPUT_EDUCATION_PROMPT = (inputs: any, aiOutput: any) => `
Act as a Pitch Deck Consultant.
Explain the Investor Analysis results.

Analysis:
- Persona: ${JSON.stringify(aiOutput.investorPersonaFit)}
- Positioning: ${aiOutput.tokenPositioning}

Task:
1. "Persona Breakdown": Who exactly are these people?
2. "Yield Attractiveness": Is this yield competitive in today's market?
3. "Risks to Disclose": What should be highlighted in the disclaimer?
4. "Pitch Strategy": How to frame this in one sentence.

Output strictly JSON:
{
  "personaBreakdown": "string",
  "yieldAttractiveness": "string",
  "risksToDisclose": "string",
  "pitchStrategy": "string"
}
`;

export const FINANCIAL_SPONSOR_PROMPT = (inputs: any, calcs: any) => `
Act as a Private Equity Fund Manager.
Analyze the Sponsor Economics for this deal.

Inputs:
- Equity Retention: ${inputs.sponsorEquityRetention}%
- Management Fee: ${inputs.managementFee}%
- Performance Fee (Carry): ${inputs.performanceFeeCarry}%
- Promote Structure: "${inputs.promoteStructure}"

Calculated:
- Sponsor Upside Potential: ${calcs.sponsorUpside}
- Fee Competitiveness: ${calcs.feeCompetitiveness}

Task:
1. Perform a "Fairness Check": Is this sponsor too greedy or properly aligned?
2. Predict "Investor Reaction": Will LPs accept these fees?
3. List 2 "Sponsor Strengths" (e.g. good alignment).
4. List 2 "Sponsor Weaknesses" (e.g. high fees).

Output strictly JSON:
{
  "fairnessCheck": "string",
  "investorReaction": ["string", "string"],
  "sponsorStrengths": ["string", "string"],
  "sponsorWeaknesses": ["string", "string"]
}
`;

export const SPONSOR_VIEW_INPUT_EDUCATION_PROMPT = (inputs: any) => `
Act as a Deal Structuring Expert.
Explain Sponsor Economics inputs.

Inputs:
- Retention: ${inputs.sponsorEquityRetention}%
- Mgmt Fee: ${inputs.managementFee}%
- Carry: ${inputs.performanceFeeCarry}%

Task:
1. Explain how sponsors normally get paid (Salary vs Carry).
2. Explain what investors consider "Fair" for Management Fees.
3. Define "Market Standards" for Performance Fees in this asset class.

Output strictly JSON:
{
  "sponsorPayModel": "string",
  "fairFeesExplained": "string",
  "marketStandards": "string"
}
`;

export const SPONSOR_VIEW_OUTPUT_EDUCATION_PROMPT = (inputs: any, aiOutput: any) => `
Act as a Negotiation Coach.
Explain the Sponsor Analysis results.

Fairness Verdict: ${aiOutput.fairnessCheck}

Task:
1. "Fairness Analysis": Why did the AI judge it this way?
2. "Risks": What happens if fees are too high (failed raise)?
3. "Adjustments": What specific number should change to improve perception?

Output strictly JSON:
{
  "fairnessAnalysis": "string",
  "riskImplications": "string",
  "adjustmentTips": "string"
}
`;

export const FINANCIAL_WATERFALL_PROMPT = (inputs: any, calcs: any) => `
Act as a Private Equity Fund Accountant.
Analyze this Waterfall Distribution:

Inputs:
- Gross Revenue: $${inputs.grossRevenue}
- OpEx: $${inputs.opex}
- Debt Service: $${inputs.seniorDebtService} (Senior) + $${inputs.mezzDebtService} (Mezz)
- Preferred Return: ${inputs.preferredReturnRate}%
- Promote: ${inputs.promoteCarry}% over ${inputs.promoteHurdle}% hurdle

Calculated Flow:
- Net after Ops/Tax: $${calcs.netAfterOps}
- Distributable Cash: $${calcs.distributableCash}
- Sponsor Promote: $${calcs.sponsorPromote}

Task:
1. Explain the "Flow of Funds" simply.
2. Identify "Risks" (e.g. is debt service coverage tight?).
3. Assess the "Investor vs Sponsor Balance" (Fair/Greedy).

Output strictly JSON:
{
  "explanation": "string",
  "risks": ["string", "string"],
  "investorVsSponsorBalance": "string"
}
`;

export const WATERFALL_INPUT_EDUCATION_PROMPT = (inputs: any) => `
Act as a Finance Professor.
Explain the Waterfall inputs.

Inputs:
- Gross Revenue
- OpEx
- Senior Debt Service
- Preferred Return Rate
- Promote Carry

Task: Define each and explain its role in the waterfall.

Output strictly JSON:
{
  "grossRevenue": "string",
  "opex": "string",
  "debtService": "string",
  "preferredReturn": "string",
  "promoteCarry": "string"
}
`;

export const WATERFALL_OUTPUT_EDUCATION_PROMPT = (calcs: any) => `
Act as an Investment Banker.
Explain the Waterfall outputs.

- Distributable Cash: $${calcs.distributableCash}
- Sponsor Promote: $${calcs.sponsorPromote}

Task:
1. Explain "Distributable Cash".
2. Explain "Sponsor Promote" and why it exists.
3. Impact on Investor Returns.

Output strictly JSON:
{
  "distributableCashExplanation": "string",
  "sponsorPromoteExplanation": "string",
  "investorImpact": "string"
}
`;
