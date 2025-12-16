
import { EnterpriseAI } from '../enterprise/services/ai/ai_manager';
import { RECOMMEND_JURISDICTION_PROMPT, COMPARE_COUNTRIES_PROMPT } from '../prompts/jurisdictionGuidePrompts';

export const JurisdictionGuideService = {

  async getRecommendation(prefs: any) {
    return await EnterpriseAI.generateJSON(
      "Legal Advisor",
      RECOMMEND_JURISDICTION_PROMPT(prefs),
      { 
        country: "US-DE", 
        reasoning: "Delaware offers the best balance of speed and investor protection.", 
        riskLevel: "Low" 
      }
    );
  },

  async compareCountries(c1: string, c2: string) {
    return await EnterpriseAI.generateJSON(
      "Tax Lawyer",
      COMPARE_COUNTRIES_PROMPT(c1, c2),
      {
        winner: c1,
        comparison: [
          { metric: "Setup", c1_val: "Fast", c2_val: "Slow" },
          { metric: "Cost", c1_val: "Low", c2_val: "High" }
        ],
        verdict: `${c1} is better for startups.`
      }
    );
  }
};
