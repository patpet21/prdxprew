
import React, { useEffect, useState } from 'react';
import { StepProps } from '../types';
import { SummaryIntro } from '../components/summary/free/SummaryIntro';
import { DataIntakeTab } from '../components/summary/free/tabs/DataIntakeTab';
import { ExecutiveSummaryCard } from '../components/summary/free/ExecutiveSummaryCard';
import { ScorecardGrid } from '../components/summary/free/ScorecardGrid';
import { RiskAndNextSteps } from '../components/tokenomics/free/sections/RiskAndNextSteps';
import { ProjectReviewTeaserTab } from '../components/summary/free/tabs/ProjectReviewTeaserTab';
import { ProviderMatchingTab } from '../components/summary/free/tabs/ProviderMatchingTab';
import { SubmissionFlowTab } from '../components/summary/free/tabs/SubmissionFlowTab';
import { ExportShareTab } from '../components/summary/free/tabs/ExportShareTab';
import { ExecutionPathTab } from '../components/summary/free/tabs/ExecutionPathTab';
import { EnterprisePathwayTab } from '../components/summary/free/tabs/EnterprisePathwayTab';
import { FinalActionTab } from '../components/summary/free/tabs/FinalActionTab';

type Tab =
  | 'DNA'
  | 'ANALYSIS'
  | 'MATCHING'
  | 'FLOW'
  | 'PRO_REVIEW'
  | 'EXPORT'
  | 'EXECUTION'
  | 'ENTERPRISE'
  | 'FINAL';

const TABS: { id: Tab; label: string; icon: string; desc: string }[] = [
  { id: 'DNA', label: 'Project DNA', icon: '🧬', desc: 'Core Configuration' },
  { id: 'ANALYSIS', label: 'Strategic Analysis', icon: '📊', desc: 'AI Deal Scoring' },
  { id: 'MATCHING', label: 'Provider Match', icon: '🤝', desc: 'Issuer Selection' },
  { id: 'FLOW', label: 'Submission Flow', icon: '🌊', desc: 'Process Timeline' },
  { id: 'PRO_REVIEW', label: 'AI Project Review', icon: '🚀', desc: 'Pro Features' },
  { id: 'EXPORT', label: 'Export & Share', icon: '📥', desc: 'Download Report' },
  { id: 'EXECUTION', label: 'Execution Path', icon: '🗺️', desc: 'Go-to-Market' },
  { id: 'ENTERPRISE', label: 'Enterprise Pathway', icon: '🏗️', desc: 'Institutional' },
  { id: 'FINAL', label: 'Next Steps', icon: '🏁', desc: 'Launch' },
];

export const SummaryStep: React.FC<StepProps> = ({ data, onValidationChange, activeTabId, onTabChange }) => {
  const [activeTab, setActiveTab] = useState<Tab>('DNA');
  const [loading, setLoading] = useState(true);

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
    onValidationChange(true);
    const timer = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(timer);
  }, [onValidationChange]);

  const handleNext = () => {
    const idx = TABS.findIndex((t) => t.id === activeTab);
    if (idx < TABS.length - 1) {
      handleTabClick(TABS[idx + 1].id);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] w-full space-y-6 animate-fadeIn bg-slate-50 rounded-3xl border border-slate-200">
        <div className="relative w-24 h-24">
          <div className="absolute inset-0 border-4 border-slate-200 rounded-full" />
          <div className="absolute inset-0 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center text-4xl">📊</div>
        </div>
        <div className="text-center space-y-2">
          <h3 className="text-2xl font-bold text-slate-900 font-display">
            Generating Investment Report
          </h3>
          <p className="text-slate-500">Synthesizing Compliance, Tokenomics, and Risk Data...</p>
        </div>
      </div>
    );

  return (
    <div className="w-full min-h-screen font-sans text-slate-900 bg-slate-50 pb-12">
      
      {/* DASHBOARD LAYOUT CONTAINER */}
      <div className="flex flex-col lg:flex-row h-full min-h-[80vh] gap-6">
        
        {/* LEFT SIDEBAR (Command Center) - Hidden on mobile if layout changes, but here acting as internal nav if parent sidebar is not enough */}
        {/* Note: The main WizardPage sidebar now controls this, but we keep this internal nav for larger screens or independent usage if needed. */}
        {/* We can conditionally hide this if controlled by parent props to avoid double nav, but keeping it ensures usability */}
        <aside className="w-full lg:w-[280px] flex-shrink-0 lg:sticky lg:top-4 lg:self-start space-y-6 hidden xl:block">
          
          {/* Navigation Card */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-lg shadow-slate-200/50 overflow-hidden">
            <div className="p-5 border-b border-slate-100 bg-slate-50/50">
              <h2 className="font-bold text-slate-900 text-sm uppercase tracking-wider font-display">Summary Hub</h2>
              <div className="flex items-center gap-2 mt-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs text-slate-500 font-bold truncate max-w-[180px]" title={data.property.title}>
                  {data.property.title || 'New Project'}
                </span>
              </div>
            </div>

            <div className="p-3 space-y-1">
              {TABS.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => handleTabClick(tab.id)}
                  className={`
                    w-full group flex items-center gap-3 px-4 py-3 rounded-xl text-left 
                    transition-all duration-200 relative overflow-hidden
                    ${
                      activeTab === tab.id
                        ? 'bg-slate-900 text-white shadow-md'
                        : 'hover:bg-slate-50 text-slate-600 hover:text-slate-900'
                    }
                  `}
                >
                  <span className={`text-lg transition-transform duration-300 ${activeTab === tab.id ? 'scale-110' : 'group-hover:scale-110 grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100'}`}>
                    {tab.icon}
                  </span>
                  <div className="flex-1 leading-tight min-w-0 relative z-10">
                    <span className="block font-bold text-xs uppercase tracking-wide">{tab.label}</span>
                    {activeTab === tab.id && <span className="text-[10px] text-slate-400 font-medium truncate block mt-0.5">{tab.desc}</span>}
                  </div>
                  
                  {tab.id === 'PRO_REVIEW' && activeTab !== tab.id && (
                    <span className="text-[9px] bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-bold uppercase tracking-wide">
                      PRO
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

        </aside>

        {/* MAIN CONTENT CANVAS (Full Width) */}
        <main className="flex-1 min-w-0 bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-200 overflow-hidden flex flex-col">
          
          {/* Tab Content Scroll Area */}
          <div className="flex-1 overflow-y-auto custom-scrollbar p-6 md:p-10 lg:p-12">
            <div className="max-w-[1600px] mx-auto">
              
              {activeTab === 'DNA' && (
                <div className="space-y-10 animate-slideUp">
                  <SummaryIntro />
                  <DataIntakeTab data={data} />
                  <div className="flex justify-end pt-6 border-t border-slate-100">
                    <button
                      onClick={handleNext}
                      className="group px-8 py-4 bg-slate-900 text-white rounded-2xl font-bold text-sm shadow-xl hover:shadow-2xl hover:shadow-slate-900/20 hover:-translate-y-1 transition-all flex items-center gap-3"
                    >
                      Analyze Strategy
                      <span className="group-hover:translate-x-1 transition-transform">→</span>
                    </button>
                  </div>
                </div>
              )}

              {activeTab === 'ANALYSIS' && (
                <div className="space-y-8 animate-slideUp">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end border-b border-slate-100 pb-6 gap-4">
                    <div>
                      <h3 className="text-3xl font-bold text-slate-900 font-display tracking-tight">
                        Strategic Analysis
                      </h3>
                      <p className="text-slate-500 mt-2 text-lg">
                        AI-driven evaluation of your deal structure and risk profile.
                      </p>
                    </div>
                    <button
                      onClick={handleNext}
                      className="px-6 py-3 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-xl font-bold transition-colors text-sm border border-slate-200"
                    >
                      Skip to Matching →
                    </button>
                  </div>
                  <ExecutiveSummaryCard data={data} />
                  <ScorecardGrid />
                  <RiskAndNextSteps />
                </div>
              )}

              {activeTab === 'MATCHING' && (
                <div className="space-y-8 animate-slideUp">
                  <ProviderMatchingTab data={data} />
                  <div className="flex justify-end">
                    <button
                      onClick={handleNext}
                      className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-bold text-sm shadow-xl hover:-translate-y-1 transition-all"
                    >
                      View Submission Flow →
                    </button>
                  </div>
                </div>
              )}

              {activeTab === 'FLOW' && (
                <div className="space-y-8 animate-slideUp">
                  <SubmissionFlowTab />
                  <div className="flex justify-end">
                    <button
                      onClick={handleNext}
                      className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-bold text-sm shadow-xl hover:-translate-y-1 transition-all"
                    >
                      Proceed to AI Review →
                    </button>
                  </div>
                </div>
              )}

              {activeTab === 'PRO_REVIEW' && (
                <div className="animate-slideUp h-full flex items-center justify-center">
                  <ProjectReviewTeaserTab />
                </div>
              )}

              {activeTab === 'EXPORT' && (
                <div className="animate-slideUp h-full">
                  <ExportShareTab onNext={handleNext} />
                </div>
              )}

              {activeTab === 'EXECUTION' && (
                <div className="animate-slideUp h-full">
                  <ExecutionPathTab onNext={handleNext} />
                </div>
              )}

              {activeTab === 'ENTERPRISE' && (
                <div className="animate-slideUp h-full flex items-center justify-center">
                  <EnterprisePathwayTab onNext={handleNext} />
                </div>
              )}

              {activeTab === 'FINAL' && (
                <div className="animate-slideUp h-full flex items-center justify-center">
                  <FinalActionTab />
                </div>
              )}

            </div>
          </div>
        </main>

      </div>
    </div>
  );
};
