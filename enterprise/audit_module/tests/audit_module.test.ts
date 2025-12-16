
import { AuditReport, auditService } from '../services/audit_service';
import { AuditConfigEntity, INITIAL_AUDIT_CONFIG } from '../domain/audit_config.entity';

declare var describe: (name: string, callback: () => void) => void;
declare var it: (name: string, callback: () => void) => void;
declare var expect: (value: any) => any;

describe('AuditModule', () => {
  
  it('should return a valid AuditReport structure', async () => {
    const mockConfig: AuditConfigEntity = {
      ...INITIAL_AUDIT_CONFIG,
      projectContext: {
        name: "Test Project",
        type: "Real Estate",
        jurisdiction: "US-DE",
        tokenType: "Security"
      }
    };

    const report: AuditReport = await auditService.runAuditScan(mockConfig);

    // 1. Check Core Structure
    expect(report).toBeDefined();
    expect(report.checks).toBeDefined();
    expect(report.score).toBeDefined();
    expect(report.gaps).toBeDefined();

    // 2. Check Score Range
    expect(report.score.globalScore).toBeGreaterThanOrEqual(0);
    expect(report.score.globalScore).toBeLessThanOrEqual(100);

    // 3. Check Area Scores
    expect(report.score.areaScores.legalRegulatory).toBeDefined();
    expect(report.score.areaScores.financial).toBeDefined();

    // 4. Check Logic Consistency
    // If there are failures, score should be < 100
    const failCount = report.checks.filter(c => c.status === 'fail').length;
    if (failCount > 0) {
        expect(report.score.globalScore).toBeLessThan(100);
    }
  });

  it('should identify gaps from failed checks', async () => {
    const mockConfig: AuditConfigEntity = {
      ...INITIAL_AUDIT_CONFIG,
      projectContext: { 
        name: "Risky Project", 
        type: "Crypto",
        jurisdiction: "Global",
        tokenType: "Utility"
      }
    };
    
    const report = await auditService.runAuditScan(mockConfig);

    const nonOkChecks = report.checks.filter(c => c.status !== 'ok');
    expect(report.gaps.length).toBe(nonOkChecks.length);
  });

});
