
import React, { useState } from 'react';
import { JurisdictionCompare, SpvModelCompare, TokenTypeCompare, FeeStructureCompare, GovernanceCompare, InvestorFitCompare } from '../tools/compare_engine';
import { AcademyPdfService } from '../../../../services/academyPdfService';
import { generateFinalDecisionReport } from '../../../../services/mockAiService';
import { Button } from '../../../ui/Button';

type Tab = 'JURISDICTION' | 'SPV' | 'TOKEN' | 'FEES' | 'GOVERNANCE' | 'INVESTOR';

interface Props {
    onNavigate?: (page: string) => void;
}

const TABS: { id: Tab; label: string; icon: string }[] = [
    { id: 'JURISDICTION', label: 'Jurisdictions', icon: '🌍' },
    { id: 'SPV', label: 'SPV Models', icon: '🏛️' },
    { id: 'TOKEN', label: 'Token Types', icon: '🪙' },
    { id: 'FEES', label: 'Fee Structures', icon: '💸' },
    { id: 'GOVERNANCE', label: 'Governance', icon: '⚖️' },
    { id: 'INVESTOR', label: 'Investor Fit', icon: '👥' }
];

export const CompareChoicesTheory: React.FC<Props> = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState<Tab>('JURISDICTION');
  const [isExporting, setIsExporting] = useState(false);

  const handleNextTab = () => {
      const idx = TABS.findIndex(t => t.id === activeTab);
      if (idx < TABS.length - 1) {
          setActiveTab(TABS[idx + 1].id);
      }
  };

  const handleExportMatrix = async () => {
      setIsExporting(true);
      const data = JSON.parse(localStorage.getItem('academyPro_compare') || '{}');
      const synthesis = await generateFinalDecisionReport(data);
      AcademyPdfService.generateDecisionMatrixPDF(data, synthesis);
      setIsExporting(false);
  };

  const handleGoToNextModule = () => {
      if (onNavigate) {
          const event = new CustomEvent('academyNavigate', { detail: 'build_real_project_theory' });
          window.dispatchEvent(event);
      }
  };

  const renderContent = () => {
      switch(activeTab) {
          case 'JURISDICTION': return <JurisdictionCompare onNext={handleNextTab} />;
          case 'SPV': return <SpvModelCompare onNext={handleNextTab} />;
          case 'TOKEN': return <TokenTypeCompare onNext={handleNextTab} />;
          case 'FEES': return <FeeStructureCompare onNext={handleNextTab} />;
          case 'GOVERNANCE': return <GovernanceCompare onNext={handleNextTab} />;
          case 'INVESTOR': return <InvestorFitCompare onExport={handleExportMatrix} isExporting={isExporting} onNext={handleGoToNextModule} />;
          default: return null;
      }
  };

  return (
    <div className="flex flex-col h-full w-full bg-slate-950 overflow-hidden">
      
      {/* 1. SPECTACULAR HERO HEADER */}
      <div className="shrink-0 bg-slate-900 border-b border-slate-800 p-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[100px] -mr-32 -mt-32 pointer-events-none animate-pulse"></div>
          <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-purple-500/5 rounded-full blur-[80px] -ml-20 -mb-20 pointer-events-none"></div>
          
          <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
              <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-[10px] font-bold uppercase tracking-widest mb-3 backdrop-blur-sm">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse"></span>
                      Decision Engine v2.0
                  </div>
                  <h1 className="text-3xl md:text-5xl font-black font-display text-white tracking-tight mb-2">
                      Trade-off <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Simulator</span>
                  </h1>
                  <p className="text-slate-400 max-w-xl text-sm md:text-base leading-relaxed">
                      Every choice has a cost. Compare strategic options side-by-side with AI scoring to architect the optimal vehicle.
                  </p>
              </div>
              
              <div className="flex gap-3">
                  <Button onClick={handleExportMatrix} isLoading={isExporting} variant="secondary" className="border-slate-700 hover:bg-slate-800 text-xs">
                      📥 Export Matrix
                  </Button>
              </div>
          </div>
      </div>

      {/* 2. NAVIGATION BAR */}
      <div className="shrink-0 border-b border-slate-800 bg-slate-950/50 backdrop-blur-sm z-20">
          <div className="flex gap-1 p-2 overflow-x-auto no-scrollbar mask-linear-fade">
              {TABS.map(tab => (
                  <button 
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`
                        flex items-center gap-2 px-5 py-3 rounded-lg text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap
                        ${activeTab === tab.id 
                            ? 'bg-slate-800 text-white shadow-lg border border-slate-700 transform scale-105' 
                            : 'text-slate-500 hover:text-slate-300 hover:bg-slate-900'
                        }
                    `}
                  >
                      <span className="text-lg">{tab.icon}</span>
                      {tab.label}
                  </button>
              ))}
          </div>
      </div>

      {/* 3. MAIN CONTENT AREA */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-6 md:p-8 bg-slate-950 relative">
          <div className="max-w-7xl mx-auto min-h-full flex flex-col">
              {renderContent()}
          </div>
      </div>

    </div>
  );
};
