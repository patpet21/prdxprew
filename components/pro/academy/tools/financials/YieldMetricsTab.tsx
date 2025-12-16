
import React, { useState, useEffect } from 'react';
import { Button } from '../../../../ui/Button';
import { Input } from '../../../../ui/Input';
import { 
    generateFinancialYieldAnalysis, 
    generateYieldInputEducation, 
    generateYieldOutputEducation 
} from '../../../../../services/mockAiService';

interface Props {
  data: any;
  onUpdate: (data: any) => void;
  context: any; // Contains the full simulator state if needed
  onNext: () => void;
}

const LOCAL_STORAGE_KEY = 'academyPro_financial';

export const YieldMetricsTab: React.FC<Props> = ({ data, onUpdate, context, onNext }) => {
  // State for Inputs
  const [inputs, setInputs] = useState({
      totalEquityInvestment: 1000000, // Default or loaded from context
      grossIncomeAnnual: 150000,
      operatingExpensesAnnual: 40000,
      debtServiceAnnual: 30000,
      tokenYieldTarget: 8.0,
      appreciationRateLow: 1.0,
      appreciationRateBase: 3.0,
      appreciationRateHigh: 5.0
  });

  // State for Calculations
  const [calcs, setCalcs] = useState({
      base: { coc: 0, irr: 0 },
      conservative: { coc: 0, irr: 0 },
      optimistic: { coc: 0, irr: 0 }
  });

  // State for AI Results
  const [aiOutput, setAiOutput] = useState<any>(null);
  const [inputEducation, setInputEducation] = useState<any>(null);
  const [outputEducation, setOutputEducation] = useState<any>(null);
  
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Load Initial Data
  useEffect(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    let loadedInputs = {};
    
    if (saved) {
        try {
            const parsed = JSON.parse(saved);
            if (parsed.yieldMetrics) {
                if (parsed.yieldMetrics.inputs) loadedInputs = parsed.yieldMetrics.inputs;
                if (parsed.yieldMetrics.aiOutput) setAiOutput(parsed.yieldMetrics.aiOutput);
                if (parsed.yieldMetrics.inputEducation) setInputEducation(parsed.yieldMetrics.inputEducation);
                if (parsed.yieldMetrics.outputEducation) setOutputEducation(parsed.yieldMetrics.outputEducation);
            }
        } catch (e) {
            console.error("Failed to load yield data", e);
        }
    }

    setInputs(prev => ({ ...prev, ...loadedInputs }));
  }, []);

  // Real-time Calculation Effect
  useEffect(() => {
    const { 
        grossIncomeAnnual, operatingExpensesAnnual, debtServiceAnnual, totalEquityInvestment,
        appreciationRateLow, appreciationRateBase, appreciationRateHigh 
    } = inputs;

    const netCashFlow = grossIncomeAnnual - operatingExpensesAnnual - debtServiceAnnual;
    const coc = totalEquityInvestment > 0 ? (netCashFlow / totalEquityInvestment) * 100 : 0;

    // Simple IRR Proxy: CoC + Appreciation
    const calcIrr = (appreciation: number) => coc + appreciation;

    const newCalcs = {
        base: { coc: parseFloat(coc.toFixed(2)), irr: parseFloat(calcIrr(appreciationRateBase).toFixed(2)) },
        conservative: { coc: parseFloat((coc * 0.8).toFixed(2)), irr: parseFloat(calcIrr(appreciationRateLow).toFixed(2)) },
        optimistic: { coc: parseFloat((coc * 1.1).toFixed(2)), irr: parseFloat(calcIrr(appreciationRateHigh).toFixed(2)) }
    };
    
    setCalcs(newCalcs);
    // Sync calcs to parent immediately for seamless flow if needed, 
    // though usually better to sync on save. We'll stick to save.
  }, [inputs]);

  const handleChange = (field: string, val: number) => {
      setInputs(prev => ({ ...prev, [field]: val }));
  };

  const handleAnalyze = async () => {
      setIsAnalyzing(true);
      const [analysis, inEdu, outEdu] = await Promise.all([
          generateFinancialYieldAnalysis(inputs, calcs),
          generateYieldInputEducation(inputs),
          generateYieldOutputEducation(inputs, calcs)
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
          yieldMetrics: {
              inputs,
              calcs,
              aiOutput: analysis,
              inputEducation: inEdu,
              outputEducation: outEdu
          }
      };
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
      onUpdate(updated.yieldMetrics);
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
        
        {/* INPUTS */}
        <div className="bg-white p-6 rounded-xl border border-sim-border shadow-sm">
            <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-6 flex items-center gap-2">
                <span className="text-xl">📊</span> Financial Inputs
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                 <div>
                    <label className="text-xs font-bold text-slate-500 uppercase block mb-2">Gross Income (Annual)</label>
                    <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">$</span>
                        <input 
                            type="number" 
                            value={inputs.grossIncomeAnnual} 
                            onChange={(e) => handleChange('grossIncomeAnnual', parseFloat(e.target.value))}
                            className="w-full pl-8 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                        />
                    </div>
                </div>
                 <div>
                    <label className="text-xs font-bold text-slate-500 uppercase block mb-2">Operating Expenses</label>
                    <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">$</span>
                        <input 
                            type="number" 
                            value={inputs.operatingExpensesAnnual} 
                            onChange={(e) => handleChange('operatingExpensesAnnual', parseFloat(e.target.value))}
                            className="w-full pl-8 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
                        />
                    </div>
                </div>
                 <div>
                    <label className="text-xs font-bold text-slate-500 uppercase block mb-2">Debt Service</label>
                    <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">$</span>
                        <input 
                            type="number" 
                            value={inputs.debtServiceAnnual} 
                            onChange={(e) => handleChange('debtServiceAnnual', parseFloat(e.target.value))}
                            className="w-full pl-8 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
                        />
                    </div>
                </div>
                <div>
                    <label className="text-xs font-bold text-slate-500 uppercase block mb-2">Total Equity Investment</label>
                    <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">$</span>
                        <input 
                            type="number" 
                            value={inputs.totalEquityInvestment} 
                            onChange={(e) => handleChange('totalEquityInvestment', parseFloat(e.target.value))}
                            className="w-full pl-8 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-slate-50"
                        />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-4 border-t border-slate-100">
                <div>
                    <label className="text-xs font-bold text-slate-400 block mb-1">Target Yield</label>
                    <input 
                        type="number" step="0.1"
                        value={inputs.tokenYieldTarget} onChange={e => handleChange('tokenYieldTarget', parseFloat(e.target.value))}
                        className="w-full p-2 border rounded text-sm text-center"
                    />
                </div>
                <div>
                    <label className="text-xs font-bold text-slate-400 block mb-1">Appr. Low</label>
                    <input 
                        type="number" step="0.1"
                        value={inputs.appreciationRateLow} onChange={e => handleChange('appreciationRateLow', parseFloat(e.target.value))}
                        className="w-full p-2 border rounded text-sm text-center"
                    />
                </div>
                <div>
                    <label className="text-xs font-bold text-slate-400 block mb-1">Appr. Base</label>
                    <input 
                        type="number" step="0.1"
                        value={inputs.appreciationRateBase} onChange={e => handleChange('appreciationRateBase', parseFloat(e.target.value))}
                        className="w-full p-2 border rounded text-sm text-center"
                    />
                </div>
                <div>
                    <label className="text-xs font-bold text-slate-400 block mb-1">Appr. High</label>
                    <input 
                        type="number" step="0.1"
                        value={inputs.appreciationRateHigh} onChange={e => handleChange('appreciationRateHigh', parseFloat(e.target.value))}
                        className="w-full p-2 border rounded text-sm text-center"
                    />
                </div>
            </div>
        </div>

        {/* OUTPUT: 3 SCENARIOS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-xl border border-sim-border text-center shadow-sm opacity-80">
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Conservative</h4>
                <div className="text-3xl font-mono font-bold text-slate-700 mb-2">{calcs.conservative.coc}%</div>
                <span className="text-xs text-slate-400 block mb-4">CoC</span>
                <div className="text-3xl font-mono font-bold text-slate-700 mb-2">{calcs.conservative.irr}%</div>
                <span className="text-xs text-slate-400 block">IRR</span>
            </div>

            <div className="bg-sim-blue/5 p-6 rounded-xl border-2 border-sim-blue text-center transform md:scale-105 shadow-xl relative z-10 bg-white">
                <h4 className="text-xs font-bold text-sim-blue uppercase tracking-widest mb-4">Base Case</h4>
                <div className="text-4xl font-mono font-bold text-sim-blue mb-2">{calcs.base.coc}%</div>
                <span className="text-xs text-slate-500 block mb-6">Cash-on-Cash</span>
                <div className="text-4xl font-mono font-bold text-sim-blue mb-2">{calcs.base.irr}%</div>
                <span className="text-xs text-slate-500 block">IRR</span>
            </div>

            <div className="bg-white p-6 rounded-xl border border-sim-border text-center shadow-sm opacity-80">
                <h4 className="text-xs font-bold text-emerald-500 uppercase tracking-widest mb-4">Optimistic</h4>
                <div className="text-3xl font-mono font-bold text-emerald-600 mb-2">{calcs.optimistic.coc}%</div>
                <span className="text-xs text-slate-400 block mb-4">CoC</span>
                <div className="text-3xl font-mono font-bold text-emerald-600 mb-2">{calcs.optimistic.irr}%</div>
                <span className="text-xs text-slate-400 block">IRR</span>
            </div>
        </div>

        {/* AI SECTION */}
        <div className="text-center">
             <Button onClick={handleAnalyze} isLoading={isAnalyzing} className="bg-sim-ai hover:bg-purple-600 text-white shadow-lg shadow-purple-500/20 px-8 py-3">
                 {isAnalyzing ? 'Analyzing Financials...' : '🧠 Ask AI Commentary'}
             </Button>
        </div>

        {aiOutput && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-slideUp">
                <div className="bg-purple-50 p-6 rounded-xl border border-purple-100">
                    <h5 className="text-sm font-bold text-purple-800 mb-3 flex items-center gap-2">
                        <span>🤖</span> Professor's Analysis
                    </h5>
                    <p className="text-sm text-slate-700 italic mb-4">"{aiOutput.scenarioNarrative}"</p>
                    <div className="text-xs font-bold text-purple-600 bg-purple-100 p-2 rounded">
                        Realism Check: {aiOutput.realismCheck}
                    </div>
                </div>

                <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
                    <h5 className="text-sm font-bold text-slate-700 mb-3">Risk & Fit</h5>
                    <ul className="space-y-2 text-xs text-slate-600">
                         {aiOutput.riskNotes?.map((note: string, i: number) => (
                             <li key={i} className="flex gap-2"><span className="text-red-400">⚠️</span> {note}</li>
                         ))}
                    </ul>
                    <div className="mt-4 pt-4 border-t border-slate-200">
                        <span className="text-xs font-bold text-slate-500 uppercase mr-2">Investor Fit:</span>
                        <span className="text-xs text-slate-800">{aiOutput.investorSegmentFit?.join(', ')}</span>
                    </div>
                </div>

                {inputEducation && (
                    <div className="md:col-span-2 bg-blue-50 p-6 rounded-xl border border-blue-100">
                        <h5 className="text-sm font-bold text-blue-800 mb-3">Input Education</h5>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {Object.entries(inputEducation).map(([key, val]: [string, any]) => (
                                <div key={key} className="text-xs">
                                    <span className="font-bold text-blue-700 block mb-1 uppercase">{key}</span>
                                    <p className="text-slate-600">{val.insight}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        )}

        {/* FOOTER */}
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
