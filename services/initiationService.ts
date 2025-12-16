
import { EnterpriseAI } from '../enterprise/services/ai/ai_manager';
import { REFINE_CONCEPT_PROMPT, SUGGEST_TARGET_RAISE_PROMPT } from '../prompts/initiationPrompts';

export interface ConceptRefinement {
  suggestedTitle: string;
  assetClass: string;
  professionalDescription: string;
  primaryGoal: string;
}

export interface RaiseSuggestion {
  min: number;
  max: number;
  default: number;
  reasoning: string;
}

export const InitiationService = {
  
  async refineConcept(rawInput: string): Promise<ConceptRefinement> {
    return await EnterpriseAI.generateJSON<ConceptRefinement>(
      "Deal Structuring Expert",
      REFINE_CONCEPT_PROMPT(rawInput),
      {
        suggestedTitle: "Project Alpha",
        assetClass: "Real Estate",
        professionalDescription: "A high-yield opportunity...",
        primaryGoal: "Capital Raise"
      }
    ) || {
        suggestedTitle: "",
        assetClass: "Real Estate",
        professionalDescription: rawInput,
        primaryGoal: "Capital Raise"
    };
  },

  async suggestRaise(category: string, subType: string = "General"): Promise<RaiseSuggestion> {
    return await EnterpriseAI.generateJSON<RaiseSuggestion>(
      "Financial Analyst",
      SUGGEST_TARGET_RAISE_PROMPT(category, subType),
      { min: 100000, max: 1000000, default: 500000, reasoning: "Standard market range." }
    ) || { min: 0, max: 0, default: 0, reasoning: "" };
  }
};
