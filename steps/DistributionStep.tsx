

import React, { useState, useEffect } from 'react';
import { StepProps } from '../types';
import { DistributionEducationPanel } from '../components/distribution/free/DistributionEducationPanel';
import { InvestorProfilingTab } from '../components/distribution/free/tabs/InvestorProfilingTab';
import { OfferingStyleTab } from '../components/distribution/free/tabs/OfferingStyleTab';
import { MarketingFunnelTab } from '../components/distribution/free/tabs/MarketingFunnelTab';
import { DistributionRiskTab } from '../components/distribution/free/tabs/DistributionRiskTab';
import { DistributionExportTab } from '../components/distribution/free/tabs/DistributionExportTab';

type Tab = 'INVESTOR' | 'OFFERING' | 'MARKETING' | 'RISK' | 'EXPORT';

const TABS: { id: Tab; label: string; icon: string }[] = [
    { id: 'INVESTOR', label: '1. Investor', icon: '👥' },
    { id: 'OFFERING', label: '2. Offering', icon: '📜' },
    { id: 'MARKETING', label: '3. Marketing', icon: '📢' },
    { id: 'RISK', label: '4. Risk Check', icon: '🛡️' },
    { id: 'EXPORT', label: '5. Summary', icon: '🏁' },
];

export const DistributionStep: React.FC<StepProps> = ({ data, updateData, onValidationChange, activeTabId, onTabChange, onNext }) => {
  const { distribution } = data;
  const [activeTab, setActiveTab] = useState<Tab>('INVESTOR');

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

  useEffect(() => {
    // Basic validation for main wizard flow
    const isValid = Boolean(distribution.targetInvestorType && distribution.minInvestment > 0);
    onValidationChange(isValid);
  }, [distribution, onValidationChange]);

  const handleUpdate = (field: string, val: any) => {
    updateData('distribution', { [field]: val });
  };

  const nextTab = () => {
      const idx = TABS.findIndex(t => t.id === activeTab);
      if (idx < TABS.length - 1) {
          handleTabClick(TABS[idx + 1].id as Tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (onNext) {
          onNext();
      }
  };

  const renderContent = () => {
      switch(activeTab) {
          case 'INVESTOR': return <InvestorProfilingTab distribution={distribution} updateData={handleUpdate} onNext={nextTab} />;
          case 'OFFERING': return <OfferingStyleTab distribution={distribution} updateData={handleUpdate} onNext={nextTab} />;
          case 'MARKETING': return <MarketingFunnelTab distribution={distribution} updateData={handleUpdate} onNext={nextTab} />;
          case 'RISK': return <DistributionRiskTab distribution={distribution} updateData={handleUpdate} onNext={nextTab} />;
          case 'EXPORT': return <DistributionExportTab data={data} onNextStep={onNext || nextTab} />;
          default: return null;
      }
  };

  return (
    <div className="h-full flex flex-col gap-8 animate-fadeIn pb-12">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-end gap-4 border-b border-sim-border pb-6">
            <div>
                <h2 className="text-3xl font-bold font-display text-slate-900 tracking-tight mb-2">Distribution Strategy</h2>
                <p className="text-slate-500 text-lg">
                    Define how you will reach investors and structure your offering.
                </p>
            </div>
        </div>

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

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-8 min-h-[500px]">
                {renderContent()}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-4 hidden lg:block">
                <DistributionEducationPanel />
            </div>
        </div>

    </div>
  );
};