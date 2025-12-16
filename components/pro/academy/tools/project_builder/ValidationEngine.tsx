
import React, { useState } from 'react';
import { Button } from '../../../../ui/Button';
import { validateProjectStructure } from '../../../../../services/mockAiService';

export const ValidationEngine: React.FC = () => {
  const [isChecking, setIsChecking] = useState(false);
  const [report, setReport] = useState<any>(null);

  const handleValidate = async () => {
      setIsChecking(true);
      const res = await validateProjectStructure({ spv: true }); // Mock payload
      setReport(res);
      setIsChecking(false);
  };

  return (
    <div className="space-y-6">
        <div className="flex justify-between items-center">
            <h4 className="text-sm font-bold text-white uppercase tracking-widest">Project Health Check</h4>
            <Button onClick={handleValidate} isLoading={isChecking} size="sm" className="bg-indigo-600">Run Validation</Button>
        </div>

        {report ? (
            <div className="animate-slideUp space-y-4">
                <div className="p-6 bg-slate-900 rounded-xl border border-slate-800 text-center">
                    <div className="text-4xl font-bold text-white mb-1">{report.score}/100</div>
                    <div className="text-xs text-slate-500 uppercase">Integrity Score</div>
                </div>
                
                <div className="space-y-2">
                    {report.checks.map((check: any, i: number) => (
                        <div key={i} className={`p-3 rounded-lg border flex items-center justify-between ${check.status === 'pass' ? 'bg-emerald-900/20 border-emerald-500/30' : 'bg-red-900/20 border-red-500/30'}`}>
                            <span className="text-sm text-slate-300">{check.name}</span>
                            <span className={`text-xs font-bold uppercase ${check.status === 'pass' ? 'text-emerald-400' : 'text-red-400'}`}>
                                {check.status === 'pass' ? 'PASSED' : 'FAILED'}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        ) : (
            <div className="p-12 text-center text-slate-500 bg-slate-900 rounded-xl border border-slate-800 border-dashed">
                Run validation to check for missing data.
            </div>
        )}
    </div>
  );
};
