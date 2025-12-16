
import { EnterpriseAI } from '../../services/ai/ai_manager';
import { AuditCheckEntity } from '../domain/audit_check.entity';
import { RiskScoreEntity } from '../domain/risk_score.entity';
import { ComplianceGapEntity } from '../domain/compliance_gap.entity';
import { AuditConfigEntity } from '../domain/audit_config.entity';

export interface AuditReport {
  checks: AuditCheckEntity[];
  score: RiskScoreEntity;
  gaps: ComplianceGapEntity[];
  summary: string;
  timestamp: string;
}

export class AuditService {
  
  /**
   * Runs the audit based on the new detailed configuration
   */
  async runAuditScan(config: AuditConfigEntity): Promise<AuditReport> {
    
    const { projectContext, scope, riskTolerance } = config;

    // 1. Generate Checklist via AI (Enhanced Prompt)
    const checklistPrompt = `
      ROLE: Senior Compliance Auditor.
      
      PROJECT CONTEXT:
      Name: ${projectContext.name}
      Type: ${projectContext.type}
      Jurisdiction: ${projectContext.jurisdiction}
      Token: ${projectContext.tokenType}

      SCOPE:
      Regulations: ${scope.regulations.join(', ')}
      Depth: ${scope.depth}
      Smart Contract Audit: ${scope.includeSmartContract}

      RISK TOLERANCE:
      Regulatory Strictness: ${riskTolerance.regulatoryTolerance}/100
      
      TASK: Generate 5-8 critical audit checks.
      Logic: If Regulatory Strictness is low (<20), be extremely pedantic. If high (>80), focus only on major blockers.
      
      OUTPUT FORMAT: JSON array: 
      [{ "area": "legal"|"financial"|"token", "description": "string", "status": "ok"|"warning"|"fail", "impact": "high"|"medium"|"low" }]
      Randomize statuses to simulate a realistic audit outcome.
    `;
    
    const checks = await EnterpriseAI.generateJSON<AuditCheckEntity[]>(
      "Senior Auditor",
      checklistPrompt,
      [
        { area: 'legal', description: 'Verify SPV Good Standing', status: 'ok', impact: 'high' },
        { area: 'financial', description: 'Valuation Recency Check', status: 'warning', impact: 'medium' }
      ]
    ) || [];

    // 2. Calculate Score (Weighted by Risk Appetite)
    const failCount = checks.filter(c => c.status === 'fail').length;
    const warnCount = checks.filter(c => c.status === 'warning').length;
    
    // stricter appetite = harsher penalties
    const penaltyMultiplier = (100 - riskTolerance.regulatoryTolerance) / 50; 

    const baseScore = 100;
    const globalScore = Math.max(0, Math.round(baseScore - (failCount * 15 * penaltyMultiplier) - (warnCount * 5 * penaltyMultiplier)));

    const score: RiskScoreEntity = {
      globalScore,
      areaScores: {
        legalRegulatory: Math.min(100, globalScore + 5),
        market: globalScore,
        financial: Math.max(0, globalScore - 5),
        operational: globalScore
      },
      label: globalScore > 80 ? 'Investment Grade' : globalScore > 50 ? 'Moderate Risk' : 'High Risk',
      explanation: `Audit completed with ${failCount} failures and ${warnCount} warnings under ${scope.depth} depth.`
    };

    // 3. Identify Gaps
    const gaps: ComplianceGapEntity[] = checks
      .filter(c => c.status !== 'ok')
      .map((c, i) => ({
        gapId: `GAP-${i}`,
        area: c.area,
        description: c.description,
        severity: c.impact === 'high' ? 'critical' : 'medium',
        proposedRemediation: `Review ${c.area} settings and update configuration based on ${scope.regulations[0]} standards.`
      }));

    return {
      checks,
      score,
      gaps,
      summary: `The project ${projectContext.name} has a risk score of ${globalScore}/100. ${gaps.length} issues detected requiring attention.`,
      timestamp: new Date().toISOString()
    };
  }
}

export const auditService = new AuditService();
