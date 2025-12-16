
import React, { useMemo, useState } from 'react';
import { PropertyDatabaseSchema, TokenAllocation } from '../../../../types';
import { Input } from '../../../ui/Input';
import { AllocationChart } from '../../AllocationChart';
import { TokenPurposeSelector } from '../sections/TokenPurposeSelector';
import { TokenPresets } from '../sections/TokenPresets';
import { AiSupplyValidator } from '../sections/AiSupplyValidator';
import { Button } from '../../../ui/Button';

interface Props {
  property: PropertyDatabaseSchema;
  tokenAllocation: TokenAllocation;
  updateProp: (field: string, val: any) => void;
  updateAlloc: (key: string, val: number) => void;
  onNext: () => void;
}

export const TokenConfigTab: React.FC<Props> = ({ property, tokenAllocation, updateProp, updateAlloc, onNext }) => {
  
  const [tokenModel, setTokenModel] = useState('Equity');

  // Capital Efficiency Calculation
  const metrics = useMemo(() => {
    const supply = property.total_tokens || 0;
    const price = property.token_price || 0;
    const marketCap = supply * price;
    
    // Investor Allocation % * Market Cap = Actual Raise
    const investorShare = tokenAllocation.investors || 0;
    const actualRaise = marketCap * (investorShare / 100);
    
    const efficiency = marketCap > 0 ? (actualRaise / marketCap) * 100 : 0;
    
    return { marketCap, actualRaise, efficiency };
  }, [property.total_tokens, property.token_price, tokenAllocation.investors]);

  const handlePresetSelect = (data: any) => {
      updateProp('token_price', data.price);
      updateProp('total_tokens', data.supply);
      updateProp('annual_yield', data.yield);
      if (data.allocation) {
          // Batch update allocation - simplified for demo
          Object.keys(data.allocation).forEach(k => updateAlloc(k, data.allocation[k]));
      }
  };

  return (
    <div className="space-y-8 animate-fadeIn pb-12">
        
        {/* Top Section: Strategy & Presets */}
        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
            <TokenPresets onSelect={handlePresetSelect} />
            
            <label className="text-xs font-bold text-slate-400 uppercase block mb-3">Token Model</label>
            <TokenPurposeSelector selected={tokenModel} onSelect={setTokenModel} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Left: Input Controls */}
            <div className="space-y-6">
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                    <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                        <span className="text-xl">🎛️</span> Supply & Pricing
                    </h4>
                    <div className="grid grid-cols-2 gap-4">
                        <Input 
                            id="price" label="Token Price (€)" type="number" 
                            value={property.token_price || ''} onChange={e => updateProp('token_price', parseFloat(e.target.value))} 
                        />
                        <Input 
                            id="supply" label="Total Supply" type="number" 
                            value={property.total_tokens || ''} onChange={e => updateProp('total_tokens', parseFloat(e.target.value))} 
                        />
                    </div>

                    {/* AI VALIDATOR */}
                    <AiSupplyValidator 
                        raiseAmount={metrics.actualRaise} // Use effective raise
                        totalSupply={property.total_tokens}
                        tokenPrice={property.token_price}
                        onCorrect={(p, s) => {
                            updateProp('token_price', p);
                            updateProp('total_tokens', s);
                        }}
                    />
                </div>

                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                    <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                         <span className="text-xl">🥧</span> Allocation Strategy
                    </h4>
                    <div className="space-y-4">
                        {[
                            { key: 'investors', label: 'Investors (Raise)', color: 'bg-brand-500' },
                            { key: 'founders', label: 'Sponsor (Retained)', color: 'bg-indigo-500' },
                            { key: 'treasury', label: 'Treasury / Ops', color: 'bg-slate-400' },
                            { key: 'advisors', label: 'Partners / Fees', color: 'bg-amber-500' },
                        ].map(item => (
                            <div key={item.key}>
                                <div className="flex justify-between text-xs font-bold text-slate-600 mb-1">
                                    <span className="flex items-center gap-2"><span className={`w-2 h-2 rounded-full ${item.color}`}></span>{item.label}</span>
                                    <span>{(tokenAllocation as any)?.[item.key] || 0}%</span>
                                </div>
                                <input 
                                    type="range" min="0" max="100" 
                                    value={(tokenAllocation as any)?.[item.key] || 0}
                                    onChange={e => updateAlloc(item.key, parseInt(e.target.value))}
                                    className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-slate-900"
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Right: Metrics & Efficiency */}
            <div className="space-y-6">
                
                {/* Capital Efficiency Card */}
                <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-6 opacity-10 text-6xl">📊</div>
                    
                    <h4 className="text-sm font-bold text-emerald-400 uppercase tracking-wider mb-4">Capital Efficiency</h4>
                    
                    <div className="grid grid-cols-2 gap-6 mb-6">
                        <div>
                            <span className="text-xs text-slate-400 block mb-1">Implied Market Cap</span>
                            <span className="text-2xl font-mono font-bold">€{metrics.marketCap.toLocaleString()}</span>
                        </div>
                        <div>
                            <span className="text-xs text-slate-400 block mb-1">Effective Raise</span>
                            <span className="text-2xl font-mono font-bold text-emerald-400">€{metrics.actualRaise.toLocaleString()}</span>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <div className="flex justify-between text-xs font-bold text-slate-400">
                            <span>Float Efficiency</span>
                            <span>{metrics.efficiency.toFixed(1)}%</span>
                        </div>
                        <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-blue-500 to-emerald-500" style={{ width: `${metrics.efficiency}%` }}></div>
                        </div>
                        <p className="text-[10px] text-slate-500 italic mt-2">
                            {metrics.efficiency < 30 ? "Warning: High sponsor retention may reduce liquidity." : "Healthy float for secondary markets."}
                        </p>
                    </div>
                </div>

                {/* Allocation Chart */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center">
                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 w-full text-left">Cap Table Preview</h4>
                    <AllocationChart allocation={tokenAllocation} />
                </div>
            </div>
        </div>

        {/* Footer Action */}
        <div className="flex justify-end pt-6 border-t border-slate-100">
             <Button 
                variant="sim"
                onClick={onNext}
                className="px-8 py-3 rounded-xl font-bold shadow-lg transition-all flex items-center gap-2"
             >
                Save & Next: Analysis →
             </Button>
        </div>
    </div>
  );
};