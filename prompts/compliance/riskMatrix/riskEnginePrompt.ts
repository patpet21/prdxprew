
export const RISK_ENGINE_PROMPT = (inputs: any) => `
ROLE: Senior Compliance Risk Auditor & Algorithmic Scorer.

TASK: Analyze the provided configuration inputs to calculate a Compliance Risk Score and identify specific triggers.

GLOBAL RULE: Do NOT assume any risk that is not explicitly triggered by an input value. If a toggle is false, that specific risk does not exist.

INPUT DATA:
${JSON.stringify(inputs, null, 2)}

SCORING LOGIC (Guidelines):
- Base Score: 100 (Safe).
- 'allowRetailInvestors' = TRUE -> Deduct 20 points (High regulatory burden).
- 'disableGeoBlocking' = TRUE -> Deduct 15 points (Sanctions risk).
- 'noRegulatedCustodian' = TRUE -> Deduct 15 points (Asset safety risk).
- 'noKYCprovider' = TRUE -> Deduct 25 points (Critical AML failure).
- 'planSecondaryMarket' = TRUE -> Deduct 10 points (Liquidity compliance).
- 'usingProspectusExemption' = TRUE -> Add 5 points (Mitigation factor).
- 'stablecoinUsage' != None -> Deduct 5 points (MiCA/Stablecoin regs).

OUTPUT FORMAT:
Return strictly a JSON object:
{
  "totalRiskScore": number,
  "riskBreakdown": {
    "legal": ["string", "string"],
    "AML": ["string", "string"],
    "custody": ["string", "string"],
    "marketing": ["string", "string"],
    "secondaryTrading": ["string", "string"],
    "jurisdictional": ["string", "string"]
  },
  "triggeredRisks": ["string", "string"],
  "explanation": "string (A synthesis of why the score is what it is, citing specific inputs)"
}
`;
