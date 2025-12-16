
import React, { useState, useEffect } from 'react';
import { Button } from '../../../../ui/Button';
import { 
    generateWaterfallAnalysis, 
    generateWaterfallInputEducation, 
    generateWaterfallOutputEducation 
} from '../../../../../services/mockAiService';
import { AcademyPdfService } from '../../../../../services/academyPdfService';

interface Props {
  data: any;
  onUpdate: (data: any) => void;
  context: any;
  onNext: () => void;
}

const LOCAL_STORAGE_KEY = 'academyPro_financial';

export const WaterfallExplainerTab: React.FC<Props> = ({ data, onUpdate, context, onNext }) => {
  // 1. INPUTS
  const [inputs, setInputs] = useState({
      grossRevenue: 1000000,
      opex: 250000,
      taxes: 50000,
      seniorDebtService: 300000,
      mezzDebtService: 50000,
      preferredReturnRate: 8.0,
      promoteHurdle: 8.0,
      promoteCarry: 20.0
  });

  // 2. CALCULATIONS
  const [calcs, setCalcs] = useState({
      netAfterOps: 0,
      distributableCash: 0,
      sponsorPromote: 0,
      investorDist: 0
  });

  // 3. AI OUTPUTS
  const [aiOutput, setAiOutput] = useState<any>(null);
  const [inputEducation, setInputEducation] = useState<any>(null);
  const [outputEducation, setOutputEducation] = useState<any>(null);

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Load from Storage
  useEffect(() => {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
          try {
              const parsed = JSON.parse(saved);
              if (parsed.waterfall) {
                  if (parsed.waterfall.inputs) setInputs(prev => ({ ...prev, ...parsed.waterfall.inputs }));
                  if (parsed.waterfall.aiOutput) setAiOutput(parsed.waterfall.aiOutput);
                  if (parsed.waterfall.inputEducation) setInputEducation(parsed.waterfall.inputEducation);
                  if (parsed.waterfall.outputEducation) setOutputEducation(parsed.waterfall.outputEducation);
              }
          } catch (e) {
              console.error("Failed to load Waterfall data", e);
          }
      }
  }, []);

  // Recalculate Logic
  useEffect(() => {
      const { grossRevenue, opex, taxes, seniorDebtService, mezzDebtService, preferredReturnRate, promoteCarry } = inputs;
      
      const netAfterOps = grossRevenue - opex - taxes;
      const totalDebt = seniorDebtService + mezzDebtService;
      let distributableCash = Math.max(0, netAfterOps - totalDebt);
      
      // Assume Equity base is roughly 30% of revenue cap for simple calc if not linked
      // Or just calculate promote on distributable
      // Simplified Model: 
      // If we assume distributableCash is the profit to be split.
      // We need equity amount to calculate hurdle amount. Let's approximate equity as 5x distributable for demo if not linked.
      // Ideally link to CapitalStack.
      const estimatedEquity = distributableCash * 10; // Placeholder multiplier if no context
      const hurdleAmount = estimatedEquity * (preferredReturnRate / 100);
      
      let sponsorPromote = 0;
      if (distributableCash > hurdleAmount) {
          const excess = distributableCash - hurdleAmount;
          sponsorPromote = excess * (promoteCarry / 100);
      }
      
      const investorDist = distributableCash - sponsorPromote;

      setCalcs({
          netAfterOps,
          distributableCash,
          sponsorPromote,
          investorDist
      });
  }, [inputs]);

  const updateInput = (field: string, val: number) => {
      setInputs(prev => ({ ...prev, [field]: val }));
  };

  const handleAnalyze = async () => {
      setIsAnalyzing(true);
      
      // Parallel AI execution
      const [analysis, inEdu] = await Promise.all([
          generateWaterfallAnalysis({ ...inputs, ...calcs }),
          generateWaterfallInputEducation(inputs)
      ]);
      
      const outEdu = await generateWaterfallOutputEducation(calcs);
      
      setAiOutput(analysis);
      setInputEducation(inEdu);
      setOutputEducation(outEdu);
      setIsAnalyzing(false);
      
      saveToStorage(analysis, inEdu, outEdu);
  };

  const saveToStorage = (analysis = aiOutput, inEdu = inputEducation, outEdu = outputEducation) => {
      const existing = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || '{}');
      const updated = {
          ...existing,
          waterfall: {
              inputs,
              calcs,
              aiOutput: analysis,
              inputEducation: inEdu,
              outputEducation: outEdu
          }
      };
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
      onUpdate(updated.waterfall);
  };

  const handleSave = () => {
      setIsSaving(true);
      saveToStorage();
      setTimeout(() => setIsSaving(false), 500);
  };

  const handleSaveNext = () => {
      handleSave();
      onNext();
  };

  return (
    <div className="space-y-8 animate-fadeIn">
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* LEFT: INPUTS */}
            <div className="bg-white p-6 rounded-xl border border-sim-border shadow-sm space-y-6">
                <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-2 flex items-center gap-2">
                    <span className="text-xl">💧</span> Waterfall Inputs
                </h4>

                <div className="space-y-4">
                    <div>
                        <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Gross Revenue ($)</label>
                        <input 
                            type="number" 
                            value={inputs.grossRevenue} 
                            onChange={e => updateInput('grossRevenue', parseFloat(e.target.value))} 
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 outline-none focus:ring-2 focus:ring-sim-blue"
                        />
                         {inputEducation?.grossRevenue && <p className="text-[10px] text-slate-400 mt-1 italic">{inputEducation.grossRevenue}</p>}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-xs font-bold text-slate-500 uppercase block mb-1">OpEx ($)</label>
                            <input 
                                type="number" 
                                value={inputs.opex} 
                                onChange={e => updateInput('opex', parseFloat(e.target.value))} 
                                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 outline-none focus:ring-2 focus:ring-sim-blue"
                            />
                        </div>
                        <div>
                            <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Taxes ($)</label>
                            <input 
                                type="number" 
                                value={inputs.taxes} 
                                onChange={e => updateInput('taxes', parseFloat(e.target.value))} 
                                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 outline-none focus:ring-2 focus:ring-sim-blue"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Senior Debt ($)</label>
                            <input 
                                type="number" 
                                value={inputs.seniorDebtService} 
                                onChange={e => updateInput('seniorDebtService', parseFloat(e.target.value))} 
                                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 outline-none focus:ring-2 focus:ring-sim-blue"
                            />
                        </div>
                        <div>
                            <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Mezz Debt ($)</label>
                            <input 
                                type="number" 
                                value={inputs.mezzDebtService} 
                                onChange={e => updateInput('mezzDebtService', parseFloat(e.target.value))} 
                                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 outline-none focus:ring-2 focus:ring-sim-blue"
                            />
                        </div>
                    </div>

                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-4">
                        <h5 className="text-xs font-bold text-sim-blue uppercase">Distribution Rules</h5>
                        <div className="flex gap-4">
                            <div className="flex-1">
                                <label className="text-[10px] font-bold text-slate-400 block mb-1">Pref Return (%)</label>
                                <input 
                                    type="number" step="0.5"
                                    value={inputs.preferredReturnRate} 
                                    onChange={e => updateInput('preferredReturnRate', parseFloat(e.target.value))} 
                                    className="w-full bg-white border border-slate-200 rounded-lg p-2 outline-none"
                                />
                            </div>
                            <div className="flex-1">
                                <label className="text-[10px] font-bold text-slate-400 block mb-1">Promote Carry (%)</label>
                                <input 
                                    type="number" step="1"
                                    value={inputs.promoteCarry} 
                                    onChange={e => updateInput('promoteCarry', parseFloat(e.target.value))} 
                                    className="w-full bg-white border border-slate-200 rounded-lg p-2 outline-none"
                                />
                            </div>
                        </div>
                         {inputEducation?.promoteCarry && <p className="text-[10px] text-slate-400 mt-1 italic">{inputEducation.promoteCarry}</p>}
                    </div>
                </div>
            </div>

            {/* RIGHT: VISUAL & AI */}
            <div className="flex flex-col gap-6">
                
                {/* Flow Visualizer */}
                <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none"></div>
                    
                    <h5 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">Cashflow Waterfall</h5>
                    
                    <div className="space-y-1 text-sm font-mono relative z-10">
                        <div className="flex justify-between p-2 bg-slate-800 rounded">
                            <span>Gross Revenue</span>
                            <span className="text-white">${inputs.grossRevenue.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-center text-xs text-slate-500">↓</div>
                        <div className="flex justify-between p-2 bg-slate-800/80 rounded border-l-4 border-red-500">
                            <span>- OpEx & Taxes</span>
                            <span className="text-red-400">${(inputs.opex + inputs.taxes).toLocaleString()}</span>
                        </div>
                        <div className="flex justify-center text-xs text-slate-500">↓</div>
                        <div className="flex justify-between p-2 bg-slate-800/80 rounded border-l-4 border-orange-500">
                            <span>- Debt Service</span>
                            <span className="text-orange-400">${(inputs.seniorDebtService + inputs.mezzDebtService).toLocaleString()}</span>
                        </div>
                        <div className="flex justify-center text-xs text-slate-500">↓</div>
                        <div className="flex justify-between p-3 bg-emerald-900/30 border border-emerald-500/50 rounded shadow-lg">
                            <span className="font-bold text-emerald-400">Distributable Cash</span>
                            <span className="font-bold text-emerald-400">${calcs.distributableCash.toLocaleString()}</span>
                        </div>
                        
                        <div className="flex gap-2 mt-4 pt-4 border-t border-slate-700">
                             <div className="flex-1 bg-slate-800 p-2 rounded text-center">
                                 <span className="block text-[10px] text-slate-400 uppercase">Investors</span>
                                 <span className="block text-white font-bold">${calcs.investorDist.toLocaleString()}</span>
                             </div>
                             <div className="flex-1 bg-slate-800 p-2 rounded text-center border border-amber-500/30">
                                 <span className="block text-[10px] text-amber-400 uppercase">Promote</span>
                                 <span className="block text-amber-400 font-bold">${calcs.sponsorPromote.toLocaleString()}</span>
                             </div>
                        </div>
                    </div>
                </div>

                <div className="text-center">
                    <Button onClick={handleAnalyze} isLoading={isAnalyzing} className="w-full bg-sim-ai hover:bg-purple-600 text-white shadow-lg shadow-purple-500/20">
                        {isAnalyzing ? 'Tracing Flow...' : '🧠 Explain Logic Simply'}
                    </Button>
                </div>

                {/* AI Analysis Box */}
                {aiOutput && (
                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 animate-slideUp">
                        <div className="flex justify-between items-start mb-2">
                             <h5 className="text-xs font-bold text-indigo-700 uppercase">AI Explanation</h5>
                        </div>
                        <p className="text-sm text-slate-700 mb-3 italic">"{aiOutput.explanation}"</p>
                        
                        <div className="space-y-1 mb-3">
                             {aiOutput.risks?.map((risk: string, i: number) => (
                                 <div key={i} className="flex gap-2 text-xs text-red-500 bg-red-50 p-2 rounded border border-red-100">
                                     <span>⚠️</span> {risk}
                                 </div>
                             ))}
                        </div>
                        
                        <div className="text-xs text-slate-500 bg-slate-100 p-2 rounded border border-slate-200">
                            <strong>Balance Check:</strong> {aiOutput.investorVsSponsorBalance}
                        </div>
                        
                        {outputEducation && (
                            <div className="mt-3 pt-3 border-t border-slate-200">
                                <p className="text-xs text-slate-500">
                                    <strong>Note:</strong> {outputEducation.distributableCashExplanation}
                                </p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>

        {/* Footer Actions */}
        <div className="flex justify-end gap-4 pt-4 border-t border-slate-200/50">
            <Button onClick={handleSave} disabled={isSaving} variant="secondary" className="border-slate-300 text-slate-500">
                {isSaving ? 'Saving...' : 'Save Progress'}
            </Button>
            <Button onClick={handleSaveNext} className="bg-sim-cta hover:bg-sim-cta-hover text-white shadow-lg">
                Save & Go to Export →
            </Button>
        </div>

    </div>
  );
};
