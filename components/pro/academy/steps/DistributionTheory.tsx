
import React, { useState } from 'react';
import { Button } from '../../../ui/Button';
import { InvestorSegmentation, GeoComplianceMarketing, ChannelMix, FunnelSimulator, CostStructure } from '../tools/distribution_strategy';
import { DistributionExportTab } from '../tools/distribution_strategy/DistributionExportTab';

type Tab = 'SEGMENTATION' | 'GEO' | 'CHANNELS' | 'FUNNEL' | 'COSTS' | 'EXPORT';

export const DistributionTheory: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('SEGMENTATION');
  
  const handleNext = (nextTab: Tab) => {
      setActiveTab(nextTab);
      window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderContent = () => {
      switch(activeTab) {
          case 'SEGMENTATION': return <InvestorSegmentation onChange={() => {}} />;
          case 'GEO': return <GeoComplianceMarketing />;
          case 'CHANNELS': return <ChannelMix onChange={() => {}} />;
          case 'FUNNEL': return <FunnelSimulator />;
          case 'COSTS': return <CostStructure />;
          case 'EXPORT': return <DistributionExportTab />;
          default: return null;
      }
  };

  return (
    <div className="flex flex-col h-full w-full bg-slate-50 animate-fadeIn">
      
      {/* Top Nav */}
      <div className="bg-white border-b border-slate-200 px-6 shrink-0 flex items-center gap-1 overflow-x-auto no-scrollbar">
          {[
              { id: 'SEGMENTATION', label: '1. Investor Persona' },
              { id: 'GEO', label: '2. Regions & Law' },
              { id: 'CHANNELS', label: '3. Channel Mix' },
              { id: 'FUNNEL', label: '4. Funnel Sim' },
              { id: 'COSTS', label: '5. Unit Economics' },
              { id: 'EXPORT', label: '6. GTM Blueprint' }
          ].map(tab => (
              <button 
                key={tab.id}
                onClick={() => setActiveTab(tab.id as Tab)}
                className={`py-4 px-6 text-xs font-bold uppercase tracking-wider border-b-2 transition-all whitespace-nowrap ${activeTab === tab.id ? 'border-teal-500 text-teal-600' : 'border-transparent text-slate-400 hover:text-slate-600 hover:border-slate-200'}`}
              >
                  {tab.label}
              </button>
          ))}
      </div>

      <div className="flex-1 w-full max-w-[1920px] mx-auto p-8 overflow-y-auto">
          {renderContent()}
      </div>

      <div className="bg-white border-t border-slate-200 p-4 flex justify-end shrink-0">
          {activeTab !== 'EXPORT' && (
              <Button onClick={() => {
                  const tabs: Tab[] = ['SEGMENTATION', 'GEO', 'CHANNELS', 'FUNNEL', 'COSTS', 'EXPORT'];
                  const idx = tabs.indexOf(activeTab);
                  if (idx < tabs.length - 1) handleNext(tabs[idx+1]);
              }} className="bg-slate-900 text-white hover:bg-slate-800">
                  Next Step →
              </Button>
          )}
      </div>

    </div>
  );
};
