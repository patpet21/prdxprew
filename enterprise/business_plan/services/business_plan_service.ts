
import { v4 as uuidv4 } from 'uuid';
import { EnterpriseAI } from '../../services/ai/ai_manager';
import { BusinessPlanEntity } from '../domain/business_plan.entity';

export class BusinessPlanService {

  async generatePlan(
    project: any,
    spv: any,
    valuation: any,
    token: any
  ): Promise<BusinessPlanEntity> {
    
    // Initial skeleton generation
    const basePlan: BusinessPlanEntity = {
      id: uuidv4(),
      projectId: project?.id || 'temp',
      executiveSummary: "",
      marketAnalysis: "",
      assetAndStrategy: "",
      spvAndTokenStructure: "",
      goToMarket: "",
      operationsAndGovernance: "",
      financialPlan: "",
      riskAndMitigation: "",
      exitStrategy: "",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: 'draft',
      version: 1
    };

    return basePlan;
  }

  async generateChapter(
    chapter: keyof BusinessPlanEntity, 
    context: { project: any, spv: any, valuation: any, token: any }
  ): Promise<string> {
    
    const { project, spv, valuation, token } = context;
    
    let prompt = `
      Role: Senior Strategic Consultant.
      Task: Write the "${chapter}" section of a Business Plan for a Security Token Offering.
      
      Context:
      - Project: ${project.name} (${project.assetType})
      - Goal: ${project.goal}
      - Jurisdiction: ${spv.country} (${spv.legalForm})
      - Valuation: ${valuation.valueCentral}
      - Token: ${token.tokenSymbol} @ $${token.tokenPrice}
    `;

    // Chapter specific instructions
    switch(chapter) {
      case 'executiveSummary':
        prompt += `\nFocus on the "Hook". Summarize the opportunity, the asset quality, and the expected return (${valuation.metrics?.irr || 'N/A'} IRR). Keep it punchy.`;
        break;
      case 'marketAnalysis':
        prompt += `\nAnalyze the market trends for ${project.assetType} in ${project.location || 'the target region'}. Mention demand drivers and liquidity needs.`;
        break;
      case 'assetAndStrategy':
        prompt += `\nDescribe the asset's value creation strategy. How will management increase NOI or value? Mention renovations or operational improvements.`;
        break;
      case 'spvAndTokenStructure':
        prompt += `\nExplain the legal structure: A ${spv.legalForm} in ${spv.country}. Explain that the ${token.tokenSymbol} token represents a legal share/claim on this entity.`;
        break;
      case 'financialPlan':
        prompt += `\nDetail the revenue model. Use the valuation of ${valuation.valueCentral}. Mention projected yields and the distribution schedule.`;
        break;
      case 'operationsAndGovernance':
        prompt += `\nDescribe the management team's role vs. the token holders. Explain voting rights if any.`;
        break;
      case 'goToMarket':
        prompt += `\nOutline the distribution strategy. How will we reach ${project.targetInvestor || 'investors'}? Marketing channels and partnerships.`;
        break;
      case 'riskAndMitigation':
        prompt += `\nIdentify 3 key risks (Regulatory, Market, Execution) and provide a mitigation strategy for each. Be honest but reassuring.`;
        break;
      case 'exitStrategy':
        prompt += `\nDefine the liquidity events: Secondary market trading, Refinancing in Year 5, or Asset Sale.`;
        break;
    }

    prompt += `\n\nFormat: Markdown. Use bolding for key figures. No preamble.`;

    const content = await EnterpriseAI.generateResponse("Strategic Consultant", prompt);
    return content || `[AI Generation Failed for ${chapter}]`;
  }

  async updateChapter(plan: BusinessPlanEntity, chapter: keyof BusinessPlanEntity, newContent: string): Promise<BusinessPlanEntity> {
    return {
      ...plan,
      [chapter]: newContent,
      updatedAt: new Date().toISOString(),
      version: plan.version + 1
    };
  }
}

export const businessPlanService = new BusinessPlanService();
