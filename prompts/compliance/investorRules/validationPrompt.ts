
export const INVESTOR_RULES_VALIDATION_PROMPT = (inputs: any) => `
ROLE: Senior Compliance Officer & Algorithmic Auditor.

TASK: Validate the Investor Configuration based STRICTLY on the provided user inputs. Do not assume any external data.

INPUT DATA:
${JSON.stringify(inputs, null, 2)}

LOGIC RULES:
1. If 'includesUSInvestors' is true AND 'regulatoryRegime' is NOT 'Reg D' (506b/c) or 'Reg A+', it is a FAIL (US investors require US exemption).
2. If 'regulatoryRegime' is 'Reg D 506(c)', 'retailCount' MUST be 0. If > 0, it is a FAIL.
3. If 'regulatoryRegime' is 'Reg S', 'includesUSInvestors' MUST be false.
4. If 'totalInvestors' > 2000 and 'regulatoryRegime' is 'Reg D 506(b)', warning about reporting requirements.
5. If 'secondaryTradingPlanned' is true, verify if 'regulatoryRegime' allows it (e.g. Reg A+ yes, Reg D restricted).

OUTPUT FORMAT:
Return strictly a JSON object:
{
  "status": "PASS" | "FAIL" | "WARNING",
  "ruleChecks": [
    { "rule": "string", "passed": boolean, "details": "string" }
  ],
  "violations": ["string", "string"],
  "fixes": ["string", "string"],
  "explanation": "string (A professional summary of the compliance status based strictly on the inputs)",
  "jurisdictionNotes": ["string"]
}
`;
