
import React, { useState, useEffect } from 'react';
import { Button } from '../../../../ui/Button';
import { generateTokenVestingAnalysis } from '../../../../../services/mockAiService';

interface Props {
  data?: any;
}

export const VestingEmission: React.FC<Props> = ({ data }) => {
  // Inputs
  const [inputs, setInputs] = useState({
      sponsorCliff: 12,
      investorLockup: 6,
      linearVestingMonths: 36,
      // Context fields (could come from props or defaults)
      tokenModel: 'Equity',
      projectType: 'Real Estate',
      jurisdiction: 'USA',
      expectedLiquidityWindow: '3-5 Years',
      sponsorAllocation: 20
  });

  const [aiResult, setAiResult] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Load from Storage
  useEffect(() => {
    const saved = localStorage.getItem('academyPro_tokenomics');
    if (saved) {
        try {
            const parsed = JSON.parse(saved);
            if (parsed.vesting) {
                if(parsed.vesting.inputs) setInputs(prev => ({ ...prev, ...parsed.vesting.inputs }));
                if(parsed.vesting.aiOutput) setAiResult(parsed.vesting.aiOutput);
            }
        } catch (e) {
            console.error("Failed to load Vesting data", e);
        }
    }
  }, []);

  const handleChange = (key: string, val: any) => {
      setInputs(prev => ({ ...prev, [key]: val }));
  };

  const handleAnalyze = async () => {
      setIsAnalyzing(true);
      const result = await generateTokenVestingAnalysis(inputs);
      setAiResult(result);
      setIsAnalyzing(false);
  };

  const handleSaveNext = () => {
      setIsSaving(true);
      const current = JSON.parse(localStorage.getItem('academyPro_tokenomics') || '{}');
      current.vesting = {
          inputs,
          aiOutput: aiResult
      };
      localStorage.setItem('academyPro_tokenomics', JSON.stringify(current));
      
      setTimeout(() => {
          setIsSaving(false);
          alert("Vesting Strategy Saved!");
      }, 500);
  };

  const getFairnessColor = (score: number) => {
      if (score >= 80) return 'text-emerald-400';
      if (score >= 50) return 'text-amber-400';
      return 'text-red-400';
  };

  return (
    <div className="space-y-8 animate-fadeIn">
        
        {/* HEADER & INPUTS */}
        <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800">
            <h4 className="text-sm font-bold text-white uppercase tracking-widest mb-6 flex items-center gap-2">
                <span className="text-xl">⏳</span> Vesting & Lock-up Strategy
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div>
                    <label className="text-xs font-bold text-slate-500 uppercase block mb-2">Sponsor Cliff (Months)</label>
                    <div className="flex items-center gap-2">
                        <input 
                            type="number" 
                            value={inputs.sponsorCliff} 
                            onChange={e => handleChange('sponsorCliff', Number(e.target.value))} 
                            className="w-full bg-slate-800 text-white p-3 rounded-lg border border-slate-700 outline-none focus:border-red-500 font-mono" 
                        />
                    </div>
                    <p className="text-xs text-slate-400 mt-1">Period before ANY tokens unlock for the team.</p>
                </div>
                <div>
                    <label className="text-xs font-bold text-slate-500 uppercase block mb-2">Investor Lock-up (Months)</label>
                    <input 
                        type="number" 
                        value={inputs.investorLockup} 
                        onChange={e => handleChange('investorLockup', Number(e.target.value))} 
                        className="w-full bg-slate-800 text-white p-3 rounded-lg border border-slate-700 outline-none focus:border-blue-500 font-mono" 
                    />
                    <p className="text-xs text-slate-400 mt-1">Standard Reg D: 12 Months.</p>
                </div>
                <div>
                    <label className="text-xs font-bold text-slate-500 uppercase block mb-2">Linear Vesting (Months)</label>
                    <input 
                        type="number" 
                        value={inputs.linearVestingMonths} 
                        onChange={e => handleChange('linearVestingMonths', Number(e.target.value))} 
                        className="w-full bg-slate-800 text-white p-3 rounded-lg border border-slate-700 outline-none focus:border-emerald-500 font-mono" 
                    />
                    <p className="text-xs text-slate-400 mt-1">Gradual release after cliff/lock-up.</p>
                </div>
            </div>

            {/* VISUALIZER */}
            <div className="h-48 w-full bg-slate-950 rounded-xl border border-slate-800 relative overflow-hidden p-4 flex items-end gap-1 mb-8">
                {Array.from({ length: 48 }).map((_, month) => {
                    const isSponsorLocked = month < inputs.sponsorCliff;
                    // Simple linear progression visualization for sponsor
                    const totalVestingTime = inputs.sponsorCliff + inputs.linearVestingMonths;
                    const progress = isSponsorLocked ? 0 : Math.min(100, ((month - inputs.sponsorCliff) / inputs.linearVestingMonths) * 100);
                    
                    return (
                        <div key={month} className="flex-1 flex flex-col justify-end h-full group relative">
                            <div 
                                style={{ height: `${isSponsorLocked ? 5 : Math.max(10, progress)}%` }} 
                                className={`w-full rounded-t-sm transition-all ${isSponsorLocked ? 'bg-red-900/50' : 'bg-emerald-500'}`}
                            ></div>
                            {/* Tooltip */}
                            <div className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 hidden group-hover:block bg-white text-slate-900 text-[8px] px-1 rounded font-bold whitespace-nowrap z-10">
                                M{month}: {isSponsorLocked ? 'Locked' : `${Math.round(progress)}% Unlocked`}
                            </div>
                        </div>
                    )
                })}
            </div>
            
            <div className="flex justify-center">
                <Button 
                    onClick={handleAnalyze} 
                    isLoading={isAnalyzing} 
                    className="bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 text-white shadow-lg px-8 py-3"
                >
                    {isAnalyzing ? 'Analyzing Incentives...' : '⚖️ Analyze Fairness & Risk'}
                </Button>
            </div>
        </div>

        {/* AI OUTPUT SECTION */}
        {aiResult && (
            <div className="animate-slideUp space-y-8">
                
                {/* A. Education & Score */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                        <h4 className="text-sm font-bold text-slate-900 uppercase tracking-widest mb-4 flex items-center gap-2">
                             <span>🎓</span> Vesting Mechanics 101
                        </h4>
                        <ul className="space-y-3">
                            {(aiResult.education || []).map((point: string, i: number) => (
                                <li key={i} className="flex items-start gap-3 text-sm text-slate-600 leading-relaxed">
                                    <span className="text-indigo-500 font-bold text-lg">•</span>
                                    {point}
                                </li>
                            ))}
                        </ul>
                    </div>
                    
                    <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 flex flex-col items-center justify-center text-center relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
                        <div className="relative w-32 h-32 mb-4">
                            <svg className="w-full h-full transform -rotate-90">
                                <circle cx="64" cy="64" r="56" stroke="#1e293b" strokeWidth="8" fill="none" />
                                <circle cx="64" cy="64" r="56" stroke={aiResult.fairnessScore > 70 ? '#10b981' : aiResult.fairnessScore > 40 ? '#f59e0b' : '#ef4444'} strokeWidth="8" 
                                    strokeDasharray={351} 
                                    strokeDashoffset={351 - (351 * (aiResult.fairnessScore || 0)) / 100}
                                    strokeLinecap="round"
                                    className="transition-all duration-1000 ease-out" fill="none" 
                                />
                            </svg>
                            <span className={`absolute inset-0 flex items-center justify-center text-3xl font-bold font-display ${getFairnessColor(aiResult.fairnessScore)}`}>
                                {aiResult.fairnessScore || 0}
                            </span>
                        </div>
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Fairness Score</span>
                    </div>
                </div>

                {/* B. Warnings & Impact */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-red-50 p-6 rounded-2xl border border-red-100">
                        <h5 className="text-xs font-bold text-red-700 uppercase tracking-wider mb-3">Critical Warnings</h5>
                        <ul className="space-y-2">
                            {(aiResult.warnings || []).map((w: string, i: number) => (
                                <li key={i} className="text-xs text-red-800 flex gap-2 font-medium"><span>⚠️</span> {w}</li>
                            ))}
                            {(!aiResult.warnings || aiResult.warnings.length === 0) && <li className="text-xs text-slate-500 italic">No critical warnings detected.</li>}
                        </ul>
                    </div>
                    <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100">
                        <h5 className="text-xs font-bold text-blue-700 uppercase tracking-wider mb-3">Liquidity Impact</h5>
                        <ul className="space-y-2">
                            {(aiResult.liquidityImpact || []).map((l: string, i: number) => (
                                <li key={i} className="text-xs text-blue-800 flex gap-2"><span>💧</span> {l}</li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* C. Strategic Context */}
                <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 text-white">
                    <h4 className="text-sm font-bold text-amber-400 uppercase tracking-widest mb-4">Strategic Alignment</h4>
                    <p className="text-sm text-slate-300 leading-relaxed italic border-l-2 border-amber-500 pl-4 mb-4">
                        "{aiResult.reasoningWhyThisStepExists}"
                    </p>
                    <div className="text-xs text-slate-400">
                        <strong>Imbalance Note:</strong> {aiResult.imbalanceNotes?.[0]}
                    </div>
                </div>

                {/* D. Provider Bridge */}
                <div className="bg-gradient-to-r from-slate-900 to-indigo-900 p-8 rounded-2xl border border-indigo-500/30 relative overflow-hidden">
                    
                    <div className="relative z-10">
                        <h4 className="text-xl font-bold text-white font-display mb-6 flex items-center gap-3">
                            <span className="text-3xl">🌉</span> Execution Bridge
                        </h4>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div>
                                <span className="text-xs font-bold text-indigo-300 uppercase block mb-2">PropertyDEX Role</span>
                                <ul className="text-xs text-slate-300 space-y-1">
                                    {(aiResult.providerBridge?.propertyDEXRole || []).map((r: string, i: number) => <li key={i}>• {r}</li>)}
                                </ul>
                            </div>
                            <div className="hidden md:flex items-center justify-center text-slate-600 text-2xl">➔</div>
                            <div>
                                <span className="text-xs font-bold text-emerald-400 uppercase block mb-2">Smart Contract Enforcement</span>
                                <ul className="text-xs text-slate-300 space-y-1">
                                    {(aiResult.providerBridge?.partnerTypes || []).map((r: string, i: number) => <li key={i}>• {r}</li>)}
                                </ul>
                            </div>
                        </div>
                        
                        <div className="mt-6 bg-black/20 p-4 rounded-xl border border-white/5 text-xs text-slate-300 font-mono">
                             Code Logic: {aiResult.providerBridge?.executionFlow}
                        </div>
                    </div>
                </div>

            </div>
        )}

        {/* FOOTER */}
        <div className="flex justify-end pt-6 border-t border-slate-200">
             <Button 
                onClick={handleSaveNext} 
                disabled={isSaving || !aiResult}
                className="bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg px-8 py-3 font-bold"
            >
                {isSaving ? 'Saving...' : 'Save & Next Section →'}
            </Button>
        </div>

    </div>
  );
};
