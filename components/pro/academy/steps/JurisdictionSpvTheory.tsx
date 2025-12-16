
import React, { useState, useEffect } from 'react';
import { StrategicContextBuilder } from '../tools/jurisdiction/StrategicContextBuilder';
import { SpvEducationalCards } from '../tools/jurisdiction/SpvEducationalCards';
import { SpvArchitectTool } from '../tools/jurisdiction/SpvArchitectTool';
import { SpvRedFlagsTab } from '../tools/jurisdiction/SpvRedFlagsTab';
import { SpvBlueprintTab } from '../tools/jurisdiction/SpvBlueprintTab';

type Tab = 'CONTEXT' | 'ANALYSIS' | 'COMPARISON' | 'RED_FLAGS' | 'BLUEPRINT';

const TABS: { id: Tab; label: string; icon: string }[] = [
    { id: 'CONTEXT', label: 'Strategic Context', icon: '🧠' },
    { id: 'ANALYSIS', label: 'SPV Architect', icon: '🏗️' },
    { id: 'COMPARISON', label: 'Comparison', icon: '⚖️' },
    { id: 'RED_FLAGS', label: 'Red Flags', icon: '🚩' },
    { id: 'BLUEPRINT', label: 'Blueprint', icon: '📝' },
];

export const JurisdictionSpvTheory: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('CONTEXT');
  
  const [contextData, setContextData] = useState({
      locationCountry: 'Italy',
      locationRegion: '',
      locationCity: '',
      investorOrigin: 'EU',
      investorType: 'Accredited',
      targetRaise: '1M - 5M',
      currentOwnership: 'Owned by SPV',
      timeframe: '5 Years',
      capitalStructure: 'Equity',
      riskTolerance: 'Medium',
      governancePref: 'Centralized',
      taxPriority: 'Balanced',
      legalPriority: 'Simplicity',
      crossBorder: 'No'
  });

  const [strategyResult, setStrategyResult] = useState<any>(null);

  useEffect(() => {
      const savedState = localStorage.getItem('pdx_academy_spv_module');
      if (savedState) {
          try {
              const parsed = JSON.parse(savedState);
              if (parsed.contextData) setContextData(parsed.contextData);
              if (parsed.strategyResult) setStrategyResult(parsed.strategyResult);
          } catch (e) { console.error("Error loading module state", e); }
      }
      const handleNav = (e: any) => setActiveTab(e.detail);
      window.addEventListener('navToTab', handleNav);
      return () => window.removeEventListener('navToTab', handleNav);
  }, []);

  useEffect(() => {
      const currentState = JSON.parse(localStorage.getItem('pdx_academy_spv_module') || '{}');
      const stateToSave = { ...currentState, contextData, strategyResult };
      localStorage.setItem('pdx_academy_spv_module', JSON.stringify(stateToSave));
  }, [contextData, strategyResult]);

  return (
    <div className="flex h-full w-full bg-slate-50 animate-fadeIn">
       
       {/* Left Sidebar Menu (Full Height) */}
       <div className="w-64 bg-white border-r border-slate-200 flex flex-col flex-shrink-0 z-10">
           <div className="p-6 border-b border-slate-100">
               <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">SPV Engineering</h3>
           </div>
           <div className="flex-1 overflow-y-auto p-2 space-y-1">
               {TABS.map(tab => (
                   <button
                       key={tab.id}
                       onClick={() => setActiveTab(tab.id)}
                       className={`
                           w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-bold transition-all text-left
                           ${activeTab === tab.id 
                               ? 'bg-indigo-50 text-indigo-700' 
                               : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                           }
                       `}
                   >
                       <span className="text-lg">{tab.icon}</span>
                       {tab.label}
                   </button>
               ))}
           </div>
           
           {strategyResult && (
               <div className="p-4 border-t border-slate-100">
                   <div className="bg-emerald-50 border border-emerald-100 p-3 rounded-xl">
                       <p className="text-[10px] font-bold text-emerald-600 uppercase mb-1">Active Strategy</p>
                       <p className="text-xs text-slate-700 font-bold truncate">
                           {strategyResult.models?.find((m: any) => m.fit === 'Best Fit')?.type || 'Pending'}
                       </p>
                   </div>
               </div>
           )}
       </div>

       {/* Main Content Area (Full Screen) */}
       <div className="flex-1 flex flex-col h-full overflow-hidden bg-slate-50 relative">
           <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
               <div className="max-w-6xl mx-auto h-full">
                    {activeTab === 'CONTEXT' && (
                        <div className="space-y-8">
                            <StrategicContextBuilder 
                                data={contextData} 
                                onUpdate={(newData) => setContextData(prev => ({ ...prev, ...newData }))} 
                                onResult={setStrategyResult}
                            />
                            {strategyResult && (
                                <SpvEducationalCards cards={strategyResult.educational_cards} />
                            )}
                        </div>
                    )}

                    {activeTab === 'ANALYSIS' && <SpvArchitectTool />}
                    
                    {activeTab === 'COMPARISON' && (
                        <div className="flex items-center justify-center h-full min-h-[400px] text-slate-400 border-2 border-dashed border-slate-200 rounded-2xl">
                            <div className="text-center">
                                <span className="text-4xl block mb-2">⚖️</span>
                                Comparison Module (Coming Soon)
                            </div>
                        </div>
                    )}

                    {activeTab === 'RED_FLAGS' && <SpvRedFlagsTab />}
                    {activeTab === 'BLUEPRINT' && <SpvBlueprintTab />}
               </div>
           </div>
       </div>

    </div>
  );
};
