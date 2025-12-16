
import React, { useState, useEffect } from 'react';
import { CapitalStackTab } from '../tools/financials/CapitalStackTab';
import { YieldMetricsTab } from '../tools/financials/YieldMetricsTab';
import { RoiSimulatorTab } from '../tools/financials/RoiSimulatorTab';
import { TokenInvestorTab } from '../tools/financials/TokenInvestorTab';
import { SponsorEconomicsTab } from '../tools/financials/SponsorEconomicsTab';
import { WaterfallExplainerTab } from '../tools/financials/WaterfallExplainerTab';
import { Button } from '../../../ui/Button';
import { AcademyPdfService } from '../../../../services/academyPdfService';

type Tab = 'STACK' | 'YIELD' | 'ROI' | 'INVESTOR' | 'SPONSOR' | 'WATERFALL' | 'EXPORT';

const TABS: { id: Tab; label: string }[] = [
    { id: 'STACK', label: 'Capital Stack' },
    { id: 'YIELD', label: 'Yield Metrics' },
    { id: 'ROI', label: 'ROI Simulator' },
    { id: 'INVESTOR', label: 'Investor View' },
    { id: 'SPONSOR', label: 'Sponsor View' },
    { id: 'WATERFALL', label: 'Waterfall' },
    { id: 'EXPORT', label: 'Export PDF' },
];

export const FinancialsRoiTheory: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('STACK');
  
  const [financeState, setFinanceState] = useState({
      capitalStack: { seniorDebtPct: 50, mezzDebtPct: 10, tokenEquityPct: 30, sponsorEquityPct: 10, aiInsight: '' },
      yieldMetrics: { 
          base: { coc: 8.5, irr: 14.2 }, 
          optimistic: { coc: 10.5, irr: 18.0 }, 
          conservative: { coc: 6.0, irr: 10.5 },
          aiComment: '' 
      },
      roiSimulator: {
          incomeGrowth: 2, vacancy: 5, opexPct: 25, exitCapRate: 5, holdingYears: 5,
          noiYear1: 60000, noiFinal: 75000, exitValue: 1200000, equityInvested: 400000,
          irr: 15.2, equityMultiple: 1.8, aiInsight: ''
      },
      investorEconomics: {
          tokenPrice: 50, annualDistributionPerToken: 4.25, netYield: 8.5, totalReturn5Y: 180, payoutFrequency: 'Quarterly', aiPerspective: ''
      },
      sponsorEconomics: {
          sponsorEquityPct: 10, sponsorIrr: 22, sponsorFeesNote: '2% Mgmt + 20% Carry', aiFairnessCheck: ''
      },
      waterfallExplainer: { aiExplanation: '' }
  });

  const [projectContext, setProjectContext] = useState<any>(null);

  useEffect(() => {
      const simState = localStorage.getItem('pdx_simulator_state');
      if (simState) {
          try {
              const parsed = JSON.parse(simState);
              setProjectContext(parsed);
          } catch(e) { console.error(e); }
      }
      const academyState = localStorage.getItem('pdx_academy_state');
      if (academyState) {
          try {
              const parsed = JSON.parse(academyState);
              if (parsed.financials) {
                  setFinanceState(prev => ({ ...prev, ...parsed.financials }));
              }
          } catch(e) { console.error(e); }
      }
  }, []);

  useEffect(() => {
      const savedState = localStorage.getItem('pdx_academy_state');
      let fullState = savedState ? JSON.parse(savedState) : {};
      fullState = { ...fullState, financials: financeState };
      localStorage.setItem('pdx_academy_state', JSON.stringify(fullState));
  }, [financeState]);

  const updateSection = (section: keyof typeof financeState, data: any) => {
      setFinanceState(prev => ({ ...prev, [section]: { ...prev[section], ...data } }));
  };

  const handleExport = () => {
      AcademyPdfService.generateFinancialModelPDF(financeState, projectContext);
  };

  const handleNext = () => {
      const idx = TABS.findIndex(t => t.id === activeTab);
      if (idx < TABS.length - 1) {
          setActiveTab(TABS[idx + 1].id);
          window.scrollTo({ top: 0, behavior: 'smooth' });
      }
  };

  const renderContent = () => {
      switch(activeTab) {
          case 'STACK': return <CapitalStackTab data={financeState.capitalStack} onUpdate={(d) => updateSection('capitalStack', d)} context={projectContext} onNext={handleNext} />;
          case 'YIELD': return <YieldMetricsTab data={financeState.yieldMetrics} onUpdate={(d) => updateSection('yieldMetrics', d)} context={projectContext} onNext={handleNext} />;
          case 'ROI': return <RoiSimulatorTab data={financeState.roiSimulator} onUpdate={(d) => updateSection('roiSimulator', d)} context={projectContext} onNext={handleNext} />;
          case 'INVESTOR': return <TokenInvestorTab data={financeState.investorEconomics} onUpdate={(d) => updateSection('investorEconomics', d)} context={projectContext} onNext={handleNext} />;
          case 'SPONSOR': return <SponsorEconomicsTab data={financeState.sponsorEconomics} onUpdate={(d) => updateSection('sponsorEconomics', d)} context={projectContext} onNext={handleNext} />;
          case 'WATERFALL': return <WaterfallExplainerTab data={financeState.waterfallExplainer} onUpdate={(d) => updateSection('waterfallExplainer', d)} context={projectContext} onNext={handleNext} />;
          case 'EXPORT': return (
                  <div className="flex flex-col items-center justify-center h-full p-8 text-center bg-white rounded-2xl border border-sim-border shadow-sm max-w-3xl mx-auto">
                      <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-4xl mb-6 text-white shadow-xl shadow-blue-500/20">📄</div>
                      <h3 className="text-2xl font-bold text-sim-blue mb-2">Financial Model Report</h3>
                      <p className="text-slate-500 max-w-md mb-8">Your comprehensive financial analysis is ready. This PDF includes all configured scenarios, stress tests, and AI insights.</p>
                      <Button onClick={handleExport} className="px-10 py-4 text-lg bg-sim-cta hover:bg-sim-cta-hover text-white shadow-xl rounded-xl flex items-center gap-2">
                          <span className="text-xl">📥</span> Download PDF Report
                      </Button>
                  </div>
              );
          default: return null;
      }
  };

  return (
    <div className="flex flex-col h-full w-full bg-slate-50 animate-fadeIn">
      {/* Top Nav */}
      <div className="bg-white border-b border-slate-200 px-6 shrink-0 flex items-center gap-1 overflow-x-auto no-scrollbar">
          {TABS.map(tab => (
              <button 
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-6 text-xs font-bold uppercase tracking-wider border-b-2 transition-all whitespace-nowrap ${activeTab === tab.id ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-400 hover:text-slate-600 hover:border-slate-200'}`}
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
