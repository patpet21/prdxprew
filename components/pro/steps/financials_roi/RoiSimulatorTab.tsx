
import React, { useState, useEffect } from 'react';
import { Button } from '../../../../ui/Button';
import { 
    generateRoiAnalysis, 
    generateRoiInputEducation, 
    generateRoiOutputEducation 
} from '../../../../../services/mockAiService';
import { calculateIRR } from '../../../../utils/financialUtils';

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
      grossRevenueBase: 100000, // Default base if not provided
      sponsorPromote: 20.0, // Carry %
      hurdleRate: 8.0 // Pref %
  });

  // 2. CALCS
  const [calcs, setCalcs] = useState({
      noiYear1: 0,
      exitValuation: 0,
      equityMultiple: 0,
      irr: 0,
      netProfit: 0
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
      }
  }, []);

  // Recalculate Logic with Professional Cashflow Engine
  useEffect(() => {
      const { 
          incomeGrowthRate, vacancyRate, opexPercent, 
          exitCapRate, holdingPeriodYears, grossRevenueBase,
          sponsorPromote 
      } = inputs;
      
      // --- A. Setup Year 1 ---
      const effectiveGrossIncome = grossRevenueBase * (1 - vacancyRate / 100);
      const opex = effectiveGrossIncome * (opexPercent / 100);
      const noiYear1 = effectiveGrossIncome - opex;

      // --- B. Derive Entry Valuation (Implied) ---
      // We assume Entry Cap roughly matches Exit Cap + market spread, or use 6% default if exit is aggressive
      // This estimates the Purchase Price
      const entryCap = exitCapRate + 0.5; // Entry usually higher than exit in conservative model
      const entryValuation = entryCap > 0 ? noiYear1 / (entryCap / 100) : 0;
      
      // Assume 60% LTV for debt simulation (common standard)
      const leverageRatio = 0.60;
      const initialDebt = entryValuation * leverageRatio;
      const initialEquity = entryValuation * (1 - leverageRatio);
      const interestRate = 0.06; // 6% debt cost

      // --- C. Cashflow Waterfall ---
      const cashFlows: number[] = [];
      let totalInvestorDistributions = 0;
      
      // Year 0: Investment (Negative)
      cashFlows.push(-initialEquity);

      let currentNoi = noiYear1;
      
      for(let i = 1; i <= holdingPeriodYears; i++) {
          // Annual Debt Service (Interest Only for simplicity)
          const debtService = initialDebt * interestRate;
          
          // Distributable Cash
          let annualCashflow = Math.max(0, currentNoi - debtService);

          // Year N: Exit Event
          if (i === holdingPeriodYears) {
              // Calculate Exit Sale Price based on Future NOI
              const futureNoi = currentNoi * (1 + incomeGrowthRate/100); // Forward looking NOI
              const exitVal = exitCapRate > 0 ? futureNoi / (exitCapRate / 100) : 0;
              
              // Net Sale Proceeds (Pay off debt)
              const netSaleProceeds = Math.max(0, exitVal - initialDebt);
              
              // Calculate Sponsor Promote on Exit (Waterfall Lite)
              // Profit = (Total Cashflows + Net Sale) - Initial Equity
              const totalProfit = (totalInvestorDistributions + annualCashflow + netSaleProceeds) - initialEquity;
              let promoteAmount = 0;
              
              if (totalProfit > 0) {
                  promoteAmount = totalProfit * (sponsorPromote / 100);
              }

              const investorExitProceeds = netSaleProceeds - promoteAmount;
              annualCashflow += investorExitProceeds;
              
              // Store Exit Val for display
              setCalcs(prev => ({ ...prev, exitValuation: Math.round(exitVal), netProfit: Math.round(totalProfit) }));
          }
          
          cashFlows.push(annualCashflow);
          totalInvestorDistributions += annualCashflow;
          
          // Grow NOI for next loop
          currentNoi *= (1 + incomeGrowthRate / 100);
      }
      
      // --- D. Calculate Metrics ---
      // IRR
      const irr = calculateIRR(cashFlows);
      
      // Equity Multiple
      const equityMultiple = initialEquity > 0 ? (totalInvestorDistributions / initialEquity) : 0;

      setCalcs(prev => ({
          ...prev,
          noiYear1: Math.round(noiYear1),
          equityMultiple: parseFloat(equityMultiple.toFixed(2)),
          irr: parseFloat(irr.toFixed(2))
      }));

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
                <div className="flex justify-between items-center">
                    <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                        <span className="text-xl">🎛️</span> Simulation Variables
                    </h4>
                    <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-1 rounded">5Y Hold Model</span>
                </div>
                
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

                {/* Sponsor Promote Input */}
                <div className="pt-4 border-t border-slate-100">
                    <div className="flex justify-between text-xs font-bold text-slate-500 mb-2">
                        <span>Sponsor Carry (Promote)</span>
                        <span className="text-purple-500">{inputs.sponsorPromote}%</span>
                    </div>
                    <input 
                        type="range" min="0" max="50" step="5" 
                        value={inputs.sponsorPromote} 
                        onChange={e => updateInput('sponsorPromote', parseFloat(e.target.value))} 
                        className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-purple-500" 
                    />
                    <p className="text-[10px] text-slate-400 mt-1">
                        Applied to profits on exit. Reduces Investor Net IRR.
                    </p>
                </div>
            </div>

            {/* RIGHT: OUTPUTS */}
            <div className="flex flex-col gap-6">
                
                {/* Result Card */}
                <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none"></div>
                    
                    <h5 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">Net Investor Projections</h5>
                    
                    <div className="grid grid-cols-2 gap-y-6 gap-x-4">
                        <div>
                            <span className="text-[10px] text-slate-500 block uppercase">Net IRR</span>
                            <span className="text-3xl font-mono font-bold text-emerald-400">{calcs.irr}%</span>
                        </div>
                        <div>
                            <span className="text-[10px] text-slate-500 block uppercase">Equity Multiple</span>
                            <span className="text-3xl font-mono font-bold text-blue-400">{calcs.equityMultiple}x</span>
                        </div>
                        <div>
                            <span className="text-[10px] text-slate-500 block uppercase">Exit Valuation</span>
                            <span className="text-xl font-mono text-white">${calcs.exitValuation.toLocaleString()}</span>
                        </div>
                        <div>
                            <span className="text-[10px] text-slate-500 block uppercase">NOI (Year 1)</span>
                            <span className="text-xl font-mono text-white">${calcs.noiYear1.toLocaleString()}</span>
                        </div>
                    </div>

                    <div className="mt-6 pt-4 border-t border-slate-800 flex justify-between items-center text-xs">
                         <span className="text-slate-500">Includes Debt & Promote</span>
                         {outputEducation && <span className="text-amber-400 italic">💡 {outputEducation.irrInterpretation}</span>}
                    </div>
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
