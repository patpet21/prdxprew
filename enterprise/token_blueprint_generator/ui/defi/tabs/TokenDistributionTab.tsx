
import React, { useState, useEffect } from 'react';
import { TokenBlueprintEntity } from '../../domain/token_blueprint.entity';
import { tokenBlueprintService } from '../../../services/token_blueprint_service';
import { Button } from '../../../../../components/ui/Button';

interface Props {
  blueprint: TokenBlueprintEntity;
  updateBlueprint: (updates: Partial<TokenBlueprintEntity>) => void;
}

export const TokenDistributionTab: React.FC<Props> = ({ blueprint, updateBlueprint }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  
  const handleAiGenerate = async () => {
      setIsGenerating(true);
      const newDistribution = await tokenBlueprintService.generateDistributionModel(blueprint);
      updateBlueprint({ distributionPlan: newDistribution });
      setIsGenerating(false);
  };

  const handleSliderChange = (idx: number, newVal: number) => {
      const newPlan = [...blueprint.distributionPlan];
      newPlan[idx].percentage = newVal;
      newPlan[idx].tokenAmount = (newVal / 100) * blueprint.totalSupply;
      updateBlueprint({ distributionPlan: newPlan });
  };

  const totalAllocated = blueprint.distributionPlan.reduce((acc, item) => acc + item.percentage, 0);

  return (
    <div className="space-y-8 animate-fadeIn">
        
        {/* Header */}
        <div className="flex justify-between items-center">
            <div>
                <h4 className="text-xl font-bold text-white flex items-center gap-2">
                    <span className="text-2xl">🍰</span> Cap Table Allocation
                </h4>
                <p className="text-slate-400 text-sm mt-1">Configure investor splits and vesting schedules.</p>
            </div>
            <Button 
                onClick={handleAiGenerate} 
                isLoading={isGenerating}
                className="bg-indigo-600 hover:bg-indigo-500 text-xs uppercase tracking-wider"
            >
                {isGenerating ? 'Optimizing...' : 'AI Generate Model'}
            </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left: Interactive Sliders */}
            <div className="lg:col-span-7 space-y-4">
                <div className="bg-slate-900 border border-slate-700 rounded-xl p-6">
                    <div className="flex justify-between items-center mb-6">
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Allocation Breakdown</span>
                        <span className={`text-xs font-bold px-3 py-1 rounded-full ${totalAllocated === 100 ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/50' : 'bg-red-500/20 text-red-400 border border-red-500/50'}`}>
                            Total: {totalAllocated}%
                        </span>
                    </div>

                    <div className="space-y-6">
                        {blueprint.distributionPlan.map((item, idx) => (
                            <div key={idx} className="group">
                                <div className="flex justify-between items-end mb-2">
                                    <div className="flex items-center gap-2">
                                        <div className={`w-3 h-3 rounded-full ${idx === 0 ? 'bg-blue-500' : idx === 1 ? 'bg-purple-500' : idx === 2 ? 'bg-amber-500' : 'bg-slate-500'}`}></div>
                                        <span className="text-sm font-bold text-white">{item.category}</span>
                                        <span className="text--[10px] text-slate-500 bg-slate-800 px-2 py-0.5 rounded ml-2">{item.vestingType}</span>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-sm font-mono font-bold text-emerald-400">{item.percentage}%</span>
                                        <span className="text-[10px] text-slate-500 block">{(item.tokenAmount || 0).toLocaleString()} Tokens</span>
                                    </div>
                                </div>
                                <input 
                                    type="range" min="0" max="100" step="1"
                                    value={item.percentage}
                                    onChange={(e) => handleSliderChange(idx, parseInt(e.target.value))}
                                    className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-white hover:accent-emerald-400 transition-colors"
                                />
                                <div className="flex justify-between mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <span className="text-[10px] text-slate-500">Lock: {item.lockupPeriodMonths}m</span>
                                    <span className="text-[10px] text-slate-500">{item.description}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Right: Vesting Visualizer */}
            <div className="lg:col-span-5 flex flex-col space-y-6">
                <div className="bg-slate-900 border border-slate-700 rounded-xl p-6 flex-1 flex flex-col relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10 text-6xl">📉</div>
                    <h5 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-6">Emission Schedule</h5>
                    
                    {/* CSS Chart Mockup */}
                    <div className="flex-1 flex items-end gap-1 pb-6 border-b border-slate-800">
                        {Array.from({length: 12}).map((_, i) => {
                            const height = 20 + (i * 5) + (Math.random() * 10);
                            return (
                                <div key={i} className="flex-1 flex flex-col justify-end group relative">
                                    <div 
                                        style={{ height: `${height}%` }} 
                                        className="w-full bg-indigo-600/50 border-t-2 border-indigo-400 rounded-t transition-all group-hover:bg-indigo-500"
                                    ></div>
                                </div>
                            )
                        })}
                    </div>
                    
                    <div className="mt-4 grid grid-cols-2 gap-4">
                         <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                             <span className="text-[10px] text-slate-500 uppercase block">Circulating Year 1</span>
                             <span className="text-lg font-mono text-white font-bold">{((blueprint.totalSupply || 0) * 0.4).toLocaleString()}</span>
                         </div>
                         <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                             <span className="text-[10px] text-slate-500 uppercase block">Fully Diluted</span>
                             <span className="text-lg font-mono text-slate-400 font-bold">{(blueprint.totalSupply || 0).toLocaleString()}</span>
                         </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
};
