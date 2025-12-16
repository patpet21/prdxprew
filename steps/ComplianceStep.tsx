import React, { useState, useEffect } from 'react';
import { StepProps } from '../types';
import { ComplianceEducationPanel } from '../components/compliance/free/ComplianceEducationPanel';
import { FrameworkConfigTab } from '../components/compliance/free/tabs/FrameworkConfigTab';
import { RiskAnalysisTab } from '../components/compliance/free/tabs/RiskAnalysisTab';
import { StrategyNotesTab } from '../components/compliance/free/tabs/StrategyNotesTab';
import { EducationTab } from '../components/compliance/free/tabs/EducationTab';
import { AiSummaryTab } from '../components/compliance/free/tabs/AiSummaryTab';
import { ComplianceExportTab } from '../components/compliance/free/tabs/ComplianceExportTab';
import { KnowledgeCenterTab } from '../components/compliance/free/tabs/KnowledgeCenterTab';

type Tab = 'CONFIG' | 'RISK' | 'STRATEGY' | 'EDUCATION' | 'AI_SUMMARY' | 'GLOSSARY' | 'EXPORT';

const TABS: { id: Tab; label: string; icon: string; desc: string }[] = [
    { id: 'CONFIG', label: 'Framework', icon: '⚙️', desc: 'Rules & Limits' },
    { id: 'RISK', label: 'Risk Analysis', icon: '⚠️', desc: 'Auto-Detection' },
    { id: 'STRATEGY', label: 'Strategy', icon: '📝', desc: 'AI Notes' },
    { id: 'EDUCATION', label: 'Education', icon: '🎓', desc: 'Key Concepts' },
    { id: 'AI_SUMMARY', label: 'Verdict', icon: '🤖', desc: 'Final Report' },
    { id: 'GLOSSARY', label: 'Knowledge', icon: '📚', desc: 'Definitions' },
    { id: 'EXPORT', label: 'Finish', icon: '🚀', desc: 'Review' }
];

export const ComplianceStep: React.FC<StepProps> = ({ data, updateData, onValidationChange, activeTabId, onTabChange, onNext }) => {
  const { compliance } = data;
  const [activeTab, setActiveTab] = useState<Tab>('CONFIG');

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
    const isValid = Boolean(compliance.regFramework && compliance.regFramework !== 'None');
    onValidationChange(isValid);
  }, [compliance, onValidationChange]);

  const updateCompliance = (field: string, val: any) => updateData('compliance', { [field]: val });

  const nextTab = () => {
      const idx = TABS.findIndex(t => t.id === activeTab);
      if (idx < TABS.length - 1) {
          handleTabClick(TABS[idx + 1].id as Tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
      }
  };

  const renderContent = () => {
      switch(activeTab) {
          case 'CONFIG': return <FrameworkConfigTab compliance={compliance} updateData={updateCompliance} onNext={nextTab} />;
          case 'RISK': return <RiskAnalysisTab compliance={compliance} updateData={updateCompliance} onNext={nextTab} />;
          case 'STRATEGY': return <StrategyNotesTab compliance={compliance} updateData={updateCompliance} onNext={nextTab} />;
          case 'EDUCATION': return <EducationTab onNext={nextTab} />;
          case 'AI_SUMMARY': return <AiSummaryTab compliance={compliance} onNext={nextTab} />;
          case 'GLOSSARY': return <KnowledgeCenterTab onNext={nextTab} />;
          case 'EXPORT': return <ComplianceExportTab compliance={compliance} onNextStep={onNext} />;
          default: return null;
      }
  };

  return (
    <div className="h-full flex flex-col animate-fadeIn pb-12 w-full max-w-full">
        
        {/* Header Section */}
        <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-blue-600 rounded-2xl flex items-center justify-center text-white font-bold text-2xl shadow-lg shadow-indigo-500/20">
                    ⚖️
                </div>
                <div>
                    <h2 className="text-3xl font-bold font-display text-slate-900 tracking-tight">Compliance & Regulations</h2>
                    <p className="text-slate-500 text-sm font-medium">
                        Define the legal perimeter, investor eligibility, and jurisdiction rules.
                    </p>
                </div>
            </div>
        </div>

        {/* Navigation Tabs - Massive Dashboard Style */}
        <div className="sticky top-0 z-30 bg-slate-50/95 backdrop-blur-md py-2 border-b border-sim-border -mx-4 px-4 md:mx-0 md:px-0 md:border-none md:bg-transparent md:static md:py-0 mb-8">
            <div className="bg-white p-1.5 rounded-xl border border-sim-border shadow-sm flex w-full md:w-max overflow-x-auto no-scrollbar snap-x">
                {TABS.map(tab => {
                    const isActive = activeTab === tab.id;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => handleTabClick(tab.id as Tab)}
                            className={`
                                flex-1 md:flex-none snap-center whitespace-nowrap px-6 py-3 rounded-lg text-sm font-bold transition-all flex flex-col md:flex-row items-center gap-2 min-w-[120px] md:min-w-0
                                ${isActive 
                                    ? 'bg-indigo-600 text-white shadow-md ring-1 ring-indigo-600' 
                                    : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                                }
                            `}
                        >
                            <span className="text-lg">{tab.icon}</span>
                            <div className="flex flex-col items-center md:items-start leading-none">
                                <span>{tab.label}</span>
                                <span className={`text-[9px] uppercase tracking-wider font-medium mt-0.5 ${isActive ? 'text-indigo-200' : 'text-slate-400'}`}>
                                    {tab.desc}
                                </span>
                            </div>
                        </button>
                    );
                })}
            </div>
        </div>

        {/* Main Content Canvas - Full Width & Height */}
        <div className="flex-1 w-full h-full min-h-[600px] flex flex-col">
            <div className="flex-1 transition-all duration-300 ease-in-out">
                {renderContent()}
            </div>
        </div>

    </div>
  );
};