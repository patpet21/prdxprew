
import React, { useState, useEffect } from 'react';
import { Button } from '../../../../ui/Button';
import { generateGovernanceDecisionMatrix } from '../../../../../services/mockAiService';

interface Props {
    onNext?: () => void;
}

export const GovernanceCompare: React.FC<Props> = ({ onNext }) => {
  // Inputs
  const [inputs, setInputs] = useState({
      speed: 8,
      compliance: 7,
      community: 3
  });

  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Load from LocalStorage
  useEffect(() => {
      const saved = localStorage.getItem('academyPro_compare');
      if (saved) {
          try {
              const parsed = JSON.parse(saved);
              if (parsed.governance) {
                  setInputs(parsed.governance.inputs || inputs);
                  setResult(parsed.governance.result);
              }
          } catch(e) {}
      }
  }, []);

  const handleAnalyze = async () => {
      setLoading(true);
      const data = await generateGovernanceDecisionMatrix(inputs);
      setResult(data);
      setLoading(false);
      saveState(data);
  };

  const saveState = (dataToSave = result) => {
      const current = JSON.parse(localStorage.getItem('academyPro_compare') || '{}');
      current.governance = { inputs, result: dataToSave };
      localStorage.setItem('academyPro_compare', JSON.stringify(current));
  };

  const handleSaveAndNext = () => {
      setIsSaving(true);
      saveState();
      setTimeout(() => {
          setIsSaving(false);
          if (onNext) onNext();
      }, 500);
  };

  const updateInput = (field: string, val: number) => {
      setInputs(prev => ({ ...prev, [field]: val }));
  };

  const getScoreColor = (score: number) => {
      if (score >= 8) return 'bg-emerald-500';
      if (score >= 5) return 'bg-amber-500';
      return 'bg-red-500';
  };
  
  const getScoreTextColor = (score: number) => {
      if (score >= 8) return 'text-emerald-400';
      if (score >= 5) return 'text-amber-400';
      return 'text-red-400';
  };

  return (
    <div className="space-y-8 animate-fadeIn">
        
        {/* HEADER & INPUTS */}
        <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-lg">
            <div className="flex justify-between items-center mb-6">
                <h4 className="text-sm font-bold text-white uppercase tracking-widest flex items-center gap-2">
                    <span className="text-xl">🏛️</span> Governance Architect
                </h4>
                <div className="text-[10px] bg-slate-800 text-slate-400 px-2 py-1 rounded border border-slate-700">
                    Control Systems
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div>
                    <label className="flex justify-between text-xs font-bold text-slate-500 uppercase mb-2">
                        <span>Decision Speed</span>
                        <span className="text-white">{inputs.speed}/10</span>
                    </label>
                    <input 
                        type="range" min="1" max="10" 
                        value={inputs.speed} 
                        onChange={e => updateInput('speed', parseInt(e.target.value))} 
                        className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500" 
                    />
                    <div className="flex justify-between text-[10px] text-slate-600 mt-1 uppercase font-bold">
                        <span>Consensus</span>
                        <span>Dictator</span>
                    </div>
                </div>

                <div>
                    <label className="flex justify-between text-xs font-bold text-slate-500 uppercase mb-2">
                        <span>Compliance Strictness</span>
                        <span className="text-white">{inputs.compliance}/10</span>
                    </label>
                    <input 
                        type="range" min="1" max="10" 
                        value={inputs.compliance} 
                        onChange={e => updateInput('compliance', parseInt(e.target.value))} 
                        className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500" 
                    />
                    <div className="flex justify-between text-[10px] text-slate-600 mt-1 uppercase font-bold">
                        <span>Loose</span>
                        <span>Bank Grade</span>
                    </div>
                </div>

                <div>
                    <label className="flex justify-between text-xs font-bold text-slate-500 uppercase mb-2">
                        <span>Community Power</span>
                        <span className="text-white">{inputs.community}/10</span>
                    </label>
                    <input 
                        type="range" min="1" max="10" 
                        value={inputs.community} 
                        onChange={e => updateInput('community', parseInt(e.target.value))} 
                        className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-500" 
                    />
                    <div className="flex justify-between text-[10px] text-slate-600 mt-1 uppercase font-bold">
                        <span>Passive</span>
                        <span>Full DAO</span>
                    </div>
                </div>
            </div>

            <div className="mt-8 flex justify-center">
                <Button 
                    onClick={handleAnalyze} 
                    isLoading={loading} 
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-xl px-12 py-3"
                >
                    {loading ? 'Simulating Conflict...' : '⚖️ Analyze Structure'}
                </Button>
            </div>
        </div>

        {/* RESULTS */}
        {result && (
            <div className="animate-slideUp space-y-6">
                
                {/* 1. Verdict Card */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-2 h-full bg-indigo-500"></div>
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <h4 className="text-sm font-bold text-indigo-900 uppercase tracking-widest mb-1">Recommended Model</h4>
                            <h3 className="text-3xl font-bold text-slate-900 font-display">{result.recommendation.model}</h3>
                            <span className="text-xs font-bold text-indigo-500 bg-indigo-50 px-2 py-1 rounded mt-2 inline-block">
                                "{result.recommendation.tagline}"
                            </span>
                        </div>
                        <div className="text-right">
                             <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Best For Phase</p>
                             <p className="text-sm font-bold text-slate-700">{result.recommendation.idealPhase}</p>
                        </div>
                    </div>
                    <p className="text-slate-600 text-sm leading-relaxed border-t border-slate-100 pt-4">
                        {result.recommendation.rationale}
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    
                    {/* 2. Scoring Matrix */}
                    <div className="lg:col-span-7 bg-slate-900 p-6 rounded-2xl border border-slate-800">
                        <h4 className="text-sm font-bold text-white uppercase tracking-widest mb-6">Trade-off Matrix</h4>
                        <div className="space-y-4">
                            {Object.entries(result.scores).map(([key, val]: [string, any]) => (
                                <div key={key}>
                                    <div className="flex justify-between text-xs mb-1">
                                        <span className="font-bold text-slate-400 capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                                        <span className={`font-bold ${getScoreTextColor(val.score)}`}>{val.score}/10</span>
                                    </div>
                                    <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden mb-1">
                                        <div className={`h-full ${getScoreColor(val.score)}`} style={{ width: `${val.score * 10}%` }}></div>
                                    </div>
                                    <p className="text-[10px] text-slate-500 italic">{val.reason}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* 3. Golden Clauses */}
                    <div className="lg:col-span-5 space-y-4">
                        <div className="p-4 bg-amber-900/10 border border-amber-500/20 rounded-xl">
                             <h4 className="text-xs font-bold text-amber-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                                <span>📜</span> Essential Clauses
                             </h4>
                             <div className="space-y-3">
                                 {(result.clauses || []).map((clause: any, i: number) => (
                                     <div key={i} className="bg-slate-900/80 p-3 rounded-lg border border-amber-500/10 hover:border-amber-500/30 transition-colors">
                                         <h5 className="text-xs font-bold text-white mb-1">{clause.title}</h5>
                                         <p className="text-[10px] text-slate-400 mb-2">{clause.mechanism}</p>
                                         <div className="text-[9px] text-amber-300/80 italic border-t border-slate-800 pt-1">
                                             Why: {clause.whyItMatters}
                                         </div>
                                     </div>
                                 ))}
                             </div>
                        </div>
                    </div>

                </div>

            </div>
        )}

        {/* FOOTER */}
        <div className="flex justify-end pt-6 border-t border-slate-200/50">
            <Button 
                onClick={handleSaveAndNext} 
                disabled={isSaving || !result}
                className="bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg px-8 py-3 font-bold flex items-center gap-2"
            >
                {isSaving ? 'Saving...' : 'Save & Next: Investor Fit →'}
            </Button>
        </div>

    </div>
  );
};
