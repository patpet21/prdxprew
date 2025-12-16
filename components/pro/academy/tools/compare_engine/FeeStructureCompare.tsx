import React, { useState, useEffect } from 'react';
import { Button } from '../../../../ui/Button';
import { Input } from '../../../../ui/Input';
import { generateFeeDecisionMatrix } from '../../../../../services/mockAiService';

interface Props {
    onNext?: () => void;
}

export const FeeStructureCompare: React.FC<Props> = ({ onNext }) => {
  // Inputs: Shared Context & Dual Models
  const [horizon, setHorizon] = useState(5);
  const [ticket, setTicket] = useState(10000);

  const [modelA, setModelA] = useState({
      mgmt: 2.0,
      carry: 20,
      setup: 2.0,
      service: 0.5
  });

  const [modelB, setModelB] = useState({
      mgmt: 1.0,
      carry: 25,
      setup: 1.0,
      service: 0.5
  });

  const [result, setResult] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Load persistence
  useEffect(() => {
    const saved = localStorage.getItem('academyPro_compare');
    if (saved) {
        try {
            const parsed = JSON.parse(saved);
            if (parsed.fees) {
                if (parsed.fees.inputs) {
                    setHorizon(parsed.fees.inputs.horizon);
                    setTicket(parsed.fees.inputs.ticket);
                    setModelA(parsed.fees.inputs.modelA);
                    setModelB(parsed.fees.inputs.modelB);
                }
                if (parsed.fees.result) setResult(parsed.fees.result);
            }
        } catch(e) {}
    }
  }, []);

  const handleAnalyze = async () => {
      setIsAnalyzing(true);
      const inputs = { horizon, avgTicket: ticket, modelA, modelB };
      const res = await generateFeeDecisionMatrix(inputs);
      setResult(res);
      setIsAnalyzing(false);
      
      const current = JSON.parse(localStorage.getItem('academyPro_compare') || '{}');
      current.fees = { inputs, result: res };
      localStorage.setItem('academyPro_compare', JSON.stringify(current));
  };

  const handleSave = () => {
      setIsSaving(true);
      const inputs = { horizon, avgTicket: ticket, modelA, modelB };
      const current = JSON.parse(localStorage.getItem('academyPro_compare') || '{}');
      current.fees = { inputs, result: result };
      localStorage.setItem('academyPro_compare', JSON.stringify(current));
      
      setTimeout(() => {
          setIsSaving(false);
      }, 500);
  };

  const handleSaveAndNext = () => {
      setIsSaving(true);
      const inputs = { horizon, avgTicket: ticket, modelA, modelB };
      const current = JSON.parse(localStorage.getItem('academyPro_compare') || '{}');
      current.fees = { inputs, result: result };
      localStorage.setItem('academyPro_compare', JSON.stringify(current));
      
      setTimeout(() => {
          setIsSaving(false);
          if (onNext) onNext();
      }, 500);
  };

  // Helper visual for drag
  const calculateSimpleDrag = (m: typeof modelA) => {
      // Very rough approximation for UI feedback before AI
      // Annual fees * years + setup
      const totalFeePct = m.setup + ((m.mgmt + m.service) * horizon);
      return Math.min(100, totalFeePct);
  };
  
  const dragA = calculateSimpleDrag(modelA);
  const dragB = calculateSimpleDrag(modelB);

  return (
    <div className="space-y-8 animate-fadeIn">
        
        {/* HEADER: CONTEXT */}
        <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800">
             <div className="flex justify-between items-center mb-6">
                <h4 className="text-sm font-bold text-white uppercase tracking-widest flex items-center gap-2">
                    <span className="text-xl">💸</span> Fee Engine Battle
                </h4>
                <div className="text-[10px] bg-slate-800 text-slate-400 px-2 py-1 rounded border border-slate-700">
                    Structural Comparison
                </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                    <label className="text-[10px] text-slate-500 uppercase font-bold block mb-2">Time Horizon (Years)</label>
                    <input 
                        type="range" min="1" max="10" step="1" 
                        value={horizon} onChange={e => setHorizon(Number(e.target.value))} 
                        className="w-full accent-indigo-500 h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer" 
                    />
                    <div className="text-right text-white font-bold mt-1">{horizon} Years</div>
                </div>
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                    <label className="text-[10px] text-slate-500 uppercase font-bold block mb-2">Avg Ticket ($)</label>
                    <input 
                        type="number" 
                        value={ticket} onChange={e => setTicket(Number(e.target.value))} 
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white outline-none focus:border-indigo-500" 
                    />
                </div>
            </div>
        </div>

        {/* COMPARISON GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* MODEL A */}
            <div className="bg-slate-900 p-6 rounded-xl border-2 border-slate-800 relative overflow-hidden group hover:border-red-900/50 transition-colors">
                <div className="absolute top-0 right-0 bg-slate-800 text-slate-400 text-xs font-bold px-3 py-1 rounded-bl-xl border-b border-l border-slate-700">
                    Model A
                </div>
                
                <h4 className="text-white font-bold mb-6">High Fee / Active</h4>
                
                <div className="space-y-4">
                    <div>
                        <div className="flex justify-between text-xs text-slate-400 mb-1">
                            <span>Management Fee (Annual)</span>
                            <span className="text-white font-bold">{modelA.mgmt}%</span>
                        </div>
                        <input type="range" min="0" max="5" step="0.25" value={modelA.mgmt} onChange={e => setModelA({...modelA, mgmt: Number(e.target.value)})} className="w-full accent-red-500 h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer" />
                    </div>
                    <div>
                        <div className="flex justify-between text-xs text-slate-400 mb-1">
                            <span>Setup / Acquisition (Upfront)</span>
                            <span className="text-white font-bold">{modelA.setup}%</span>
                        </div>
                        <input type="range" min="0" max="5" step="0.5" value={modelA.setup} onChange={e => setModelA({...modelA, setup: Number(e.target.value)})} className="w-full accent-red-500 h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer" />
                    </div>
                    <div>
                        <div className="flex justify-between text-xs text-slate-400 mb-1">
                            <span>Performance / Carry</span>
                            <span className="text-white font-bold">{modelA.carry}%</span>
                        </div>
                        <input type="range" min="0" max="50" step="5" value={modelA.carry} onChange={e => setModelA({...modelA, carry: Number(e.target.value)})} className="w-full accent-red-500 h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer" />
                    </div>
                </div>

                <div className="mt-6 p-4 bg-red-900/10 border border-red-500/20 rounded-xl">
                    <span className="text-[10px] text-red-400 uppercase font-bold block mb-1">Fee Drag Estimate</span>
                    <div className="flex items-center gap-3">
                        <div className="flex-1 bg-slate-800 h-2 rounded-full overflow-hidden">
                            <div className="bg-red-500 h-full" style={{ width: `${dragA}%` }}></div>
                        </div>
                        <span className="text-lg font-bold text-white">{dragA.toFixed(1)}%</span>
                    </div>
                </div>
            </div>

            {/* MODEL B */}
            <div className="bg-slate-900 p-6 rounded-xl border-2 border-slate-800 relative overflow-hidden group hover:border-emerald-900/50 transition-colors">
                <div className="absolute top-0 right-0 bg-slate-800 text-slate-400 text-xs font-bold px-3 py-1 rounded-bl-xl border-b border-l border-slate-700">
                    Model B
                </div>
                
                <h4 className="text-white font-bold mb-6">Low Fee / Passive</h4>
                
                <div className="space-y-4">
                    <div>
                        <div className="flex justify-between text-xs text-slate-400 mb-1">
                            <span>Management Fee (Annual)</span>
                            <span className="text-white font-bold">{modelB.mgmt}%</span>
                        </div>
                        <input type="range" min="0" max="5" step="0.25" value={modelB.mgmt} onChange={e => setModelB({...modelB, mgmt: Number(e.target.value)})} className="w-full accent-emerald-500 h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer" />
                    </div>
                    <div>
                        <div className="flex justify-between text-xs text-slate-400 mb-1">
                            <span>Setup / Acquisition (Upfront)</span>
                            <span className="text-white font-bold">{modelB.setup}%</span>
                        </div>
                        <input type="range" min="0" max="5" step="0.5" value={modelB.setup} onChange={e => setModelB({...modelB, setup: Number(e.target.value)})} className="w-full accent-emerald-500 h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer" />
                    </div>
                    <div>
                        <div className="flex justify-between text-xs text-slate-400 mb-1">
                            <span>Performance / Carry</span>
                            <span className="text-white font-bold">{modelB.carry}%</span>
                        </div>
                        <input type="range" min="0" max="50" step="5" value={modelB.carry} onChange={e => setModelB({...modelB, carry: Number(e.target.value)})} className="w-full accent-emerald-500 h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer" />
                    </div>
                </div>

                <div className="mt-6 p-4 bg-emerald-900/10 border border-emerald-500/20 rounded-xl">
                    <span className="text-[10px] text-emerald-400 uppercase font-bold block mb-1">Fee Drag Estimate</span>
                    <div className="flex items-center gap-3">
                        <div className="flex-1 bg-slate-800 h-2 rounded-full overflow-hidden">
                            <div className="bg-emerald-500 h-full" style={{ width: `${dragB}%` }}></div>
                        </div>
                        <span className="text-lg font-bold text-white">{dragB.toFixed(1)}%</span>
                    </div>
                </div>
            </div>
        </div>

        <div className="flex justify-center">
            <Button onClick={handleAnalyze} isLoading={isAnalyzing} className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-lg px-12 py-3">
                {isAnalyzing ? 'Simulating Reactions...' : '🗣️ Predict Investor Reaction'}
            </Button>
        </div>

        {/* AI OUTPUT */}
        {result && (
            <div className="animate-slideUp space-y-6">
                
                {/* 1. Reaction Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative">
                        <div className="absolute -top-3 left-6 bg-red-100 text-red-700 px-2 py-0.5 rounded text-[10px] font-bold uppercase border border-red-200">
                            Model A Feedback
                        </div>
                        <p className="text-sm text-slate-600 italic leading-relaxed">
                            "{result.modelA.reaction}"
                        </p>
                        <div className="mt-4 pt-3 border-t border-slate-100 flex justify-between text-xs">
                             <span className="text-slate-400 font-bold uppercase">Competitiveness</span>
                             <span className="text-slate-900 font-bold">{result.modelA.scores.competitiveness}/10</span>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative">
                        <div className="absolute -top-3 left-6 bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded text-[10px] font-bold uppercase border border-emerald-200">
                            Model B Feedback
                        </div>
                        <p className="text-sm text-slate-600 italic leading-relaxed">
                            "{result.modelB.reaction}"
                        </p>
                        <div className="mt-4 pt-3 border-t border-slate-100 flex justify-between text-xs">
                             <span className="text-slate-400 font-bold uppercase">Competitiveness</span>
                             <span className="text-slate-900 font-bold">{result.modelB.scores.competitiveness}/10</span>
                        </div>
                    </div>
                </div>

                {/* 2. Verdict & Fixes */}
                <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 text-white">
                    <h4 className="text-sm font-bold text-amber-400 uppercase tracking-widest mb-2">Professor's Verdict</h4>
                    <p className="text-lg font-medium mb-6">
                        {result.verdict}
                    </p>

                    <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-600/50">
                        <h5 className="text-xs font-bold text-slate-400 uppercase mb-3 flex items-center gap-2">
                            <span>🔧</span> Recommended Fixes
                        </h5>
                        <ul className="space-y-2">
                            {(result.fixes || []).map((fix: string, i: number) => (
                                <li key={i} className="text-sm text-slate-300 flex items-start gap-2">
                                    <span className="text-indigo-400 font-bold">→</span> {fix}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

            </div>
        )}

        {/* FOOTER */}
        <div className="flex justify-end gap-4 pt-6 border-t border-slate-200/50">
            <Button onClick={handleSave} disabled={isSaving} variant="secondary" className="border-slate-300 text-slate-500">
                {isSaving ? 'Saving...' : 'Save Draft'}
            </Button>
            <Button onClick={handleSaveAndNext} className="bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg px-8 py-3 font-bold flex items-center gap-2">
                {isSaving ? 'Saving...' : 'Save & Next: Governance →'}
            </Button>
        </div>

    </div>
  );
};