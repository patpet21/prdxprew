
import { EnterpriseAI } from '../../services/ai/ai_manager';
import { DataRoomProject } from '../domain/data_room.entity';
import { ASSET_INTELLIGENCE_PROMPT } from '../prompts/data_room/asset_intelligence.prompts';
import { FINANCIAL_NARRATIVE_PROMPT } from '../prompts/data_room/financial_narrative.prompts';
import { INVESTMENT_THESIS_PROMPT } from '../prompts/data_room/investment_thesis.prompts';
import { DATA_ROOM_AUDIT_PROMPT } from '../prompts/data_room/risk_audit.prompts';
import { GENERATE_DECK_STRUCTURE_PROMPT } from '../prompts/data_room/package_generation.prompts';

export class DataRoomService {

  async generateAssetIntelligence(asset: any): Promise<any> {
    return await EnterpriseAI.generateJSON(
      "Real Estate Analyst",
      ASSET_INTELLIGENCE_PROMPT(asset.assetType || 'Real Estate', asset.location || 'Global', asset.assetCondition || 'Standard'),
      { marketHighlights: [], technicalDescription: "" }
    );
  }

  async generateFinancialNarrative(metrics: any): Promise<string> {
    return await EnterpriseAI.generateResponse(
      "Investment Banker",
      FINANCIAL_NARRATIVE_PROMPT(metrics)
    );
  }

  async generateThesis(overview: any): Promise<any> {
    return await EnterpriseAI.generateJSON(
      "PE Partner",
      INVESTMENT_THESIS_PROMPT(overview),
      { coreThesis: "", valueDrivers: [], risks: [], mitigations: [] }
    );
  }

  async runAudit(data: DataRoomProject): Promise<any> {
    return await EnterpriseAI.generateJSON(
      "Risk Auditor",
      DATA_ROOM_AUDIT_PROMPT(data),
      { score: 80, flags: [] }
    );
  }

  async buildPackage(data: DataRoomProject): Promise<any> {
    return await EnterpriseAI.generateJSON(
      "Pitch Designer",
      GENERATE_DECK_STRUCTURE_PROMPT(data),
      { slides: [], faq: [] }
    );
  }
}

export const dataRoomService = new DataRoomService();
