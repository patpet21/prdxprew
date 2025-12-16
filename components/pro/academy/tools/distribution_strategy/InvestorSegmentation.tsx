
import React, { useState, useEffect } from 'react';
import { Button } from '../../../../ui/Button';
import { generateDistributionAnalysis } from '../../../../../services/mockAiService';

interface Props {
  onChange: (data: any) => void;
}

export const InvestorSegmentation: React.FC<Props> = ({ onChange }) => {
  const [inputs, setInputs] = useState({
      assetType: 'Real Estate',
      minTicket: 1000,
      tokenModel: 'Equity',
      jurisdiction: 'USA',
      projectType: 'Capital Raise',
      riskProfile: 'Medium',
      targetRaise: 5000000
  });

  const [aiResult, setAiResult] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
      // Load context from global state if available
      const projectContext = JSON.parse(localStorage.getItem('pdx_simulator_state') || '{}');
      if (projectContext.projectInfo) {
          setInputs(prev => ({
              ...prev,
              assetType: projectContext.projectInfo.assetClass || 'Real Estate',
              tokenModel: projectContext.proContext?.tokenModel || 'Equity',
              jurisdiction: projectContext.jurisdiction?.country || 'USA',
              targetRaise: projectContext.projectInfo.targetRaiseAmount || 5000000
          }));
      }

      const saved = localStorage.getItem('academyPro_distribution');
      if (saved) {
          try {
              const parsed = JSON.parse(saved);
              if (parsed.investorPersona) {
                  if (parsed.investorPersona.inputs) setInputs(prev => ({ ...prev, ...parsed.investorPersona.inputs }));
                  if (parsed.investorPersona.aiOutput) setAiResult(parsed.investorPersona.aiOutput);
              }
          } catch (e) { console.error(e); }
      }
  }, []);

  const handleChange = (field: string, val: any) => {
      setInputs(prev => ({ ...prev, [field]: val }));
  };

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    const result = await generateDistributionAnalysis(inputs);
    setAiResult(result);
    setIsAnalyzing(false);
    handleSave(result);
  };

  const handleSave = (result = aiResult) => {
      const current = JSON.parse(localStorage.getItem('academyPro_distribution') || '{}');
      current.investorPersona = { inputs, aiOutput: result };
      localStorage.setItem('academyPro_distribution', JSON.stringify(current));
      onChange(result); 
  };

  return (
    <div className="space-y-8 animate-fadeIn">
       <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
           <div className="flex justify-between items-center mb-6">
               <h4 className="text-sm font-bold text-teal-400 uppercase tracking-widest flex items-center gap-2">
                   <span className="text-xl">🎯</span> Target Audience Definition
               </h4>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
               <div>
                   <label className="text-xs text-slate-500 block mb-2 font-bold uppercase">Asset Class</label>
                   <select 
                     value={inputs.assetType} 
                     onChange={e => handleChange('assetType', e.target.value)}
                     className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-white outline-none focus:border-teal-500"
                   >
                       <option>Real Estate</option>
                       <option>Company Equity</option>
                       <option>Debt</option>
                       <option>Art / Collectible</option>
                       <option>Funds</option>
                   </select>
               </div>
               <div>
                   <label className="text-xs text-slate-500 block mb-2 font-bold uppercase">Token Model</label>
                   <select 
                     value={inputs.tokenModel} 
                     onChange={e => handleChange('tokenModel', e.target.value)}
                     className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-white outline-none focus:border-teal-500"
                   >
                       <option>Equity</option>
                       <option>Revenue Share</option>
                       <option>Debt</option>
                       <option>Utility</option>
                   </select>
               </div>
               <div>
                   <label className="text-xs text-slate-500 block mb-2 font-bold uppercase">Risk Profile</label>
                   <select 
                     value={inputs.riskProfile} 
                     onChange={e => handleChange('riskProfile', e.target.value)}
                     className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-white outline-none focus:border-teal-500"
                   >
                       <option>Low (Conservative)</option>
                       <option>Medium (Balanced)</option>
                       <option>High (Speculative)</option>
                   </select>
               </div>
               <div>
                   <label className="text-xs text-slate-500 block mb-2 font-bold uppercase">Min Ticket ($)</label>
                   <input 
                     type="number"
                     value={inputs.minTicket} 
                     onChange={e => handleChange('minTicket', parseFloat(e.target.value))}
                     className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-white outline-none focus:border-teal-500"
                   />
               </div>
               <div>
                   <label className="text-xs text-slate-500 block mb-2 font-bold uppercase">Target Raise ($)</label>
                   <input 
                     type="number"
                     value={inputs.targetRaise} 
                     onChange={e => handleChange('targetRaise', parseFloat(e.target.value))}
                     className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-white outline-none focus:border-teal-500"
                   />
               </div>
               <div>
                   <label className="text-xs text-slate-500 block mb-2 font-bold uppercase">Jurisdiction</label>
                   <input 
                     type="text"
                     value={inputs.jurisdiction} 
                     onChange={e => handleChange('jurisdiction', e.target.value)}
                     className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-white outline-none focus:border-teal-500"
                   />
               </div>
           </div>

           <div className="mt-8 flex justify-center">
               <Button 
                   onClick={handleAnalyze} 
                   isLoading={isAnalyzing} 
                   className="bg-teal-600 hover:bg-teal-500 text-white shadow-lg shadow-teal-900/20 px-8 py-3 font-bold"
               >
                   {isAnalyzing ? 'Mapping Psychology...' : '🧠 Analyze Investor Fit'}
               </Button>
           </div>
       </div>

       {aiResult && (
           <div className="animate-slideUp space-y-8">
               
               <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                   <h4 className="text-sm font-bold text-indigo-900 uppercase tracking-widest mb-4 flex items-center gap-2">
                       <span className="text-xl">🎓</span> Professor's Insight
                   </h4>
                   <ul className="space-y-3">
                       {aiResult.education?.map((pt: string, i: number) => (
                           <li key={i} className="flex items-start gap-3 text-sm text-slate-600 leading-relaxed">
                               <span className="text-teal-500 font-bold text-lg">•</span>
                               {pt}
                           </li>
                       ))}
                   </ul>
                   <div className="mt-4 pt-4 border-t border-slate-100">
                       <p className="text-xs text-slate-500 italic">
                           <strong>Why this matters:</strong> {aiResult.reasoningWhyThisStepExists}
                       </p>
                   </div>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                   {aiResult.personas?.map((persona: any, i: number) => (
                       <div key={i} className="bg-slate-800 p-6 rounded-2xl border border-slate-700 flex flex-col h-full hover:border-teal-500/50 transition-colors">
                           <div className="flex items-center gap-3 mb-4">
                               <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold bg-slate-700 text-white`}>
                                   {i + 1}
                               </div>
                               <h5 className="font-bold text-white text-lg leading-tight">{persona.name}</h5>
                           </div>
                           
                           <div className="space-y-4 flex-1">
                               <div className="bg-slate-900/50 p-3 rounded-lg border border-slate-600/30">
                                   <p className="text-[10px] text-teal-400 uppercase font-bold mb-1">Motivation</p>
                                   <p className="text-xs text-slate-300">{persona.motivation}</p>
                               </div>
                               <div>
                                   <p className="text-[10px] text-slate-500 uppercase font-bold mb-1">Triggers</p>
                                   <p className="text-xs text-slate-400 italic">"{persona.triggers}"</p>
                               </div>
                           </div>
                       </div>
                   ))}
               </div>

               <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 flex flex-col items-center justify-center text-center relative overflow-hidden">
                   <h5 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Market Fit Score</h5>
                   <div className={`text-6xl font-display font-bold mb-2 ${aiResult.personaFitScore > 80 ? 'text-emerald-400' : 'text-amber-400'}`}>
                       {aiResult.personaFitScore}
                   </div>
                   <span className="text-xs bg-slate-800 px-3 py-1 rounded-full text-slate-300 border border-slate-700">
                       {aiResult.personaFitScore > 80 ? 'High Alignment' : 'Potential Friction'}
                   </span>
               </div>

           </div>
       )}
    </div>
  );
};
