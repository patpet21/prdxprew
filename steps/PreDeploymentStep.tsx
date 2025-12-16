
import React, { useState, useEffect } from 'react';
import { StepProps } from '../types';
import { ProjectDeckTab } from '../components/pre_deployment/ProjectDeckTab';
import { FeasibilityScoreTab } from '../components/pre_deployment/FeasibilityScoreTab';
import { ProviderUnlockTab } from '../components/pre_deployment/ProviderUnlockTab';
import { RegulatoryRoadmapTab } from '../components/pre_deployment/RegulatoryRoadmapTab';
import { GeneratedDocumentsTab } from '../components/pre_deployment/GeneratedDocumentsTab';
import { FinancialSnapshotTab } from '../components/pre_deployment/FinancialSnapshotTab';
import { WhatHappensNextTab } from '../components/pre_deployment/WhatHappensNextTab';

type Tab = 'DECK' | 'ROADMAP' | 'FINANCIALS' | 'SCORE' | 'PROVIDERS' | 'DOCS' | 'NEXT_STEPS';

export const PreDeploymentStep: React.FC<StepProps> = ({ data, activeTabId, onTabChange, onValidationChange }) => {
  const [activeTab, setActiveTab] = useState<Tab>('DECK');

  // Sync with parent
  useEffect(() => {
    if (activeTabId) setActiveTab(activeTabId as Tab);
  }, [activeTabId]);

  // Always valid as this is a report step
  useEffect(() => {
    onValidationChange(true);
  }, [onValidationChange]);

  const handleTabClick = (tab: Tab) => {
    setActiveTab(tab);
    if (onTabChange) onTabChange(tab);
  };

  return (
    <div className="h-full flex flex-col animate-fadeIn pb-12">
      
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-600 text-xs font-bold uppercase tracking-widest mb-4">
          <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
          Final Simulation Output
        </div>
        <h2 className="text-4xl md:text-5xl font-bold font-display text-slate-900 mb-3">
          Project Pre-Deployment Report
        </h2>
        <p className="text-slate-500 text-lg max-w-2xl mx-auto">
          Your structural blueprint is ready. Review your generated pitch deck, roadmap, and documentation.
        </p>
      </div>

      {/* Custom Tab Switcher */}
      <div className="flex justify-center mb-10">
        <div className="bg-slate-100 p-1.5 rounded-xl inline-flex relative overflow-x-auto max-w-full no-scrollbar">
           <button
             onClick={() => handleTabClick('DECK')}
             className={`px-5 py-3 rounded-lg text-sm font-bold transition-all duration-300 flex items-center gap-2 z-10 whitespace-nowrap ${activeTab === 'DECK' ? 'bg-white text-slate-900 shadow-md' : 'text-slate-500 hover:text-slate-700'}`}
           >
             <span>📊</span> Project Deck
           </button>
           <button
             onClick={() => handleTabClick('ROADMAP')}
             className={`px-5 py-3 rounded-lg text-sm font-bold transition-all duration-300 flex items-center gap-2 z-10 whitespace-nowrap ${activeTab === 'ROADMAP' ? 'bg-white text-slate-900 shadow-md' : 'text-slate-500 hover:text-slate-700'}`}
           >
             <span>🗺️</span> Roadmap
           </button>
            <button
             onClick={() => handleTabClick('FINANCIALS')}
             className={`px-5 py-3 rounded-lg text-sm font-bold transition-all duration-300 flex items-center gap-2 z-10 whitespace-nowrap ${activeTab === 'FINANCIALS' ? 'bg-slate-900 text-emerald-400 shadow-md' : 'text-slate-500 hover:text-slate-700'}`}
           >
             <span>💰</span> Financials
           </button>
           <button
             onClick={() => handleTabClick('SCORE')}
             className={`px-5 py-3 rounded-lg text-sm font-bold transition-all duration-300 flex items-center gap-2 z-10 whitespace-nowrap ${activeTab === 'SCORE' ? 'bg-white text-slate-900 shadow-md' : 'text-slate-500 hover:text-slate-700'}`}
           >
             <span>🎯</span> Feasibility
           </button>
           <button
             onClick={() => handleTabClick('PROVIDERS')}
             className={`px-5 py-3 rounded-lg text-sm font-bold transition-all duration-300 flex items-center gap-2 z-10 whitespace-nowrap ${activeTab === 'PROVIDERS' ? 'bg-white text-slate-900 shadow-md' : 'text-slate-500 hover:text-slate-700'}`}
           >
             <span>🤝</span> Providers
           </button>
           <button
             onClick={() => handleTabClick('DOCS')}
             className={`px-5 py-3 rounded-lg text-sm font-bold transition-all duration-300 flex items-center gap-2 z-10 whitespace-nowrap ${activeTab === 'DOCS' ? 'bg-white text-slate-900 shadow-md' : 'text-slate-500 hover:text-slate-700'}`}
           >
             <span>📄</span> Documents
           </button>
           <button
             onClick={() => handleTabClick('NEXT_STEPS')}
             className={`px-5 py-3 rounded-lg text-sm font-bold transition-all duration-300 flex items-center gap-2 z-10 whitespace-nowrap ${activeTab === 'NEXT_STEPS' ? 'bg-amber-500 text-white shadow-md' : 'text-slate-500 hover:text-slate-700'}`}
           >
             <span>🚀</span> Next Steps
           </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 min-h-[600px]">
        {activeTab === 'DECK' && <ProjectDeckTab data={data} />}
        {activeTab === 'ROADMAP' && <RegulatoryRoadmapTab data={data} />}
        {activeTab === 'FINANCIALS' && <FinancialSnapshotTab data={data} />}
        {activeTab === 'SCORE' && <FeasibilityScoreTab data={data} />}
        {activeTab === 'PROVIDERS' && <ProviderUnlockTab />}
        {activeTab === 'DOCS' && <GeneratedDocumentsTab data={data} />}
        {activeTab === 'NEXT_STEPS' && <WhatHappensNextTab data={data} />}
      </div>

    </div>
  );
};
