
import React, { useState } from 'react';
import { TokenModelSelector, SupplyPricing, GovernanceRights, VestingEmission, FairnessRisk } from '../tools/token_design';
import { TokenomicsExportTab } from '../tools/token_design/TokenomicsExportTab';
import { Button } from '../../../ui/Button';

type Tab = 'MODEL' | 'SUPPLY' | 'GOVERNANCE' | 'RIGHTS' | 'VESTING' | 'RISK' | 'EXPORT';

export const TokenDesignTheory: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('MODEL');
  
  const [tokenData, setTokenData] = useState({
      model: 'Equity',
      supply: 1000000,
      price: 1.0,
      rights: [] as string[],
      valuation: 1000000,
      supplyAnalysis: null,
      proTokenDesign: { rights: [] as string[], vesting: {}, tokenModel: 'Equity' },
      jurisdiction: { country: 'USA' },
      proDistribution: { primaryInvestorType: 'Accredited' },
      property: { category: 'Real Estate', raise_amount: 1000000 }
  });

  const handleNext = (nextTab: Tab) => {
      setActiveTab(nextTab);
      window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const persistToStorage = (section: string, data: any) => {
      const current = JSON.parse(localStorage.getItem('academyPro_tokenomics') || '{}');
      current[section] = data;
      localStorage.setItem('academyPro_tokenomics', JSON.stringify(current));
  };

  const renderContent = () => {
      switch(activeTab) {
          case 'MODEL': 
              return <TokenModelSelector selected={tokenData.model} onSelect={(m) => setTokenData({...tokenData, model: m})} onUpdate={(d) => persistToStorage('model', d)} onNext={() => handleNext('SUPPLY')} />;
          case 'SUPPLY': 
              return <SupplyPricing valuation={tokenData.valuation} onChange={(d) => setTokenData({...tokenData, ...d})} data={{ supply: tokenData.supply, price: tokenData.price, aiResult: tokenData.supplyAnalysis }} onUpdate={(d) => { setTokenData(prev => ({ ...prev, supply: d.supply, price: d.price, supplyAnalysis: d.aiResult })); persistToStorage('supply', d); }} onNext={() => handleNext('RIGHTS')} />;
          case 'GOVERNANCE':
          case 'RIGHTS': 
              return <GovernanceRights onChange={(r) => setTokenData(prev => ({...prev, rights: r, proTokenDesign: {...prev.proTokenDesign, rights: r}}))} data={tokenData} />;
          case 'VESTING': 
              return <VestingEmission />;
          case 'RISK': 
              return <FairnessRisk data={tokenData} onUpdate={(d) => console.log('Fairness Updated', d)} />;
          case 'EXPORT':
              return <TokenomicsExportTab />;
          default: return null;
      }
  };

  return (
    <div className="flex flex-col h-full w-full bg-slate-50 animate-fadeIn">
      
      {/* Top Nav */}
      <div className="bg-white border-b border-slate-200 px-6 shrink-0 flex items-center gap-1 overflow-x-auto no-scrollbar">
          {[
              { id: 'MODEL', label: '1. Model' },
              { id: 'SUPPLY', label: '2. Supply & Price' },
              { id: 'RIGHTS', label: '3. Rights' },
              { id: 'VESTING', label: '4. Vesting' },
              { id: 'RISK', label: '5. Risk & Fairness' },
              { id: 'EXPORT', label: '6. Blueprint PDF' }
          ].map(tab => (
              <button 
                key={tab.id}
                onClick={() => setActiveTab(tab.id as Tab)}
                className={`py-4 px-6 text-xs font-bold uppercase tracking-wider border-b-2 transition-all whitespace-nowrap ${activeTab === tab.id ? 'border-purple-500 text-purple-600' : 'border-transparent text-slate-400 hover:text-slate-600 hover:border-slate-200'}`}
              >
                  {tab.label}
              </button>
          ))}
      </div>

      <div className="flex-1 w-full max-w-[1920px] mx-auto p-8 overflow-y-auto">
          {renderContent()}
      </div>

    </div>
  );
};
