

import React, { useState, useEffect } from 'react';
import { PropertyDatabaseSchema, ComplianceData } from '../../../../types';
import { Button } from '../../../ui/Button';

interface Props {
  property: PropertyDatabaseSchema;
  compliance: ComplianceData;
  onNext: () => void;
  updateStrategy: (data: any) => void;
  savedStrategy?: any;
}

export const TokenStrategyTab: React.FC<Props> = ({ property, compliance, onNext, updateStrategy, savedStrategy }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [strategy, setStrategy] = useState<any>(savedStrategy || null);

  useEffect(() => {
    if (savedStrategy) {
        setStrategy(savedStrategy);
    }
  }, [savedStrategy]);

  const handleGenerate = () => {
      setIsGenerating(true);
      setTimeout(() => {
          const newStrategy = {
              behavior: `The token represents a fractional right to Net Operating Income from ${property.title}. Distributions are programmed quarterly via USDC airdrops.`,
              lifecycle: [
                  "1. Investor buys token (Primary Offering)",
                  "2. Holding Period: Receives quarterly yield",
                  "3. Lock-up ends: Can trade on secondary market",
                  "4. Exit Event: Property sold, token redeemed for pro-rata capital"
              ],
              complianceNote: `Compatible with ${compliance.regFramework}. Requires Whitelist enforcement in Smart Contract. Reg D investors subject to 12-month lock-up.`
          };
          setStrategy(newStrategy);
          updateStrategy(newStrategy);
          setIsGenerating(false);
      }, 1500);
  };

  return (
    <div className="space-y-8 animate-fadeIn pb-12">
        
        {!strategy ? (
             <div className="flex flex-col items-center justify-center p-12 bg-white border-2 border-dashed border-slate-200 rounded-2xl">
                 <div className="text-4xl mb-4 opacity-50">🧠</div>
                 <h3 className="text-lg font-bold text-slate-900 mb-2">Generate Token Strategy</h3>
                 <p className="text-slate-500 text-sm mb-6 text-center max-w-sm">
                     Ask the AI to simulate the token lifecycle and compliance rules based on your inputs.
                 </p>
                 <Button onClick={handleGenerate} isLoading={isGenerating} className="bg-indigo-600 hover:bg-indigo-500">
                     Generate Strategy
                 </Button>
             </div>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-slideUp">
                
                {/* A) Token Behavior */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                    <h4 className="text-sm font-bold text-indigo-600 uppercase tracking-widest mb-4 flex items-center gap-2">
                        <span className="text-xl">⚙️</span> Token Behavior
                    </h4>
                    <p className="text-slate-700 text-sm leading-relaxed">
                        {strategy.behavior}
                    </p>
                </div>

                {/* C) Compliance Interaction */}
                <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 text-white">
                    <h4 className="text-sm font-bold text-emerald-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                        <span className="text-xl">🛡️</span> Compliance Logic
                    </h4>
                    <p className="text-slate-300 text-sm leading-relaxed border-l-2 border-emerald-500 pl-4">
                        {strategy.complianceNote}
                    </p>
                </div>

                {/* B) Investor Lifecycle */}
                <div className="md:col-span-2 bg-slate-50 p-6 rounded-2xl border border-slate-200">
                    <h4 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-6">Investor Lifecycle</h4>
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4 relative">
                        {/* Connecting Line */}
                        <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-slate-200 -z-10"></div>
                        
                        {strategy.lifecycle.map((step: string, i: number) => (
                            <div key={i} className="flex flex-col items-center text-center bg-white p-4 rounded-xl border border-slate-200 shadow-sm w-full md:w-1/4 z-10">
                                <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-xs mb-3 border border-indigo-200">
                                    {i+1}
                                </div>
                                <span className="text-xs font-medium text-slate-700">{step.replace(/^\d+\.\s/, '')}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* D) Risk Notes */}
                <div className="md:col-span-2 p-4 bg-amber-50 border border-amber-200 rounded-xl flex gap-3 items-start">
                    <span className="text-xl">⚠️</span>
                    <div>
                        <h5 className="text-xs font-bold text-amber-800 uppercase mb-1">Mandatory Disclosure</h5>
                        <p className="text-xs text-amber-700 leading-relaxed">
                            This tokenomics structure carries inherent risks: <strong>Liquidity is not guaranteed.</strong> 
                            Investors must be warned that secondary markets may have low volume initially.
                        </p>
                    </div>
                </div>

            </div>
        )}

        <div className="flex justify-end pt-6 border-t border-slate-100">
             <Button 
                onClick={onNext}
                className="bg-slate-900 hover:bg-slate-800 text-white px-8 py-3 rounded-xl font-bold shadow-lg transition-all flex items-center gap-2"
                disabled={!strategy}
             >
                Save & Next: Summary →
             </Button>
        </div>
    </div>
  );
};