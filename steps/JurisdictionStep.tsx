
import React, { useState, useEffect } from 'react';
import { StepProps } from '../types';
import { CountrySelectionTab } from '../components/jurisdiction/free/tabs/CountrySelectionTab';
import { RegionSelectionTab } from '../components/jurisdiction/free/tabs/RegionSelectionTab';
import { StructureSelectionTab } from '../components/jurisdiction/free/tabs/StructureSelectionTab';
import { JurisdictionSummaryTab } from '../components/jurisdiction/free/tabs/JurisdictionSummaryTab';

type Tab = 'COUNTRY' | 'REGION' | 'STRUCTURE' | 'EXPORT';

const TABS: { id: Tab; label: string }[] = [
    { id: 'COUNTRY', label: '1. Country' },
    { id: 'REGION', label: '2. Region' },
    { id: 'STRUCTURE', label: '3. Structure' },
    { id: 'EXPORT', label: '4. Summary' }
];

export const JurisdictionStep: React.FC<StepProps> = ({ data, updateData, onValidationChange, activeTabId, onTabChange, onNext }) => {
  const [activeTab, setActiveTab] = useState<Tab>('COUNTRY');

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

  const handleNextTab = () => {
      const idx = TABS.findIndex(t => t.id === activeTab);
      if (idx < TABS.length - 1) {
          handleTabClick(TABS[idx + 1].id as Tab);
      } else if (onNext) {
          onNext(); // Move to next major step if at end
      }
  };

  // Validation Logic
  useEffect(() => {
      const j = data.jurisdiction;
      // Adjusted validation to check for structure type (spvType)
      const isValid = Boolean(j.country && j.spvType);
      onValidationChange(isValid);
  }, [data.jurisdiction, onValidationChange]);

  const updateJurisdiction = (field: string, val: any) => {
      updateData('jurisdiction', { [field]: val });
  };

  return (
    <div className="h-full flex flex-col gap-8 animate-fadeIn pb-12">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-end gap-4 border-b border-sim-border pb-6">
            <div>
                <h2 className="text-3xl font-bold font-display text-slate-900 tracking-tight mb-2">Jurisdiction & Structure</h2>
                <p className="text-slate-500 text-lg">
                    Define the legal wrapper for your asset.
                </p>
            </div>
        </div>

        {/* Tabs */}
        <div className="bg-white p-1.5 rounded-xl border border-sim-border inline-flex w-full md:w-auto shadow-sm overflow-x-auto no-scrollbar">
            {TABS.map(tab => (
                <button
                    key={tab.id}
                    onClick={() => handleTabClick(tab.id as Tab)}
                    className={`
                        whitespace-nowrap px-5 py-2.5 rounded-lg text-sm font-bold transition-all
                        ${activeTab === tab.id 
                            ? 'bg-indigo-50 text-indigo-700 shadow-sm ring-1 ring-indigo-100' 
                            : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
                        }
                    `}
                >
                    {tab.label}
                </button>
            ))}
        </div>

        {/* Content Area */}
        <div className="min-h-[500px]">
            {activeTab === 'COUNTRY' && (
                <CountrySelectionTab 
                    jurisdiction={data.jurisdiction} 
                    category={data.property.category}
                    updateData={updateJurisdiction} 
                    onNext={handleNextTab} 
                />
            )}
            {activeTab === 'REGION' && (
                <RegionSelectionTab 
                    jurisdiction={data.jurisdiction} 
                    category={data.property.category}
                    updateData={updateJurisdiction} 
                    onNext={handleNextTab} 
                />
            )}
            {activeTab === 'STRUCTURE' && (
                <StructureSelectionTab 
                    data={data}
                    updateData={updateData} 
                    onNext={handleNextTab} 
                />
            )}
            {activeTab === 'EXPORT' && (
                <JurisdictionSummaryTab 
                    data={data} 
                    onNextStep={onNext || handleNextTab} 
                />
            )}
        </div>

    </div>
  );
};