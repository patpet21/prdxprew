
import React, { useState, useEffect } from 'react';
import { StepProps } from '../types';
import { TokenConfigTab } from '../components/tokenomics/free/tabs/TokenConfigTab';
import { FinancialAnalysisTab } from '../components/tokenomics/free/tabs/FinancialAnalysisTab';
import { TokenStrategyTab } from '../components/tokenomics/free/tabs/TokenStrategyTab';
import { TokenomicsExportTab } from '../components/tokenomics/free/tabs/TokenomicsExportTab';
import { TokenomicsAiPanel } from '../components/tokenomics/TokenomicsAiPanel';
import { generateTokenConfig } from '../services/mockAiService';

type Tab = 'CONFIG' | 'ANALYSIS' | 'STRATEGY' | 'EXPORT';

const TABS: { id: Tab; label: string; icon: string }[] = [
    { id: 'CONFIG', label: '1. Configuration', icon: '🎛️' },
    { id: 'ANALYSIS', label: '2. Analysis', icon: '📊' },
    { id: 'STRATEGY', label: '3. Strategy', icon: '🧠' },
    { id: 'EXPORT', label: '4. Summary', icon: '📑' },
];

export const TokenomicsStep: React.FC<StepProps> = ({ data, updateData, onValidationChange, activeTabId, onTabChange, onNext }) => {
  const { property, tokenAllocation, compliance, projectInfo, tokenStrategy } = data;
  const [activeTab, setActiveTab] = useState<Tab>('CONFIG');
  const [isConfigLoading, setIsConfigLoading] = useState(false);
  const [configInsight, setConfigInsight] = useState<string | null>(data.aiTokenomicsInsight || null);

  // Sync with Sidebar
  useEffect(() => {
      if (activeTabId) {
          setActiveTab(activeTabId as Tab);
      }
  }, [activeTabId]);

  const handleTabClick = (tab: Tab) => {
      setActiveTab(tab);
      if (onTabChange) onTabChange(tab);
  };

  const updateProp = (field: string, val: any) => updateData('property', { [field]: val });
  const updateAlloc = (key: string, val: number) => {
    updateData('tokenAllocation', { ...tokenAllocation, [key]: val });
  };
  
  const handleStrategyUpdate = (strategyData: any) => {
      updateData('tokenStrategy', strategyData);
  }

  const handleNextTab = () => {
      const idx = TABS.findIndex(t => t.id === activeTab);
      if (idx < TABS.length - 1) {
          handleTabClick(TABS[idx+1].id);
          window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (onNext) {
          onNext();
      }
  };

  const handleAiConfig = async () => {
      setIsConfigLoading(true);
      const assetData = { category: property.category, assetType: property.asset_type, valuation: property.total_value };
      const config = await generateTokenConfig(assetData as any, projectInfo);
      
      if (config) {
          if (config.token_price) updateProp('token_price', config.token_price);
          if (config.total_tokens) {
              updateProp('total_tokens', config.total_tokens);
              // Assume available = total initially for simple logic
              updateProp('available_tokens', config.total_tokens);
          }
          if (config.soft_cap) updateProp('soft_cap', config.soft_cap);
          if (config.hard_cap) updateProp('hard_cap', config.hard_cap);
          if (config.allocation) {
              // Batch update allocation
              updateData('tokenAllocation', config.allocation);
          }
          if (config.strategy_reasoning) {
              setConfigInsight(config.strategy_reasoning);
              updateData('aiTokenomicsInsight', config.strategy_reasoning as any);
          }
      }
      setIsConfigLoading(false);
  };

  // Validation Logic
  useEffect(() => {
    const hasEconomics = Boolean(property.token_price > 0 && property.total_tokens > 0);
    const hasYield = property.annual_yield !== undefined;
    onValidationChange(hasEconomics && hasYield);
  }, [property, onValidationChange]);

  return (
    <div className="h-full flex flex-col gap-8 animate-fadeIn pb-12">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-end gap-4 border-b border-sim-border pb-6">
            <div>
                <h2 className="text-3xl font-bold font-display text-slate-900 tracking-tight mb-2">Token Economics</h2>
                <p className="text-slate-500 text-lg">
                    Design the math behind your token. Configure supply, pricing, and investor returns.
                </p>
            </div>
        </div>
        
        {/* AI Tool - Only on Config tab */}
        {activeTab === 'CONFIG' && (
            <TokenomicsAiPanel 
                title="AI Token Structurer"
                description="Auto-calculate optimal supply, price, and allocation based on your asset valuation."
                buttonText="Generate Structure"
                isLoading={isConfigLoading}
                onAction={handleAiConfig}
                insight={configInsight || undefined}
                onCloseInsight={() => { setConfigInsight(null); updateData('aiTokenomicsInsight', undefined as any); }}
            />
        )}

        {/* Tabs */}
        <div className="bg-white p-1.5 rounded-xl border border-sim-border inline-flex w-full md:w-auto shadow-sm overflow-x-auto no-scrollbar">
            {TABS.map(tab => (
                <button
                    key={tab.id}
                    onClick={() => handleTabClick(tab.id)}
                    className={`
                        whitespace-nowrap px-5 py-2.5 rounded-lg text-sm font-bold transition-all flex items-center gap-2
                        ${activeTab === tab.id 
                            ? 'bg-indigo-50 text-indigo-700 shadow-sm ring-1 ring-indigo-100' 
                            : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
                        }
                    `}
                >
                    <span>{tab.icon}</span>
                    {tab.label}
                </button>
            ))}
        </div>

        {/* Content */}
        <div className="min-h-[500px]">
            {activeTab === 'CONFIG' && (
                <TokenConfigTab 
                    property={property} 
                    tokenAllocation={tokenAllocation} 
                    updateProp={updateProp} 
                    updateAlloc={updateAlloc}
                    onNext={handleNextTab}
                />
            )}
            {activeTab === 'ANALYSIS' && (
                <FinancialAnalysisTab 
                    property={property} 
                    tokenAllocation={tokenAllocation}
                    updateProp={updateProp}
                    onNext={handleNextTab}
                />
            )}
            {activeTab === 'STRATEGY' && (
                <TokenStrategyTab 
                    property={property} 
                    compliance={compliance}
                    onNext={handleNextTab}
                    updateStrategy={handleStrategyUpdate}
                    savedStrategy={tokenStrategy}
                />
            )}
            {activeTab === 'EXPORT' && (
                <TokenomicsExportTab 
                    data={data}
                    onNextStep={onNext || handleNextTab}
                />
            )}
        </div>

    </div>
  );
};
