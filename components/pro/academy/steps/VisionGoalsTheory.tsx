
import React, { useState, useEffect } from 'react';
import { VisionComposer } from '../tools/vision/VisionComposer';
import { InvestorFitMatrix } from '../tools/vision/InvestorFitMatrix';
import { TechStrategyNavigator } from '../tools/vision/TechStrategyNavigator';
import { FounderDiagnosticTool } from '../tools/vision/FounderDiagnosticTool';
import { StrategicGoalsEngineTool } from '../tools/vision/StrategicGoalsEngineTool';
import { AcademyPdfService } from '../../../../services/academyPdfService';

type Tab = 'VISION' | 'INVESTOR' | 'TECH' | 'FOUNDER' | 'GOALS';

export const VisionGoalsTheory: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('VISION');
  
  // Central State Management
  const [state, setState] = useState({
      visionComposer: {},
      investorFit: {},
      techStrategy: {},
      founderDiagnostic: {},
      strategicGoals: {}
  });

  useEffect(() => {
      const saved = localStorage.getItem('pdx_vision_goals_module');
      if (saved) {
          try {
              setState(JSON.parse(saved));
          } catch(e) { console.error("Load failed", e); }
      }
  }, []);

  useEffect(() => {
      localStorage.setItem('pdx_vision_goals_module', JSON.stringify(state));
  }, [state]);

  const updateSection = (section: keyof typeof state, data: any) => {
      setState(prev => ({ ...prev, [section]: data }));
  };

  const handleExportPDF = () => {
      if (!state.strategicGoals) {
          alert("Please complete the final step first.");
          return;
      }
      AcademyPdfService.generateVisionStratPDF(state);
  };

  const tabs: { id: Tab; label: string }[] = [
      { id: 'VISION', label: '1. Vision' },
      { id: 'INVESTOR', label: '2. Investor Fit' },
      { id: 'TECH', label: '3. Tech Strategy' },
      { id: 'FOUNDER', label: '4. Founder DNA' },
      { id: 'GOALS', label: '5. Strategic Goals' },
  ];

  const handleNext = (nextTab: Tab) => {
      setActiveTab(nextTab);
      window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="flex flex-col h-full w-full bg-slate-50 animate-fadeIn">
      
      {/* Top Nav */}
      <div className="bg-white border-b border-slate-200 px-6 shrink-0 flex items-center gap-1 overflow-x-auto no-scrollbar">
          {tabs.map(tab => (
              <button 
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                    py-4 px-6 text-xs font-bold uppercase tracking-wider border-b-2 transition-all whitespace-nowrap
                    ${activeTab === tab.id 
                        ? 'border-indigo-600 text-indigo-600' 
                        : 'border-transparent text-slate-400 hover:text-slate-600 hover:border-slate-200'
                    }
                `}
              >
                  {tab.label}
              </button>
          ))}
      </div>

      {/* Content */}
      <div className="flex-1 w-full max-w-[1920px] mx-auto p-8 overflow-y-auto">
          <div className="max-w-7xl mx-auto h-full">
              {activeTab === 'VISION' && (
                  <VisionComposer 
                      data={state.visionComposer} 
                      onUpdate={(d) => updateSection('visionComposer', d)}
                      onNext={() => handleNext('INVESTOR')}
                  />
              )}
              {activeTab === 'INVESTOR' && (
                  <InvestorFitMatrix
                      data={state.investorFit} 
                      onUpdate={(d) => updateSection('investorFit', d)}
                      onNext={() => handleNext('TECH')}
                  />
              )}
              {activeTab === 'TECH' && (
                  <TechStrategyNavigator
                      data={state.techStrategy} 
                      onUpdate={(d) => updateSection('techStrategy', d)}
                      onNext={() => handleNext('FOUNDER')}
                  />
              )}
              {activeTab === 'FOUNDER' && (
                  <FounderDiagnosticTool
                      data={state.founderDiagnostic} 
                      onUpdate={(d) => updateSection('founderDiagnostic', d)}
                      onNext={() => handleNext('GOALS')}
                  />
              )}
              {activeTab === 'GOALS' && (
                  <StrategicGoalsEngineTool
                      data={state.strategicGoals} 
                      onUpdate={(d) => updateSection('strategicGoals', d)}
                      onExport={handleExportPDF}
                  />
              )}
          </div>
      </div>
    </div>
  );
};
