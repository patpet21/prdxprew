
import React, { useState, useEffect } from 'react';
import { Button } from '../../../../ui/Button';
import { 
    generateInvestorAnalysis, 
    generateInvestorInputEducation, 
    generateInvestorOutputEducation 
} from '../../../../../services/mockAiService';

interface Props {
  data: any;
  onUpdate: (data: any) => void;
  context: any;
  onNext: () => void;
}

const LOCAL_STORAGE_KEY = 'academyPro_financial';

export const TokenInvestorTab: React.FC<Props> = ({ data, onUpdate, context, onNext }) => {
  // 1. INPUTS
  const [inputs, setInputs] = useState({
      initialTicket: 5000,
      payoutFrequency: 'Quarterly',
      tokenNetYield: 8.5,
      expectedHoldPeriod: 5
  });

  // 2. CALCS
  const [calcs, setCalcs] = useState({
      annualPayout: 0,
      lifetimeReturns: 0,
      yieldComparison: { sp500: 10, bonds: 4.5 } // Standard benchmarks
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
              if (parsed.investorView) {
                  if (parsed.investorView.inputs) setInputs(prev => ({ ...prev, ...parsed.investorView.inputs }));
                  if (parsed.investorView.aiOutput) setAiOutput(parsed.investorView.aiOutput);
                  if (parsed.investorView.inputEducation) setInputEducation(parsed.investorView.inputEducation);
                  if (parsed.investorView.outputEducation) setOutputEducation(parsed.investorView.outputEducation);
              }
          } catch (e) {
              console.error("Failed to load Investor View data", e);
          }
      }
  }, []);

  // Recalculate Logic
  useEffect(() => {
      const { initialTicket, tokenNetYield, expectedHoldPeriod } = inputs;
      
      const annualPayout = initialTicket * (tokenNetYield / 100);
      // Simple Lifetime: (Annual * Years) + Principal Return (Assuming full exit at par)
      // Realistically exit could be higher/lower but we keep it simple for the view
      const lifetimeReturns = (annualPayout * expectedHoldPeriod) + initialTicket;

      setCalcs(prev => ({
          ...prev,
          annualPayout: parseFloat(annualPayout.toFixed(2)),
          lifetimeReturns: parseFloat(lifetimeReturns.toFixed(2))
      }));
  }, [inputs]);

  const updateInput = (field: string, val: any) => {
      setInputs(prev => ({ ...prev, [field]: val }));
  };

  const handleAnalyze = async () => {
      setIsAnalyzing(true);
      
      // Get analysis first as it is required for output education
      const analysis = await generateInvestorAnalysis(inputs, calcs);

      const [inEdu, outEdu] = await Promise.all([
          generateInvestorInputEducation(inputs),
          generateInvestorOutputEducation(inputs, analysis) // Pass analysis result if needed by output edu
      ]);
      
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
          investorView: {
              inputs,
              calcs,
              aiOutput: analysis,
              inputEducation: inEdu,
              outputEducation: outEdu
          }
      };
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
      onUpdate(updated.investorView);
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
                    <span className="text-xl">👤</span> Investor Parameters
                </h4>

                <div>
                    <label className="text-xs font-bold text-slate-500 uppercase block mb-2">Initial Investment ($)</label>
                    <input 
                        type="number" 
                        value={inputs.initialTicket} 
                        onChange={e => updateInput('initialTicket', parseFloat(e.target.value))} 
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 outline-none focus:ring-2 focus:ring-sim-blue"
                    />
                     {inputEducation?.smallVsInstitutional && <p className="text-[10px] text-slate-400 mt-1 italic">{inputEducation.smallVsInstitutional}</p>}
                </div>

                <div>
                    <label className="text-xs font-bold text-slate-500 uppercase block mb-2">Payout Frequency</label>
                    <select 
                        value={inputs.payoutFrequency} 
                        onChange={e => updateInput('payoutFrequency', e.target.value)} 
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 outline-none focus:ring-2 focus:ring-sim-blue"
                    >
                        <option>Monthly</option>
                        <option>Quarterly</option>
                        <option>Semi-annual</option>
                        <option>Annual</option>
                    </select>
                    {inputEducation?.frequencyTrust && <p className="text-[10px] text-slate-400 mt-1 italic">{inputEducation.frequencyTrust}</p>}
                </div>

                <div>
                    <label className="text-xs font-bold text-slate-500 uppercase block mb-2">Net Yield (%)</label>
                    <input 
                        type="number" step="0.1" 
                        value={inputs.tokenNetYield} 
                        onChange={e => updateInput('tokenNetYield', parseFloat(e.target.value))} 
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 outline-none focus:ring-2 focus:ring-sim-blue"
                    />
                    {inputEducation?.yieldRealism && <p className="text-[10px] text-slate-400 mt-1 italic">{inputEducation.yieldRealism}</p>}
                </div>

                <div>
                    <label className="text-xs font-bold text-slate-500 uppercase block mb-2">Hold Period (Years)</label>
                    <input 
                        type="range" min="1" max="10" step="1" 
                        value={inputs.expectedHoldPeriod} 
                        onChange={e => updateInput('expectedHoldPeriod', parseFloat(e.target.value))} 
                        className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-sim-blue"
                    />
                    <div className="text-right text-xs font-bold text-sim-blue mt-1">{inputs.expectedHoldPeriod} Years</div>
                </div>

            </div>

            {/* RIGHT: OUTPUTS & AI */}
            <div className="flex flex-col gap-6">
                
                {/* Visualizer Card */}
                <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none"></div>
                    
                    <h5 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">Return Simulation</h5>
                    
                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <span className="text-[10px] text-slate-500 block uppercase">Annual Payout</span>
                            <span className="text-2xl font-mono text-emerald-400">${calcs.annualPayout.toLocaleString()}</span>
                        </div>
                        <div>
                            <span className="text-[10px] text-slate-500 block uppercase">Lifetime Total</span>
                            <span className="text-2xl font-mono text-white">${calcs.lifetimeReturns.toLocaleString()}</span>
                        </div>
                    </div>

                    <div className="mt-6 pt-4 border-t border-slate-800">
                         <div className="flex justify-between items-center text-xs mb-2">
                             <span className="text-slate-500">Yield vs S&P 500 ({calcs.yieldComparison.sp500}%)</span>
                             <span className={inputs.tokenNetYield > calcs.yieldComparison.sp500 ? "text-emerald-400 font-bold" : "text-slate-400"}>
                                 {inputs.tokenNetYield > calcs.yieldComparison.sp500 ? "Outperforming" : "Lagging"}
                             </span>
                         </div>
                         <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                             <div className="h-full bg-blue-500" style={{ width: `${Math.min(100, (inputs.tokenNetYield / 15) * 100)}%` }}></div>
                         </div>
                    </div>
                </div>

                <div className="text-center">
                    <Button onClick={handleAnalyze} isLoading={isAnalyzing} className="w-full bg-sim-ai hover:bg-purple-600 text-white shadow-lg shadow-purple-500/20">
                        {isAnalyzing ? 'Profiling Persona...' : '🧠 Analyze Investor Fit'}
                    </Button>
                </div>

                {/* AI Analysis */}
                {aiOutput && (
                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 animate-slideUp">
                        <div className="flex justify-between items-start mb-3">
                             <h5 className="text-xs font-bold text-slate-700 uppercase">AI Persona Match</h5>
                             <span className="text-[10px] bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded border border-indigo-200 font-bold">
                                 {aiOutput.tokenPositioning}
                             </span>
                        </div>
                        
                        <div className="flex flex-wrap gap-2 mb-4">
                            {aiOutput.investorPersonaFit?.map((p: string, i: number) => (
                                <span key={i} className="text-xs bg-white border border-slate-200 px-2 py-1 rounded text-slate-600 shadow-sm">{p}</span>
                            ))}
                        </div>

                        <div className="space-y-2">
                             <div className="text-xs text-slate-600 bg-white p-3 rounded border border-slate-200">
                                 <strong>Strategy:</strong> {aiOutput.messagingStrategy?.[0]}
                             </div>
                             <div className="text-xs text-red-500 bg-red-50 p-3 rounded border border-red-100">
                                 <strong>Risk Perception:</strong> {aiOutput.riskPerception?.[0]}
                             </div>
                        </div>

                        {outputEducation && (
                            <div className="mt-4 pt-3 border-t border-slate-200 text-xs text-slate-500 italic">
                                " {outputEducation.pitchStrategy} "
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
                Save & Next →
            </Button>
        </div>

    </div>
  );
};
