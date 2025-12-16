
import React, { useState } from 'react';
import { DataRoomProject, INITIAL_DATA_ROOM } from '../../domain/data_room.entity';
import { DealOverviewTab } from './tabs/1_DealOverviewTab';
import { AssetIntelligenceTab } from './tabs/2_AssetIntelligenceTab';
import { FinancialStoryTab } from './tabs/3_FinancialStoryTab';
import { InvestmentThesisTab } from './tabs/4_InvestmentThesisTab';
import { RiskAuditTab } from './tabs/5_RiskAuditTab';
import { PackageBuilderTab } from './tabs/6_PackageBuilderTab';
import { ExportSyncTab } from './tabs/7_ExportSyncTab';

type Step = 'overview' | 'asset' | 'financial' | 'thesis' | 'audit' | 'package' | 'export';

const STEPS: { id: Step; label: string; icon: string }[] = [
    { id: 'overview', label: 'Overview', icon: '📋' },
    { id: 'asset', label: 'Intelligence', icon: '🏢' },
    { id: 'financial', label: 'Financials', icon: '💰' },
    { id: 'thesis', label: 'Thesis', icon: '🧠' },
    { id: 'audit', label: 'Risk Audit', icon: '🛡️' },
    { id: 'package', label: 'Package', icon: '📦' },
    { id: 'export', label: 'Launch', icon: '🚀' },
];

export const DataRoomOrchestrator: React.FC = () => {
  const [activeStep, setActiveStep] = useState<Step>('overview');
  const [project, setProject] = useState<DataRoomProject>(INITIAL_DATA_ROOM);

  const updateProject = (field: keyof DataRoomProject, val: any) => {
      setProject(prev => ({ ...prev, [field]: val }));
  };

  const renderStep = () => {
      switch (activeStep) {
          case 'overview': return <DealOverviewTab data={project} update={updateProject} />;
          case 'asset': return <AssetIntelligenceTab data={project} update={updateProject} />;
          case 'financial': return <FinancialStoryTab data={project} update={updateProject} />;
          case 'thesis': return <InvestmentThesisTab data={project} update={updateProject} />;
          case 'audit': return <RiskAuditTab data={project} update={updateProject} />;
          case 'package': return <PackageBuilderTab data={project} update={updateProject} />;
          case 'export': return <ExportSyncTab data={project} update={updateProject} />;
          default: return null;
      }
  };

  return (
    <div className="h-full flex flex-col bg-slate-950">
        {/* Header */}
        <div className="p-6 border-b border-slate-800 bg-slate-900/50 flex justify-between items-center shrink-0">
            <div>
                <h2 className="text-xl font-bold text-white font-display">Data Room Engine</h2>
                <p className="text-xs text-slate-400">Deal Packaging v3.0</p>
            </div>
            <div className="flex gap-2 overflow-x-auto max-w-2xl no-scrollbar">
                {STEPS.map(s => (
                    <button
                        key={s.id}
                        onClick={() => setActiveStep(s.id)}
                        className={`
                            px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-2 whitespace-nowrap transition-all
                            ${activeStep === s.id 
                                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' 
                                : 'bg-slate-800 text-slate-500 hover:bg-slate-700 hover:text-slate-300'
                            }
                        `}
                    >
                        <span>{s.icon}</span>
                        {s.label}
                    </button>
                ))}
            </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 md:p-8">
            <div className="max-w-7xl mx-auto">
                {renderStep()}
            </div>
        </div>
    </div>
  );
};
