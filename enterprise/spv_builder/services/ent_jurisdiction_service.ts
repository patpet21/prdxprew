
import { EnterpriseAI } from '../../services/ai/ai_manager';
import { ENT_GENERATE_JURISDICTION_SHORTLIST_PROMPT, ENT_GENERATE_SPV_MODEL_STRATEGY_PROMPT } from '../prompts/jurisdiction/ent_jurisdiction.prompts';

export class EntJurisdictionService {

  async generateShortlist(category: string, region: string, goal: string) {
    const prompt = ENT_GENERATE_JURISDICTION_SHORTLIST_PROMPT(category, region, goal);
    
    return await EnterpriseAI.generateJSON(
      "Legal Advisor",
      prompt,
      {
        recommendations: [
            { code: 'US-DE', name: 'Delaware', matchScore: 95, reason: 'Standard for capital markets.' },
            { code: 'UK', name: 'United Kingdom', matchScore: 88, reason: 'Strong legal framework.' },
            { code: 'AE-DIFC', name: 'UAE (DIFC)', matchScore: 85, reason: 'Tax efficiency.' }
        ],
        summary: "Delaware remains the gold standard for capital raising."
      }
    );
  }

  async generateSpvStrategy(category: string, geo: string, targets: string[]) {
    const prompt = ENT_GENERATE_SPV_MODEL_STRATEGY_PROMPT(category, geo, targets);

    return await EnterpriseAI.generateJSON(
      "Tax Strategist",
      prompt,
      {
        recommendedModel: "Double",
        reasoning: "A double structure separates liability and optimizes tax leakage for global investors.",
        riskFactor: "Higher setup costs."
      }
    );
  }
}

export const entJurisdictionService = new EntJurisdictionService();
