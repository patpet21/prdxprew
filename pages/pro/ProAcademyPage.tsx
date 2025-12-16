
import React, { useState, useEffect } from 'react';
import { AcademySidebar } from '../../components/pro/academy/AcademySidebar';
import { Button } from '../../components/ui/Button';
import { useAcademyState } from '../../hooks/useAcademyState';

// Import Old Visual Components (Fundamentals)
import { BasicsTab } from '../../components/education/BasicsTab';
import { AssetTypesTab } from '../../components/education/AssetTypesTab';
import { LegalTab } from '../../components/education/LegalTab';
import { LifecycleTab } from '../../components/education/LifecycleTab';

// Import New Theory Components (Pro Curriculum)
import { OnboardingTheory } from '../../components/pro/academy/steps/OnboardingTheory';
import { VisionGoalsTheory } from '../../components/pro/academy/steps/VisionGoalsTheory';
import { RegulationLicensesStep } from '../../components/pro/academy/steps/RegulationLicensesStep';
import { JurisdictionSpvTheory } from '../../components/pro/academy/steps/JurisdictionSpvTheory';
import { AssetMarketTheory } from '../../components/pro/academy/steps/AssetMarketTheory';
import { FinancialsRoiTheory } from '../../components/pro/academy/steps/FinancialsRoiTheory';
import { LegalComplianceTheory } from '../../components/pro/academy/steps/LegalComplianceTheory';
import { TokenDesignTheory } from '../../components/pro/academy/steps/TokenDesignTheory';
import { DistributionTheory } from '../../components/pro/academy/steps/DistributionTheory';
import { PayoutTreasuryTheory } from '../../components/pro/academy/steps/PayoutTreasuryTheory';
import { ReportsRoadmapTheory } from '../../components/pro/academy/steps/ReportsRoadmapTheory';
import { CompareChoicesTheory } from '../../components/pro/academy/steps/CompareChoicesTheory';
import { BuildRealProjectTheory } from '../../components/pro/academy/steps/BuildRealProjectTheory';
import { FinalExam } from '../../components/pro/academy/steps/FinalExam';

interface ProAcademyPageProps {
  onBack: () => void;
  onNavigate: (page: string) => void;
  onLogin: () => void;
}

export const ProAcademyPage: React.FC<ProAcademyPageProps> = ({ onBack, onNavigate }) => {
  // Default to the first Pro module
  const [activeModule, setActiveModule] = useState('onboarding_theory'); 
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // Academy State Management
  const { state, updateModule, getModuleData } = useAcademyState();

  // Listen for internal navigation events from deep components
  useEffect(() => {
      const handleInternalNav = (e: any) => {
          if (e.detail) {
              setActiveModule(e.detail);
              window.scrollTo({ top: 0, behavior: 'smooth' });
          }
      };
      
      window.addEventListener('academyNavigate', handleInternalNav);
      return () => window.removeEventListener('academyNavigate', handleInternalNav);
  }, []);

  const renderContent = () => {
      // Fundamentals Section (Legacy Content - wrapped to fit new theme)
      // We wrap these in a container because they were designed as cards, but now we give them breathing room
      if (['basics', 'assets', 'legal', 'lifecycle'].includes(activeModule)) {
          return (
              <div className="h-full w-full overflow-y-auto bg-slate-50 p-8">
                  <div className="max-w-7xl mx-auto">
                    {activeModule === 'basics' && <BasicsTab />}
                    {activeModule === 'assets' && <AssetTypesTab />}
                    {activeModule === 'legal' && <LegalTab />}
                    {activeModule === 'lifecycle' && <LifecycleTab />}
                  </div>
              </div>
          );
      }

      // Pro Architect Curriculum
      // These components are now FULL SCREEN height/width internally
      switch(activeModule) {
          case 'onboarding_theory': 
            return <OnboardingTheory 
                moduleState={getModuleData('onboarding_theory')} 
                onUpdateState={(data) => updateModule('onboarding_theory', data)} 
            />;
          case 'vision_goals_theory': return <VisionGoalsTheory />;
          case 'regulation_licenses_101': 
            return <RegulationLicensesStep 
                moduleState={getModuleData('regulation_licenses_101')}
                onUpdateState={(data) => updateModule('regulation_licenses_101', data)}
            />;
          case 'jurisdiction_spv_theory': return <JurisdictionSpvTheory />;
          case 'asset_market_theory': return <AssetMarketTheory />;
          case 'financials_roi_theory': return <FinancialsRoiTheory />;
          case 'legal_compliance_theory': return <LegalComplianceTheory />;
          case 'token_design_theory': return <TokenDesignTheory />;
          case 'distribution_theory': return <DistributionTheory />;
          case 'payout_treasury_theory': return <PayoutTreasuryTheory />;
          case 'reports_roadmap_theory': return <ReportsRoadmapTheory />;
          case 'compare_choices_theory': return <CompareChoicesTheory onNavigate={onNavigate} />;
          case 'build_real_project_theory': return <BuildRealProjectTheory onNavigate={onNavigate} />;
          case 'final_exam': return <FinalExam academyState={state} />;
          default: return <OnboardingTheory />;
      }
  };

  return (
    <div className="h-screen w-screen bg-slate-50 font-sans flex overflow-hidden text-slate-900">
      
      {/* Sidebar */}
      <AcademySidebar 
        activeModule={activeModule} 
        onSelect={setActiveModule} 
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        onNavigate={onNavigate}
      />

      {/* Main Layout */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
          
          {/* Top Bar (Sticky, Full Width) */}
          <header className="h-16 border-b border-slate-200 bg-white flex items-center justify-between px-6 shrink-0 z-20">
             <div className="flex items-center gap-4">
                <button 
                    onClick={() => setIsSidebarOpen(true)}
                    className="lg:hidden text-slate-500 hover:text-slate-900 p-2 rounded-md hover:bg-slate-100"
                >
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
                </button>
                <div className="flex flex-col">
                    <h1 className="text-sm font-bold text-slate-900 uppercase tracking-widest font-display">
                        PropertyDEX – Tokenization Insights
                    </h1>
                    <span className="text-xs text-slate-500 font-medium capitalize">
                        {activeModule.replace(/_/g, ' ').replace('theory', '')}
                    </span>
                </div>
             </div>

             <div className="flex items-center gap-4">
                 <div className="hidden md:flex items-center gap-2">
                    <div className="w-32 h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500 transition-all duration-1000" style={{ width: `${state.meta.totalProgress}%` }}></div>
                    </div>
                    <span className="text-xs font-bold text-slate-400">{state.meta.totalProgress}%</span>
                 </div>
                 <Button variant="ghost" onClick={onBack} className="text-slate-500 hover:text-slate-900 text-xs font-bold uppercase">Exit</Button>
             </div>
          </header>

          {/* Viewport Area - No Padding Constraints */}
          <main className="flex-1 overflow-hidden relative bg-slate-50">
              {renderContent()}
          </main>
      </div>
    </div>
  );
};
