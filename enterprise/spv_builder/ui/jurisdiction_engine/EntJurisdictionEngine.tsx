
import React, { useState } from 'react';
import { EntBaseContextTab } from './EntBaseContextTab';
import { EntSpvModelTab } from './EntSpvModelTab';
import { EntJurisdictionTargetsTab } from './EntJurisdictionTargetsTab';
import { EntSpvConfigurationTab } from './EntSpvConfigurationTab';
import { EntSpvProviderAction } from './EntSpvProviderAction';
import { EntInvestorRegionsTab } from './EntInvestorRegionsTab';
import { EntComplianceLaneTab } from './EntComplianceLaneTab';
import { EntDocumentToolsTab } from './EntDocumentToolsTab'; // NEW IMPORT

// Mock state structure to match Pro simulator
const MOCK_STATE = {
    jurisdiction: {
        baseContext: {},
        country: 'IT', // Default for preview
        spvType: '',
        targetRegions: [],
        complianceProfile: {},
        detailedSpv: null,
        sensitiveFlags: []
    },
    property: { category: 'Real Estate' },
    projectInfo: { geoIntent: 'Global', projectGoal: 'Capital Raise' }
};

interface Props {
    onUpdateState?: (newState: any) => void;
}

type Tab = 'base_context' | 'spv_model' | 'jurisdiction_targets' | 'spv_configuration' | 'execution' | 'investor_regions' | 'compliance_lane' | 'documents';

const TABS: { id: Tab; label: string; icon: string }[] = [
    { id: 'base_context', label: 'Context', icon: '📝' },
    { id: 'spv_model', label: 'SPV Model', icon: '🏛️' },
    { id: 'jurisdiction_targets', label: 'Selection', icon: '🏳️' },
    { id: 'spv_configuration', label: 'Configuration', icon: '⚙️' }, 
    { id: 'investor_regions', label: 'Regions', icon: '🌍' },
    { id: 'compliance_lane', label: 'Compliance', icon: '🛡️' },
    { id: 'documents', label: 'Data Room', icon: '📁' }, // NEW TAB
    { id: 'execution', label: 'Execution', icon: '🚀' }, 
];

export const EntJurisdictionEngine: React.FC<Props> = ({ onUpdateState }) => {
  const [activeTab, setActiveTab] = useState<Tab>('base_context');
  const [data, setData] = useState(MOCK_STATE);

  const handleUpdate = (section: string, payload: any) => {
      const newData = { ...data, [section]: { ...(data as any)[section], ...payload } };
      setData(newData);
      if (onUpdateState) onUpdateState(newData);
  };

  const renderContent = () => {
      switch (activeTab) {
          case 'base_context': return <EntBaseContextTab data={data} updateData={handleUpdate} />;
          case 'spv_model': return <EntSpvModelTab data={data} updateData={handleUpdate} />;
          case 'jurisdiction_targets': return <EntJurisdictionTargetsTab data={data} updateData={handleUpdate} />;
          case 'spv_configuration': return <EntSpvConfigurationTab data={data} updateData={handleUpdate} />;
          case 'investor_regions': return <EntInvestorRegionsTab data={data} updateData={handleUpdate} />;
          case 'compliance_lane': return <EntComplianceLaneTab data={data} updateData={handleUpdate} />;
          case 'documents': return <EntDocumentToolsTab data={data} updateData={handleUpdate} />; // NEW RENDER
          case 'execution': return <EntSpvProviderAction data={data} />;
          default: return null;
      }
  };

  return (
    <div className="h-full flex flex-col bg-slate-950">
        
        {/* Header Navigation */}
        <div className="p-4 border-b border-slate-800 bg-slate-900/50">
            <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2 md:pb-0">
                {TABS.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`
                            px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 whitespace-nowrap
                            ${activeTab === tab.id 
                                ? 'bg-amber-500 text-slate-900 shadow-md' 
                                : 'bg-slate-800 text-slate-500 hover:text-slate-300 hover:bg-slate-700'
                            }
                        `}
                    >
                        <span>{tab.icon}</span>
                        <span className="hidden md:inline">{tab.label}</span>
                    </button>
                ))}
            </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 p-6 overflow-y-auto custom-scrollbar">
            {renderContent()}
        </div>

    </div>
  );
};
