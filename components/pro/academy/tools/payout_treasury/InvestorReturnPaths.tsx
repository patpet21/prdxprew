
import React, { useState, useEffect } from 'react';
import { Button } from '../../../../ui/Button';
import { generateInvestorPathsAnalysis } from '../../../../../services/mockAiService';

interface Props {
    onNext?: () => void;
}

export const InvestorReturnPaths: React.FC<Props> = ({ onNext }) => {
  const [inputs, setInputs] = useState({
      classA_pref: 8.0,
      classB_carry: 20.0,
      holdPeriod: 5,
      exitYield: 15.0,
      riskProfile: 'Medium'
  });

  const [aiOutput, setAiOutput] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('academyPro_payout');
    if (saved) {
        try {
            const parsed = JSON.parse(saved);
            if (parsed.investorPaths) {
                setInputs(prev => ({ ...prev, ...parsed.investorPaths.inputs }));
                setAiOutput(parsed.investorPaths.aiOutput);
            }
        } catch(e) { console.error(e); }
    }
  }, []);

  const handleAnalyze = async () => {
      setIsAnalyzing(true);
      const result = await generateInvestorPathsAnalysis(inputs);
      setAiOutput(result);
      const current = JSON.parse(localStorage.getItem('academyPro_payout') || '{}');
      current.investorPaths = { inputs, aiOutput: result };
      localStorage.setItem('academyPro_payout', JSON.stringify(current));
      setIsAnalyzing(false);
  };

  const handleSaveNext = () => {
      setIsSaving(true);
      const current = JSON.parse(localStorage.getItem('academyPro_payout') || '{}');
      current.investorPaths = { inputs, aiOutput };
      localStorage.setItem('academyPro_payout', JSON.stringify(current));
      
      setTimeout(() => {
          setIsSaving(false);
          if(onNext) onNext();
      }, 500);
  };

  const generatePath = (type: 'A' | 'B') => {
      const points = [];
      const width = 100;
      const height = 50;
      const years = inputs.holdPeriod;
      for (let i = 0; i <= years; i++) {
          const x = (i / years) * width;
          let y = height;
          if (i === 0) y = height * 0.9;
          else {
              if (type === 'A') {
                  const growth = (i * inputs.classA_pref); 
                  y = height * 0.9 - (growth * 0.5); 
              } else {
                  const growth = i > 1 ? Math.pow(i, 1.8) * 2 : 0;
                  y = height * 0.9 - (growth * 0.4); 
              }
          }
          y = Math.max(5, Math.min(height, y));
          points.push(`${x},${y}`);
      }
      return points.join(' ');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 h-full">
        
        <div className="lg:col-span-4 space-y-10">
            <div>
                <h2 className="text-3xl font-display font-bold text-slate-900 mb-6">J-Curve Simulation</h2>
                <p className="text-slate-500 text-lg leading-relaxed">
                    Visualize the return path for different investor classes over the holding period.
                </p>
            </div>

            <div className="space-y-6">
                <div className="p-4 bg-white border border-slate-200 rounded-xl">
                    <label className="text-xs font-bold text-emerald-600 uppercase block mb-3">Class A (Preferred)</label>
                    <div className="flex items-center gap-4">
                        <span className="text-slate-400 text-sm">Hurdle</span>
                        <input type="number" value={inputs.classA_pref} onChange={e => setInputs({...inputs, classA_pref: parseFloat(e.target.value)})} className="w-20 bg-slate-50 border border-slate-200 rounded p-2 text-right outline-none font-bold" />
                        <span className="text-slate-400 text-sm">%</span>
                    </div>
                </div>
                
                <div className="p-4 bg-white border border-slate-200 rounded-xl">
                    <label className="text-xs font-bold text-indigo-600 uppercase block mb-3">Class B (Common)</label>
                    <div className="flex items-center gap-4">
                        <span className="text-slate-400 text-sm">Carry</span>
                        <input type="number" value={inputs.classB_carry} onChange={e => setInputs({...inputs, classB_carry: parseFloat(e.target.value)})} className="w-20 bg-slate-50 border border-slate-200 rounded p-2 text-right outline-none font-bold" />
                        <span className="text-slate-400 text-sm">%</span>
                    </div>
                </div>

                <div className="p-4 bg-white border border-slate-200 rounded-xl">
                    <label className="text-xs font-bold text-slate-500 uppercase block mb-3">Hold Period</label>
                    <input type="range" min="3" max="10" value={inputs.holdPeriod} onChange={e => setInputs({...inputs, holdPeriod: parseInt(e.target.value)})} className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-slate-900" />
                    <div className="text-right text-slate-900 font-bold mt-2">{inputs.holdPeriod} Years</div>
                </div>
            </div>

            <div className="pt-8">
                <Button onClick={handleAnalyze} isLoading={isAnalyzing} className="w-full py-4 text-lg bg-slate-900 text-white hover:bg-slate-800">
                    Analyze Paths
                </Button>
            </div>
        </div>

        <div className="lg:col-span-8 flex flex-col pl-8 border-l border-slate-200 justify-center">
             
             {/* Chart */}
             <div className="w-full h-96 bg-slate-50 border border-slate-200 rounded-3xl relative overflow-hidden p-8 shadow-inner">
                <h5 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6 absolute top-8 left-8">Projected Returns Multiplier</h5>
                
                <svg viewBox="0 0 100 50" className="w-full h-full overflow-visible" preserveAspectRatio="none">
                    {/* Grid */}
                    <line x1="0" y1="45" x2="100" y2="45" stroke="#e2e8f0" strokeWidth="0.2" />
                    <line x1="0" y1="25" x2="100" y2="25" stroke="#e2e8f0" strokeWidth="0.2" strokeDasharray="2 2" />
                    
                    {/* Paths */}
                    <path d={`M ${generatePath('A')}`} fill="none" stroke="#10b981" strokeWidth="1" strokeLinecap="round" />
                    <path d={`M ${generatePath('B')}`} fill="none" stroke="#6366f1" strokeWidth="1" strokeDasharray="2 2" strokeLinecap="round" />
                </svg>
                
                <div className="absolute bottom-4 left-8 text-xs text-slate-400 font-mono">Y0</div>
                <div className="absolute bottom-4 right-8 text-xs text-slate-400 font-mono">Exit (Y{inputs.holdPeriod})</div>
             </div>

             <div className="flex justify-center gap-8 mt-6">
                 <div className="flex items-center gap-2">
                     <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                     <span className="text-sm font-bold text-slate-700">Class A (Stable)</span>
                 </div>
                 <div className="flex items-center gap-2">
                     <div className="w-3 h-3 bg-indigo-500 rounded-full"></div>
                     <span className="text-sm font-bold text-slate-700">Class B (Growth)</span>
                 </div>
             </div>

            {aiOutput && (
                <div className="mt-12 space-y-6 animate-slideUp">
                    <div className="flex items-start gap-4">
                        <div className="text-3xl">🎓</div>
                        <p className="text-lg text-slate-600 italic">"{aiOutput.jCurveCommentary}"</p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-8">
                        <div>
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Institutional Score</span>
                            <div className="text-4xl font-display font-bold text-slate-900 mt-1">{aiOutput.institutionalReadinessScore}/100</div>
                        </div>
                        <div>
                             <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Risk Factors</span>
                             <ul className="mt-1 space-y-1">
                                {aiOutput.risks?.map((r: string, i: number) => (
                                    <li key={i} className="text-sm text-red-500 font-medium">• {r}</li>
                                ))}
                             </ul>
                        </div>
                    </div>
                </div>
            )}

            <div className="mt-auto pt-12 flex justify-end">
                <Button onClick={handleSaveNext} disabled={isSaving} className="bg-indigo-600 hover:bg-indigo-500 text-white px-10 py-4 text-lg shadow-xl shadow-indigo-200">
                    {isSaving ? 'Saving...' : 'Save & Continue →'}
                </Button>
            </div>
        </div>
    </div>
  );
};
