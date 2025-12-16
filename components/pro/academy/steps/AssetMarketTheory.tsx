
import React, { useState, useEffect } from 'react';
import { Button } from '../../../ui/Button';
import { LocalMarketTab } from '../tools/market_analysis/LocalMarketTab';
import { GlobalComparisonTab } from '../tools/market_analysis/GlobalComparisonTab';
import { MacroRisksTab } from '../tools/market_analysis/MacroRisksTab';
import { ForecastSimulator } from '../tools/market_analysis/ForecastSimulator';
import { MarketExportTab } from '../tools/market_analysis/MarketExportTab'; 
import { AcademyPdfService } from '../../../../services/academyPdfService';

type Tab = 'LOCAL' | 'GLOBAL' | 'RISKS' | 'SIMULATOR' | 'EXPORT'; 

const TABS: Tab[] = ['LOCAL', 'GLOBAL', 'RISKS', 'SIMULATOR', 'EXPORT'];

export const AssetMarketTheory: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('LOCAL');
  
  const [marketState, setMarketState] = useState<any>({
      localMarket: {},
      globalBenchmark: {},
      macroRisks: {},
      forecastSim: {}
  });

  useEffect(() => {
      const savedState = localStorage.getItem('pdx_academy_state');
      if (savedState) {
          const parsed = JSON.parse(savedState);
          if (parsed.assetMarket) {
              setMarketState(parsed.assetMarket);
          }
      }
  }, []);

  useEffect(() => {
      const savedState = localStorage.getItem('pdx_academy_state');
      let fullState = savedState ? JSON.parse(savedState) : {};
      
      fullState = {
          ...fullState,
          assetMarket: marketState
      };
      
      localStorage.setItem('pdx_academy_state', JSON.stringify(fullState));
  }, [marketState]);

  const updateSection = (section: string, data: any) => {
      setMarketState((prev: any) => ({
          ...prev,
          [section]: { ...prev[section], ...data }
      }));
  };

  const handleNextTab = () => {
      const currentIndex = TABS.indexOf(activeTab);
      if (currentIndex < TABS.length - 1) {
          setActiveTab(TABS[currentIndex + 1]);
          window.scrollTo({ top: 0, behavior: 'smooth' });
      }
  };

  return (
    <div className="flex flex-col h-full w-full bg-slate-50 animate-fadeIn">
      
      {/* Top Nav */}
      <div className="bg-white border-b border-slate-200 px-6 shrink-0 flex items-center gap-1 overflow-x-auto no-scrollbar">
          <button onClick={() => setActiveTab('LOCAL')} className={`py-4 px-6 text-xs font-bold uppercase tracking-wider border-b-2 transition-all whitespace-nowrap ${activeTab === 'LOCAL' ? 'border-amber-500 text-amber-600' : 'border-transparent text-slate-400 hover:text-slate-600'}`}>1. Local Market</button>
          <button onClick={() => setActiveTab('GLOBAL')} className={`py-4 px-6 text-xs font-bold uppercase tracking-wider border-b-2 transition-all whitespace-nowrap ${activeTab === 'GLOBAL' ? 'border-blue-500 text-blue-600' : 'border-transparent text-slate-400 hover:text-slate-600'}`}>2. Global Benchmark</button>
          <button onClick={() => setActiveTab('RISKS')} className={`py-4 px-6 text-xs font-bold uppercase tracking-wider border-b-2 transition-all whitespace-nowrap ${activeTab === 'RISKS' ? 'border-red-500 text-red-600' : 'border-transparent text-slate-400 hover:text-slate-600'}`}>3. Macro Risks</button>
          <button onClick={() => setActiveTab('SIMULATOR')} className={`py-4 px-6 text-xs font-bold uppercase tracking-wider border-b-2 transition-all whitespace-nowrap ${activeTab === 'SIMULATOR' ? 'border-emerald-500 text-emerald-600' : 'border-transparent text-slate-400 hover:text-slate-600'}`}>4. Forecast Sim</button>
          <button onClick={() => setActiveTab('EXPORT')} className={`py-4 px-6 text-xs font-bold uppercase tracking-wider border-b-2 transition-all whitespace-nowrap ${activeTab === 'EXPORT' ? 'border-slate-800 text-slate-900' : 'border-transparent text-slate-400 hover:text-slate-600'}`}>5. Final Export</button>
      </div>

      {/* Content */}
      <div className="flex-1 w-full max-w-[1920px] mx-auto p-8 overflow-y-auto">
          {activeTab === 'LOCAL' && <LocalMarketTab data={marketState.localMarket} onUpdate={(d) => updateSection('localMarket', d)} onNext={handleNextTab} />}
          {activeTab === 'GLOBAL' && <GlobalComparisonTab data={marketState.globalBenchmark} onUpdate={(d) => updateSection('globalBenchmark', d)} onNext={handleNextTab} />}
          {activeTab === 'RISKS' && <MacroRisksTab data={marketState.macroRisks} onUpdate={(d) => updateSection('macroRisks', d)} onNext={handleNextTab} />}
          {activeTab === 'SIMULATOR' && <ForecastSimulator data={marketState.forecastSim} onUpdate={(d) => updateSection('forecastSim', d)} onNext={handleNextTab} />}
          {activeTab === 'EXPORT' && <MarketExportTab />}
      </div>

    </div>
  );
};
