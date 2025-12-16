
import React, { useState } from 'react';
import { StepProps } from '../../../types';
import { 
    ExecutiveSummary,
    FeasibilityReport,
    ComplianceSummary,
    TokenizationBlueprint,
    TwelveMonthRoadmap,
    ExportCenter,
    AiFinalBrief
} from './reports_roadmap';
import { Button } from '../../../components/ui/Button';
import { generateAllProReports } from '../../../services/mockAiService';

type ReportTab = 'summary' | 'feasibility' | 'compliance' | 'blueprint' | 'roadmap' | 'export' | 'brief';

export const ProReportsStep: React.FC<StepProps> = ({ data, updateData }) => {
  const [activeTab, setActiveTab] = useState<ReportTab>('summary');
  const [isGenerating, setIsGenerating] = useState(false);

  const tabs: { id: ReportTab; label: string; icon: string }[] = [
      { id: 'summary', label: 'Executive Summary', icon: '💎' },
      { id: 'feasibility', label: 'Feasibility', icon: '📊' },
      { id: 'compliance', label: 'Compliance', icon: '🛡️' },
      { id: 'blueprint', label: 'Blueprint', icon: '🗺️' },
      { id: 'roadmap', label: 'Roadmap', icon: '🗓️' },
      { id: 'export', label: 'Export', icon: '📦' },
      { id: 'brief', label: 'AI Verdict', icon: '🤖' },
  ];

  const handleGenerateAll = async () => {
    setIsGenerating(true);
    const reports = await generateAllProReports(data);
    updateData('proReports', reports);
    setIsGenerating(false);
  };

  const renderContent = () => {
      // If no report data, prompt generation
      if (!data.proReports && !isGenerating) {
        return (
            <div className="flex flex-col items-center justify-center h-[400px] text-center p-8 bg-slate-900/50 rounded-2xl border border-slate-800 border-dashed">
                <div className="text-6xl mb-6 grayscale opacity-30">📑</div>
                <h3 className="text-xl font-bold text-white mb-2">Final Report Generation</h3>
                <p className="text-slate-400 mb-8 max-w-md">
                    Aggregate all your simulation data (SPV, Tokenomics, Financials) into a cohesive investment memorandum.
                </p>
                <Button onClick={handleGenerateAll} className="bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg px-8 py-3">
                    Compile Master Report
                </Button>
            </div>
        );
      }
      
      if (isGenerating) {
          return (
             <div className="flex flex-col items-center justify-center h-[400px] text-center p-8">
                <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-6"></div>
                <h3 className="text-xl font-bold text-white animate-pulse">Consulting AI Analysts...</h3>
                <p className="text-slate-400 text-sm mt-2">Harmonizing legal, financial, and technical data.</p>
             </div>
          );
      }

      switch (activeTab) {
          case 'summary': return <ExecutiveSummary data={data} />;
          case 'feasibility': return <FeasibilityReport data={data} />;
          case 'compliance': return <ComplianceSummary data={data} />;
          case 'blueprint': return <TokenizationBlueprint data={data} />;
          case 'roadmap': return <TwelveMonthRoadmap data={data} />;
          case 'export': return <ExportCenter />;
          case 'brief': return <AiFinalBrief data={data} />;
          default: return null;
      }
  };

  return (
    <div className="space-y-6 animate-fadeIn h-full flex flex-col">
      
      {/* Header & Tabs */}
      <div className="flex flex-col md:flex-row justify-between items-end border-b border-slate-800 pb-4 gap-4">
        <div>
            <h3 className="text-xl font-bold font-display text-white mb-1">Reports & Roadmap</h3>
            <p className="text-slate-400 text-sm">
                Final project consolidation and strategic output.
            </p>
        </div>
        <div className="flex items-center gap-4">
            {data.proReports && (
                 <Button onClick={handleGenerateAll} disabled={isGenerating} size="sm" variant="secondary" className="border-slate-700 text-slate-400">
                     Refresh Data
                 </Button>
            )}
            <div className="flex gap-2 overflow-x-auto max-w-full pb-2 md:pb-0 custom-scrollbar">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`
                            px-3 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 whitespace-nowrap
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
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
          {renderContent()}
      </div>

    </div>
  );
};
