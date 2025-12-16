
import { ComplianceData } from '../../types';

export const GENERATE_COMPLIANCE_SUMMARY_PROMPT = (data: ComplianceData) => `
Act as a Senior Compliance Officer for Digital Assets.

User Configuration:
- Framework: ${data.regFramework}
- Investor Type: ${data.targetInvestorType || 'Not Specified'}
- Blocked Regions: ${data.jurisdictionRestrictions?.join(', ') || 'None'}

Task:
1. Identify the "Regulatory Lane" (e.g., "This setup resembles a US Reg D 506(c) private placement" or "This is a standard Offshore Offering").
2. Explain 2 critical obligations for this specific setup (e.g. "Must verify accreditation", "Cannot advertise publicly in EU").
3. If they selected "Educational/Simulation", clarify that this is a sandbox environment.

Output strictly professional text, max 3 paragraphs.
`;
