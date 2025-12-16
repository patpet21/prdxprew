
import React, { useState } from 'react';
import { AssetIdentityBuilder } from '../tools/onboarding/AssetIdentityBuilder';
import { TokenizabilityScorer } from '../tools/onboarding/TokenizabilityScorer';
import { EducationalCards } from '../tools/onboarding/EducationalCards';
import { RevenueSimulator } from '../tools/onboarding/RevenueSimulator';
import { LegalNavigator } from '../tools/onboarding/LegalNavigator';
import { AssetBlueprintExport } from '../tools/onboarding/AssetBlueprintExport';

type ModuleTab = 'IDENTITY' | 'SCORE' | 'EDU' | 'REVENUE' | 'LEGAL' | 'EXPORT';

interface Props {
  moduleState?: any;
  onUpdateState?: (data: any) => void;
}

export const OnboardingTheory: React.FC<Props> = ({ moduleState, onUpdateState }) => {
  const [activeTab, setActiveTab] = useState<ModuleTab>('IDENTITY');
  
  // Shared State for the Blueprint
  const [blueprint, setBlueprint] = useState({
      identity: { assetName: '', assetType: 'Real Estate', status: 'Existing', objective: 'Liquidity', location: '', capital: '' },
      score: null,
      revenue: { noi: 0, roi: 0, yield: 0 },
      legal: { structure: '', compliance: '' }
  });

  const updateBlueprint = (section: string, data: any) => {
      setBlueprint(prev => ({ ...prev, [section]: { ...prev[section as keyof typeof prev], ...data } }));
  };

  const tabs: { id: ModuleTab; label: string }[] = [
      { id: 'IDENTITY', label: '1. Identity' },
      { id: 'SCORE', label: '2. Scoring' },
      { id: 'EDU', label: '3. Concepts' },
      { id: 'REVENUE', label: '4. Revenue' },
      { id: 'LEGAL', label: '5. Legal' },
      { id: 'EXPORT', label: '6. Blueprint' },
  ];

  const handleNext = () => {
      const idx = tabs.findIndex(t => t.id === activeTab);
      if (idx < tabs.length - 1) setActiveTab(tabs[idx + 1].id as ModuleTab);
  };

  const renderContent = () => {
      switch(activeTab) {
          case 'IDENTITY': return <AssetIdentityBuilder data={blueprint.identity} onChange={(d) => updateBlueprint('identity', d)} onNext={handleNext} />;
          case 'SCORE': return <TokenizabilityScorer data={blueprint.identity} onScore={(s) => updateBlueprint('score', s)} onNext={handleNext} />;
          case 'EDU': return <EducationalCards onNext={handleNext} />;
          case 'REVENUE': return <RevenueSimulator data={blueprint.revenue} onChange={(d) => updateBlueprint('revenue', d)} onNext={handleNext} />;
          case 'LEGAL': return <LegalNavigator data={blueprint.identity} onChange={(d) => updateBlueprint('legal', d)} onNext={handleNext} />;
          case 'EXPORT': return <AssetBlueprintExport data={blueprint} />;
          default: return null;
      }
  };

  return (
    <div className="flex flex-col h-full w-full bg-slate-50 animate-fadeIn">
        
        {/* Navigation Bar */}
        <div className="bg-white border-b border-slate-200 px-6 py-0 shrink-0 flex overflow-x-auto no-scrollbar">
            {tabs.map(tab => (
                <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as ModuleTab)}
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

        {/* Content Area (Free Field) */}
        <div className="flex-1 w-full max-w-[1920px] mx-auto p-8 overflow-y-auto">
            <div className="max-w-7xl mx-auto h-full flex flex-col">
                 <div className="mb-6">
                    <h2 className="text-3xl font-bold font-display text-slate-900">Onboarding & Asset DNA</h2>
                    <p className="text-slate-500">Define the core characteristics of your asset to initialize the simulation engine.</p>
                 </div>
                 <div className="flex-1">
                    {renderContent()}
                 </div>
            </div>
        </div>

    </div>
  );
};
