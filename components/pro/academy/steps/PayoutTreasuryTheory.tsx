
import React, { useState } from 'react';
import { FeeStructure, WaterfallSimulator, InvestorReturnPaths, TreasuryRules, RiskScenarios, AiFinanceInsights } from '../tools/payout_treasury';
import { Button } from '../../../ui/Button';
import { generatePayoutPdfContent } from '../../../../services/mockAiService';
import { AcademyPdfService } from '../../../../services/academyPdfService';

type Tab = 'FEES' | 'WATERFALL' | 'PATHS' | 'TREASURY' | 'RISK' | 'INSIGHTS';

const TABS: { id: Tab; label: string; number: string }[] = [
    { id: 'FEES', label: 'Fee Structure', number: '01' },
    { id: 'WATERFALL', label: 'Waterfall', number: '02' },
    { id: 'PATHS', label: 'Investor Paths', number: '03' },
    { id: 'TREASURY', label: 'Treasury', number: '04' },
    { id: 'RISK', label: 'Risk Sim', number: '05' },
    { id: 'INSIGHTS', label: 'Verdict', number: '06' }
];

export const PayoutTreasuryTheory: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('FEES');
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  const handleNextTab = () => {
      const idx = TABS.findIndex(t => t.id === activeTab);
      if (idx < TABS.length - 1) {
          setActiveTab(TABS[idx + 1].id as Tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
      }
  };

  const handleExportJson = () => {
      const data = JSON.parse(localStorage.getItem('academyPro_payout') || '{}');
      const payload = {
          module: "Payout & Treasury Strategy",
          timestamp: new Date().toISOString(),
          data: data,
          status: "Draft"
      };
      const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = "payout_strategy.json";
      a.click();
  };

  const handleExportPDF = async () => {
      setIsGeneratingPdf(true);
      const data = JSON.parse(localStorage.getItem('academyPro_payout') || '{}');
      
      let aiContent = data.pdfContent;
      if (!aiContent) {
          try {
             aiContent = await generatePayoutPdfContent(data);
          } catch (e) {
             console.error("PDF Gen Error", e);
             aiContent = {};
          }
      }
      
      AcademyPdfService.generatePayoutTreasuryPDF(data, aiContent);
      setIsGeneratingPdf(false);
  };

  const renderContent = () => {
      switch(activeTab) {
          case 'FEES': return <FeeStructure onNext={handleNextTab} onChange={() => {}} />;
          case 'WATERFALL': return <WaterfallSimulator onNext={handleNextTab} />;
          case 'PATHS': return <InvestorReturnPaths onNext={handleNextTab} />;
          case 'TREASURY': return <TreasuryRules onNext={handleNextTab} />;
          case 'RISK': return <RiskScenarios onNext={handleNextTab} />;
          case 'INSIGHTS': return <AiFinanceInsights />;
          default: return null;
      }
  };

  return (
    <div className="flex flex-col h-full w-full bg-slate-50 animate-fadeIn">
      
      {/* Top Bar: Minimal Navigation with New Palette */}
      <div className="flex items-center justify-between px-8 py-6 border-b border-slate-200 bg-white sticky top-0 z-20 shadow-sm">
          <div>
              <div className="flex items-center gap-2">
                 <div className="w-2 h-8 bg-prdx-cyan rounded-full"></div>
                 <h1 className="text-2xl font-bold font-display text-slate-900">Payout & Treasury</h1>
              </div>
              <p className="text-sm text-slate-500 pl-4 mt-0.5">Institutional Financial Engineering</p>
          </div>
          
          <div className="flex items-center gap-1 bg-slate-50 p-1 rounded-xl border border-slate-100">
              {TABS.map(tab => (
                  <button 
                    key={tab.id} 
                    onClick={() => setActiveTab(tab.id as Tab)} 
                    className={`
                        px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all
                        ${activeTab === tab.id 
                            ? 'bg-prdx-cyan text-white shadow-lg shadow-prdx-cyan/30' 
                            : 'text-slate-400 hover:text-prdx-blue hover:bg-white'
                        }
                    `}
                  >
                      <span className={`mr-2 opacity-50 ${activeTab === tab.id ? 'text-white' : ''}`}>{tab.number}</span>
                      {tab.label}
                  </button>
              ))}
          </div>
          
          <div className="flex gap-3">
              <Button onClick={handleExportJson} variant="secondary" className="bg-white border border-slate-200 text-slate-600 hover:text-prdx-blue hover:border-prdx-blue text-xs">
                  Save JSON
              </Button>
              <Button onClick={handleExportPDF} isLoading={isGeneratingPdf} className="bg-prdx-blue text-white hover:bg-prdx-cyan text-xs shadow-lg">
                  Export Report
              </Button>
          </div>
      </div>

      {/* Main Content Area: Full Screen / Free Field */}
      <div className="flex-1 w-full max-w-[1920px] mx-auto p-8 overflow-y-auto">
          {renderContent()}
      </div>

    </div>
  );
};
