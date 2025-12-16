
import React, { useState } from 'react';
import { InstitutionalReport, PitchDeckGenerator, NarrativeBuilder, ExecutionMap, FinalReportCompiler } from '../tools/reports_roadmap';
import { Button } from '../../../ui/Button';

type Tab = 'INSTITUTIONAL' | 'PITCH' | 'NARRATIVE' | 'EXECUTION' | 'FINAL';

export const ReportsRoadmapTheory: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('INSTITUTIONAL');

  const renderContent = () => {
      switch(activeTab) {
          case 'INSTITUTIONAL': return <InstitutionalReport />;
          case 'PITCH': return <PitchDeckGenerator />;
          case 'NARRATIVE': return <NarrativeBuilder />;
          case 'EXECUTION': return <ExecutionMap />;
          case 'FINAL': return <FinalReportCompiler />;
          default: return null;
      }
  };

  return (
    <div className="flex flex-col h-full w-full bg-slate-50 animate-fadeIn">
      
      {/* Top Nav */}
      <div className="bg-white border-b border-slate-200 px-6 shrink-0 flex items-center gap-1 overflow-x-auto no-scrollbar">
          {[
              { id: 'INSTITUTIONAL', label: '1. Deal Memo' },
              { id: 'PITCH', label: '2. Pitch Deck' },
              { id: 'NARRATIVE', label: '3. Story Builder' },
              { id: 'EXECUTION', label: '4. Execution Map' },
              { id: 'FINAL', label: '5. Final Report' }
          ].map(tab => (
              <button 
                key={tab.id}
                onClick={() => setActiveTab(tab.id as Tab)}
                className={`py-4 px-6 text-xs font-bold uppercase tracking-wider border-b-2 transition-all whitespace-nowrap ${activeTab === tab.id ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-400 hover:text-slate-600 hover:border-slate-200'}`}
              >
                  {tab.label}
              </button>
          ))}
      </div>

      <div className="flex-1 w-full max-w-[1920px] mx-auto p-8 overflow-y-auto">
          {renderContent()}
      </div>

    </div>
  );
};
