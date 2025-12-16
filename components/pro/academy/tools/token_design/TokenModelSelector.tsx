
import React, { useState, useEffect } from 'react';
import { generateTokenModelAnalysis } from '../../../../../services/mockAiService';
import { Button } from '../../../../ui/Button';

interface Props {
  selected: string;
  onSelect: (model: string) => void;
  // New props for context
  data?: any;
  onUpdate?: (data: any) => void;
  onNext?: () => void;
}

const MODELS = [
    {
        id: 'Equity',
        icon: '🏢',
        title: 'Equity Token',
        desc: 'Direct ownership share in the SPV.',
        pros: ['Capital Appreciation', 'Voting Rights'],
        cons: ['Complex Compliance', 'Illiquid initially']
    },
    {
        id: 'Debt',
        icon: '💳',
        title: 'Debt / Bond',
        desc: 'Fixed income instrument backed by asset.',
        pros: ['Predictable Yield', 'Easier Exit'],
        cons: ['No Upside', 'Default Risk']
    },
    {
        id: 'Revenue',
        icon: '💸',
        title: 'Revenue Share',
        desc: 'Right to cashflow only, no equity.',
        pros: ['Flexible', 'Non-dilutive'],
        cons: ['Security classification', 'Ops Heavy']
    },
    {
        id: 'Hybrid',
        icon: '🧬',
        title: 'Hybrid (Conv. Note)',
        desc: 'Debt that converts to Equity on trigger.',
        pros: ['Best of both', 'Investor protection'],
        cons: ['Complex Logic', 'Hard to explain']
    }
];

export const TokenModelSelector: React.FC<Props> = ({ selected, onSelect, data, onUpdate, onNext }) => {
  // Local state for context if not provided
  const [inputs, setInputs] = useState({
      jurisdiction: 'USA',
      assetClass: 'Real Estate',
      investorProfile: 'Accredited',
      raiseAmount: 1000000,
      riskTolerance: 'Medium'
  });

  const [aiResult, setAiResult] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Initialize from props if available
  useEffect(() => {
      if (data) {
          if (data.inputs) setInputs(data.inputs);
          if (data.aiResult) setAiResult(data.aiResult);
      }
  }, []);

  const handleChange = (field: string, val: any) => {
      setInputs(prev => ({ ...prev, [field]: val }));
  };

  const handleAskProfessor = async () => {
      if (!selected) {
          alert("Please select a Token Model first.");
          return;
      }
      setIsAnalyzing(true);
      const fullContext = { ...inputs, tokenModel: selected };
      const result = await generateTokenModelAnalysis(fullContext);
      setAiResult(result);
      setIsAnalyzing(false);
  };

  const handleSaveNext = () => {
      setIsSaving(true);
      if (onUpdate) {
          onUpdate({ inputs, aiResult, selectedModel: selected });
      }
      setTimeout(() => {
          setIsSaving(false);
          if (onNext) onNext();
      }, 500);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
        
        {/* SECTION 1: CONTEXT INPUTS */}
        <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800">
            <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                <span className="text-xl">⚙️</span> Strategic Context
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                 <div>
                    <label className="text-xs font-bold text-slate-500 uppercase block mb-2">Jurisdiction</label>
                    <select 
                        value={inputs.jurisdiction}
                        onChange={e => handleChange('jurisdiction', e.target.value)}
                        className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white outline-none focus:border-indigo-500"
                    >
                        <option>USA</option>
                        <option>EU (MiCA)</option>
                        <option>UK</option>
                        <option>UAE</option>
                        <option>Global/Offshore</option>
                    </select>
                </div>
                 <div>
                    <label className="text-xs font-bold text-slate-500 uppercase block mb-2">Asset Class</label>
                    <select 
                        value={inputs.assetClass}
                        onChange={e => handleChange('assetClass', e.target.value)}
                        className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white outline-none focus:border-indigo-500"
                    >
                        <option>Real Estate</option>
                        <option>Business Equity</option>
                        <option>Debt</option>
                        <option>Art</option>
                        <option>Funds</option>
                    </select>
                </div>
                <div>
                    <label className="text-xs font-bold text-slate-500 uppercase block mb-2">Target Investor</label>
                    <select 
                        value={inputs.investorProfile}
                        onChange={e => handleChange('investorProfile', e.target.value)}
                        className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white outline-none focus:border-indigo-500"
                    >
                        <option>Retail</option>
                        <option>Accredited</option>
                        <option>Institutional</option>
                    </select>
                </div>
                <div>
                    <label className="text-xs font-bold text-slate-500 uppercase block mb-2">Raise Amount</label>
                    <input 
                        type="number"
                        value={inputs.raiseAmount}
                        onChange={e => handleChange('raiseAmount', parseFloat(e.target.value))}
                        className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white outline-none focus:border-indigo-500"
                    />
                </div>
                 <div>
                    <label className="text-xs font-bold text-slate-500 uppercase block mb-2">Risk Tolerance</label>
                    <select 
                        value={inputs.riskTolerance}
                        onChange={e => handleChange('riskTolerance', e.target.value)}
                        className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white outline-none focus:border-indigo-500"
                    >
                        <option>Low</option>
                        <option>Medium</option>
                        <option>High</option>
                    </select>
                </div>
            </div>
        </div>

        {/* SECTION 2: MODEL SELECTION */}
        <div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {MODELS.map(m => (
                    <button
                        key={m.id}
                        onClick={() => onSelect(m.id)}
                        className={`
                            text-left p-5 rounded-xl border-2 transition-all group flex flex-col h-full
                            ${selected === m.id 
                                ? 'bg-indigo-600 border-indigo-600 text-white shadow-xl transform scale-[1.02]' 
                                : 'bg-white border-slate-200 hover:border-indigo-400 hover:shadow-md'
                            }
                        `}
                    >
                        <div className="flex justify-between items-start mb-3">
                            <span className="text-3xl">{m.icon}</span>
                            {selected === m.id && <span className="bg-white/20 px-2 py-0.5 rounded text-[10px] font-bold uppercase">Selected</span>}
                        </div>
                        <h4 className={`font-bold text-lg mb-1 ${selected === m.id ? 'text-white' : 'text-slate-900'}`}>{m.title}</h4>
                        <p className={`text-xs mb-4 flex-1 leading-relaxed ${selected === m.id ? 'text-indigo-100' : 'text-slate-500'}`}>{m.desc}</p>
                        
                        <div className="space-y-1">
                            {m.pros.map(p => (
                                <div key={p} className="flex items-center gap-2 text-[10px] font-bold uppercase">
                                    <span className={selected === m.id ? 'text-emerald-300' : 'text-emerald-600'}>✓</span> 
                                    <span className={selected === m.id ? 'text-white' : 'text-slate-600'}>{p}</span>
                                </div>
                            ))}
                        </div>
                    </button>
                ))}
            </div>

            <div className="mt-8 flex justify-center">
                 <Button 
                    onClick={handleAskProfessor} 
                    isLoading={isAnalyzing} 
                    className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-xl px-10 py-3 text-lg"
                 >
                     {isAnalyzing ? 'Professor is Thinking...' : '🎓 Ask the Professor'}
                 </Button>
            </div>
        </div>

        {/* SECTION 3: AI OUTPUT */}
        {aiResult && (
            <div className="animate-slideUp space-y-8">
                
                {/* A. Education Block */}
                <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-2 h-full bg-indigo-500"></div>
                    <h4 className="text-lg font-bold text-indigo-900 mb-4 flex items-center gap-2">
                        <span>📚</span> Professor's Lecture
                    </h4>
                    <div className="prose prose-sm max-w-none text-slate-600">
                        <p>{aiResult.education}</p>
                    </div>
                    
                    <div className="mt-6 p-4 bg-indigo-50 rounded-xl border border-indigo-100">
                        <h5 className="text-xs font-bold text-indigo-800 uppercase mb-2">Why This Step Matters</h5>
                        <p className="text-sm text-indigo-700 italic">"{aiResult.reasoningWhyThisStepExists}"</p>
                    </div>
                </div>

                {/* B. Personalized Analysis */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 text-white">
                        <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Compatibility Analysis</h4>
                        
                        <div className="mb-6 flex items-center justify-between">
                            <span className="text-sm font-bold">Model Fit Score</span>
                            <div className="flex items-center gap-3">
                                <div className="w-32 h-3 bg-slate-800 rounded-full overflow-hidden">
                                    <div 
                                        className={`h-full transition-all duration-1000 ${aiResult.analysis?.compatibilityScore > 80 ? 'bg-emerald-500' : 'bg-amber-500'}`} 
                                        style={{ width: `${aiResult.analysis?.compatibilityScore || 0}%` }}
                                    ></div>
                                </div>
                                <span className="font-mono text-xl font-bold">{aiResult.analysis?.compatibilityScore || 0}/100</span>
                            </div>
                        </div>

                        <ul className="space-y-3 text-sm">
                            <li className="flex justify-between border-b border-slate-800 pb-2">
                                <span className="text-slate-400">Reasoning</span>
                                <span className="text-white text-right max-w-[200px] truncate">{aiResult.analysis?.compatibilityReason || 'N/A'}</span>
                            </li>
                            <li className="flex justify-between border-b border-slate-800 pb-2">
                                <span className="text-slate-400">Regulatory Impact</span>
                                <span className="text-white text-right max-w-[200px] truncate">{aiResult.analysis?.regulatoryImplication || 'N/A'}</span>
                            </li>
                             <li className="flex justify-between border-b border-slate-800 pb-2">
                                <span className="text-slate-400">Ops Burden</span>
                                <span className={`font-bold ${aiResult.analysis?.operationalBurden === 'High' ? 'text-red-400' : 'text-emerald-400'}`}>{aiResult.analysis?.operationalBurden || 'N/A'}</span>
                            </li>
                        </ul>
                    </div>

                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                        <h4 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4">Impact Report</h4>
                        <div className="grid grid-cols-1 gap-4">
                            <div className="p-3 bg-red-50 border border-red-100 rounded-lg">
                                <h5 className="text-xs font-bold text-red-600 uppercase mb-1">Legal Notes</h5>
                                <ul className="list-disc list-inside text-xs text-red-800">
                                    {aiResult.legalNotes?.map((n: string, i: number) => <li key={i}>{n}</li>)}
                                </ul>
                            </div>
                             <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-lg">
                                <h5 className="text-xs font-bold text-emerald-600 uppercase mb-1">Investor Impact</h5>
                                <ul className="list-disc list-inside text-xs text-emerald-800">
                                    {aiResult.investorImpact?.map((n: string, i: number) => <li key={i}>{n}</li>)}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                {/* C. PROVIDER BRIDGE */}
                <div className="bg-slate-800 p-8 rounded-2xl border border-slate-700 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>
                    
                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-6">
                            <span className="text-3xl">🌉</span>
                            <h3 className="text-xl font-bold text-white">The Provider Bridge</h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                             {/* Col 1: PropertyDEX */}
                             <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-600">
                                 <h5 className="text-xs font-bold text-blue-400 uppercase mb-2">PropertyDEX Role</h5>
                                 <ul className="text-xs text-slate-300 space-y-1">
                                     {aiResult.providerBridge?.propertyDEXRole?.map((r: string, i: number) => <li key={i}>• {r}</li>)}
                                 </ul>
                             </div>
                             
                             {/* Arrow */}
                             <div className="hidden md:flex items-center justify-center text-slate-500 text-2xl">➔</div>

                             {/* Col 2: Partners */}
                             <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-600">
                                 <h5 className="text-xs font-bold text-emerald-400 uppercase mb-2">Real World Partners</h5>
                                 <ul className="text-xs text-slate-300 space-y-1">
                                     {aiResult.providerBridge?.partnerTypes?.map((r: string, i: number) => <li key={i}>• {r}</li>)}
                                 </ul>
                             </div>
                        </div>

                        <div className="p-4 bg-blue-900/20 border border-blue-500/30 rounded-xl">
                            <p className="text-sm text-blue-200 italic">
                                <strong>Why this saves you money:</strong> {aiResult.providerBridge?.valueAdd}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Final Rec */}
                <div className="text-center p-6 border-t-2 border-slate-100">
                    <h5 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Professor's Final Verdict</h5>
                    <p className="text-xl font-bold text-slate-900">"{aiResult.finalRecommendation}"</p>
                </div>

            </div>
        )}

        {/* FOOTER ACTION */}
        <div className="flex justify-end pt-6 border-t border-slate-200">
             <Button 
                onClick={handleSaveNext} 
                disabled={isSaving}
                className="bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg px-8 py-3 font-bold"
            >
                {isSaving ? 'Saving...' : 'Save & Next Section →'}
            </Button>
        </div>

    </div>
  );
};
