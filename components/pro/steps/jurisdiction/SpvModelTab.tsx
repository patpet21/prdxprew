
import React, { useState, useEffect } from 'react';
import { TokenizationState } from '../../../../types';
import { getSpvModelStrategy } from '../../../../services/mockAiService';

interface Props {
  data: TokenizationState;
  updateData: (section: keyof TokenizationState, payload: any) => void;
  onNavigate?: (page: string) => void;
}

const SNIPPETS = {
    local_only: [
        "Best when asset and investors are in same country",
        "Simpler legal chain but less flexible internationally",
        "Often higher tax burden / less attractive to global investors"
    ],
    foreign_only: [
        "Good for global investors and flexible governance",
        "Sometimes still requires a local holder SPV in asset country",
        "Tax-efficient but needs proper legal structuring"
    ],
    double_spv: [
        "Standard for serious cross-border tokenization",
        "Local SPV holds the asset, foreign SPV issues the tokens",
        "More setup cost but best balance of legality + flexibility"
    ]
};

const SPV_STRATEGIES = [
    { 
        id: 'Local', 
        label: 'Local SPV Only', 
        icon: '🏠',
        color: 'bg-emerald-500',
        borderColor: 'border-emerald-500',
        textColor: 'text-emerald-700',
        detail: 'Simplest. Asset and Investors in same jurisdiction.',
        snippetKey: 'local_only'
    },
    { 
        id: 'Foreign', 
        label: 'Foreign SPV Only', 
        icon: '🌊',
        color: 'bg-blue-500',
        borderColor: 'border-blue-500',
        textColor: 'text-blue-700',
        detail: 'Asset held directly by offshore entity. Higher scrutiny.',
        snippetKey: 'foreign_only'
    },
    { 
        id: 'Double', 
        label: 'Double SPV (OpCo/HoldCo)', 
        icon: '🏢',
        color: 'bg-amber-500',
        borderColor: 'border-amber-500',
        textColor: 'text-amber-700',
        detail: 'Institutional standard. Local Asset Co + Foreign Hold Co.',
        snippetKey: 'double_spv'
    }
];

// Countries where "Foreign Only" is typically blocked for Real Estate (Requires Local Entity on Title)
const RESTRICTED_COUNTRIES = ["IT", "FR", "DE", "PT", "TH", "ID"]; 

export const SpvModelTab: React.FC<Props> = ({ data, updateData, onNavigate }) => {
  const { jurisdiction, property, projectInfo } = data;
  const currentStrategy = jurisdiction.baseContext?.spvStructuring;
  const assetClass = property.category || 'Real Estate';
  // Parse country code (e.g., 'IT' from 'IT', or 'US' from 'US-DE')
  const assetCountryCode = jurisdiction.baseContext?.assetCountry?.split('-')[0] || ''; 
  const geoIntent = projectInfo.geoIntent || 'Global';
  const targetRegions = jurisdiction.targetRegions || [];

  // Local state
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [aiRecommendation, setAiRecommendation] = useState<{recommendedModel: string, reasoning: string, riskFactor: string} | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);
  
  // --- LOGIC ENGINE ---

  // 1. Determine Allowed Strategies based on Asset Class
  const getAssetClassLogic = (category: string) => {
      switch (category) {
          case 'Real Estate': return ['Local', 'Foreign', 'Double'];
          case 'Business': return ['Foreign', 'Double']; 
          case 'Art': return ['Foreign', 'Double']; 
          case 'Debt': return ['Foreign', 'Double'];
          case 'Energy': return ['Double']; 
          case 'Funds': return ['Foreign', 'Double'];
          default: return ['Local', 'Foreign', 'Double'];
      }
  };

  // 2. Check for Local SPV Requirement (Overrides "Foreign Only")
  const checkLocalRequirement = (countryCode: string) => {
      return RESTRICTED_COUNTRIES.includes(countryCode);
  };

  const allowedStrategies = getAssetClassLogic(assetClass);
  const requiresLocal = checkLocalRequirement(assetCountryCode);

  const handleSelect = (strategy: 'Local' | 'Foreign' | 'Double') => {
      let effectiveStrategy = strategy;
      
      if (requiresLocal && strategy === 'Foreign') {
          alert(`Notice: ${assetCountryCode} requires a local entity to hold the asset title. We will structure this as a Double SPV.`);
          effectiveStrategy = 'Double';
      }

      updateData('jurisdiction', { 
          baseContext: { ...jurisdiction.baseContext, spvStructuring: effectiveStrategy } 
      });
  };

  const handleAskAi = async () => {
      setIsAiLoading(true);
      const result = await getSpvModelStrategy(assetClass, geoIntent, targetRegions);
      if(result) {
          setAiRecommendation(result);
          // Auto select recommendation if none selected
          if (!currentStrategy) {
              handleSelect(result.recommendedModel as any);
          }
      }
      setIsAiLoading(false);
  };

  // Display snippets based on active selection or hover
  const activeId = hoveredId || currentStrategy;
  const activeSnippet = activeId 
    ? SNIPPETS[SPV_STRATEGIES.find(s => s.id === activeId)?.snippetKey as keyof typeof SNIPPETS] 
    : null;

  return (
    <div className="space-y-8 animate-fadeIn">
        
        {/* Logic Feedback Banners */}
        <div className="flex flex-col gap-2">
            {requiresLocal && (
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-center gap-3 animate-slideUp shadow-sm">
                    <span className="text-xl">⚠️</span>
                    <p className="text-sm text-amber-800">
                        <strong>Restricted Jurisdiction:</strong> Real Estate in {assetCountryCode} typically requires a local entity to hold title. "Foreign Only" structures are disabled or upgraded to Double SPV.
                    </p>
                </div>
            )}
            
            {/* AI Recommendation Banner */}
            {aiRecommendation && (
                <div className="p-5 bg-gradient-to-r from-indigo-900 to-purple-900 border border-indigo-500/50 rounded-xl animate-fadeIn relative overflow-hidden shadow-lg">
                    <div className="absolute top-0 right-0 p-4 opacity-10 text-6xl text-white">🤖</div>
                    <div className="relative z-10">
                        <div className="flex items-center gap-2 mb-2">
                            <span className="text-xs font-bold bg-white text-indigo-900 px-2 py-0.5 rounded shadow-sm uppercase tracking-wide">AI Strategy</span>
                            <span className="text-sm font-bold text-indigo-100">Recommends: <span className="text-white underline">{aiRecommendation.recommendedModel} SPV</span></span>
                        </div>
                        <p className="text-sm text-indigo-100 leading-relaxed italic">"{aiRecommendation.reasoning}"</p>
                        <p className="text-xs text-amber-300 mt-2 font-bold">Risk Factor: {aiRecommendation.riskFactor}</p>
                    </div>
                </div>
            )}
        </div>

        {/* 1. Strategy Selection Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {SPV_STRATEGIES.map((strat) => {
                const isSelected = currentStrategy === strat.id;
                const isRecommended = aiRecommendation?.recommendedModel === strat.id;
                
                // Determine if disabled based on logic
                let isDisabled = !allowedStrategies.includes(strat.id);
                let disabledReason = "Not available for this Asset Class";

                // Specific Override: If Local Required, disable Foreign Only
                if (requiresLocal && strat.id === 'Foreign') {
                    isDisabled = true;
                    disabledReason = `Restricted in ${assetCountryCode}`;
                }

                return (
                    <button
                        key={strat.id}
                        onClick={() => !isDisabled && handleSelect(strat.id as any)}
                        onMouseEnter={() => setHoveredId(strat.id)}
                        onMouseLeave={() => setHoveredId(null)}
                        disabled={isDisabled}
                        className={`
                            relative p-6 rounded-2xl border-2 transition-all duration-300 group overflow-hidden flex flex-col items-center text-center h-full
                            ${isDisabled 
                                ? 'bg-slate-100 border-slate-200 opacity-50 cursor-not-allowed' 
                                : isSelected 
                                    ? `bg-white ${strat.borderColor} ring-2 ring-offset-2 ring-${strat.color.split('-')[1]}-200 shadow-xl scale-[1.02] z-10` 
                                    : 'bg-white border-slate-200 hover:border-indigo-300 hover:shadow-lg'
                            }
                        `}
                    >
                        {/* Recommendation Badge */}
                        {isRecommended && !isDisabled && (
                            <div className="absolute top-0 right-0">
                                <span className="bg-emerald-500 text-white text-[10px] font-bold px-3 py-1 rounded-bl-lg uppercase tracking-wider shadow-md">
                                    AI Pick
                                </span>
                            </div>
                        )}

                        <div className={`
                            w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mb-4 shadow-md transition-transform group-hover:scale-110
                            ${isSelected ? strat.color + ' text-white' : 'bg-slate-50 text-slate-500 border border-slate-100'}
                        `}>
                            {strat.icon}
                        </div>
                        
                        <h4 className={`text-lg font-bold font-display mb-2 ${isSelected ? 'text-slate-900' : 'text-slate-700'}`}>
                            {strat.label}
                        </h4>
                        
                        <p className={`text-xs leading-relaxed ${isSelected ? 'text-slate-600' : 'text-slate-500'}`}>
                            {strat.detail}
                        </p>

                        {isDisabled && (
                            <div className="mt-4 px-2 py-1 bg-red-100 text-red-600 rounded text-[10px] font-bold uppercase border border-red-200">
                                {disabledReason}
                            </div>
                        )}

                        {isSelected && (
                            <div className="mt-4 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-[10px] font-bold uppercase tracking-wider">
                                Active Model
                            </div>
                        )}
                    </button>
                );
            })}
        </div>

        {/* 2. AI Analysis Panel (The "Refresh" Snippets) */}
        <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden relative min-h-[180px] shadow-2xl">
            {/* Background Mesh */}
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
            
            {activeSnippet ? (
                <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-12 gap-6 relative z-10 animate-slideUp">
                    {/* Left: Indicator */}
                    <div className="md:col-span-3 flex flex-col justify-center border-b md:border-b-0 md:border-r border-slate-700 pb-4 md:pb-0">
                        <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Information</div>
                        <div className="text-xl font-bold text-white font-display">
                            {activeId} Structure
                        </div>
                    </div>

                    {/* Right: The 3 Lines from Snippets */}
                    <div className="md:col-span-9 space-y-4">
                        {activeSnippet.map((line, idx) => (
                            <div key={idx} className="flex gap-4 items-start">
                                <div className={`
                                    w-6 h-6 rounded flex items-center justify-center text-xs font-bold shrink-0 mt-0.5
                                    ${idx === 0 ? 'bg-emerald-500/20 text-emerald-400' : idx === 1 ? 'bg-blue-500/20 text-blue-400' : 'bg-amber-500/20 text-amber-400'}
                                `}>
                                    {idx === 0 ? '✓' : idx === 1 ? 'ℹ' : '!'}
                                </div>
                                <div>
                                    <p className="text-sm text-slate-300 leading-relaxed font-medium">
                                        {line}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center h-full p-8 text-slate-500">
                    <span className="text-4xl mb-4 grayscale opacity-20">🧠</span>
                    <p className="text-sm font-medium mb-4">Unsure which model fits your needs?</p>
                    <button 
                        onClick={handleAskAi}
                        disabled={isAiLoading}
                        className="px-8 py-3 bg-white hover:bg-slate-200 text-slate-900 font-bold rounded-full shadow-lg transition-all flex items-center gap-2 transform hover:scale-105"
                    >
                        {isAiLoading ? 'Analyzing...' : 'Ask AI Strategist'}
                    </button>
                </div>
            )}
        </div>

        {/* 3. Academy Link */}
        <div className="flex justify-center pt-4">
            <div className="bg-white border border-slate-200 rounded-full p-1 pl-5 pr-2 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow">
                <span className="text-xs text-slate-500 font-medium hidden sm:inline">
                    Confused about SPVs vs Holding Companies?
                </span>
                <button 
                    onClick={() => onNavigate && onNavigate('PRO_ACADEMY')}
                    className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold uppercase tracking-wider px-4 py-2 rounded-full transition-all flex items-center gap-2"
                >
                    Open Academy <span className="text-slate-300">→</span>
                </button>
            </div>
        </div>

    </div>
  );
};
