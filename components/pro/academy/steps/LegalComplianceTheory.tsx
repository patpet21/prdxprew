
import React, { useState, useEffect } from 'react';
import { RegulatoryFramework } from '../tools/legal_compliance/RegulatoryFramework';
import { InvestorRules } from '../tools/legal_compliance/InvestorRules';
import { RiskMatrix } from '../tools/legal_compliance/RiskMatrix';
import { LegalTemplatesTab } from '../tools/legal_compliance/LegalTemplatesTab';
import { LegalExportTab } from '../tools/legal_compliance/LegalExportTab';

type Tab = 'FRAMEWORK' | 'INVESTORS' | 'RISK' | 'TEMPLATES' | 'EXPORT';

const TABS: { id: Tab; label: string }[] = [
    { id: 'FRAMEWORK', label: '1. Framework' },
    { id: 'INVESTORS', label: '2. Investor Rules' },
    { id: 'RISK', label: '3. Risk Matrix' },
    { id: 'TEMPLATES', label: '4. Templates' },
    { id: 'EXPORT', label: '5. Export' },
];

export const LegalComplianceTheory: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('FRAMEWORK');
  
  const [legalState, setLegalState] = useState(() => {
      const saved = localStorage.getItem('pdx_academy_state');
      if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed.legalCompliance) return parsed.legalCompliance;
      }
      return {
          regulatoryFramework: {},
          investorRules: {},
          riskMatrix: {},
          templates: { generatedSamples: {} }
      };
  });

  useEffect(() => {
      const saved = localStorage.getItem('pdx_academy_state');
      let fullState = saved ? JSON.parse(saved) : {};
      
      fullState.legalCompliance = legalState;
      localStorage.setItem('pdx_academy_state', JSON.stringify(fullState));
  }, [legalState]);

  const updateSection = (section: string, data: any) => {
      setLegalState((prev: any) => ({
          ...prev,
          [section]: { ...prev[section], ...data }
      }));
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
          case 'FRAMEWORK': return <RegulatoryFramework data={legalState.regulatoryFramework} onUpdate={(d) => updateSection('regulatoryFramework', d)} onNext={handleNext} />;
          case 'INVESTORS': return <InvestorRules data={legalState.investorRules} onUpdate={(d) => updateSection('investorRules', d)} onNext={handleNext} />;
          case 'RISK': return <RiskMatrix data={legalState.riskMatrix} framework={legalState.regulatoryFramework} onUpdate={(d) => updateSection('riskMatrix', d)} onNext={handleNext} />;
          case 'TEMPLATES': return <LegalTemplatesTab data={legalState} onUpdate={(d) => updateSection('templates', d)} onNext={handleNext} />;
          case 'EXPORT': return <LegalExportTab data={legalState} />;
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
                className={`py-4 px-6 text-xs font-bold uppercase tracking-wider border-b-2 transition-all whitespace-nowrap ${activeTab === tab.id ? 'border-red-500 text-red-600' : 'border-transparent text-slate-400 hover:text-slate-600 hover:border-slate-200'}`}
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
