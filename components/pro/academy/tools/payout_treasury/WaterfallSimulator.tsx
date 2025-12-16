
import React, { useState, useEffect } from 'react';
import { Button } from '../../../../ui/Button';
import { generateWaterfallAnalysis } from '../../../../../services/mockAiService';

interface Props {
  onNext?: () => void;
}

export const WaterfallSimulator: React.FC<Props> = ({ onNext }) => {
  const [inputs, setInputs] = useState({
      distributableCash: 100000,
      preferredReturnPct: 8.0,
      carryPct: 20.0,
      catchupPct: 100.0,
      sponsorCapitalPct: 10.0
  });

  const [aiOutput, setAiOutput] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
      const saved = localStorage.getItem('academyPro_payout');
      if (saved) {
          try {
              const parsed = JSON.parse(saved);
              if (parsed.waterfall) {
                  setInputs(prev => ({ ...prev, ...parsed.waterfall.inputs }));
                  setAiOutput(parsed.waterfall.aiOutput);
              }
          } catch(e) { console.error(e); }
      }
  }, []);

  const handleChange = (key: string, val: number) => {
      setInputs(prev => ({ ...prev, [key]: val }));
  };

  const handleAnalyze = async () => {
      setIsAnalyzing(true);
      const result = await generateWaterfallAnalysis(inputs);
      setAiOutput(result);
      const current = JSON.parse(localStorage.getItem('academyPro_payout') || '{}');
      current.waterfall = { inputs, aiOutput: result };
      localStorage.setItem('academyPro_payout', JSON.stringify(current));
      setIsAnalyzing(false);
  };

  const handleSaveNext = () => {
      setIsSaving(true);
      const current = JSON.parse(localStorage.getItem('academyPro_payout') || '{}');
      current.waterfall = { inputs, aiOutput };
      localStorage.setItem('academyPro_payout', JSON.stringify(current));
      
      setTimeout(() => {
          setIsSaving(false);
          if(onNext) onNext();
      }, 500);
  };

  const getSplits = () => {
      const { distributableCash, preferredReturnPct, carryPct, sponsorCapitalPct } = inputs;
      const impliedEquity = distributableCash * 10; 
      const investorHurdle = impliedEquity * (1 - sponsorCapitalPct/100) * (preferredReturnPct / 100);
      
      let remaining = distributableCash;
      
      // Tier 1
      const tier1Dist = Math.min(remaining, investorHurdle / (1 - sponsorCapitalPct/100)); 
      remaining -= tier1Dist;
      
      // Tier 2
      const catchupTarget = (tier1Dist / (1 - carryPct/100)) * (carryPct/100);
      const tier2Dist = Math.min(remaining, catchupTarget);
      remaining -= tier2Dist;
      
      // Tier 3
      const lpTier3 = remaining * (1 - carryPct/100);
      const gpTier3 = remaining * (carryPct/100);
      
      const lpTotal = (tier1Dist * (1 - sponsorCapitalPct/100)) + lpTier3;
      const gpTotal = (tier1Dist * (sponsorCapitalPct/100)) + tier2Dist + gpTier3;
      
      return { lpTotal, gpTotal };
  };

  const splits = getSplits();
  const lpPercent = (splits.lpTotal / inputs.distributableCash) * 100;
  const gpPercent = (splits.gpTotal / inputs.distributableCash) * 100;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 h-full">
        
        {/* Left: Configuration */}
        <div className="lg:col-span-4 space-y-10">
            <div>
                <h2 className="text-3xl font-display font-bold text-slate-900 mb-6">Waterfall Engine</h2>
                <p className="text-slate-500 text-lg leading-relaxed">
                    Configure the flow of funds. The waterfall determines who gets paid first, and how profits are split after hurdles are met.
                </p>
            </div>

            <div className="space-y-6">
                <div>
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-2">Scenario Cashflow ($)</label>
                    <input 
                        type="number" 
                        value={inputs.distributableCash} 
                        onChange={e => handleChange('distributableCash', parseFloat(e.target.value))} 
                        className="w-full p-4 bg-white border border-slate-200 rounded-xl text-xl font-mono text-slate-900 focus:border-indigo-500 outline-none"
                    />
                </div>
                 <div>
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-2">Sponsor Co-Invest (%)</label>
                    <input 
                        type="number" 
                        value={inputs.sponsorCapitalPct} 
                        onChange={e => handleChange('sponsorCapitalPct', parseFloat(e.target.value))} 
                        className="w-full p-4 bg-white border border-slate-200 rounded-xl text-xl font-mono text-slate-900 focus:border-indigo-500 outline-none"
                    />
                </div>
                
                <div className="pt-4 border-t border-slate-200">
                    <div className="flex justify-between text-sm font-bold text-slate-700 mb-2">
                        <span>Preferred Return</span>
                        <span>{inputs.preferredReturnPct}%</span>
                    </div>
                    <input type="range" min="0" max="15" step="0.5" value={inputs.preferredReturnPct} onChange={e => handleChange('preferredReturnPct', parseFloat(e.target.value))} className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-500" />
                </div>
                
                <div>
                    <div className="flex justify-between text-sm font-bold text-slate-700 mb-2">
                        <span>Promote (Carry)</span>
                        <span>{inputs.carryPct}%</span>
                    </div>
                    <input type="range" min="0" max="50" step="1" value={inputs.carryPct} onChange={e => handleChange('carryPct', parseFloat(e.target.value))} className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-amber-500" />
                </div>
            </div>

            <div className="pt-8">
                <Button onClick={handleAnalyze} isLoading={isAnalyzing} className="w-full py-4 text-lg bg-slate-900 text-white hover:bg-slate-800">
                    Simulate Distribution
                </Button>
            </div>
        </div>

        {/* Right: Visual Flow */}
        <div className="lg:col-span-8 flex flex-col pl-8 border-l border-slate-200">
            
            <div className="flex-1 flex flex-col justify-center items-center">
                {/* Visual Bar */}
                <div className="w-full max-w-2xl">
                    <div className="flex justify-between mb-2 text-sm font-bold text-slate-500 uppercase tracking-widest">
                        <span>Limited Partners (Investors)</span>
                        <span>General Partner (Sponsor)</span>
                    </div>
                    <div className="h-24 w-full bg-slate-100 rounded-2xl overflow-hidden flex relative shadow-inner">
                        <div 
                            style={{ width: `${lpPercent}%` }} 
                            className="bg-emerald-500 flex items-center justify-center text-white font-bold text-2xl relative transition-all duration-700"
                        >
                            {lpPercent.toFixed(1)}%
                        </div>
                        <div 
                            style={{ width: `${gpPercent}%` }} 
                            className="bg-amber-500 flex items-center justify-center text-white font-bold text-2xl relative transition-all duration-700"
                        >
                            {gpPercent.toFixed(1)}%
                        </div>
                    </div>
                    <div className="flex justify-between mt-4 text-lg font-mono font-bold text-slate-900">
                        <span>${(splits.lpTotal || 0).toLocaleString(undefined, {maximumFractionDigits:0})}</span>
                        <span>${(splits.gpTotal || 0).toLocaleString(undefined, {maximumFractionDigits:0})}</span>
                    </div>
                </div>

                {/* AI Output */}
                {aiOutput && (
                    <div className="mt-16 w-full max-w-3xl animate-slideUp">
                        <h4 className="text-xl font-bold text-indigo-900 mb-6">Structuring Analysis</h4>
                        <div className="grid grid-cols-2 gap-8">
                             <div>
                                 <p className="text-sm font-bold text-slate-400 uppercase mb-2">Efficiency Score</p>
                                 <p className="text-3xl font-display font-bold text-slate-900">{aiOutput.efficiencyScore}/100</p>
                             </div>
                             <div>
                                 <p className="text-sm font-bold text-slate-400 uppercase mb-2">Smart Contract Logic</p>
                                 <p className="text-sm text-slate-600 font-mono bg-slate-100 p-2 rounded">{aiOutput.providerBridge.smartContractLogic}</p>
                             </div>
                        </div>
                        <div className="mt-8">
                            <p className="text-lg text-slate-600 leading-relaxed">
                                {aiOutput.education?.map((pt: string, i: number) => (
                                    <span key={i} className="block mb-2">{pt}</span>
                                ))}
                            </p>
                        </div>
                    </div>
                )}
            </div>

            <div className="mt-12 flex justify-end">
                <Button onClick={handleSaveNext} disabled={isSaving} className="bg-indigo-600 hover:bg-indigo-500 text-white px-10 py-4 text-lg shadow-xl shadow-indigo-200">
                    {isSaving ? 'Saving...' : 'Save & Continue →'}
                </Button>
            </div>
        </div>
    </div>
  );
};
