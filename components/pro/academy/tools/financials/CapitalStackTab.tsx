
import React, { useState, useEffect } from 'react';
import { Button } from '../../../../ui/Button';
import { generateCapitalStackAnalysis, generateCapitalStackInputEducation, generateCapitalStackOutputEducation } from '../../../../../services/mockAiService';
import { TokenizationState } from '../../../../types';

interface Props {
  data: any;
  onUpdate: (data: any) => void;
  context: any;
  onNext: () => void;
}

const LOCAL_STORAGE_KEY = 'academyPro_financial';

export const CapitalStackTab: React.FC<Props> = ({ data, onUpdate, context, onNext }) => {
  const [inputs, setInputs] = useState({
      seniorDebtPercent: 50,
      mezzanineDebtPercent: 10,
      tokenizedEquityPercent: 30,
      sponsorEquityPercent: 10,
      seniorInterestRate: 6.0,
      mezzInterestRate: 12.0,
      targetTokenYield: 8.0,
      sponsorPromoteThreshold: 8.0,
      sponsorPromoteCarry: 20.0
  });

  const [aiOutput, setAiOutput] = useState<any>(null);
  const [inputEducation, setInputEducation] = useState<any>(null);
  const [outputEducation, setOutputEducation] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
        try {
            const parsed = JSON.parse(saved);
            if (parsed.capitalStack) {
                if (parsed.capitalStack.inputs) setInputs(parsed.capitalStack.inputs);
                if (parsed.capitalStack.aiOutput) setAiOutput(parsed.capitalStack.aiOutput);
                if (parsed.capitalStack.inputEducation) setInputEducation(parsed.capitalStack.inputEducation);
                if (parsed.capitalStack.outputEducation) setOutputEducation(parsed.capitalStack.outputEducation);
            }
        } catch (e) {
            console.error("Failed to load capital stack data", e);
        }
    }
  }, []);

  const totalPercent = inputs.seniorDebtPercent + inputs.mezzanineDebtPercent + inputs.tokenizedEquityPercent + inputs.sponsorEquityPercent;

  const saveToStorage = () => {
    const existing = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || '{}');
    const updated = {
        ...existing,
        capitalStack: {
            inputs,
            aiOutput,
            inputEducation,
            outputEducation
        }
    };
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
    onUpdate(updated.capitalStack);
  };

  const handleSave = () => {
      setIsSaving(true);
      saveToStorage();
      setTimeout(() => setIsSaving(false), 500);
  };

  const handleSaveAndNext = () => {
      handleSave();
      onNext();
  };

  const handleAnalyze = async () => {
      if (totalPercent !== 100) {
          alert("Total Capital Stack allocation must equal 100%.");
          return;
      }
      setIsAnalyzing(true);
      
      // Parallel execution for speed
      const [analysis, inEdu] = await Promise.all([
          generateCapitalStackAnalysis(inputs),
          generateCapitalStackInputEducation(inputs)
      ]);
      
      const outEdu = await generateCapitalStackOutputEducation(inputs, analysis);

      setAiOutput(analysis);
      setInputEducation(inEdu);
      setOutputEducation(outEdu);
      
      setIsAnalyzing(false);
      
      // Auto-save
      const existing = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || '{}');
      const updated = {
        ...existing,
        capitalStack: {
            inputs,
            aiOutput: analysis,
            inputEducation: inEdu,
            outputEducation: outEdu
        }
      };
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
      onUpdate(updated.capitalStack);
  };

  const updateInput = (field: string, val: number) => {
      setInputs(prev => ({ ...prev, [field]: val }));
  };

  const getScoreColor = (score: number) => {
      if (score >= 80) return 'text-emerald-400';
      if (score >= 60) return 'text-amber-400';
      return 'text-red-400';
  };

  return (
    <div className="space-y-8 animate-fadeIn">
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* INPUTS - Capital Structure */}
            <div className="bg-white p-6 rounded-xl border border-sim-border shadow-sm space-y-6">
                <div className="flex justify-between items-center mb-2">
                    <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                        <span className="text-xl">🏗️</span> Capital Sources
                    </h4>
                    <span className={`text-xs font-bold px-2 py-1 rounded ${totalPercent === 100 ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                        Total: {totalPercent}%
                    </span>
                </div>

                {/* Senior Debt */}
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                    <div className="flex justify-between items-center mb-2">
                        <label className="text-xs font-bold text-blue-600 uppercase">Senior Debt</label>
                        <input 
                            type="number" className="w-16 bg-white border border-slate-300 rounded px-1 text-right text-xs" 
                            value={inputs.seniorInterestRate} onChange={e => updateInput('seniorInterestRate', parseFloat(e.target.value))}
                        />
                        <span className="text-xs text-slate-400 ml-1">% Rate</span>
                    </div>
                    <input 
                        type="range" min="0" max="80" step="5" 
                        value={inputs.seniorDebtPercent} onChange={e => updateInput('seniorDebtPercent', parseInt(e.target.value))}
                        className="w-full h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                    />
                    <div className="text-right text-xs font-bold text-blue-600 mt-1">{inputs.seniorDebtPercent}%</div>
                </div>

                {/* Mezzanine Debt */}
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                    <div className="flex justify-between items-center mb-2">
                        <label className="text-xs font-bold text-purple-600 uppercase">Mezzanine Debt</label>
                        <input 
                            type="number" className="w-16 bg-white border border-slate-300 rounded px-1 text-right text-xs" 
                            value={inputs.mezzInterestRate} onChange={e => updateInput('mezzInterestRate', parseFloat(e.target.value))}
                        />
                        <span className="text-xs text-slate-400 ml-1">% Rate</span>
                    </div>
                    <input 
                        type="range" min="0" max="40" step="5" 
                        value={inputs.mezzanineDebtPercent} onChange={e => updateInput('mezzanineDebtPercent', parseInt(e.target.value))}
                        className="w-full h-2 bg-purple-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
                    />
                    <div className="text-right text-xs font-bold text-purple-600 mt-1">{inputs.mezzanineDebtPercent}%</div>
                </div>

                {/* Tokenized Equity */}
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                    <div className="flex justify-between items-center mb-2">
                        <label className="text-xs font-bold text-emerald-600 uppercase">Tokenized Equity</label>
                        <input 
                            type="number" className="w-16 bg-white border border-slate-300 rounded px-1 text-right text-xs" 
                            value={inputs.targetTokenYield} onChange={e => updateInput('targetTokenYield', parseFloat(e.target.value))}
                        />
                        <span className="text-xs text-slate-400 ml-1">% Target</span>
                    </div>
                    <input 
                        type="range" min="0" max="100" step="5" 
                        value={inputs.tokenizedEquityPercent} onChange={e => updateInput('tokenizedEquityPercent', parseInt(e.target.value))}
                        className="w-full h-2 bg-emerald-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                    />
                    <div className="text-right text-xs font-bold text-emerald-600 mt-1">{inputs.tokenizedEquityPercent}%</div>
                </div>

                {/* Sponsor Equity */}
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                    <div className="flex justify-between items-center mb-2">
                        <label className="text-xs font-bold text-amber-600 uppercase">Sponsor Equity</label>
                        <div className="flex gap-2">
                            <span className="text-[10px] text-slate-400">Promote:</span>
                            <input 
                                type="number" className="w-10 bg-white border border-slate-300 rounded px-1 text-right text-[10px]" 
                                value={inputs.sponsorPromoteCarry} onChange={e => updateInput('sponsorPromoteCarry', parseFloat(e.target.value))}
                            />
                            <span className="text-[10px] text-slate-400">% over</span>
                            <input 
                                type="number" className="w-8 bg-white border border-slate-300 rounded px-1 text-right text-[10px]" 
                                value={inputs.sponsorPromoteThreshold} onChange={e => updateInput('sponsorPromoteThreshold', parseFloat(e.target.value))}
                            />
                            <span className="text-[10px] text-slate-400">%</span>
                        </div>
                    </div>
                    <input 
                        type="range" min="0" max="40" step="1" 
                        value={inputs.sponsorEquityPercent} onChange={e => updateInput('sponsorEquityPercent', parseInt(e.target.value))}
                        className="w-full h-2 bg-amber-200 rounded-lg appearance-none cursor-pointer accent-amber-600"
                    />
                    <div className="text-right text-xs font-bold text-amber-600 mt-1">{inputs.sponsorEquityPercent}%</div>
                </div>
            </div>

            {/* VISUALIZATION */}
            <div className="bg-slate-900 p-8 rounded-xl border border-slate-800 flex flex-col items-center justify-center relative overflow-hidden">
                 <div className="absolute top-0 right-0 p-6 opacity-10 text-9xl text-white pointer-events-none">🏢</div>
                 
                 <div className="w-40 h-[400px] bg-slate-800 rounded-lg border border-slate-700 flex flex-col-reverse overflow-hidden relative shadow-2xl">
                     {/* Senior */}
                     <div style={{ height: `${inputs.seniorDebtPercent}%` }} className="w-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold border-t border-blue-400/30 transition-all duration-500">
                         {inputs.seniorDebtPercent > 5 && `Senior ${inputs.seniorDebtPercent}%`}
                     </div>
                     {/* Mezz */}
                     <div style={{ height: `${inputs.mezzanineDebtPercent}%` }} className="w-full bg-purple-600 flex items-center justify-center text-white text-xs font-bold border-t border-purple-400/30 transition-all duration-500">
                         {inputs.mezzanineDebtPercent > 5 && `Mezz ${inputs.mezzanineDebtPercent}%`}
                     </div>
                     {/* Token */}
                     <div style={{ height: `${inputs.tokenizedEquityPercent}%` }} className="w-full bg-emerald-500 flex items-center justify-center text-slate-900 text-xs font-bold border-t border-emerald-300/30 transition-all duration-500">
                         {inputs.tokenizedEquityPercent > 5 && `Token ${inputs.tokenizedEquityPercent}%`}
                     </div>
                     {/* Sponsor */}
                     <div style={{ height: `${inputs.sponsorEquityPercent}%` }} className="w-full bg-amber-500 flex items-center justify-center text-slate-900 text-xs font-bold border-t border-amber-300/30 transition-all duration-500">
                         {inputs.sponsorEquityPercent > 5 && `Sponsor ${inputs.sponsorEquityPercent}%`}
                     </div>
                 </div>

                 <div className="mt-8 w-full">
                    <Button onClick={handleAnalyze} isLoading={isAnalyzing} className="w-full bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-900/40">
                        {isAnalyzing ? 'Analyzing Stack...' : '🧠 Ask AI Architect'}
                    </Button>
                 </div>
            </div>
        </div>

        {/* AI OUTPUT & EDUCATION */}
        {aiOutput && (
            <div className="animate-slideUp space-y-6">
                
                {/* Scores */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 flex items-center justify-between">
                        <span className="text-slate-400 text-xs uppercase font-bold">Capital Efficiency</span>
                        <span className={`text-2xl font-mono font-bold ${getScoreColor(aiOutput.capitalEfficiencyScore)}`}>
                            {aiOutput.capitalEfficiencyScore}/100
                        </span>
                    </div>
                    <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 flex items-center justify-between">
                        <span className="text-slate-400 text-xs uppercase font-bold">Risk Distribution</span>
                        <span className={`text-2xl font-mono font-bold ${getScoreColor(aiOutput.riskDistributionScore)}`}>
                            {aiOutput.riskDistributionScore}/100
                        </span>
                    </div>
                </div>

                {/* Educational Cards (Input Context) */}
                {inputEducation && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {inputs.seniorDebtPercent > 0 && inputEducation.seniorDebt && (
                             <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                                 <h5 className="text-blue-800 font-bold text-xs uppercase mb-1">Senior Debt ({inputs.seniorDebtPercent}%)</h5>
                                 <p className="text-xs text-blue-700 mb-2">{inputEducation.seniorDebt.definition}</p>
                                 <p className="text-[10px] text-blue-600 bg-blue-100 p-2 rounded">⚠️ {inputEducation.seniorDebt.warning}</p>
                             </div>
                        )}
                        {inputs.tokenizedEquityPercent > 0 && inputEducation.tokenEquity && (
                             <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100">
                                 <h5 className="text-emerald-800 font-bold text-xs uppercase mb-1">Token Equity ({inputs.tokenizedEquityPercent}%)</h5>
                                 <p className="text-xs text-emerald-700 mb-2">{inputEducation.tokenEquity.definition}</p>
                                 <p className="text-[10px] text-emerald-600 bg-emerald-100 p-2 rounded">⚠️ {inputEducation.tokenEquity.warning}</p>
                             </div>
                        )}
                    </div>
                )}
                
                {/* Strategic Advice */}
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">Strategic Assessment</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            <h5 className="text-xs font-bold text-slate-500 mb-2">Investor Appeal</h5>
                            <ul className="list-disc list-inside text-xs text-slate-600 space-y-1">
                                {aiOutput.investorAppealNotes?.map((n: string, i: number) => <li key={i}>{n}</li>)}
                            </ul>
                        </div>
                        <div>
                            <h5 className="text-xs font-bold text-slate-500 mb-2">Structural Weak Spots</h5>
                            <ul className="list-disc list-inside text-xs text-red-500 space-y-1">
                                {aiOutput.structuralWeakSpots?.map((n: string, i: number) => <li key={i}>{n}</li>)}
                            </ul>
                        </div>
                    </div>
                    {outputEducation && (
                        <div className="mt-6 pt-4 border-t border-slate-100">
                            <p className="text-xs text-slate-500 italic">
                                <strong>Consultant's Note:</strong> {outputEducation.efficiencyExplanation}
                            </p>
                        </div>
                    )}
                </div>

            </div>
        )}

        {/* Footer Actions */}
        <div className="flex justify-end gap-4 pt-4 border-t border-slate-200/20">
            <Button onClick={handleSave} disabled={isSaving} variant="secondary" className="border-slate-600 text-slate-400 hover:text-white hover:bg-slate-800">
                {isSaving ? 'Saving...' : 'Save Draft'}
            </Button>
            <Button onClick={handleSaveAndNext} className="bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg">
                Save & Next →
            </Button>
        </div>

    </div>
  );
};
