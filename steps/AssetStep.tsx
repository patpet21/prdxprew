
import React, { useState, useEffect } from 'react';
import { StepProps } from '../types';
import { AssetEducationPanel } from '../components/asset/free/AssetEducationPanel';
import { GeneralTimelineTab } from '../components/asset/free/tabs/GeneralTimelineTab';
import { PhysicalSpecsTab } from '../components/asset/free/tabs/PhysicalSpecsTab';
import { PartnersTeamTab } from '../components/asset/free/tabs/PartnersTeamTab';
import { AiDescriptionTab } from '../components/asset/free/tabs/AiDescriptionTab';
import { MediaAssetsTab } from '../components/asset/free/tabs/MediaAssetsTab';
import { AssetExportTab } from '../components/asset/free/tabs/AssetExportTab';

type AssetTab = 'GENERAL' | 'SPECS' | 'TEAM' | 'DESC' | 'MEDIA' | 'EXPORT';

const TABS: { id: AssetTab; label: string }[] = [
    { id: 'GENERAL', label: '1. General & Timeline' },
    { id: 'SPECS', label: '2. Physical Specs' },
    { id: 'TEAM', label: '3. Partners & Team' },
    { id: 'DESC', label: '4. AI Description' },
    { id: 'MEDIA', label: '5. Media' },
    { id: 'EXPORT', label: '6. Summary' }
];

export const AssetStep: React.FC<StepProps> = ({ data, updateData, onValidationChange, activeTabId, onTabChange, onNext }) => {
  const { property } = data;
  const [activeTab, setActiveTab] = useState<AssetTab>('GENERAL');

  // Sync with Sidebar
  useEffect(() => {
      if (activeTabId) {
          setActiveTab(activeTabId as AssetTab);
      }
  }, [activeTabId]);

  const handleTabClick = (tab: AssetTab) => {
      setActiveTab(tab);
      if (onTabChange) onTabChange(tab);
  };

  const handleNextTab = () => {
    const idx = TABS.findIndex(t => t.id === activeTab);
    if (idx < TABS.length - 1) {
        handleTabClick(TABS[idx + 1].id as AssetTab);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Validation Logic
  useEffect(() => {
    const hasBasic = Boolean(property.title && property.total_value > 0 && property.country);
    onValidationChange(hasBasic);
  }, [property, onValidationChange]);

  const updateProp = (field: string, val: any) => updateData('property', { [field]: val });

  const renderContent = () => {
      switch(activeTab) {
          case 'GENERAL': return <GeneralTimelineTab property={property} updateProp={updateProp} onNext={handleNextTab} />;
          case 'SPECS': return <PhysicalSpecsTab property={property} updateProp={updateProp} onNext={handleNextTab} />;
          case 'TEAM': return <PartnersTeamTab property={property} updateProp={updateProp} onNext={handleNextTab} />;
          case 'DESC': return <AiDescriptionTab property={property} updateProp={updateProp} onNext={handleNextTab} />;
          case 'MEDIA': return <MediaAssetsTab property={property} updateProp={updateProp} onNext={handleNextTab} />;
          case 'EXPORT': return <AssetExportTab property={property} onNextStep={onNext} />;
          default: return null;
      }
  };

  return (
    <div className="h-full flex flex-col lg:flex-row gap-8 animate-fadeIn pb-12">
        
        {/* Main Content */}
        <div className="flex-1">
            <div className="mb-8">
                <h2 className="text-3xl font-bold font-display text-slate-900">Asset Details</h2>
                <p className="text-slate-500 text-lg">Define the physical and strategic characteristics of your asset.</p>
            </div>

            {/* Tabs */}
            <div className="flex overflow-x-auto gap-2 pb-2 mb-6 no-scrollbar">
                {TABS.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => handleTabClick(tab.id)}
                        className={`
                            whitespace-nowrap px-4 py-2 rounded-full text-sm font-bold transition-all border
                            ${activeTab === tab.id 
                                ? 'bg-slate-900 text-white border-slate-900 shadow-lg' 
                                : 'bg-white text-slate-500 border-sim-border hover:border-slate-300'
                            }
                        `}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            <div className="min-h-[400px]">
                {renderContent()}
            </div>
        </div>

        {/* Sidebar (Education) */}
        <div className="w-full lg:w-80 shrink-0">
            <AssetEducationPanel />
        </div>

    </div>
  );
};