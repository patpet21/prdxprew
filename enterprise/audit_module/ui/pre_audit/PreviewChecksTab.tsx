
import React from 'react';
import { AuditConfigEntity } from '../../domain/audit_config.entity';
import { Button } from '../../../../../components/ui/Button';

interface Props {
  config: AuditConfigEntity;
  onNext: () => void;
}

export const PreviewChecksTab: React.FC<Props> = ({ config, onNext }) => {
  // Dynamically generating preview based on config
  const checks = [
      { id: 1, category: 'Legal', check: `Verify ${config.projectContext.jurisdiction} Entity Good Standing` },
      { id: 2, category: 'Compliance', check: `${config.scope.regulations[0] || 'General'} Investor Suitability Test` },
      { id: 3, category: 'Docs', check: `Audit ${config.documents.length} Uploaded Documents for Completeness` },
      { id: 4, category: 'Smart Contract', check: `Permission Logic vs ${config.projectContext.tokenType} Classification` },
      { id: 5, category: 'Risk', check: `Stress Test against Risk Tolerance (${config.riskTolerance.financialExposureTolerance}%)` },
  ];

  return (
    <div className="space-y-8 animate-fadeIn">
        <div className="text-center max-w-2xl mx-auto pt-8 pb-4">
            <h3 className="text-3xl font-bold text-white font-display mb-3">Ready to Audit</h3>
            <p className="text-slate-400 text-lg">
                The engine is configured. Below is a preview of the logic vectors that will be applied to your project.
            </p>
        </div>

        <div className="max-w-3xl mx-auto bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden shadow-2xl">
            <div className="bg-slate-950 px-6 py-4 border-b border-slate-800 flex justify-between items-center">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Execution Plan</span>
                <span className="text-xs text-emerald-400 font-mono">v2.4.1 Engine</span>
            </div>
            <div className="p-6 space-y-4">
                {checks.map((c, i) => (
                    <div key={c.id} className="flex items-center gap-4 p-3 rounded-xl bg-slate-800/50 border border-slate-700/50">
                        <div className="w-6 h-6 rounded-full bg-slate-700 text-slate-400 flex items-center justify-center text-xs font-bold">
                            {i + 1}
                        </div>
                        <div className="flex-1">
                            <span className="text-xs text-blue-400 font-bold uppercase tracking-wider block mb-0.5">{c.category}</span>
                            <span className="text-sm text-slate-200">{c.check}</span>
                        </div>
                        <div className="w-2 h-2 rounded-full bg-slate-600 animate-pulse"></div>
                    </div>
                ))}
                <div className="text-center text-slate-500 text-xs italic pt-4">
                    + 45 Sub-routines hidden
                </div>
            </div>
        </div>

        <div className="flex justify-center pt-8">
            <Button 
                onClick={onNext} 
                className="px-12 py-4 text-lg font-bold bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-xl shadow-emerald-900/30 transform hover:-translate-y-1 transition-all"
            >
                🚀 Initialize Audit Sequence
            </Button>
        </div>
    </div>
  );
};
