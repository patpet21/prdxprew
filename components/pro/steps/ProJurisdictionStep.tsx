
import React, { useState, useEffect } from 'react';
import { StepProps } from '../../../types';
import { ProStepFooter } from '../ProStepFooter';
import { 
    BaseContextTab, 
    SpvModelTab, 
    JurisdictionTargetsTab, 
    InvestorRegionsTab, 
    ComplianceLaneTab 
} from './jurisdiction';

type JurisdictionTab = 'base_context' | 'spv_model' | 'jurisdiction_targets' | 'investor_regions' | 'compliance_lane';

const TABS: { id: JurisdictionTab; label: string; icon: string }[] = [
    { id: 'base_context', label: 'Context', icon: '📝' },
    { id: 'spv_model', label: 'SPV Model', icon: '🏛️' },
    { id: 'jurisdiction_targets', label: 'Jurisdiction', icon: '🏳️' },
    { id: 'investor_regions', label: 'Regions', icon: '🌍' },
    { id: 'compliance_lane', label: 'Compliance', icon: '🛡️' },
];

export const ProJurisdictionStep: React.FC<StepProps & { activeTabId?: string, onTabChange?: (id: string) => void, onNextStep?: () => void, onNavigate?: (page: string) => void }> = ({ 
    data, 
    updateData, 
    onNavigate,
    activeTabId,
    onTabChange,
    onNextStep
}) => {
  const [activeTab, setActiveTab] = useState<JurisdictionTab>('base_context');

  useEffect(() => {
      if (activeTabId && TABS.find(t => t.id === activeTabId)) {
          setActiveTab(activeTabId as JurisdictionTab);
      }
  }, [activeTabId]);

  const handleTabChange = (id: JurisdictionTab) => {
      setActiveTab(id);
      if (onTabChange) onTabChange(id);
  };

  const handleNext = () => {
      const idx = TABS.findIndex(t => t.id === activeTab);
      if (idx < TABS.length - 1) {
          handleTabChange(TABS[idx + 1].id as JurisdictionTab);
      } else {
          if (onNextStep) onNextStep();
      }
  };

  const handleBack = () => {
      const idx = TABS.findIndex(t => t.id === activeTab);
      if (idx > 0) handleTabChange(TABS[idx - 1].id as JurisdictionTab);
  };

  const renderContent = () => {
      switch (activeTab) {
          case 'base_context': return <BaseContextTab data={data} updateData={updateData} />;
          case 'spv_model': return <SpvModelTab data={data} updateData={updateData} onNavigate={onNavigate} />;
          case 'jurisdiction_targets': return <JurisdictionTargetsTab data={data} updateData={updateData} />;
          case 'investor_regions': return <InvestorRegionsTab data={data} updateData={updateData} />;
          case 'compliance_lane': return <ComplianceLaneTab data={data} updateData={updateData} />;
          default: return null;
      }
  };

  const currentIndex = TABS.findIndex(t => t.id === activeTab);
  const currentTab = TABS[currentIndex];
  const nextTab = currentIndex >= 0 && currentIndex < TABS.length - 1 ? TABS[currentIndex + 1] : null;

  // Access jurisdiction directly as it's part of the data prop type
  const jurisdiction = data.jurisdiction;

  const summaryData = {
      'SPV Model': jurisdiction.baseContext?.spvStructuring,
      'Jurisdiction': jurisdiction.country,
      'Entity Type': jurisdiction.spvType,
      'Compliance Lane': jurisdiction.complianceLane,
      'Target Regions': jurisdiction.targetRegions?.join(', '),
  };

  return (
    <div className="space-y-6 animate-fadeIn h-full flex flex-col">
      
      {/* Header & Tabs */}
      <div className="flex flex-col xl:flex-row xl:items-end justify-between border-b border-slate-200 pb-6 gap-6">
        <div>
            <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center text-xl shadow-lg shadow-slate-900/20">
                    ⚖️
                </div>
                <h3 className="text-2xl font-bold font-display text-slate-900">Jurisdiction & SPV</h3>
            </div>
            <p className="text-slate-500 text-sm max-w-xl leading-relaxed">
                Define the legal wrapper and regulatory perimeter for your asset. This engine will recommend the optimal structure based on your goals.
            </p>
        </div>
        
        {/* Responsive Tabs */}
        <div className="flex gap-2 overflow-x-auto max-w-full pb-2 xl:pb-0 custom-scrollbar -mx-4 px-4 xl:mx-0 xl:px-0">
            {TABS.map(tab => (
                <button
                    key={tab.id}
                    onClick={() => handleTabChange(tab.id)}
                    className={`
                        px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 whitespace-nowrap border
                        ${activeTab === tab.id 
                            ? 'bg-slate-900 text-white border-slate-900 shadow-md transform scale-105' 
                            : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300 hover:text-slate-700'
                        }
                    `}
                >
                    <span className="text-base">{tab.icon}</span>
                    <span className="hidden md:inline">{tab.label}</span>
                </button>
            ))}
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto pr-1 custom-scrollbar">
          {renderContent()}
      </div>

      <ProStepFooter 
          onNext={handleNext}
          onBack={currentIndex > 0 ? handleBack : undefined}
          isLastTab={currentIndex === TABS.length - 1}
          isStepValid={true}
          currentTabLabel={currentTab?.label || ''}
          nextTabLabel={nextTab?.label}
          summaryData={summaryData}
          stepTitle="Jurisdiction & SPV"
      />

    </div>
  );
};
