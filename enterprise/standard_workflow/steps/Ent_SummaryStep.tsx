
import React, { useEffect, useState } from 'react';
import { StepProps, AiRiskReport } from '../../../types';
import { generateRiskReport } from '../../../services/mockAiService';

export const Ent_SummaryStep: React.FC<StepProps> = ({ data, onValidationChange }) => {
  const [report, setReport] = useState<AiRiskReport | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    onValidationChange(true);
    generateRiskReport(data).then(res => {
        // Cast the level to the expected union type as mock service might return generic string
        const safeReport = {
            ...res,
            level: res.level as 'Low' | 'Medium' | 'High'
        };
        setReport(safeReport);
        setLoading(false);
    });
  }, [data, onValidationChange]);

  if (loading) return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
          <div className="w-12 h-12 border-4 border-slate-600 border-t-emerald-500 rounded-full animate-spin"></div>
          <p className="text-slate-400 font-medium">Audit in progress...</p>
      </div>
  );

  const { projectInfo, property, compliance } = data;
  const fmt = (num?: number) => num ? `€${num.toLocaleString()}` : '-';

  return (
    <div className="space-y-8 animate-fadeIn pb-8 text-white">
      <div className="flex items-center justify-between">
         <div>
            <h2 className="text-3xl font-bold font-display text-white">Final Audit Report</h2>
            <p className="text-slate-400 text-sm mt-1">Review structure before deployment.</p>
         </div>
      </div>

      <div className="bg-slate-900 text-white rounded-2xl p-8 shadow-xl relative overflow-hidden border border-slate-800">
         <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
            <div className="relative w-32 h-32 flex items-center justify-center shrink-0">
               <svg className="w-full h-full transform -rotate-90">
                 <circle cx="64" cy="64" r="60" stroke="#334155" strokeWidth="8" fill="none" />
                 <circle cx="64" cy="64" r="60" stroke={report?.score! > 80 ? '#10b981' : '#f59e0b'} strokeWidth="8" 
                    strokeDasharray={377} strokeDashoffset={377 - (377 * (report?.score || 0)) / 100}
                    className="transition-all duration-1000 ease-out" fill="none" 
                 />
               </svg>
               <div className="absolute flex flex-col items-center">
                  <span className="text-3xl font-bold font-display">{report?.score}</span>
                  <span className="text-xs text-slate-400">/ 100</span>
               </div>
            </div>
            
            <div className="flex-1 space-y-4 w-full text-center md:text-left">
               <h3 className="text-xl font-bold mb-1"><span className={report?.level === 'Low' ? 'text-emerald-400' : 'text-amber-400'}>{report?.level} Risk</span> Assessment</h3>
               
               <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-slate-800 p-3 rounded-lg border border-slate-700">
                     <span className="text-[10px] text-slate-400 uppercase block tracking-wider">Total Value</span>
                     <span className="font-mono font-bold text-white">{fmt(property.total_value)}</span>
                  </div>
                  <div className="bg-slate-800 p-3 rounded-lg border border-slate-700">
                     <span className="text-[10px] text-slate-400 uppercase block tracking-wider">Framework</span>
                     <span className="font-mono font-bold text-white">{compliance.regFramework || 'N/A'}</span>
                  </div>
               </div>
            </div>
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
         <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
            <h3 className="font-bold text-white mb-4 flex items-center gap-2">Legal Roadmap</h3>
            <div className="space-y-4">
               {report?.legalRoadmap?.map((step, i) => (
                  <div key={i} className="flex gap-3">
                     <div className="flex flex-col items-center">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2"></div>
                        {i !== (report?.legalRoadmap.length || 0) - 1 && <div className="w-px h-full bg-slate-700 my-1"></div>}
                     </div>
                     <p className="text-sm text-slate-400 py-1">{step}</p>
                  </div>
               ))}
            </div>
         </div>

         <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
             <h3 className="font-bold text-white mb-4">Critical Attention Points</h3>
            <ul className="space-y-3">
               {report?.warnings?.map((warn, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-amber-200 bg-amber-900/20 p-2 rounded border border-amber-900/30">
                     <span className="text-amber-500 font-bold">!</span> {warn}
                  </li>
               ))}
            </ul>
         </div>
      </div>
    </div>
  );
};