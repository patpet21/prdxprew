
import React, { useEffect, useState } from 'react';
import { ComplianceData } from '../../../../types';
import { generateRiskFlags } from '../../../../services/mockAiService';

interface Props {
  compliance: ComplianceData;
  updateData: (field: string, val: any) => void;
}

export const RiskFlagsSection: React.FC<Props> = ({ compliance, updateData }) => {
  const [flags, setFlags] = useState<string[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Re-analyze whenever critical fields change
  useEffect(() => {
      const analyze = async () => {
          setIsAnalyzing(true);
          const result = await generateRiskFlags(compliance);
          setFlags(result);
          setIsAnalyzing(false);
      };
      
      // Debounce slightly
      const timeout = setTimeout(analyze, 800);
      return () => clearTimeout(timeout);
  }, [compliance.regFramework, compliance.targetInvestorType, compliance.jurisdictionRestrictions, compliance.minInvestment]);

  return (
    <div className="bg-slate-900 p-8 rounded-2xl border border-slate-800 shadow-lg relative overflow-hidden h-full flex flex-col">
      <div className="absolute top-0 right-0 p-6 opacity-5 text-8xl text-white pointer-events-none">⚠️</div>
      
      <div className="flex items-center gap-3 mb-6 relative z-10">
        <div className="w-8 h-8 rounded-lg bg-orange-500 flex items-center justify-center text-slate-900 text-sm font-bold shadow-lg shadow-orange-500/20">4</div>
        <h3 className="font-bold text-white text-lg">Risk Flags & Restrictions</h3>
        {isAnalyzing && <span className="text-xs text-orange-400 animate-pulse ml-auto">Analyzing...</span>}
      </div>

      <div className="space-y-3 relative z-10 flex-1">
          {flags.length > 0 ? (
              flags.map((flag, i) => (
                  <div key={i} className="flex items-start gap-4 p-4 rounded-xl bg-slate-800/50 border border-slate-700/50 hover:bg-slate-800 transition-colors">
                      <span className="text-orange-500 mt-0.5 text-lg">🚩</span>
                      <p className="text-sm text-slate-300 font-medium leading-snug">{flag}</p>
                  </div>
              ))
          ) : (
              <div className="flex flex-col items-center justify-center h-full text-slate-600 py-8">
                  <span className="text-3xl mb-2 opacity-20">🛡️</span>
                  <p className="text-sm italic">Configure your framework to run risk detection.</p>
              </div>
          )}
      </div>
    </div>
  );
};
