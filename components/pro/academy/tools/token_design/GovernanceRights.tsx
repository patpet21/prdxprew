
import React, { useState, useEffect } from 'react';
import { Button } from '../../../../ui/Button';
import { generateTokenRightsAnalysis } from '../../../../../services/mockAiService';

interface Props {
  onChange: (rights: string[]) => void;
  data?: any;
  updateData?: (section: string, payload: any) => void;
}

export const GovernanceRights: React.FC<Props> = ({ onChange, data }) => {
  const [rights, setRights] = useState<string[]>([]);
  const [context, setContext] = useState({
      tokenModel: data?.proTokenDesign?.tokenModel || 'Equity', 
      jurisdiction: data?.jurisdiction?.country || 'USA',
      investorProfile: data?.proDistribution?.primaryInvestorType || 'Accredited',
      raiseAmount: data?.property?.raise_amount || 1000000
  });

  const [aiResult, setAiResult] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
      if (data?.proTokenDesign?.rights) {
          setRights(data.proTokenDesign.rights);
      }
      if (data?.aiResult) {
          setAiResult(data.aiResult); 
      }
  }, [data]);

  const OPTIONS = [
      { id: 'Dividend', label: 'Dividend Right', desc: 'Right to receive profit share.' },
      { id: 'Vote_Sale', label: 'Vote on Sale', desc: 'Approve asset liquidation.' },
      { id: 'Vote_Ops', label: 'Operational Vote', desc: 'Approve maintenance/vendors.' },
      { id: 'Information', label: 'Information Right', desc: 'Quarterly financial reports.' },
      { id: 'Tag_Along', label: 'Tag-Along', desc: 'Sell if majority sells.' },
      { id: 'Drag_Along', label: 'Drag-Along', desc: 'Forced sale if majority exits.' },
      { id: 'Redemption', label: 'Redemption', desc: 'Right to sell back to issuer.' },
      { id: 'Veto', label: 'Veto Power', desc: 'Block specific actions.' }
  ];

  const toggleRight = (id: string) => {
      const newRights = rights.includes(id) 
        ? rights.filter(r => r !== id)
        : [...rights, id];
      setRights(newRights);
      onChange(newRights);
  };

  const handleAnalyze = async () => {
      setIsAnalyzing(true);
      const inputs = {
          selectedRights: rights,
          ...context
      };
      const result = await generateTokenRightsAnalysis(inputs);
      setAiResult(result);
      setIsAnalyzing(false);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
        
        {/* HEADER & SELECTION */}
        <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800">
            <h4 className="text-sm font-bold text-white uppercase tracking-widest mb-4 flex items-center gap-2">
                <span className="text-xl">🗳️</span> Governance Configuration
            </h4>
            <p className="text-slate-400 text-sm mb-6 max-w-2xl">
                Select the rights embedded in your token. This defines the balance of power between you (Sponsor) and your investors.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {OPTIONS.map(opt => {
                    const isActive = rights.includes(opt.id);
                    return (
                        <button
                            key={opt.id}
                            onClick={() => toggleRight(opt.id)}
                            className={`
                                flex flex-col items-start p-4 rounded-xl border transition-all text-left group
                                ${isActive 
                                    ? 'bg-amber-900/20 border-amber-500 shadow-md shadow-amber-900/10' 
                                    : 'bg-slate-800 border-slate-700 hover:bg-slate-700'
                                }
                            `}
                        >
                            <div className="flex justify-between w-full mb-2">
                                <span className={`text-sm font-bold ${isActive ? 'text-amber-400' : 'text-slate-200'}`}>{opt.label}</span>
                                {isActive && <span className="text-amber-400 text-xs font-bold">✓</span>}
                            </div>
                            <p className="text-[10px] text-slate-500 leading-tight group-hover:text-slate-400 transition-colors">{opt.desc}</p>
                        </button>
                    )
                })}
            </div>
            
            <div className="mt-8 flex justify-center">
                <Button 
                    onClick={handleAnalyze} 
                    isLoading={isAnalyzing} 
                    disabled={rights.length === 0}
                    className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white shadow-lg px-8 py-3"
                >
                    {isAnalyzing ? 'Professor is Analyzing...' : '🎓 Generate Governance Analysis'}
                </Button>
            </div>
        </div>
        
        {/* AI OUTPUT SECTION */}
        {aiResult && (
            <div className="animate-slideUp space-y-8">
                
                {/* A. Education & Score */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                        <h4 className="text-sm font-bold text-slate-900 uppercase tracking-widest mb-4">Professor's Lecture</h4>
                        <ul className="space-y-3">
                            {(aiResult.education || []).map((point: string, i: number) => (
                                <li key={i} className="flex items-start gap-3 text-sm text-slate-600 leading-relaxed">
                                    <span className="text-amber-500 font-bold text-lg">•</span>
                                    {point}
                                </li>
                            ))}
                        </ul>
                    </div>
                    
                    <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 flex flex-col items-center justify-center text-center">
                        <div className="relative w-32 h-32 mb-4">
                            <svg className="w-full h-full transform -rotate-90">
                                <circle cx="64" cy="64" r="56" stroke="#1e293b" strokeWidth="8" fill="none" />
                                <circle cx="64" cy="64" r="56" stroke={aiResult.governanceScore > 70 ? '#10b981' : aiResult.governanceScore > 40 ? '#f59e0b' : '#ef4444'} strokeWidth="8" 
                                    strokeDasharray={351} 
                                    strokeDashoffset={351 - (351 * (aiResult.governanceScore || 0)) / 100}
                                    strokeLinecap="round"
                                    className="transition-all duration-1000 ease-out" fill="none" 
                                />
                            </svg>
                            <span className="absolute inset-0 flex items-center justify-center text-3xl font-bold text-white font-display">
                                {aiResult.governanceScore || 0}
                            </span>
                        </div>
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Governance Score</span>
                    </div>
                </div>

                {/* B. SWOT & Impact */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-emerald-50 p-6 rounded-2xl border border-emerald-100">
                        <h5 className="text-xs font-bold text-emerald-700 uppercase tracking-wider mb-3">Strengths</h5>
                        <ul className="space-y-2">
                            {(aiResult.strengths || []).map((s: string, i: number) => (
                                <li key={i} className="text-xs text-emerald-800 flex gap-2"><span>✓</span> {s}</li>
                            ))}
                        </ul>
                    </div>
                    <div className="bg-red-50 p-6 rounded-2xl border border-red-100">
                        <h5 className="text-xs font-bold text-red-700 uppercase tracking-wider mb-3">Weaknesses / Risks</h5>
                        <ul className="space-y-2">
                            {(aiResult.weaknesses || []).map((w: string, i: number) => (
                                <li key={i} className="text-xs text-red-800 flex gap-2"><span>!</span> {w}</li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* C. Regulatory & Investor Context */}
                <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 text-white">
                    <h4 className="text-sm font-bold text-amber-400 uppercase tracking-widest mb-4">Strategic Context</h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            <h5 className="text-xs font-bold text-slate-400 uppercase mb-2">Investor Impact</h5>
                            <p className="text-sm text-slate-300 leading-relaxed italic">"{aiResult.investorImpact}"</p>
                        </div>
                        <div>
                            <h5 className="text-xs font-bold text-slate-400 uppercase mb-2">Regulatory Check</h5>
                            <ul className="space-y-1">
                                {(aiResult.regulatoryNotes || []).map((n: string, i: number) => (
                                    <li key={i} className="text-xs text-slate-300 flex gap-2"><span>⚖️</span> {n}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>

                {/* D. Provider Bridge */}
                <div className="bg-gradient-to-r from-indigo-900 to-slate-900 p-8 rounded-2xl border border-indigo-500/30 relative overflow-hidden">
                    <div className="relative z-10">
                        <h4 className="text-xl font-bold text-white font-display mb-6 flex items-center gap-3">
                            <span className="text-3xl">🌉</span> Provider Bridge
                        </h4>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div>
                                <span className="text-xs font-bold text-indigo-300 uppercase block mb-2">PropertyDEX Role</span>
                                <ul className="text-xs text-slate-300 space-y-1">
                                    {(aiResult.providerBridge?.propertyDEXRole || []).map((r: string, i: number) => <li key={i}>• {r}</li>)}
                                </ul>
                            </div>
                            <div className="flex items-center justify-center text-slate-600">➔</div>
                            <div>
                                <span className="text-xs font-bold text-emerald-400 uppercase block mb-2">Execution Partners</span>
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
    </div>
  );
};
