
import React, { useState, useEffect } from 'react';
import { Button } from '../../../../ui/Button';
import { generateFeeStructureAnalysis } from '../../../../../services/mockAiService';

interface Props {
  onChange: (fees: any) => void;
  onNext?: () => void;
}

export const FeeStructure: React.FC<Props> = ({ onChange, onNext }) => {
  const [inputs, setInputs] = useState({
      managementFeePct: 2.0,
      acquisitionFeePct: 1.0,
      dispositionFeePct: 1.0,
      carryPct: 20.0,
      preferredReturnPct: 8.0,
      jurisdiction: 'USA',
      assetType: 'Real Estate'
  });

  const [aiOutput, setAiOutput] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
      const savedFees = localStorage.getItem('academyPro_payout');
      if (savedFees) {
          try {
              const parsed = JSON.parse(savedFees);
              if (parsed.feeStructure?.inputs) setInputs(prev => ({ ...prev, ...parsed.feeStructure.inputs }));
              if (parsed.feeStructure?.aiOutput) setAiOutput(parsed.feeStructure.aiOutput);
          } catch(e) { console.error(e); }
      }
  }, []);

  const updateInput = (field: string, val: number) => {
      setInputs(prev => ({ ...prev, [field]: val }));
  };

  const handleAnalyze = async () => {
      setIsAnalyzing(true);
      const result = await generateFeeStructureAnalysis(inputs);
      setAiOutput(result);
      setIsAnalyzing(false);
      
      const current = JSON.parse(localStorage.getItem('academyPro_payout') || '{}');
      current.feeStructure = { inputs, aiOutput: result };
      localStorage.setItem('academyPro_payout', JSON.stringify(current));
  };

  const handleSaveNext = () => {
      setIsSaving(true);
      onChange(inputs);
      const current = JSON.parse(localStorage.getItem('academyPro_payout') || '{}');
      current.feeStructure = { inputs, aiOutput };
      localStorage.setItem('academyPro_payout', JSON.stringify(current));
      
      setTimeout(() => {
          setIsSaving(false);
          if(onNext) onNext();
      }, 500);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 h-full">
        
        {/* Left: Input Configuration */}
        <div className="lg:col-span-4 space-y-10">
            <div>
                <h2 className="text-3xl font-display font-bold text-slate-900 mb-6 flex items-center gap-2">
                    <span className="text-prdx-cyan">01.</span> Fee Engineering
                </h2>
                <p className="text-slate-500 text-lg leading-relaxed">
                    Define the economic incentives. High fees reduce investor yield but align long-term management.
                </p>
            </div>

            <div className="space-y-8">
                <div className="space-y-4">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block">Upfront Fees</label>
                    <div>
                        <div className="flex justify-between text-sm font-medium text-slate-700 mb-2">
                            <span>Acquisition Fee</span>
                            <span className="text-prdx-blue font-bold">{inputs.acquisitionFeePct}%</span>
                        </div>
                        <input type="range" min="0" max="5" step="0.5" value={inputs.acquisitionFeePct} onChange={e => updateInput('acquisitionFeePct', parseFloat(e.target.value))} className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-prdx-blue" />
                    </div>
                </div>

                <div className="space-y-4">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block">Recurring Fees</label>
                    <div>
                        <div className="flex justify-between text-sm font-medium text-slate-700 mb-2">
                            <span>Management Fee (Annual)</span>
                            <span className="text-prdx-cyan font-bold">{inputs.managementFeePct}%</span>
                        </div>
                        <input type="range" min="0" max="5" step="0.1" value={inputs.managementFeePct} onChange={e => updateInput('managementFeePct', parseFloat(e.target.value))} className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-prdx-cyan" />
                    </div>
                </div>

                <div className="space-y-4">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block">Performance</label>
                    <div>
                        <div className="flex justify-between text-sm font-medium text-slate-700 mb-2">
                            <span>Preferred Return (Hurdle)</span>
                            <span className="text-prdx-gold font-bold">{inputs.preferredReturnPct}%</span>
                        </div>
                        <input type="range" min="0" max="15" step="1" value={inputs.preferredReturnPct} onChange={e => updateInput('preferredReturnPct', parseFloat(e.target.value))} className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-prdx-gold" />
                    </div>
                    <div>
                        <div className="flex justify-between text-sm font-medium text-slate-700 mb-2">
                            <span>Carried Interest (Promote)</span>
                            <span className="text-prdx-orange font-bold">{inputs.carryPct}%</span>
                        </div>
                        <input type="range" min="0" max="50" step="5" value={inputs.carryPct} onChange={e => updateInput('carryPct', parseFloat(e.target.value))} className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-prdx-orange" />
                    </div>
                </div>

                <div className="pt-8">
                    <Button onClick={handleAnalyze} isLoading={isAnalyzing} className="w-full py-4 text-lg bg-slate-900 text-white hover:bg-slate-800 shadow-xl shadow-slate-900/20">
                        Run Fairness Analysis
                    </Button>
                </div>
            </div>
        </div>

        {/* Right: Visualization & AI Output */}
        <div className="lg:col-span-8 flex flex-col justify-between pl-8 border-l border-slate-200">
            
            <div className="flex-1 flex flex-col justify-center items-center relative">
                 {!aiOutput ? (
                     <div className="text-center opacity-30">
                         <div className="text-8xl mb-4 grayscale">⚖️</div>
                         <h3 className="text-2xl font-display font-bold text-slate-900">Awaiting Input</h3>
                         <p className="text-lg">Configure the fee structure to see fairness rating.</p>
                     </div>
                 ) : (
                     <div className="w-full max-w-3xl space-y-12 animate-slideUp">
                         <div className="flex items-center justify-between">
                             <div>
                                 <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-2">Fairness Score</p>
                                 <div className={`text-8xl font-display font-bold ${aiOutput.analysis.feeFairnessScore > 75 ? 'text-prdx-cyan' : 'text-prdx-orange'}`}>
                                     {aiOutput.analysis.feeFairnessScore}
                                 </div>
                             </div>
                             <div className="text-right">
                                 <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-2">Complexity</p>
                                 <div className="text-4xl font-display font-bold text-slate-900">
                                     {aiOutput.analysis.complexityLevel}
                                 </div>
                             </div>
                         </div>

                         <div className="grid grid-cols-2 gap-8">
                             <div className="bg-prdx-blue/5 p-6 rounded-2xl border border-prdx-blue/10">
                                 <h4 className="text-lg font-bold text-prdx-blue mb-4">Professor's Insight</h4>
                                 <ul className="space-y-4">
                                     {aiOutput.education.map((pt: string, i: number) => (
                                         <li key={i} className="text-base text-slate-700 leading-relaxed pl-4 border-l-2 border-prdx-cyan">
                                             {pt}
                                         </li>
                                     ))}
                                 </ul>
                             </div>
                             <div className="bg-prdx-red/5 p-6 rounded-2xl border border-prdx-red/10">
                                 <h4 className="text-lg font-bold text-prdx-red mb-4">Risk Flags</h4>
                                 {aiOutput.analysis.redFlags?.length > 0 ? (
                                     <ul className="space-y-4">
                                         {aiOutput.analysis.redFlags.map((flag: string, i: number) => (
                                             <li key={i} className="text-base text-prdx-red leading-relaxed font-medium">
                                                 ⚠️ {flag}
                                             </li>
                                         ))}
                                     </ul>
                                 ) : (
                                     <p className="text-prdx-cyan font-medium">No critical red flags detected.</p>
                                 )}
                             </div>
                         </div>
                     </div>
                 )}
            </div>

            <div className="mt-12 flex justify-end">
                <Button onClick={handleSaveNext} disabled={isSaving} className="bg-prdx-cyan hover:bg-prdx-blue text-white px-10 py-4 text-lg shadow-xl shadow-prdx-cyan/20">
                    {isSaving ? 'Saving...' : 'Save & Continue →'}
                </Button>
            </div>

        </div>
    </div>
  );
};
