
import React, { useState } from 'react';
import { Button } from '../../../ui/Button';
import { auditService, AuditReport } from '../../../../enterprise/audit_module/services/audit_service';
import { AuditReportView } from '../../../../enterprise/audit_module/ui/AuditReportView';
import { AuditConfigEntity, INITIAL_AUDIT_CONFIG } from '../../../../enterprise/audit_module/domain/audit_config.entity';

// Import New Tabs
import { AuditInputsTab } from '../../../../enterprise/audit_module/ui/pre_audit/AuditInputsTab';
import { ComplianceScopeTab } from '../../../../enterprise/audit_module/ui/pre_audit/ComplianceScopeTab';
import { DocumentDeclarationTab } from '../../../../enterprise/audit_module/ui/pre_audit/DocumentDeclarationTab';
import { RiskAppetiteTab } from '../../../../enterprise/audit_module/ui/pre_audit/RiskAppetiteTab';
import { PreviewChecksTab } from '../../../../enterprise/audit_module/ui/pre_audit/PreviewChecksTab';

type AuditStage = 'INPUTS' | 'SCOPE' | 'DOCS' | 'RISK' | 'PREVIEW' | 'SCANNING' | 'REPORT';

export const AuditModule: React.FC = () => {
  const [stage, setStage] = useState<AuditStage>('INPUTS');
  const [config, setConfig] = useState<AuditConfigEntity>(INITIAL_AUDIT_CONFIG);
  const [report, setReport] = useState<AuditReport | null>(null);
  const [scanProgress, setScanProgress] = useState(0);
  const [scanStageText, setScanStageText] = useState('Initializing');
  const [showFullDetails, setShowFullDetails] = useState(false);

  const updateConfig = (updates: Partial<AuditConfigEntity>) => {
      setConfig(prev => ({ ...prev, ...updates }));
  };

  const handleRunScan = async () => {
    setStage('SCANNING');
    setReport(null);
    setShowFullDetails(false);
    
    const stages = ['Initializing Protocol', 'Applying Scope Rules', 'Scanning Documents', 'Calculating Risk Matrices', 'Finalizing Score'];
    
    for (let i = 0; i <= 100; i+=2) {
        setScanProgress(i);
        const stageIndex = Math.floor((i / 100) * stages.length);
        setScanStageText(stages[Math.min(stageIndex, stages.length - 1)]);
        await new Promise(r => setTimeout(r, 40));
    }

    const result = await auditService.runAuditScan(config);
    setReport(result);
    setStage('REPORT');
  };

  // --- Navigation Renderers ---
  
  // Progress Bar
  const renderProgress = () => {
      const steps = ['INPUTS', 'SCOPE', 'DOCS', 'RISK', 'PREVIEW', 'REPORT'];
      const currentIndex = steps.indexOf(stage === 'SCANNING' ? 'PREVIEW' : stage);
      const progress = ((currentIndex + 1) / steps.length) * 100;

      return (
          <div className="h-1 bg-slate-800 w-full mb-6 rounded-full overflow-hidden">
              <div className="h-full bg-blue-600 transition-all duration-500" style={{ width: `${progress}%` }}></div>
          </div>
      );
  };

  // Main Content Switch
  const renderContent = () => {
      switch(stage) {
          case 'INPUTS': return <AuditInputsTab config={config} updateConfig={updateConfig} onNext={() => setStage('SCOPE')} />;
          case 'SCOPE': return <ComplianceScopeTab config={config} updateConfig={updateConfig} onNext={() => setStage('DOCS')} />;
          case 'DOCS': return <DocumentDeclarationTab config={config} updateConfig={updateConfig} onNext={() => setStage('RISK')} />;
          case 'RISK': return <RiskAppetiteTab config={config} updateConfig={updateConfig} onNext={() => setStage('PREVIEW')} />;
          case 'PREVIEW': return <PreviewChecksTab config={config} onNext={handleRunScan} />;
          
          case 'SCANNING': 
             return (
                <div className="flex-1 flex flex-col items-center justify-center p-12 bg-slate-900/50 rounded-2xl border border-slate-800 border-dashed h-[500px]">
                    <div className="relative w-64 h-64 mb-8">
                        <div className="absolute inset-0 rounded-full border-4 border-slate-800"></div>
                        <div className="absolute inset-0 rounded-full border-4 border-t-blue-500 border-r-transparent border-b-transparent border-l-transparent animate-spin"></div>
                        <div className="absolute inset-4 rounded-full bg-slate-900 flex items-center justify-center">
                            <span className="text-4xl font-bold text-white font-mono">{scanProgress}%</span>
                        </div>
                    </div>
                    <h3 className="text-xl font-bold text-white animate-pulse mb-2">{scanStageText}...</h3>
                    <p className="text-slate-500 text-sm">Processing {config.scope.depth} Audit on {config.scope.regulations.length} Frameworks.</p>
                </div>
             );

          case 'REPORT':
             if (!report) return <div>Error loading report.</div>;
             return (
                <div className="flex-1 overflow-y-auto custom-scrollbar">
                    {showFullDetails ? (
                        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
                             <div className="flex justify-between items-center mb-4 pb-4 border-b border-slate-800">
                                 <h3 className="text-lg font-bold text-white">Full Audit Logs</h3>
                                 <button onClick={() => setShowFullDetails(false)} className="text-xs text-blue-400 hover:text-blue-300 uppercase font-bold">Close Details</button>
                             </div>
                             <pre className="text-slate-400 text-xs font-mono whitespace-pre-wrap bg-slate-950 p-4 rounded-xl border border-slate-800">
                                {`# Audit Report: ${report.timestamp}\n\n${report.summary}\n\n## Config Used\nRisk Tolerance: ${config.riskTolerance.regulatoryTolerance}\n\n## Findings\n${report.gaps.map(g => `- [${g.severity.toUpperCase()}] ${g.description}`).join('\n')}`}
                             </pre>
                        </div>
                    ) : (
                        <AuditReportView 
                            report={report} 
                            onViewFullDetails={() => setShowFullDetails(true)}
                        />
                    )}
                    <div className="flex justify-center pt-8">
                        <Button onClick={() => setStage('INPUTS')} variant="secondary" className="border-slate-700 text-slate-400">
                            Start New Audit
                        </Button>
                    </div>
                </div>
             );
      }
  };

  return (
    <div className="h-full flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center shrink-0 mb-4">
            <div>
                <h2 className="text-2xl font-bold text-white font-display">Compliance Audit Engine</h2>
                <p className="text-slate-400 text-sm">Enterprise Risk Assessment Suite</p>
            </div>
        </div>
        
        {renderProgress()}

        {/* Tabs Content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar bg-slate-950 rounded-2xl p-1">
            {renderContent()}
        </div>

    </div>
  );
};
