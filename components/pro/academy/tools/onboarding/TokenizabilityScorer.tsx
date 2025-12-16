
import React, { useState, useEffect } from 'react';
import { Button } from '../../../../ui/Button';

interface Props {
  data: any;
  onScore: (score: any) => void;
  onNext: () => void;
}

export const TokenizabilityScorer: React.FC<Props> = ({ data, onScore, onNext }) => {
  const [metrics, setMetrics] = useState({
      fractionalization: 5,
      investorAppetite: 5,
      liquidityPotential: 5,
      legalClarity: 5
  });

  const [score, setScore] = useState(0);

  useEffect(() => {
      const avg = (metrics.fractionalization + metrics.investorAppetite + metrics.liquidityPotential + metrics.legalClarity) / 4;
      const finalScore = Math.round(avg * 20); // 0-100
      setScore(finalScore);
      onScore({ finalScore, metrics });
  }, [metrics]);

  const updateMetric = (key: keyof typeof metrics, val: number) => {
      setMetrics(prev => ({ ...prev, [key]: val }));
  };

  const getVerdict = () => {
      if (score > 80) return { label: "Prime Candidate", color: "text-emerald-500" };
      if (score > 60) return { label: "Viable with Structure", color: "text-amber-500" };
      return { label: "High Friction", color: "text-red-500" };
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-slideUp">
        
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
            <h3 className="font-bold text-slate-800 text-lg">2. Tokenizability Assessment</h3>
            
            <div className="space-y-4">
                <div>
                    <div className="flex justify-between text-xs font-bold text-slate-500 uppercase mb-2">
                        <span>Fractionalization Ease</span>
                        <span>{metrics.fractionalization}/5</span>
                    </div>
                    <input type="range" min="1" max="5" value={metrics.fractionalization} onChange={e => updateMetric('fractionalization', Number(e.target.value))} className="w-full accent-indigo-600" />
                    <p className="text-[10px] text-slate-400 mt-1">Can the asset be easily split (e.g. shares)?</p>
                </div>

                <div>
                    <div className="flex justify-between text-xs font-bold text-slate-500 uppercase mb-2">
                        <span>Investor Appetite</span>
                        <span>{metrics.investorAppetite}/5</span>
                    </div>
                    <input type="range" min="1" max="5" value={metrics.investorAppetite} onChange={e => updateMetric('investorAppetite', Number(e.target.value))} className="w-full accent-indigo-600" />
                    <p className="text-[10px] text-slate-400 mt-1">Is there demand for this asset class?</p>
                </div>

                <div>
                    <div className="flex justify-between text-xs font-bold text-slate-500 uppercase mb-2">
                        <span>Liquidity Potential</span>
                        <span>{metrics.liquidityPotential}/5</span>
                    </div>
                    <input type="range" min="1" max="5" value={metrics.liquidityPotential} onChange={e => updateMetric('liquidityPotential', Number(e.target.value))} className="w-full accent-indigo-600" />
                    <p className="text-[10px] text-slate-400 mt-1">Will secondary trading be active?</p>
                </div>
                
                <div>
                    <div className="flex justify-between text-xs font-bold text-slate-500 uppercase mb-2">
                        <span>Legal Clarity</span>
                        <span>{metrics.legalClarity}/5</span>
                    </div>
                    <input type="range" min="1" max="5" value={metrics.legalClarity} onChange={e => updateMetric('legalClarity', Number(e.target.value))} className="w-full accent-indigo-600" />
                    <p className="text-[10px] text-slate-400 mt-1">Is the jurisdiction crypto-friendly?</p>
                </div>
            </div>

            <Button onClick={onNext} className="w-full bg-slate-900 text-white mt-4">Next: Education →</Button>
        </div>

        <div className="bg-slate-900 rounded-2xl border border-slate-800 p-8 flex flex-col items-center justify-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
            
            <div className="relative z-10 text-center">
                <div className="text-6xl font-bold text-white font-display mb-2">{score}/100</div>
                <div className={`text-sm font-bold uppercase tracking-widest px-3 py-1 rounded-full border bg-slate-800 ${getVerdict().color} border-slate-700`}>
                    {getVerdict().label}
                </div>
                
                <div className="mt-8 grid grid-cols-2 gap-4 text-left">
                    <div className="bg-slate-800 p-3 rounded-lg border border-slate-700">
                        <span className="text-[10px] text-slate-400 block">Risk Profile</span>
                        <span className="text-white font-bold text-sm">Moderate</span>
                    </div>
                     <div className="bg-slate-800 p-3 rounded-lg border border-slate-700">
                        <span className="text-[10px] text-slate-400 block">Tech Fit</span>
                        <span className="text-white font-bold text-sm">ERC-3643</span>
                    </div>
                </div>
            </div>
        </div>

    </div>
  );
};
