

import { ComplianceData } from '../../types';

export const GENERATE_RISK_FLAGS_PROMPT = (data: ComplianceData) => `
Act as a Legal Risk Algorithm.

Analyze the following configuration:
- Framework: ${data.regFramework}
- Investor Type: ${data.targetInvestorType}
- Blocked Regions: ${data.jurisdictionRestrictions.join(', ')}
- Min Ticket: ${data.minInvestment || 'Not Specified'}

Task: Generate 4 short, punchy "Risk Flags" or "Restrictions" formatted as status updates.
Style: Technical, concise, "System Warning" style.

Examples of output format:
- "US investors included → Solo accredited → No retail offering"
- "EU retail allowed → MiCA rules may apply → Whitepaper required"

Output strictly a JSON array of strings: ["string", "string", "string", "string"]
`;
