
import { EnterpriseAI } from '../../services/ai/ai_manager';
import { LegalProjectData, LogicRule, LegalClause, MissingClauseFinding } from '../domain/legal_engineering.entity';
import { GENERATE_LOGIC_RULES_PROMPT, DRAFT_CLAUSE_PROMPT, ANALYZE_MISSING_CLAUSES_PROMPT } from '../prompts/legal_engineering.prompts';
import { v4 as uuidv4 } from 'uuid';

export class LegalEngineeringService {

  async generateLogicRules(context: any): Promise<LogicRule[]> {
    const result = await EnterpriseAI.generateJSON<{ rules: any[] }>(
      "Legal Engineer",
      GENERATE_LOGIC_RULES_PROMPT(context),
      { rules: [] }
    );

    return (result?.rules || []).map(r => ({
      id: uuidv4(),
      isActive: true,
      ...r
    }));
  }

  async generateClauseDraft(clauseName: string, context: any): Promise<LegalClause> {
    const result = await EnterpriseAI.generateJSON<{ standard_draft: string, friendly_variant: string }>(
      "Contract Drafter",
      DRAFT_CLAUSE_PROMPT(clauseName, context),
      { standard_draft: "Loading...", friendly_variant: "Loading..." }
    );

    return {
      id: uuidv4(),
      title: clauseName,
      content: result?.standard_draft || "Draft generation failed.",
      isAiGenerated: true,
      variants: [result?.friendly_variant || ""],
      tags: ["AI Drafted"]
    };
  }

  async findMissingClauses(currentClauses: LegalClause[]): Promise<MissingClauseFinding[]> {
    const titles = currentClauses.map(c => c.title);
    const result = await EnterpriseAI.generateJSON<{ findings: any[] }>(
      "Legal Auditor",
      ANALYZE_MISSING_CLAUSES_PROMPT(titles),
      { findings: [] }
    );

    return (result?.findings || []).map(f => ({
      id: uuidv4(),
      ...f
    }));
  }

  async generateChecklist(context: any): Promise<{ item: string; checked: boolean }[]> {
    return [
      { item: "Incorporation Certificate Verified", checked: true },
      { item: "Cap Table Matches Token Supply", checked: false },
      { item: `Governing Law set to ${context.governingLaw}`, checked: true },
      { item: "Dispute Resolution Clause defined", checked: true },
      { item: "Risk Disclosures included", checked: false }
    ];
  }
}

export const legalEngineeringService = new LegalEngineeringService();
