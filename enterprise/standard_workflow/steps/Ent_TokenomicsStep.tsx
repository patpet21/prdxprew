
import React, { useEffect, useState } from 'react';
import { StepProps } from '../../../types';
import { Input } from '../../../components/ui/Input';
import { AllocationChart } from '../../../components/tokenomics/AllocationChart';
import { TokenomicsAiPanel } from '../../../components/tokenomics/TokenomicsAiPanel';
import { generateTokenConfig } from '../../../services/mockAiService';

export const Ent_TokenomicsStep: React.FC<StepProps> = ({ data, updateData, onValidationChange }) => {
  const { property, tokenAllocation, projectInfo } = data;
  const [isConfigLoading, setIsConfigLoading] = useState(false);
  const [configInsight, setConfigInsight] = useState<string | null>(null);

  useEffect(() => {
    const hasEconomics = Boolean(property.token_price > 0 && property.total_tokens > 0);
    const hasYield = property.annual_yield !== undefined;
    onValidationChange(hasEconomics && hasYield);
  }, [property, onValidationChange]);

  const updateProp = (field: string, val: any) => updateData('property', { [field]: val });
  const updateAlloc = (key: string, val: number) => {
    updateData('tokenAllocation', { ...tokenAllocation, [key]: val });
  };

  const handleAiConfig = async () => {
      setIsConfigLoading(true);
      const assetData = { category: property.category, assetType: property.asset_type, valuation: property.total_value };
      const config = await generateTokenConfig(assetData as any, projectInfo);
      
      if (config) {
          if (config.token_price) updateProp('token_price', config.token_price);
          if (config.total_tokens) {
              updateProp('total_tokens', config.total_tokens);
              updateProp('available_tokens', config.total_tokens);
          }
          if (config.soft_cap) updateProp('soft_cap', config.soft_cap);
          if (config.hard_cap) updateProp('hard_cap', config.hard_cap);
          if (config.allocation) {
              updateData('tokenAllocation', config.allocation);
          }
          if (config.strategy_reasoning) {
              setConfigInsight(config.strategy_reasoning);
          }
      }
      setIsConfigLoading(false);
  };

  const totalRaise = (property.total_tokens || 0) * (property.token_price || 0);

  return (
    <div className="space-y-8 animate-fadeIn pb-12 text-white">
      <div>
        <h2 className="text-3xl font-bold font-display text-white">Tokenomics & Financials</h2>
        <p className="text-slate-400">Define the capital stack and distribution logic.</p>
      </div>
      
      <TokenomicsAiPanel 
          title="AI Token Structurer"
          description="Optimize supply and pricing based on valuation."
          buttonText="Generate Structure"
          isLoading={isConfigLoading}
          onAction={handleAiConfig}
          insight={configInsight || undefined}
          onCloseInsight={() => setConfigInsight(null)}
          color="bg-indigo-500/10 text-indigo-400 border-indigo-500/20"
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7 space-y-6">
              <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-sm">
                  <h3 className="font-bold text-slate-300 mb-6">Supply & Pricing</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <Input 
                          id="price" label="Token Price (€)" type="number" 
                          value={property.token_price || ''} onChange={e => updateProp('token_price', parseFloat(e.target.value))} 
                          className="bg-slate-950 border-slate-700 text-white"
                      />
                      <Input 
                          id="supply" label="Total Tokens" type="number" 
                          value={property.total_tokens || ''} onChange={e => updateProp('total_tokens', parseFloat(e.target.value))} 
                          className="bg-slate-950 border-slate-700 text-white"
                      />
                      <Input 
                          id="soft" label="Soft Cap (€)" type="number" 
                          value={property.soft_cap || ''} onChange={e => updateProp('soft_cap', parseFloat(e.target.value))} 
                          className="bg-slate-950 border-slate-700 text-white"
                      />
                      <Input 
                          id="hard" label="Hard Cap (€)" type="number" 
                          value={property.hard_cap || ''} onChange={e => updateProp('hard_cap', parseFloat(e.target.value))} 
                          className="bg-slate-950 border-slate-700 text-white"
                      />
                  </div>
              </div>

              <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-sm">
                  <h3 className="font-bold text-slate-300 mb-6">Allocation</h3>
                  <div className="space-y-4">
                      {[{ key: 'investors', label: 'Investors', color: 'bg-brand-500' }, { key: 'founders', label: 'Sponsor', color: 'bg-indigo-500' }, { key: 'treasury', label: 'Treasury', color: 'bg-slate-400' }, { key: 'advisors', label: 'Advisors', color: 'bg-amber-500' }].map(item => (
                          <div key={item.key}>
                              <div className="flex justify-between text-sm font-bold text-slate-400 mb-1">
                                  <span className="flex items-center gap-2"><span className={`w-3 h-3 rounded-full ${item.color}`}></span>{item.label}</span>
                                  <span>{(tokenAllocation as any)?.[item.key] || 0}%</span>
                              </div>
                              <input 
                                  type="range" min="0" max="100" 
                                  value={(tokenAllocation as any)?.[item.key] || 0}
                                  onChange={e => updateAlloc(item.key, parseInt(e.target.value))}
                                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-slate-500"
                              />
                          </div>
                      ))}
                  </div>
              </div>
          </div>

          <div className="lg:col-span-5 space-y-6">
              <div className="bg-slate-800 text-white p-6 rounded-2xl shadow-xl border border-slate-700">
                  <div className="flex justify-between items-start mb-6 border-b border-slate-600 pb-4">
                      <div>
                          <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Market Cap</h3>
                          <div className="text-3xl font-mono font-bold text-emerald-400 mt-1">€{totalRaise.toLocaleString()}</div>
                      </div>
                  </div>
                  <div className="space-y-3 font-mono text-xs">
                      <div className="flex justify-between">
                          <span className="text-slate-400">Asset Value</span>
                          <span className="text-slate-300">€{property.total_value?.toLocaleString()}</span>
                      </div>
                  </div>
              </div>
              <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-sm flex flex-col items-center">
                  <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-6 w-full text-left">Cap Table</h3>
                  <AllocationChart allocation={tokenAllocation} />
              </div>
          </div>
      </div>
    </div>
  );
};
