
import { v4 as uuidv4 } from 'uuid';
import { EnterpriseAI } from '../../services/ai/ai_manager';
import { SpvDesignEntity } from '../domain/spv_design.entity';
import { GovernanceRulesEntity } from '../domain/governance_rules.entity';

// Interfaces matching schemas
export interface SpvProjectContext {
  projectId: string;
  projectName: string;
  assetType: string;
  assetCountry: string;
  targetRaise: number;
  investorProfile: string;
  sponsorEquityTarget?: string;
  investorVoting?: string;
}

export interface SpvJurisdictionContext {
  code: string;
  name: string;
  preferredLegalForm?: string;
}

export interface RedFlag {
  risk: string;
  description: string;
  severity: 'High' | 'Medium' | 'Low';
}

export interface SpvWizardResult {
  spvDesign: SpvDesignEntity;
  governance: GovernanceRulesEntity;
  redFlags: RedFlag[];
  summaryMarkdown: string;
}

export class SpvService {

  /**
   * AI Step 1: Propose SPV Structure
   */
  async proposeSPV(project: SpvProjectContext, jurisdiction: SpvJurisdictionContext): Promise<SpvDesignEntity> {
    const prompt = `
      Act as a Senior Corporate Lawyer.
      Design a Special Purpose Vehicle (SPV) structure for an asset tokenization project.

      Project: ${project.projectName} (${project.assetType})
      Location: ${project.assetCountry}
      Raise: $${project.targetRaise} from ${project.investorProfile} investors
      Sponsor Goal: Retain ${project.sponsorEquityTarget || 'standard'} equity
      Investor Voice: ${project.investorVoting || 'Limited'}

      Target Jurisdiction: ${jurisdiction.name} (${jurisdiction.code})
      ${jurisdiction.preferredLegalForm ? `Preferred Form: ${jurisdiction.preferredLegalForm}` : ''}

      Task:
      1. Choose the best Legal Form.
      2. Define Share Classes (e.g. Class A for Investors, Class B for Sponsor).
      3. Define Rights (Voting, Economic) to match context.
      4. Provide Tax & Regulatory notes.
    `;

    const exampleOutput = {
      jurisdictionCode: "US-DE",
      legalForm: "Series LLC",
      entityNameSuggestion: "Project Alpha Series",
      shareClasses: [
        { className: "Class A", description: "Investor Shares", votingRights: "None", economicRights: "Pro-rata Distributions", equityPercentage: "80%" },
        { className: "Class B", description: "Sponsor Shares", votingRights: "Full Control", economicRights: "Carried Interest", equityPercentage: "20%" }
      ],
      roles: [
        { roleName: "Manager", whoHoldsIt: "Sponsor Co.", mainDuties: "Day-to-day operations" }
      ],
      basicInvestorRights: ["Information Rights", "Limited Liability"],
      taxNotes: ["Pass-through taxation"],
      regulatoryNotes: ["Reg D 506(c) compliant"]
    };

    const result = await EnterpriseAI.generateJSON<any>(
      "Corporate Structuring Architect",
      prompt,
      exampleOutput
    );

    if (!result) throw new Error("Failed to generate SPV design");

    return {
      id: uuidv4(),
      projectId: project.projectId,
      jurisdictionCode: result.jurisdictionCode,
      legalForm: result.legalForm,
      entityNameSuggestion: result.entityNameSuggestion,
      shareClasses: result.shareClasses,
      roles: result.roles,
      basicInvestorRights: result.basicInvestorRights,
      taxNotes: result.taxNotes,
      regulatoryNotes: result.regulatoryNotes,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      generatedBy: 'AI',
      status: 'draft'
    };
  }

  /**
   * AI Step 2: Generate Governance Rules
   */
  async generateGovernanceRules(spvDesign: SpvDesignEntity): Promise<GovernanceRulesEntity> {
    const prompt = `
      Act as a Governance Specialist.
      Define the governance framework for:
      Entity: ${spvDesign.entityNameSuggestion} (${spvDesign.legalForm})
      Structure: ${JSON.stringify(spvDesign.shareClasses)}
      
      Task:
      1. List Ordinary Decisions.
      2. List Extraordinary Decisions.
      3. Define Quorum Rules.
      4. Suggest Board Composition.
      5. Add Investor Protection Clauses.
    `;

    const exampleOutput = {
      ordinaryDecisions: ["Budget approval", "Vendor contracts"],
      extraordinaryDecisions: ["Sale of asset", "Liquidation"],
      quorumRules: "51% of voting shares",
      boardComposition: { totalSeats: 3, notes: "2 Sponsor appointed, 1 Independent" },
      investorProtectionClauses: ["Tag-along rights", "Information rights"]
    };

    const result = await EnterpriseAI.generateJSON<any>(
      "Governance Expert",
      prompt,
      exampleOutput
    );

    if (!result) throw new Error("Failed to generate governance rules");

    return {
      id: uuidv4(),
      spvId: spvDesign.id,
      projectId: spvDesign.projectId,
      ordinaryDecisions: result.ordinaryDecisions,
      extraordinaryDecisions: result.extraordinaryDecisions,
      quorumRules: result.quorumRules,
      boardComposition: result.boardComposition,
      investorProtectionClauses: result.investorProtectionClauses,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  }

  /**
   * AI Step 3: Check for Red Flags
   */
  async checkRedFlags(spvDesign: SpvDesignEntity, governance: GovernanceRulesEntity): Promise<RedFlag[]> {
    const prompt = `
      Act as a Legal Compliance Officer.
      Review this SPV structure for risks:
      SPV: ${JSON.stringify(spvDesign)}
      Governance: ${JSON.stringify(governance)}

      Identify "Red Flags" like misalignment, excessive sponsor control, or regulatory gaps.
    `;

    const exampleOutput = {
      risks: [
        { risk: "Excessive Sponsor Control", description: "Sponsor has 100% voting rights with only 5% equity.", severity: "High" }
      ]
    };

    const result = await EnterpriseAI.generateJSON<{ risks: RedFlag[] }>(
      "Compliance Officer",
      prompt,
      exampleOutput
    );

    return result?.risks || [];
  }

  /**
   * AI Step 4: Generate Structure Summary
   */
  async generateStructureSummary(project: SpvProjectContext, legalForm: string, jurisdiction: string): Promise<string> {
    const prompt = `
      Act as a Strategic Legal Advisor.
      Write a concise Executive Summary (max 3 sentences) explaining why a **${legalForm}** in **${jurisdiction}** is the optimal choice for this project.

      Project: ${project.projectName} (${project.assetType})
      Target Raise: $${project.targetRaise}
      Investors: ${project.investorProfile}

      Focus on: Liability protection, Tax efficiency, or Investor familiarity.
      Output: Plain text string.
    `;

    const response = await EnterpriseAI.generateResponse(
      "Legal Strategist",
      prompt
    );

    return response || `A ${legalForm} in ${jurisdiction} offers a balance of liability protection and tax efficiency suitable for ${project.assetType} projects.`;
  }

  /**
   * Orchestrator
   */
  async runSpvWizardStep(project: SpvProjectContext, jurisdiction: SpvJurisdictionContext): Promise<SpvWizardResult> {
    const spvDesign = await this.proposeSPV(project, jurisdiction);
    const governance = await this.generateGovernanceRules(spvDesign);
    const redFlags = await this.checkRedFlags(spvDesign, governance);

    const summaryMarkdown = `
# SPV Proposal: ${spvDesign.entityNameSuggestion}
**Jurisdiction**: ${spvDesign.jurisdictionCode} (${jurisdiction.name})
**Legal Form**: ${spvDesign.legalForm}

## Capital Structure
| Class | Equity | Voting | Description |
| :--- | :--- | :--- | :--- |
${spvDesign.shareClasses.map(c => `| ${c.className} | ${c.equityPercentage} | ${c.votingRights} | ${c.description} |`).join('\n')}

## Governance
- **Board**: ${governance.boardComposition.totalSeats} (${governance.boardComposition.notes})
- **Quorum**: ${governance.quorumRules}
- **Protection**: ${governance.investorProtectionClauses.join(', ')}

## Risk Assessment
${redFlags.length > 0 ? redFlags.map(r => `- **${r.severity}**: ${r.risk} - ${r.description}`).join('\n') : "No major red flags."}
    `;

    return { spvDesign, governance, redFlags, summaryMarkdown };
  }
}

export const spvService = new SpvService();
