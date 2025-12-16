
import { v4 as uuidv4 } from 'uuid';
import { EnterpriseAI } from '../../services/ai/ai_manager';
import { TokenBlueprintEntity, SupplyCurvePoint, DeFiHandoffPackage, RegulatedHandoffPackage } from '../domain/token_blueprint.entity';
import { DistributionPlanItem } from '../domain/distribution_plan.entity';
import { TokenizationPartner } from '../data/tokenization_partners';
import { GENERATE_DISTRIBUTION_MODEL_PROMPT, GENERATE_RIGHTS_TABLE_PROMPT } from '../prompts/defi/defi_tokenomics.prompts';
import { GENERATE_DEFI_HANDOFF_PROMPT } from '../prompts/defi/defi_handoff.prompts';
import { GENERATE_REGULATED_HANDOFF_PROMPT } from '../prompts/regulated/regulated_handoff.prompts';

export class TokenBlueprintService {

  async generateBlueprint(
    project: any,
    spv: any,
    valuation: any
  ): Promise<TokenBlueprintEntity> {
    
    // 1. Structure Proposal
    const structurePrompt = `
      Project: ${project.name} (${project.assetType})
      Valuation: ${valuation.valueCentral} ${valuation.currency}
      Jurisdiction: ${spv.country}
      
      Recommend: 
      1. Token Type (Security, Governance, etc)
      2. Token Standard (ERC-3643, ERC-1404, etc)
      3. Base Price
      4. Transfer Restrictions (based on jurisdiction)
      5. Risk Analysis (1 sentence)
    `;
    
    const structure = await EnterpriseAI.generateJSON<any>(
      "Token Architect", 
      structurePrompt,
      { 
        tokenType: "Security", 
        tokenStandard: "ERC-3643", 
        recommendedPrice: 1.0, 
        transferRestrictions: "Reg D 12-month lockup",
        jurisdictionRules: "US Accredited + Non-US (Reg S)",
        riskAnalysis: "Low technical risk via standard protocol. Compliance heavy.",
        reasoning: "Standard for asset backing" 
      }
    );

    // 2. Economics Generation
    const supply = Math.round((valuation.valueCentral || 1000000) / (structure?.recommendedPrice || 1));
    
    // 3. Distribution Plan (Default Template - Will be refined by dedicated step)
    const distributionPlan: DistributionPlanItem[] = [
      { category: 'Investors', percentage: 70, tokenAmount: supply * 0.7, lockupPeriodMonths: 0, vestingType: 'Immediate', description: 'Public Sale' },
      { category: 'Sponsor', percentage: 20, tokenAmount: supply * 0.2, lockupPeriodMonths: 24, vestingType: 'Linear', description: 'Skin in the game' },
      { category: 'Treasury', percentage: 10, tokenAmount: supply * 0.1, lockupPeriodMonths: 12, vestingType: 'Cliff', description: 'Future Ops' }
    ];

    // 4. Rights Generation (Basic)
    const rights = await EnterpriseAI.generateJSON<any>(
        "Legal Engineer",
        `Define rights for ${structure?.tokenType || 'Security'} backed by ${project.assetType}`,
        { economic: ["Dividends"], governance: ["No Voting"], utility: ["None"] }
    );

    // 5. Supply Curve & Valuation Ref
    const supplyCurve: SupplyCurvePoint[] = Array.from({ length: 5 }).map((_, i) => ({
        year: i + 1,
        amount: supply,
        inflationRate: 0
    }));

    return {
      id: uuidv4(),
      projectId: project.id,
      tokenName: `${project.name} Token`,
      tokenSymbol: (project.name || 'TKN').substring(0,3).toUpperCase(),
      tokenType: structure?.tokenType || 'Security',
      tokenStandard: structure?.tokenStandard || 'ERC-3643',
      totalSupply: supply,
      tokenPrice: structure?.recommendedPrice || 1,
      hardCap: valuation.valueCentral || 1000000,
      minInvestmentTicket: 1000, // Default
      currency: valuation.currency || 'USD',
      
      supplyCurve,
      valuationReference: {
        estimatedValue: valuation.valueCentral || 1000000,
        pegType: 'Soft Peg'
      },

      distributionPlan,
      economicRights: rights?.economic || [],
      governanceRights: rights?.governance || [],
      utilityRights: [],
      regulatoryFlags: [],
      
      // New Fields Populated
      transferRestrictions: structure?.transferRestrictions || "Rule 144 Restricted",
      jurisdictionRules: structure?.jurisdictionRules || "Global exclude Sanctioned",
      riskAnalysisAi: structure?.riskAnalysis || "Standard compliance profile.",
      complianceConfig: {
          identityProvider: "OnchainID",
          whitelistingMode: "Permissioned",
          countryBlocklist: ["KP", "IR", "SY"]
      },
      permissionConfig: {
          pauseable: true,
          forceTransfer: true,
          maxBalanceLimit: 0
      },

      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  }

  async refineEconomics(blueprint: TokenBlueprintEntity, changes: Partial<TokenBlueprintEntity>): Promise<TokenBlueprintEntity> {
    // Recalculate dependent fields (like HardCap)
    const updated = { ...blueprint, ...changes };
    
    if (changes.tokenPrice || changes.totalSupply) {
      updated.hardCap = updated.totalSupply * updated.tokenPrice;
      
      // Rebalance distribution token amounts if percentages are fixed
      updated.distributionPlan = updated.distributionPlan.map(d => ({
        ...d,
        tokenAmount: updated.totalSupply * (d.percentage / 100)
      }));
    }

    return updated;
  }

  async analyzeRisks(blueprint: TokenBlueprintEntity): Promise<string[]> {
    const result = await EnterpriseAI.generateJSON<{ risks: string[] }>(
        "Risk Manager",
        `Analyze tokenomics: Supply ${blueprint.totalSupply}, Price ${blueprint.tokenPrice}, Type ${blueprint.tokenType}`,
        { risks: ["Risk 1"] }
    );
    return result?.risks || [];
  }

  async generatePartnerAdvice(partner: TokenizationPartner, projectContext: any): Promise<string[]> {
    const prompt = `
      Role: Integration Specialist for ${partner.name}.
      Context: 
      - Partner: ${partner.name} (${partner.type})
      - Jurisdiction: ${projectContext.jurisdictionCode}
      - Asset: ${projectContext.assetType}
      - Partner Hints: ${partner.aiHints}

      Task: Provide 3 specific, actionable tips for integrating this project with ${partner.name}. 
      Focus on documents needed or technical configuration specific to their protocol.
    `;

    const result = await EnterpriseAI.generateJSON<{ tips: string[] }>(
      "Integration Specialist",
      prompt,
      { tips: ["Tip 1", "Tip 2", "Tip 3"] }
    );

    return result?.tips || [];
  }

  // --- NEW: Distribution Model Generator ---
  async generateDistributionModel(blueprint: TokenBlueprintEntity): Promise<DistributionPlanItem[]> {
    const prompt = GENERATE_DISTRIBUTION_MODEL_PROMPT(
        blueprint.totalSupply,
        blueprint.tokenType,
        blueprint.hardCap
    );

    const result = await EnterpriseAI.generateJSON<{ allocations: any[] }>(
        "Tokenomics Architect",
        prompt,
        { allocations: [] }
    );

    if (!result || !result.allocations) return blueprint.distributionPlan;

    // Map AI result to Entity
    return result.allocations.map(a => ({
        category: a.category,
        percentage: a.percentage,
        tokenAmount: a.tokenAmount,
        vestingType: a.vestingType,
        lockupPeriodMonths: a.cliffMonths || 0, // Mapping cliff to lockup for simplicity
        description: a.rationale
    }));
  }

  // --- NEW: Rights Generator ---
  async generateTokenRights(blueprint: TokenBlueprintEntity, jurisdiction: string): Promise<any> {
    const prompt = GENERATE_RIGHTS_TABLE_PROMPT(blueprint.tokenType, jurisdiction);

    const result = await EnterpriseAI.generateJSON<any>(
        "Digital Securities Lawyer",
        prompt,
        {
            economic_rights: [],
            governance_rights: [],
            liquidation_priority: "Pari Passu",
            redemption_rules: "None",
            transfer_restrictions: []
        }
    );

    return result;
  }

  // --- NEW: DeFi Deployment Handoff ---
  async generateDeFiHandoff(blueprint: TokenBlueprintEntity, jurisdiction: string): Promise<DeFiHandoffPackage> {
      const prompt = GENERATE_DEFI_HANDOFF_PROMPT(
          blueprint.tokenName,
          blueprint.tokenSymbol,
          blueprint.tokenStandard,
          jurisdiction
      );

      const result = await EnterpriseAI.generateJSON<any>(
          "Blockchain Architect",
          prompt,
          {
              contract_address: "0x...",
              status: "draft"
          }
      );

      if (!result) throw new Error("Failed to generate Handoff Package");

      return {
          handoff_package_id: uuidv4(),
          contract_address: result.contract_address,
          contract_abi: result.contract_abi,
          network: result.network || "Polygon Mainnet",
          token_standard: blueprint.tokenStandard,
          compliance_overlay_json: JSON.stringify(result.compliance_overlay_json || {}),
          tokenomics_json: JSON.stringify(result.tokenomics_json || {}),
          vesting_schedule_json: JSON.stringify(result.vesting_schedule_json || {}),
          distribution_plan_json: JSON.stringify(blueprint.distributionPlan || []), // Use actual blueprint data
          rights_json: JSON.stringify(result.rights_json || {}),
          deployer_wallet: result.deployer_wallet,
          audit_hash: result.audit_hash,
          status: 'deployed',
          delivery_method: 'api',
          timestamp: new Date().toISOString()
      };
  }

  // --- NEW: Regulated Provider Handoff ---
  async generateRegulatedHandoff(partner: TokenizationPartner, projectContext: any, formData: any): Promise<RegulatedHandoffPackage> {
      const prompt = GENERATE_REGULATED_HANDOFF_PROMPT(
          partner.name,
          projectContext,
          formData
      );

      const result = await EnterpriseAI.generateJSON<any>(
          "Operations Manager",
          prompt,
          {
              spv_summary: {},
              offering_terms: {},
              documents_required: []
          }
      );

      if (!result) throw new Error("Failed to generate Regulated Handoff Package");

      return {
          handoff_package_id: uuidv4(),
          provider_id: partner.id,
          spv_summary_json: JSON.stringify(result.spv_summary || {}),
          jurisdiction_summary_json: JSON.stringify(result.jurisdiction_summary || {}),
          valuation_summary_json: JSON.stringify(result.valuation_summary || {}),
          offering_terms_json: JSON.stringify(result.offering_terms || {}),
          token_blueprint_json: JSON.stringify(result.token_blueprint_partial || {}),
          kyc_rules_json: JSON.stringify(result.kyc_rules || {}),
          escrow_setup_json: JSON.stringify(result.escrow_setup || {}),
          documents_required: result.documents_required || [],
          documents_uploaded: [], // To be filled by user later
          status: 'draft',
          delivery_method: 'api',
          timestamp: new Date().toISOString()
      };
  }
}

export const tokenBlueprintService = new TokenBlueprintService();
