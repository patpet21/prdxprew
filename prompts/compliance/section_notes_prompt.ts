
import { ComplianceData } from '../../types';

export const GENERATE_COMPLIANCE_NOTES_PROMPT = (data: ComplianceData) => `
Act as a Senior Tokenization Attorney.

Review the Project Configuration:
- Framework: ${data.regFramework}
- Investor Profile: ${data.targetInvestorType}
- Blocked Jurisdictions: ${data.jurisdictionRestrictions.join(', ')}
- Ticket Size: ${data.minInvestment ? '$' + data.minInvestment : 'Not Specified'}

Task: Write a professional "Compliance Summary Note".
Include:
1. **Legal Model**: Summarize the regulatory lane.
2. **Marketing Restrictions**: Can they advertise publicly?
3. **Secondary Market**: Is there a lock-up period?
4. **Operational Requirement**: Mention Escrow or Transfer Agents if needed.

Tone: Professional, direct, advisory. Max 150 words.
Start with "Your configuration falls under..."
`;
