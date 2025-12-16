
import React, { useState, useEffect } from 'react';
import { TokenBlueprintEntity, SupplyCurvePoint } from '../../domain/token_blueprint.entity';
import { Input } from '../../../../../components/ui/Input';

interface Props {
  blueprint: TokenBlueprintEntity;
  updateBlueprint: (updates: Partial<TokenBlueprintEntity>) => void;
}

export const TokenEconomicsTab: React.FC<Props> = ({ blueprint, updateBlueprint }) => {
  
  // Initialize defaults if missing
  useEffect(() => {
    if (!blueprint.supplyCurve || blueprint.supplyCurve.length === 0) {
        const initialCurve: SupplyCurvePoint[] = Array.from({ length: 5 }).map((_, i) => ({
            year: i + 1,
            amount: blueprint.totalSupply,
            inflationRate: 0
        }));
        updateBlueprint({ supplyCurve: initialCurve });
    }
    if (!blueprint.valuationReference) {
        updateBlueprint({
            valuationReference: {
                estimatedValue: blueprint.hardCap,
                pegType: 'Soft Peg'
            }
        });
    }
  }, []);

  const handleSupplyChange = (val: number) => {
      const newCap = val * blueprint.tokenPrice;
      updateBlueprint({ totalSupply: val, hardCap: newCap });
  };

  const handlePriceChange = (val: number) => {
      const newCap = blueprint.totalSupply * val;
      updateBlueprint({ tokenPrice: val, hardCap: newCap });
  };

  return (
    <div className="space-y-8 animate-fadeIn">
        
        {/* Section 1: Core Economics Matrix */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Input Controls */}
            <div className="lg:col-span-8 bg-slate-900 border border-slate-700 p-6 rounded-xl">
                <h4 className="text-sm font-bold text-emerald-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                    <span className="text-xl">💰</span> Token Generation Metrics
                </h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="text-xs text-slate-500 block mb-2 font-bold uppercase">Token Price</label>
                        <div className="relative group">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-500 font-mono">$</span>
                            <input 
                                type="number" 
                                value={blueprint.tokenPrice} 
                                onChange={e => handlePriceChange(parseFloat(e.target.value))}
                                className="w-full bg-slate-950 border border-slate-700 rounded-lg py-3 pl-8 pr-4 text-white font-mono focus:border-emerald-500 outline-none transition-all"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="text-xs text-slate-500 block mb-2 font-bold uppercase">Total Supply (Max)</label>
                        <input 
                            type="number" 
                            value={blueprint.totalSupply} 
                            onChange={e => handleSupplyChange(parseFloat(e.target.value))}
                            className="w-full bg-slate-950 border border-slate-700 rounded-lg py-3 px-4 text-white font-mono focus:border-emerald-500 outline-none transition-all"
                        />
                    </div>
                    <div className="md:col-span-2">
                        <label className="text-xs text-slate-500 block mb-2 font-bold uppercase">Market Cap / Hard Cap</label>
                        <div className="w-full bg-slate-800/50 border border-emerald-500/30 rounded-lg py-4 px-4 text-emerald-400 font-mono text-2xl font-bold text-center">
                            ${blueprint.hardCap?.toLocaleString()}
                        </div>
                    </div>
                </div>
            </div>

            {/* Valuation Link */}
            <div className="lg:col-span-4 bg-indigo-900/20 border border-indigo-500/30 p-6 rounded-xl flex flex-col justify-between relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10 text-6xl">🔗</div>
                <div>
                    <h4 className="text-sm font-bold text-indigo-300 uppercase tracking-widest mb-2">Valuation Engine</h4>
                    <p className="text-xs text-indigo-200/70 mb-6">Linked to project valuation module.</p>
                    
                    <div className="space-y-3">
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-slate-400">Ref Value</span>
                            <span className="text-white font-mono font-bold">${blueprint.valuationReference?.estimatedValue.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-slate-400">Peg Type</span>
                            <span className="px-2 py-0.5 bg-indigo-500/20 rounded text-indigo-300 text-xs font-bold uppercase">
                                {blueprint.valuationReference?.pegType || 'Soft Peg'}
                            </span>
                        </div>
                    </div>
                </div>
                <div className="mt-6 pt-4 border-t border-indigo-500/20">
                    <div className="flex items-center gap-2 text-xs text-emerald-400">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                        <span>Sync Active</span>
                    </div>
                </div>
            </div>
        </div>

        {/* Section 2: Supply Curve & Schedule */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Supply Curve */}
            <div className="bg-slate-900 border border-slate-700 p-6 rounded-xl">
                <h4 className="text-sm font-bold text-slate-300 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <span className="text-xl">📈</span> Supply Curve
                </h4>
                <div className="overflow-hidden rounded-lg border border-slate-800">
                    <table className="w-full text-xs text-left text-slate-400">
                        <thead className="bg-slate-950 uppercase font-bold">
                            <tr>
                                <th className="px-4 py-3">Year</th>
                                <th className="px-4 py-3">Circulating</th>
                                <th className="px-4 py-3 text-right">Inflation</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800">
                            {blueprint.supplyCurve?.map((point, i) => (
                                <tr key={i} className="hover:bg-slate-800/50">
                                    <td className="px-4 py-2 font-mono text-white">Y{point.year}</td>
                                    <td className="px-4 py-2 font-mono">{(point.amount * (1 + (point.inflationRate/100) * i)).toLocaleString()}</td>
                                    <td className="px-4 py-2 text-right text-emerald-400">{point.inflationRate}%</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Release Schedule (Vesting) */}
            <div className="bg-slate-900 border border-slate-700 p-6 rounded-xl">
                <h4 className="text-sm font-bold text-slate-300 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <span className="text-xl">🗓️</span> Release Schedule
                </h4>
                <div className="space-y-3">
                    {blueprint.distributionPlan.map((plan, i) => (
                        <div key={i} className="flex items-center justify-between p-3 bg-slate-950 rounded-lg border border-slate-800">
                            <div className="flex items-center gap-3">
                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold ${i === 0 ? 'bg-emerald-900/50 text-emerald-400' : 'bg-purple-900/50 text-purple-400'}`}>
                                    {plan.category.charAt(0)}
                                </div>
                                <div>
                                    <div className="text-white font-bold text-xs">{plan.category}</div>
                                    <div className="text-[10px] text-slate-500">{plan.tokenAmount.toLocaleString()} Tokens</div>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="text-xs font-mono text-amber-400">{plan.lockupPeriodMonths}m Lock</div>
                                <div className="text-[10px] text-slate-600 uppercase">{plan.vestingType}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

        </div>

    </div>
  );
};
