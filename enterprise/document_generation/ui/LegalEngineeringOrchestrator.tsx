
import React, { useState } from 'react';
import { LegalProjectData, INITIAL_LEGAL_PROJECT } from '../domain/legal_engineering.entity';
import { LegalIntakeTab } from './tabs/1_LegalIntakeTab';
import { LogicEngineTab } from './tabs/2_LogicEngineTab';
import { DraftGeneratorTab } from './tabs/3_DraftGeneratorTab';
import { AiAuditTab } from './tabs/4_AiAuditTab';
import { PreExportChecklistTab } from './tabs/5_PreExportChecklistTab';
import { FinalExportTab } from './tabs/6_FinalExportTab';

type Step = 'INTAKE' | 'LOGIC' | 'DRAFT' | 'AUDIT' | 'CHECKLIST' | 'EXPORT';

const STEPS: { id: Step; label: string; icon: string }[] = [
    { id: 'INTAKE', label: 'Intake', icon: '1' },
    { id: 'LOGIC', label: 'Logic Engine', icon: '2' },
    { id: 'DRAFT', label: 'Drafting', icon: '3' },
    { id: 'AUDIT', label: 'AI Audit', icon: '4' },
    { id: 'CHECKLIST', label: 'Checklist', icon: '5' },
    { id: 'EXPORT', label: 'Export', icon: '6' },
];

export const LegalEngineeringOrchestrator: React.FC = () => {
  const [activeStep, setActiveStep] = useState<Step>('INTAKE');
  const [projectData, setProjectData] = useState<LegalProjectData>(INITIAL_LEGAL_PROJECT);

  const updateData = (updates: Partial<LegalProjectData>) => {
      setProjectData(prev => ({ ...prev, ...updates }));
  };

  const renderStep = () => {
      switch (activeStep) {
          case 'INTAKE': return <LegalIntakeTab data={projectData} updateData={updateData} />;
          case 'LOGIC': return <LogicEngineTab data={projectData} updateData={updateData} />;
          case 'DRAFT': return <DraftGeneratorTab data={projectData} updateData={updateData} />;
          case 'AUDIT': return <AiAuditTab data={projectData} updateData={updateData} />;
          case 'CHECKLIST': return <PreExportChecklistTab data={projectData} updateData={updateData} />;
          case 'EXPORT': return <FinalExportTab />;
          default: return null;
      }
  };

  return (
    <div className="h-full flex flex-col">
        {/* Header Progress */}
        <div className="flex items-center justify-between mb-8 px-2 shrink-0">
            <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold shadow-lg">
                    ⚖️
                </div>
                <div>
                    <h2 className="text-xl font-bold text-white font-display">Legal Engineering</h2>
                    <p className="text-slate-400 text-xs">Automated Counsel v2.0</p>
                </div>
            </div>

            <div className="flex items-center gap-2 bg-slate-900 p-1.5 rounded-xl border border-slate-800">
                {STEPS.map((step) => (
                    <button
                        key={step.id}
                        onClick={() => setActiveStep(step.id)}
                        className={`
                            px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2
                            ${activeStep === step.id 
                                ? 'bg-slate-800 text-white shadow-sm ring-1 ring-slate-700' 
                                : 'text-slate-500 hover:text-slate-300'
                            }
                        `}
                    >
                        <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[9px] ${activeStep === step.id ? 'bg-indigo-500 text-white' : 'bg-slate-800 text-slate-600'}`}>
                            {step.icon}
                        </span>
                        <span className="hidden md:inline">{step.label}</span>
                    </button>
                ))}
            </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-hidden flex flex-col">
            <div className="flex-1 overflow-y-auto custom-scrollbar">
                <div className="max-w-7xl mx-auto pb-12">
                    {renderStep()}
                </div>
            </div>
        </div>
    </div>
  );
};
