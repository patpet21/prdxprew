
import React, { useState } from 'react';
import { entJurisdictionService } from '../../services/ent_jurisdiction_service';

interface Props {
  data: any;
  updateData: (field: string, val: any) => void;
}

const SPV_STRATEGIES = [
    { 
        id: 'Local', 
        label: 'Local SPV Only', 
        icon: '🏠',
        color: 'bg-emerald-500',
        borderColor: 'border-emerald-500',
        detail: 'Simplest. Asset and Investors in same jurisdiction.'
    },
    { 
        id: 'Foreign', 
        label: 'Foreign SPV Only', 
        icon: '🌊',
        color: 'bg-blue-500',
        borderColor: 'border-blue-500',
        detail: 'Asset held directly by offshore entity. Higher scrutiny.'
    },
    { 
        id: 'Double', 
        label: 'Double SPV (OpCo/HoldCo)', 
        icon: '🏢',
        color: 'bg-amber-500',
        borderColor: 'border-amber-500',
        detail: 'Institutional standard. Local Asset Co + Foreign Hold Co.'
    }
];

export const EntSpvModelTab: React.FC<Props> = ({ data, updateData }) => {
  const { baseContext, property, projectInfo } = data;
  const currentStrategy = baseContext?.spvStructuring;
  const assetClass = property?.category || 'Real Estate';
  
  const [aiRecommendation, setAiRecommendation] = useState<any>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);

  const handleSelect = (strategy: string) => {
      updateData('baseContext', { ...baseContext, spvStructuring: strategy });
  };

  const handleAskAi = async () => {
      setIsAiLoading(true);
      const result = await entJurisdictionService.generateSpvStrategy(
          assetClass, 
          projectInfo?.geoIntent || 'Global', 
          []
      );
      
      if(result) {
          setAiRecommendation(result);
          if (!currentStrategy) {
              handleSelect((result as any).recommendedModel);
          }
      }
      setIsAiLoading(false);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
        
        {/* AI Recommendation Banner */}
        {aiRecommendation && (
            <div className="p-4 bg-gradient-to-r from-indigo-900/50 to-purple-900/50 border border-indigo-500/50 rounded-xl animate-fadeIn relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10 text-6xl">🤖</div>
                <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs font-bold bg-indigo-500 text-white px-2 py-0.5 rounded">AI Strategy</span>
                        <span className="text-sm font-bold text-indigo-200">Recommends: <span className="text-white underline">{aiRecommendation.recommendedModel} SPV</span></span>
                    </div>
                    <p className="text-sm text-slate-300 leading-relaxed italic">"{aiRecommendation.reasoning}"</p>
                </div>
            </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {SPV_STRATEGIES.map((strat) => {
                const isSelected = currentStrategy === strat.id;
                const isRecommended = aiRecommendation?.recommendedModel === strat.id;

                return (
                    <button
                        key={strat.id}
                        onClick={() => handleSelect(strat.id)}
                        className={`
                            relative p-6 rounded-2xl border-2 transition-all duration-300 group overflow-hidden flex flex-col items-center text-center h-full
                            ${isSelected 
                                ? `bg-slate-800 ${strat.borderColor} shadow-xl scale-[1.02]` 
                                : 'bg-slate-900 border-slate-800 hover:border-slate-600'
                            }
                        `}
                    >
                        {isRecommended && (
                            <div className="absolute top-0 right-0">
                                <span className="bg-emerald-500 text-slate-900 text-[10px] font-bold px-2 py-1 rounded-bl-lg uppercase tracking-wider shadow-lg">
                                    AI Pick
                                </span>
                            </div>
                        )}

                        <div className={`
                            w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mb-4 shadow-lg transition-transform group-hover:scale-110
                            ${isSelected ? strat.color : 'bg-slate-950 text-slate-400 border border-slate-800'}
                        `}>
                            {strat.icon}
                        </div>
                        
                        <h4 className={`text-lg font-bold font-display mb-2 ${isSelected ? 'text-white' : 'text-slate-300'}`}>
                            {strat.label}
                        </h4>
                        
                        <p className={`text-xs leading-relaxed ${isSelected ? 'text-slate-300' : 'text-slate-500'}`}>
                            {strat.detail}
                        </p>

                        {isSelected && (
                            <div className="mt-4 px-3 py-1 rounded-full bg-slate-900 border border-slate-700 text-[10px] font-bold uppercase tracking-wider text-white">
                                Selected
                            </div>
                        )}
                    </button>
                );
            })}
        </div>

        {!currentStrategy && !aiRecommendation && (
             <div className="flex flex-col items-center justify-center p-8 text-slate-600 border-2 border-dashed border-slate-800 rounded-2xl bg-slate-900/30">
                <span className="text-4xl mb-4 grayscale opacity-20">🧠</span>
                <p className="text-sm font-medium mb-4">Unsure which model fits your needs?</p>
                <button 
                    onClick={handleAskAi}
                    disabled={isAiLoading}
                    className="px-6 py-2 bg-indigo-600 text-white font-bold rounded-full shadow-lg hover:bg-indigo-500 transition-all"
                >
                    {isAiLoading ? 'Analyzing...' : 'Ask AI Strategist'}
                </button>
            </div>
        )}

    </div>
  );
};
