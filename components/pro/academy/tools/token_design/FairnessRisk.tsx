

import React, { useState } from 'react';
import { Button } from '../../../../ui/Button';
import { Select } from '../../../../ui/Select';
import { generateTokenFairnessAnalysis } from '../../../../../services/mockAiService';

interface Props {
  // Context passed from parent
  data?: any;
  onUpdate?: (data: any) => void;
}

export const FairnessRisk: React.FC<Props> = ({ data, onUpdate }) => {
  const [inputs, setInputs] = useState({
      sponsorAllocation: 20,
      governancePower: 'Balanced',
      liquidityTerms: 'Standard',
      investorRights: data?.proTokenDesign?.rights || [],
      vestingRules: data?.proTokenDesign?.vesting || {},
      tokenModel: data?.proTokenDesign?.tokenModel || 'Equity',
      jurisdiction: data?.jurisdiction?.country || 'USA',
      investorProfile: data?.proDistribution?.primaryInvestorType || 'Accredited',
      projectType: data?.property?.category || 'Real Estate',
      raiseAmount: data?.property?.raise_amount || 1000000
  });

  const [aiResult, setAiResult] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Sync state with parent data update
  const handleChange = (key: string, val: any) => {
      setInputs(prev => ({ ...prev, [key]: val }));
  };

  const handleAnalyze = async () => {
      setIsAnalyzing(true);
      const result = await generateTokenFairnessAnalysis(inputs);
      setAiResult(result);
      setIsAnalyzing(false);
  };

  const handleSaveNext = () => {
      setIsSaving(true);
      const current = JSON.parse(localStorage.getItem('academyPro_tokenomics') || '{}');
      current.fairness = {
          inputs,
          aiOutput: aiResult
      };
      localStorage.setItem('academyPro_tokenomics', JSON.stringify(current));
      
      if (onUpdate) onUpdate(current);

      setTimeout(() => {
          setIsSaving(false);
          alert("Fairness Assessment Saved! Module Complete.");
          // Final step, maybe redirect or celebrate?
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
             <div className="flex justify-between items-center mb-6">
                <h4 className="text-sm font-bold text-white uppercase tracking-widest flex items-center gap-2">
                    <span className="text-xl">⚖️</span> Ethical Auditor
                </h4>
                <div className="text-xs text-slate-500 bg-slate-800 px-3 py-1 rounded border border-slate-700">
                    Sponsor Equity Check
                </div>
             </div>

             <div className="space-y-6">
                 <div>
                     <div className="flex justify-between text-xs font-bold text-slate-500 uppercase mb-2">
                         <span>Sponsor Allocation</span>
                         <span className="text-white font-mono">{inputs.sponsorAllocation}%</span>
                     </div>
                     <input 
                        type="range" min="0" max="100" 
                        value={inputs.sponsorAllocation} 
                        onChange={e => handleChange('sponsorAllocation', Number(e.target.value))}
                        className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
                     />
                     <div className="flex justify-between text-[10px] text-slate-600 mt-1 uppercase font-bold">
                         <span>Too Low (No Skin)</span>
                         <span>Too High (Greedy)</span>
                     </div>
                 </div>

                 <div className="grid grid-cols-2 gap-4">
                     <div>
                         <Select 
                            label="Governance Power"
                            value={inputs.governancePower}
                            onChange={e => handleChange('governancePower', e.target.value)}
                            options={[
                                { value: 'Centralized', label: 'Sponsor Dominant' },
                                { value: 'Balanced', label: 'Shared Control' },
                                { value: 'Decentralized', label: 'Community Lead' }
                            ]}
                            className="bg-slate-800 border-slate-700 text-white"
                        />
                     </div>
                     
                     <div>
                         <Select 
                            label="Liquidity Terms"
                            value={inputs.liquidityTerms}
                            onChange={e => handleChange('liquidityTerms', e.target.value)}
                            options={[
                                { value: 'Locked', label: 'Long-term Lock (Illiquid)' },
                                { value: 'Standard', label: 'Standard Vesting' },
                                { value: 'Liquid', label: 'High Liquidity' }
                            ]}
                            className="bg-slate-800 border-slate-700 text-white"
                        />
                     </div>
                 </div>

                 <div className="grid grid-cols-2 gap-4">
                     <div className="p-3 bg-slate-800 rounded-lg border border-slate-700">
                         <span className="text-[10px] text-slate-400 uppercase block mb-1">Investor Profile</span>
                         <span className="text-sm text-white font-bold">{inputs.investorProfile}</span>
                     </div>
                     <div className="p-3 bg-slate-800 rounded-lg border border-slate-700">
                         <span className="text-[10px] text-slate-400 uppercase block mb-1">Jurisdiction</span>
                         <span className="text-sm text-white font-bold">{inputs.jurisdiction}</span>
                     </div>
                 </div>
             </div>
             
             <div className="mt-8 flex justify-center">
                 <Button 
                    onClick={handleAnalyze} 
                    isLoading={isAnalyzing} 
                    className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-lg py-3"
                 >
                     {isAnalyzing ? 'Auditing Structure...' : '🔍 Run Ethical Audit'}
                 </Button>
             </div>
        </div>

        {/* AI OUTPUT SECTION */}
        {aiResult && (
            <div className="animate-slideUp space-y-8">
                
                {/* A. Score & Verdict */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-slate-900 p-8 rounded-2xl border border-slate-800 flex flex-col items-center justify-center text-center relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
                        <h5 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Fairness Score</h5>
                        <div className={`text-6xl font-display font-bold mb-2 ${getFairnessColor(aiResult.fairnessScore)}`}>
                            {aiResult.fairnessScore}/100
                        </div>
                        <p className="text-sm text-slate-400 italic">"{aiResult.institutionalImpact}"</p>
                    </div>

                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                        <h4 className="text-sm font-bold text-slate-900 uppercase tracking-widest mb-4">Professor's Lecture</h4>
                        <ul className="space-y-3">
                            {aiResult.education.map((pt: string, i: number) => (
                                <li key={i} className="text-xs text-slate-600 flex gap-2 leading-relaxed">
                                    <span className="text-purple-600 font-bold">•</span> {pt}
                                </li>
                            ))}
                        </ul>
                        <div className="mt-4 pt-3 border-t border-slate-100">
                             <p className="text-[10px] text-slate-400 uppercase font-bold mb-1">Why This Matters</p>
                             <p className="text-xs text-slate-500 italic">{aiResult.reasoningWhyThisStepExists}</p>
                        </div>
                    </div>
                </div>

                {/* B. Red Flags & Warnings */}
                <div className="space-y-4">
                    {aiResult.redFlags?.length > 0 && (
                        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                            <h5 className="text-xs font-bold text-red-700 uppercase mb-2 flex items-center gap-2">
                                <span>🚩</span> Critical Red Flags
                            </h5>
                            <ul className="space-y-1">
                                {aiResult.redFlags.map((flag: string, i: number) => (
                                    <li key={i} className="text-xs text-red-600">• {flag}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                    
                    {aiResult.warnings?.length > 0 && (
                        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                            <h5 className="text-xs font-bold text-amber-700 uppercase mb-2 flex items-center gap-2">
                                <span>⚠️</span> Allocation Warnings
                            </h5>
                            <ul className="space-y-1">
                                {aiResult.warnings.map((warn: string, i: number) => (
                                    <li key={i} className="text-xs text-amber-600">• {warn}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>

                {/* C. Provider Bridge */}
                <div className="bg-slate-800 p-8 rounded-2xl border border-slate-700 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl -ml-10 -mt-10 pointer-events-none"></div>
                    
                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-6">
                            <span className="text-3xl">🤝</span>
                            <h3 className="text-xl font-bold text-white">Trust & Verification Bridge</h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-600">
                                <h5 className="text-xs font-bold text-purple-400 uppercase mb-2">PropertyDEX Role</h5>
                                <ul className="text-xs text-slate-300 space-y-1">
                                    {aiResult.providerBridge.propertyDEXRole.map((r: string, i: number) => <li key={i}>• {r}</li>)}
                                </ul>
                            </div>
                            
                            <div className="hidden md:flex items-center justify-center text-slate-500 text-2xl">➔</div>

                            <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-600">
                                <h5 className="text-xs font-bold text-emerald-400 uppercase mb-2">Real World Verification</h5>
                                <ul className="text-xs text-slate-300 space-y-1">
                                    {aiResult.providerBridge.partnerTypes.map((r: string, i: number) => <li key={i}>• {r}</li>)}
                                </ul>
                            </div>
                        </div>

                        <div className="mt-6 text-center text-xs text-slate-400">
                            Process: {aiResult.providerBridge.verificationFlow}
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
                className="bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg px-8 py-3 font-bold"
            >
                {isSaving ? 'Saving...' : 'Finish & Save Module'}
            </Button>
        </div>

    </div>
  );
};