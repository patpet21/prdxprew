
import React, { useState } from 'react';
import { Button } from '../../../../ui/Button';
import { AcademyPdfService } from '../../../../../services/academyPdfService';
import { generateComplianceNextSteps } from '../../../../../services/mockAiService';

interface Props {
  data: any;
}

export const LegalExportTab: React.FC<Props> = ({ data }) => {
  const [downloading, setDownloading] = useState(false);
  const [generatingSummary, setGeneratingSummary] = useState(false);
  const [aiNextSteps, setAiNextSteps] = useState<any>(null);

  const handleGenerateSummary = async () => {
      setGeneratingSummary(true);
      // Aggregate data for the prompt
      const contextData = {
          framework: data.regulatoryFramework,
          riskMatrix: data.riskMatrix,
          investorRules: data.investorRules,
          templates: data.templates
      };
      
      const result = await generateComplianceNextSteps(contextData);
      setAiNextSteps(result);
      setGeneratingSummary(false);
  };

  const handlePdfExport = () => {
      if (!aiNextSteps) {
          alert("Please generate the AI Summary first to complete the report.");
          return;
      }
      setDownloading(true);
      setTimeout(() => {
          AcademyPdfService.generateLegalWrapperPDF(data, aiNextSteps);
          setDownloading(false);
      }, 1000);
  };

  return (
    <div className="flex flex-col items-center justify-center h-full space-y-8 animate-fadeIn text-center max-w-4xl mx-auto">
        
        {/* Step 1: Readiness Check */}
        <div className="bg-slate-900 p-8 rounded-3xl border border-slate-800 w-full relative overflow-hidden">
             <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-500 to-emerald-500"></div>
             
             <h3 className="text-2xl font-bold text-white font-display mb-6">Blueprint Finalization</h3>
             
             <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                 <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
                     <span className="text-[10px] text-slate-500 uppercase tracking-wider block mb-1">Framework</span>
                     <span className="text-white font-bold text-sm">{data.regulatoryFramework?.aiOutput ? '✅ Ready' : '⚠️ Pending'}</span>
                 </div>
                 <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
                     <span className="text-[10px] text-slate-500 uppercase tracking-wider block mb-1">Investor Rules</span>
                     <span className="text-white font-bold text-sm">{data.investorRules?.aiOutput ? '✅ Ready' : '⚠️ Pending'}</span>
                 </div>
                 <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
                     <span className="text-[10px] text-slate-500 uppercase tracking-wider block mb-1">Risk Matrix</span>
                     <span className="text-white font-bold text-sm">{data.riskMatrix?.aiOutput ? '✅ Ready' : '⚠️ Pending'}</span>
                 </div>
                 <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
                     <span className="text-[10px] text-slate-500 uppercase tracking-wider block mb-1">Templates</span>
                     <span className="text-white font-bold text-sm">{data.templates?.generatedTemplates ? '✅ Ready' : '⚠️ Pending'}</span>
                 </div>
             </div>

             {/* Step 2: AI Summary Generation */}
             {!aiNextSteps ? (
                 <div className="text-center">
                     <p className="text-slate-400 mb-4 text-sm">
                         Consolidate all modules into a final executive summary before export.
                     </p>
                     <Button 
                        onClick={handleGenerateSummary} 
                        isLoading={generatingSummary} 
                        className="bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-3 shadow-lg shadow-indigo-500/20"
                     >
                         {generatingSummary ? 'Synthesizing Data...' : '✨ Generate Executive Summary'}
                     </Button>
                 </div>
             ) : (
                 <div className="bg-slate-950/50 p-6 rounded-xl border border-emerald-500/30 text-left animate-slideUp">
                     <div className="flex items-center gap-2 mb-3">
                         <span className="text-emerald-400 text-lg">🤖</span>
                         <h4 className="text-white font-bold text-sm">AI Executive Verdict</h4>
                     </div>
                     <p className="text-slate-300 text-sm leading-relaxed mb-4">
                         "{aiNextSteps.executiveSummary}"
                     </p>
                     
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                         <div>
                             <span className="text-[10px] font-bold text-red-400 uppercase block mb-1">Immediate Actions</span>
                             <ul className="text-xs text-slate-400 space-y-1">
                                 {aiNextSteps.immediateActions?.map((a: string, i: number) => <li key={i}>• {a}</li>)}
                             </ul>
                         </div>
                         <div>
                             <span className="text-[10px] font-bold text-blue-400 uppercase block mb-1">Long Term</span>
                             <ul className="text-xs text-slate-400 space-y-1">
                                 {aiNextSteps.longTermMaintenance?.map((a: string, i: number) => <li key={i}>• {a}</li>)}
                             </ul>
                         </div>
                     </div>
                 </div>
             )}
        </div>

        {/* Step 3: Final Export */}
        {aiNextSteps && (
            <div className="flex gap-4 animate-fadeIn">
                <Button 
                    onClick={handlePdfExport} 
                    isLoading={downloading} 
                    className="bg-emerald-600 hover:bg-emerald-500 text-white shadow-xl shadow-emerald-500/20 px-10 py-4 text-lg"
                >
                    📥 Download Compliance Blueprint (PDF)
                </Button>
            </div>
        )}
        
        <p className="text-xs text-slate-500 max-w-sm mx-auto">
            This document serves as a strategic brief for your legal counsel. It is not a substitute for formal legal advice.
        </p>
    </div>
  );
};
