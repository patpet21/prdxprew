import React, { useState, useEffect } from 'react';
import { Button } from '../../../../ui/Button';
import { 
    generateRoiAnalysis, 
    generateRoiInputEducation, 
    generateRoiOutputEducation 
} from '../../../../../services/mockAiService';

interface Props {
  data: any;
  onUpdate: (data: any) => void;
  context: any;
  onNext: () => void;
}

const LOCAL_STORAGE_KEY = 'academyPro_financial';

export const RoiSimulatorTab: React.FC<Props> = ({ data, onUpdate, context, onNext }) => {
  // 1. INPUTS
  const [inputs, setInputs] = useState({
      incomeGrowthRate: 2.0,
      vacancyRate: 5.0,
      opexPercent: 25.0,
      exitCapRate: 5.5,
      holdingPeriodYears: 5,
      grossRevenueBase: 100000 // Default base if not provided
  });

  // 2. CALCS
  const [calcs, setCalcs] = useState({
      noiYear1: 0,
      exitValuation: 0,
      equityMultiple: 0,
      irr: 0
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
              if (parsed.roiSimulator) {
                  if (parsed.roiSimulator.inputs) setInputs(prev => ({ ...prev, ...parsed.roiSimulator.inputs }));
                  if (parsed.roiSimulator.aiOutput) setAiOutput(parsed.roiSimulator.aiOutput);
                  if (parsed.roiSimulator.inputEducation) setInputEducation(parsed.roiSimulator.inputEducation);
                  if (parsed.roiSimulator.outputEducation) setOutputEducation(parsed.roiSimulator.outputEducation);
              }
          } catch (e) {
              console.error("Failed to load ROI data", e);
          }
      } else if (context) {
          // Fallback: try to grab revenue from context/previous tabs if available
           // This is just a placeholder logic as context structure might vary
           // if (context.financials?.grossIncome) ...
      }
  }, []);

  // Recalculate Logic
  useEffect(() => {
      const { incomeGrowthRate, vacancyRate, opexPercent, exitCapRate, holdingPeriodYears, grossRevenueBase } = inputs;
      
      // 1. NOI Year 1
      const effectiveGrossIncome = grossRevenueBase * (1 - vacancyRate / 100);
      const opex = effectiveGrossIncome * (opexPercent / 100);
      const noiYear1 = effectiveGrossIncome - opex;

      // 2. Future NOI & Exit Valuation
      // Simple compounding for NOI at exit year
      const futureNoi = noiYear1 * Math.pow(1 + incomeGrowthRate / 100, holdingPeriodYears);
      const exitValuation = exitCapRate > 0 ? futureNoi / (exitCapRate / 100) : 0;

      // 3. Equity Multiple & IRR (Simplified for UI speed)
      // Assume initial equity is roughly based on valuation (e.g. 30% of entry price)
      // Entry Price estimated via Cap Rate (same as exit for simplicity if not provided)
      const entryValuation = exitCapRate > 0 ? noiYear1 / (exitCapRate / 100) : 0;
      const initialEquity = entryValuation * 0.3; // Assumption if capital stack not linked
      
      // Total Cashflow over holding period (approximate sum)
      let totalCashflow = 0;
      let currentNoi = noiYear1;
      for(let i=0; i<holdingPeriodYears; i++) {
          totalCashflow += currentNoi;
          currentNoi *= (1 + incomeGrowthRate / 100);
      }
      
      // Net Profit = (Exit Proceeds - Debt) + Accumulated Cashflow
      // Assume Debt is constant interest only for simplicity or fully paid at exit
      // Profit = (ExitVal - (EntryVal * 0.7)) + TotalCashflow - (InitialEquity) ? 
      // Simplified Multiple: (Total Returned) / Initial Equity
      // Total Returned = (Exit Valuation - Initial Debt) + Total Cashflow
      const initialDebt = entryValuation * 0.7;
      const totalReturned = (exitValuation - initialDebt) + totalCashflow;
      
      const equityMultiple = initialEquity > 0 ? totalReturned / initialEquity : 0;
      
      // Simple IRR proxy
      // CAGR of equity growth + average cash yield
      const equityGrowth = initialEquity > 0 ? Math.pow(totalReturned / initialEquity, 1/holdingPeriodYears) - 1 : 0;
      const irr = equityGrowth * 100; // rough approximation

      setCalcs({
          noiYear1: Math.round(noiYear1),
          exitValuation: Math.round(exitValuation),
          equityMultiple: parseFloat(equityMultiple.toFixed(2)),
          irr: parseFloat(irr.toFixed(2))
      });

  }, [inputs]);

  const updateInput = (field: string, val: number) => {
      setInputs(prev => ({ ...prev, [field]: val }));
  };

  const handleAnalyze = async () => {
      setIsAnalyzing(true);
      const [analysis, inEdu, outEdu] = await Promise.all([
          generateRoiAnalysis(inputs, calcs),
          generateRoiInputEducation(inputs),
          generateRoiOutputEducation(calcs)
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
          roiSimulator: {
              inputs,
              calcs,
              aiOutput: analysis,
              inputEducation: inEdu,
              outputEducation: outEdu
          }
      };
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
      onUpdate(updated.roiSimulator);
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
                    <span className="text-xl">🎛️</span> Simulation Variables
                </h4>
                
                {/* Income Growth */}
                <div>
                    <div className="flex justify-between text-xs font-bold text-slate-500 mb-2">
                        <span>Income Growth Rate</span>
                        <div className="flex items-center gap-1">
                             <input 
                                 type="number" 
                                 step="0.1"
                                 value={inputs.incomeGrowthRate}
                                 onChange={e => updateInput('incomeGrowthRate', parseFloat(e.target.value))}
                                 className="w-12 text-right bg-transparent border-b border-slate-300 focus:border-sim-blue outline-none text-sim-blue font-bold"
                             />
                             <span className="text-sim-blue">%</span>
                        </div>
                    </div>
                    <input 
                        type="range" min="0" max="10" step="0.5" 
                        value={inputs.incomeGrowthRate} 
                        onChange={e => updateInput('incomeGrowthRate', parseFloat(e.target.value))} 
                        className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-sim-blue" 
                    />
                    {inputEducation?.incomeGrowth && <p className="text-[10px] text-slate-400 mt-1 italic">{inputEducation.incomeGrowth.impact}</p>}
                </div>

                {/* Vacancy */}
                <div>
                    <div className="flex justify-between text-xs font-bold text-slate-500 mb-2">
                        <span>Vacancy Rate</span>
                        <span className="text-amber-500">{inputs.vacancyRate}%</span>
                    </div>
                    <input 
                        type="range" min="0" max="20" step="1" 
                        value={inputs.vacancyRate} 
                        onChange={e => updateInput('vacancyRate', parseFloat(e.target.value))} 
                        className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-amber-500" 
                    />
                    {inputEducation?.vacancy && <p className="text-[10px] text-slate-400 mt-1 italic">{inputEducation.vacancy.impact}</p>}
                </div>

                {/* Opex */}
                <div>
                    <div className="flex justify-between text-xs font-bold text-slate-500 mb-2">
                        <span>OpEx (% of Revenue)</span>
                        <span className="text-red-400">{inputs.opexPercent}%</span>
                    </div>
                    <input 
                        type="range" min="10" max="60" step="1" 
                        value={inputs.opexPercent} 
                        onChange={e => updateInput('opexPercent', parseFloat(e.target.value))} 
                        className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-red-400" 
                    />
                     {inputEducation?.opex && <p className="text-[10px] text-slate-400 mt-1 italic">{inputEducation.opex.impact}</p>}
                </div>

                {/* Exit Cap */}
                <div>
                    <div className="flex justify-between text-xs font-bold text-slate-500 mb-2">
                        <span>Exit Cap Rate</span>
                        <span className="text-indigo-500">{inputs.exitCapRate}%</span>
                    </div>
                    <input 
                        type="range" min="3" max="12" step="0.25" 
                        value={inputs.exitCapRate} 
                        onChange={e => updateInput('exitCapRate', parseFloat(e.target.value))} 
                        className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-500" 
                    />
                     {inputEducation?.exitCap && <p className="text-[10px] text-slate-400 mt-1 italic">{inputEducation.exitCap.impact}</p>}
                </div>

                 {/* Holding Period */}
                <div>
                    <div className="flex justify-between text-xs font-bold text-slate-500 mb-2">
                        <span>Holding Period</span>
                        <span className="text-slate-700">{inputs.holdingPeriodYears} Years</span>
                    </div>
                    <input 
                        type="range" min="1" max="15" step="1" 
                        value={inputs.holdingPeriodYears} 
                        onChange={e => updateInput('holdingPeriodYears', parseFloat(e.target.value))} 
                        className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-slate-600" 
                    />
                </div>
            </div>

            {/* RIGHT: OUTPUTS */}
            <div className="flex flex-col gap-6">
                
                {/* Result Card */}
                <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none"></div>
                    
                    <h5 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">Projections</h5>
                    
                    <div className="grid grid-cols-2 gap-y-6 gap-x-4">
                        <div>
                            <span className="text-[10px] text-slate-500 block uppercase">NOI (Year 1)</span>
                            <span className="text-xl font-mono text-emerald-400">${calcs.noiYear1.toLocaleString()}</span>
                        </div>
                        <div>
                            <span className="text-[10px] text-slate-500 block uppercase">Exit Valuation</span>
                            <span className="text-xl font-mono text-white">${calcs.exitValuation.toLocaleString()}</span>
                        </div>
                        <div>
                            <span className="text-[10px] text-slate-500 block uppercase">Equity Multiple</span>
                            <span className="text-xl font-mono text-blue-400">{calcs.equityMultiple}x</span>
                        </div>
                        <div>
                            <span className="text-[10px] text-slate-500 block uppercase">IRR (Est)</span>
                            <span className="text-xl font-mono text-amber-400">{calcs.irr}%</span>
                        </div>
                    </div>

                    {outputEducation && (
                        <div className="mt-6 pt-4 border-t border-slate-800 text-xs text-slate-400 italic">
                             💡 {outputEducation.irrInterpretation}
                        </div>
                    )}
                </div>

                <div className="text-center">
                    <Button onClick={handleAnalyze} isLoading={isAnalyzing} className="w-full bg-sim-ai hover:bg-purple-600 text-white shadow-lg shadow-purple-500/20">
                        {isAnalyzing ? 'Running Models...' : '🧠 Validate with AI'}
                    </Button>
                </div>

                {/* AI Analysis Box */}
                {aiOutput && (
                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 animate-slideUp">
                        <div className="flex justify-between items-start mb-2">
                             <h5 className="text-xs font-bold text-slate-700 uppercase">Analysis</h5>
                             <span className="text-[10px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded border border-emerald-200 font-bold">
                                 Conf: {aiOutput.valuationConfidence}%
                             </span>
                        </div>
                        <p className="text-sm text-slate-600 mb-3 italic">"{aiOutput.realismCheck}"</p>
                        
                        <div className="space-y-1">
                             {aiOutput.stressTestNotes?.map((note: string, i: number) => (
                                 <div key={i} className="flex gap-2 text-xs text-red-500 bg-red-50 p-2 rounded border border-red-100">
                                     <span>⚠️</span> {note}
                                 </div>
                             ))}
                        </div>
                        <div className="mt-3 text-xs text-slate-500">
                            <strong>Exit Risk:</strong> {aiOutput.exitRisk}
                        </div>
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