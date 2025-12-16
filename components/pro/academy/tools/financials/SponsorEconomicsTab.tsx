
import React, { useState, useEffect } from 'react';
import { Button } from '../../../../ui/Button';
import { 
    generateSponsorAnalysis, 
    generateSponsorInputEducation, 
    generateSponsorOutputEducation 
} from '../../../../../services/mockAiService';

interface Props {
  data: any;
  onUpdate: (data: any) => void;
  context: any;
  onNext: () => void;
}

const LOCAL_STORAGE_KEY = 'academyPro_financial';

export const SponsorEconomicsTab: React.FC<Props> = ({ data, onUpdate, context, onNext }) => {
  // 1. INPUTS
  const [inputs, setInputs] = useState({
      sponsorEquityRetention: 20,
      managementFee: 2.0,
      performanceFeeCarry: 20,
      promoteStructure: '8% Hurdle, 20% Carry'
  });

  // 2. CALCULATIONS
  const [calcs, setCalcs] = useState({
      sponsorUpside: 'High',
      feeCompetitiveness: 'Standard',
      dilutionEffect: 80
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
              if (parsed.sponsorView) {
                  if (parsed.sponsorView.inputs) setInputs(prev => ({ ...prev, ...parsed.sponsorView.inputs }));
                  if (parsed.sponsorView.aiOutput) setAiOutput(parsed.sponsorView.aiOutput);
                  if (parsed.sponsorView.inputEducation) setInputEducation(parsed.sponsorView.inputEducation);
                  if (parsed.sponsorView.outputEducation) setOutputEducation(parsed.sponsorView.outputEducation);
              }
          } catch (e) {
              console.error("Failed to load Sponsor View data", e);
          }
      }
  }, []);

  // Recalculate Logic
  useEffect(() => {
      const { sponsorEquityRetention, managementFee, performanceFeeCarry } = inputs;
      
      // Basic heuristics for visual feedback
      const dilutionEffect = 100 - sponsorEquityRetention;
      
      let feeCompetitiveness = 'Competitive';
      if (managementFee > 2.5 || performanceFeeCarry > 25) feeCompetitiveness = 'Expensive';
      if (managementFee < 1.0 && performanceFeeCarry < 15) feeCompetitiveness = 'Very Attractive';

      let sponsorUpside = 'Moderate';
      if (performanceFeeCarry > 20) sponsorUpside = 'High';
      if (performanceFeeCarry < 10) sponsorUpside = 'Low';

      setCalcs({
          sponsorUpside,
          feeCompetitiveness,
          dilutionEffect
      });
  }, [inputs]);

  const updateInput = (field: string, val: any) => {
      setInputs(prev => ({ ...prev, [field]: val }));
  };

  const handleAnalyze = async () => {
      setIsAnalyzing(true);
      
      // Parallel AI execution
      const [analysis, inEdu] = await Promise.all([
          generateSponsorAnalysis(inputs, calcs),
          generateSponsorInputEducation(inputs)
      ]);
      
      const outEdu = await generateSponsorOutputEducation(inputs, analysis);
      
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
          sponsorView: {
              inputs,
              calcs,
              aiOutput: analysis,
              inputEducation: inEdu,
              outputEducation: outEdu
          }
      };
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
      onUpdate(updated.sponsorView);
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
                    <span className="text-xl">👔</span> Sponsor Economics
                </h4>

                <div>
                    <label className="text-xs font-bold text-slate-500 uppercase block mb-2">Equity Retention (%)</label>
                    <div className="flex items-center gap-4">
                        <input 
                            type="range" min="0" max="100" step="1" 
                            value={inputs.sponsorEquityRetention} 
                            onChange={e => updateInput('sponsorEquityRetention', parseFloat(e.target.value))} 
                            className="flex-1 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-sim-blue"
                        />
                        <span className="text-lg font-bold text-sim-blue w-12 text-right">{inputs.sponsorEquityRetention}%</span>
                    </div>
                    <p className="text-[10px] text-slate-400 mt-1">Skin in the game. Investors like to see &gt;10%.</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="text-xs font-bold text-slate-500 uppercase block mb-2">Management Fee (%)</label>
                        <input 
                            type="number" step="0.1" 
                            value={inputs.managementFee} 
                            onChange={e => updateInput('managementFee', parseFloat(e.target.value))} 
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 outline-none focus:ring-2 focus:ring-sim-blue"
                        />
                    </div>
                    <div>
                        <label className="text-xs font-bold text-slate-500 uppercase block mb-2">Carried Interest (%)</label>
                        <input 
                            type="number" step="1" 
                            value={inputs.performanceFeeCarry} 
                            onChange={e => updateInput('performanceFeeCarry', parseFloat(e.target.value))} 
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 outline-none focus:ring-2 focus:ring-sim-blue"
                        />
                    </div>
                </div>

                <div>
                    <label className="text-xs font-bold text-slate-500 uppercase block mb-2">Promote Structure (Hurdle)</label>
                    <input 
                        type="text" 
                        value={inputs.promoteStructure} 
                        onChange={e => updateInput('promoteStructure', e.target.value)} 
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 outline-none focus:ring-2 focus:ring-sim-blue"
                        placeholder="e.g. 8% Preferred Return"
                    />
                    {inputEducation?.sponsorPayModel && <p className="text-[10px] text-slate-400 mt-1 italic">{inputEducation.sponsorPayModel}</p>}
                </div>
                
                {inputEducation && (
                    <div className="bg-slate-50 p-4 rounded-lg border border-slate-100 text-xs text-slate-600 space-y-2">
                        <p><strong>Market Standard:</strong> {inputEducation.marketStandards}</p>
                        <p><strong>Note:</strong> {inputEducation.fairFeesExplained}</p>
                    </div>
                )}
            </div>

            {/* RIGHT: OUTPUTS & AI */}
            <div className="flex flex-col gap-6">
                
                {/* Visualizer */}
                <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none"></div>
                    
                    <h5 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">Incentive Alignment</h5>
                    
                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <span className="text-[10px] text-slate-500 block uppercase">Fee Competitiveness</span>
                            <span className={`text-xl font-bold ${calcs.feeCompetitiveness === 'Expensive' ? 'text-red-400' : 'text-emerald-400'}`}>
                                {calcs.feeCompetitiveness}
                            </span>
                        </div>
                        <div>
                            <span className="text-[10px] text-slate-500 block uppercase">Sponsor Upside</span>
                            <span className="text-xl font-bold text-amber-400">{calcs.sponsorUpside}</span>
                        </div>
                        <div>
                            <span className="text-[10px] text-slate-500 block uppercase">Equity Dilution</span>
                            <span className="text-xl font-bold text-white">{calcs.dilutionEffect}%</span>
                        </div>
                    </div>
                </div>

                <div className="text-center">
                    <Button onClick={handleAnalyze} isLoading={isAnalyzing} className="w-full bg-sim-ai hover:bg-purple-600 text-white shadow-lg shadow-purple-500/20">
                        {isAnalyzing ? 'Checking Fairness...' : '⚖️ Run Fairness Check'}
                    </Button>
                </div>

                {/* AI Analysis Box */}
                {aiOutput && (
                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 animate-slideUp">
                        <div className="flex justify-between items-start mb-2">
                             <h5 className="text-xs font-bold text-indigo-700 uppercase">AI Verdict</h5>
                        </div>
                        <p className="text-sm text-slate-700 font-medium italic mb-4">"{aiOutput.fairnessCheck}"</p>
                        
                        <div className="grid grid-cols-2 gap-4">
                             <div className="bg-emerald-50 border border-emerald-100 p-3 rounded-lg">
                                 <span className="text-[10px] text-emerald-600 font-bold uppercase block mb-1">Strengths</span>
                                 <ul className="text-xs text-slate-600 space-y-1">
                                     {aiOutput.sponsorStrengths?.map((s: string, i: number) => <li key={i}>• {s}</li>)}
                                 </ul>
                             </div>
                             <div className="bg-amber-50 border border-amber-100 p-3 rounded-lg">
                                 <span className="text-[10px] text-amber-600 font-bold uppercase block mb-1">Weaknesses</span>
                                 <ul className="text-xs text-slate-600 space-y-1">
                                     {aiOutput.sponsorWeaknesses?.map((w: string, i: number) => <li key={i}>• {w}</li>)}
                                 </ul>
                             </div>
                        </div>

                        {outputEducation && (
                            <div className="mt-4 pt-3 border-t border-slate-200">
                                <p className="text-xs text-slate-500">
                                    <strong>Coach Tip:</strong> {outputEducation.adjustmentTips}
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
                Save & Next →
            </Button>
        </div>

    </div>
  );
};
