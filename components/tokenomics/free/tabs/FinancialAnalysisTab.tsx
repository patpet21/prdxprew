

import React, { useState } from 'react';
import { PropertyDatabaseSchema, TokenAllocation } from '../../../../types';
import { Input } from '../../../ui/Input';
import { Button } from '../../../ui/Button';
import { generateSensitivityAnalysis, generateInvestorAppeal } from '../../../../services/mockAiService';
import { YieldSimulationCard } from '../sections/YieldSimulationCard';

interface Props {
  property: PropertyDatabaseSchema;
  tokenAllocation: TokenAllocation;
  updateProp: (field: string, val: any) => void;
  onNext: () => void;
}

export const FinancialAnalysisTab: React.FC<Props> = ({ property, tokenAllocation, updateProp, onNext }) => {
  const [sensitivity, setSensitivity] = useState<any>(null);
  const [appeal, setAppeal] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleRunAnalysis = async () => {
      setIsAnalyzing(true);
      
      const baseYield = property.annual_yield || 5;
      const baseIrr = property.roi_target || 10;

      // AI Calls
      const sensResult = await generateSensitivityAnalysis(baseYield, baseIrr);
      setSensitivity({
          optimistic: sensResult?.optimisticYield || (baseYield * 1.1).toFixed(1),
          conservative: sensResult?.conservativeYield || (baseYield * 0.9).toFixed(1),
          comment: sensResult?.aiComment || "Sensitivity check complete."
      });

      const appealResult = await generateInvestorAppeal(property.token_price, tokenAllocation, baseYield);
      setAppeal(appealResult);

      setIsAnalyzing(false);
  };

  return (
    <div className="space-y-8 animate-fadeIn pb-12">
        
        {/* Input Section */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-6 flex items-center gap-2">
                 <span className="text-xl">📈</span> Financial Targets
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Input 
                    id="yield" label="Est. Annual Yield (%)" type="number" step="0.1"
                    value={property.annual_yield || ''} onChange={e => updateProp('annual_yield', parseFloat(e.target.value))} 
                />
                <Input 
                    id="irr" label="Target IRR (%)" type="number" step="0.1"
                    value={property.roi_target || ''} onChange={e => updateProp('roi_target', parseFloat(e.target.value))} 
                />
                <div className="flex items-end">
                    <Button onClick={handleRunAnalysis} isLoading={isAnalyzing} className="w-full bg-indigo-600 h-[50px]">
                        {isAnalyzing ? 'Simulating...' : 'Run Financial AI'}
                    </Button>
                </div>
            </div>
        </div>

        {/* Results Area */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-slideUp">
            
            {/* Left: Simulation Card (New) */}
            <div className="lg:col-span-5">
                <YieldSimulationCard 
                    yieldPct={property.annual_yield || 0} 
                    irrPct={property.roi_target || 0} 
                />
            </div>

            {/* Right: Metrics */}
            <div className="lg:col-span-7 space-y-6">
                {sensitivity && (
                    <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 text-white">
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">Sensitivity Analysis</h4>
                        
                        <div className="grid grid-cols-3 gap-4 text-center mb-6">
                            <div className="p-3 bg-red-900/20 border border-red-500/20 rounded-xl">
                                <span className="text-[10px] text-red-300 font-bold uppercase block mb-1">Conservative</span>
                                <span className="text-xl font-mono font-bold text-white">{sensitivity.conservative}%</span>
                            </div>
                            <div className="p-3 bg-slate-800 border border-slate-600 rounded-xl transform scale-110 shadow-lg">
                                <span className="text-[10px] text-slate-300 font-bold uppercase block mb-1">Base Case</span>
                                <span className="text-2xl font-mono font-bold text-white">{property.annual_yield}%</span>
                            </div>
                            <div className="p-3 bg-emerald-900/20 border border-emerald-500/20 rounded-xl">
                                <span className="text-[10px] text-emerald-300 font-bold uppercase block mb-1">Optimistic</span>
                                <span className="text-xl font-mono font-bold text-white">{sensitivity.optimistic}%</span>
                            </div>
                        </div>

                        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs text-slate-400 italic leading-relaxed">
                            " {sensitivity.comment} "
                        </div>
                    </div>
                )}

                {appeal && (
                    <div className="bg-gradient-to-br from-indigo-600 to-purple-700 p-6 rounded-2xl text-white shadow-xl relative overflow-hidden flex flex-col justify-between">
                        <div className="absolute top-0 right-0 p-6 opacity-10 text-8xl">★</div>
                        
                        <div>
                            <h4 className="text-xs font-bold text-indigo-200 uppercase tracking-widest mb-4">Investor Appeal Score</h4>
                            <div className="flex items-baseline gap-2 mb-2">
                                <span className="text-6xl font-bold font-display">{appeal.score}</span>
                                <span className="text-xl text-indigo-300 font-medium">/ 10</span>
                            </div>
                        </div>

                        <div className="bg-white/10 p-4 rounded-xl backdrop-blur-md border border-white/10 text-sm font-medium leading-relaxed">
                            {appeal.critique}
                        </div>
                    </div>
                )}
            </div>

        </div>

        {/* Footer Action */}
        <div className="flex justify-end pt-6 border-t border-slate-100">
             <Button 
                onClick={onNext}
                className="bg-slate-900 hover:bg-slate-800 text-white px-8 py-3 rounded-xl font-bold shadow-lg transition-all flex items-center gap-2"
             >
                Save & Next: Strategy →
             </Button>
        </div>

    </div>
  );
};