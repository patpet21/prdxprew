
import React, { useState, useEffect } from 'react';
import { TokenizationState, StepProps } from '../types';
import { Button } from '../components/ui/Button';
import { 
  ProjectInitiationStep,
  JurisdictionStep, 
  AssetStep, 
  ComplianceStep, 
  TokenomicsStep, 
  DistributionStep, 
  SummaryStep,
  PreDeploymentStep,
  FinalDeployStep,
  BusinessPlanStep
} from '../steps';

// Configuration defining both steps and their sub-tabs
const WIZARD_CONFIG = [
  { 
      id: 'initiation',
      title: "Initiation", 
      component: ProjectInitiationStep, 
      desc: "Vision & Goals",
      tabs: [
          { id: 'TEMPLATES', label: 'Templates' },
          { id: 'AI_ASSIST', label: 'AI Assistant' },
          { id: 'MANUAL', label: 'Manual Form' },
          { id: 'PDF', label: 'PDF Report' }
      ]
  },
  { 
      id: 'jurisdiction',
      title: "Jurisdiction", 
      component: JurisdictionStep, 
      desc: "Legal Entity & Region",
      tabs: [
          { id: 'COUNTRY', label: '1. Country' },
          { id: 'REGION', label: '2. Region' },
          { id: 'STRUCTURE', label: '3. Structure' },
          { id: 'EXPORT', label: '4. Summary' }
      ]
  },
  { 
      id: 'asset',
      title: "Asset Details", 
      component: AssetStep, 
      desc: "Valuation & Specs",
      tabs: [
          { id: 'GENERAL', label: 'General & Timeline' },
          { id: 'SPECS', label: 'Physical Specs' },
          { id: 'TEAM', label: 'Partners & Team' },
          { id: 'DESC', label: 'AI Description' },
          { id: 'MEDIA', label: 'Media' },
          { id: 'EXPORT', label: 'Summary' }
      ]
  },
  { 
      id: 'compliance',
      title: "Compliance", 
      component: ComplianceStep, 
      desc: "KYC/AML Rules",
      tabs: [
          { id: 'CONFIG', label: 'Framework' },
          { id: 'RISK', label: 'Risk Analysis' },
          { id: 'STRATEGY', label: 'Strategy Notes' },
          { id: 'EDUCATION', label: 'Education' },
          { id: 'AI_SUMMARY', label: 'AI Verdict' },
          { id: 'GLOSSARY', label: 'Knowledge Base' },
          { id: 'EXPORT', label: 'Finish' }
      ]
  },
  { 
      id: 'tokenomics',
      title: "Tokenomics", 
      component: TokenomicsStep, 
      desc: "Supply & Price",
      tabs: [
          { id: 'CONFIG', label: 'Configuration' },
          { id: 'ANALYSIS', label: 'Analysis' },
          { id: 'STRATEGY', label: 'Strategy' },
          { id: 'EXPORT', label: 'Summary' }
      ]
  },
  { 
      id: 'distribution',
      title: "Distribution", 
      component: DistributionStep, 
      desc: "Investor Targeting",
      tabs: [
          { id: 'INVESTOR', label: 'Investor Profile' },
          { id: 'OFFERING', label: 'Offering Style' },
          { id: 'MARKETING', label: 'Marketing Funnel' },
          { id: 'RISK', label: 'Risk Check' },
          { id: 'EXPORT', label: 'Summary' }
      ]
  },
  { 
      id: 'summary',
      title: "Summary", 
      component: SummaryStep, 
      desc: "Review & Report",
      tabs: [
          { id: 'DNA', label: 'Project DNA' },
          { id: 'ANALYSIS', label: 'Strategic Analysis' },
          { id: 'MATCHING', label: 'Provider Match' },
          { id: 'FLOW', label: 'Submission Flow' },
          { id: 'PRO_REVIEW', label: 'AI Project Review' },
          { id: 'EXPORT', label: 'Export & Share' },
          { id: 'EXECUTION', label: 'Execution Path' },
          { id: 'ENTERPRISE', label: 'Enterprise Pathway' },
          { id: 'FINAL', label: 'Next Steps' }
      ]
  },
  {
      id: 'pre_deployment',
      title: "Pre-Deployment",
      component: PreDeploymentStep,
      desc: "Final Output",
      tabs: [
          { id: 'DECK', label: 'Project Deck' },
          { id: 'ROADMAP', label: 'Regulatory Roadmap' },
          { id: 'FINANCIALS', label: 'Financial Snapshot' },
          { id: 'SCORE', label: 'Risk & Feasibility' },
          { id: 'PROVIDERS', label: 'Provider Match' },
          { id: 'DOCS', label: 'Generated Documents' },
          { id: 'NEXT_STEPS', label: 'What Happens Next' }
      ]
  },
  {
      id: 'business_plan',
      title: "Business Plan",
      component: BusinessPlanStep,
      desc: "Strategy & Pitch",
      tabs: [
          { id: 'PREVIEW', label: 'Plan Preview' },
          { id: 'AI_GENERATOR', label: 'AI Writer' }
      ]
  },
  {
      id: 'final_deploy',
      title: "Final Deploy",
      component: FinalDeployStep,
      desc: "Launch Execution",
      tabs: [
          { id: 'LEGAL', label: 'Legal & Corporate' },
          { id: 'CONTRACT', label: 'Smart Contract' },
          { id: 'CUSTODY', label: 'Custody Integration' },
          { id: 'KYC', label: 'KYC Onboarding' },
          { id: 'LISTING', label: 'Marketplace Listing' },
          { id: 'GOLIVE', label: 'GO-LIVE' }
      ]
  }
];

// Extend StepProps to include onNext from parent
interface ExtendedStepProps extends StepProps {
    onNext?: () => void;
    onDeploy?: (data: TokenizationState) => void;
}

// --- SUB-COMPONENTS ---

import { QuickTemplates, ProjectTemplate } from '../components/initiation/QuickTemplates';
import { AiConceptAssistant } from '../components/initiation/AiConceptAssistant';
import { InitiationService, ConceptRefinement } from '../services/initiationService';
import { downloadPDF } from '../utils/pdfGenerator'; 
// Input and Select were unused in sub-components within this file but might be needed if inline editing is added.
// Kept imports clean for now.

const TemplateDetailModal = ({ 
    template, 
    onClose, 
    onConfirm 
}: { 
    template: ProjectTemplate | null; 
    onClose: () => void; 
    onConfirm: () => void; 
}) => {
    if (!template) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fadeIn">
            <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden animate-slideUp border border-sim-border">
                <div className="bg-slate-50 p-6 flex justify-between items-start border-b border-sim-border">
                    <div className="flex items-center gap-4">
                        <div className="text-4xl">{template.icon}</div>
                        <div>
                            <h3 className="text-xl font-bold font-display text-slate-900">{template.label}</h3>
                            <p className="text-slate-500 text-sm">{template.assetClass}</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors font-bold text-xl">✕</button>
                </div>
                
                <div className="p-6 space-y-6">
                    <div>
                        <h4 className="text-xs font-bold text-sim-blue uppercase tracking-widest mb-2">Description</h4>
                        <p className="text-slate-700 text-sm leading-relaxed">{template.defaultDesc}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-3 bg-slate-50 rounded-lg border border-sim-border">
                            <span className="block text-[10px] font-bold text-slate-400 uppercase">Typical Value</span>
                            <span className="block text-slate-900 font-bold">{template.typicalValue}</span>
                        </div>
                        <div className="p-3 bg-slate-50 rounded-lg border border-sim-border">
                            <span className="block text-[10px] font-bold text-slate-400 uppercase">Est. Yield</span>
                            <span className="block text-sim-green font-bold">{template.yieldEstimate}</span>
                        </div>
                        <div className="p-3 bg-slate-50 rounded-lg border border-sim-border">
                            <span className="block text-[10px] font-bold text-slate-400 uppercase">Token Model</span>
                            <span className="block text-sim-blue font-bold">{template.tokenModel}</span>
                        </div>
                        <div className="p-3 bg-slate-50 rounded-lg border border-sim-border">
                            <span className="block text-[10px] font-bold text-slate-400 uppercase">Leverage</span>
                            <span className="block text-slate-900 font-bold">{template.leverage}</span>
                        </div>
                    </div>
                </div>

                <div className="p-4 border-t border-sim-border bg-slate-50 flex justify-end gap-3">
                    <Button variant="secondary" onClick={onClose} className="border border-slate-300 bg-white text-slate-700 hover:bg-slate-100">
                        Close
                    </Button>
                    <Button variant="sim" onClick={onConfirm} className="shadow-lg">
                        Select Template
                    </Button>
                </div>
            </div>
        </div>
    );
};

const PdfExportView = ({ onNextStep }: { onNextStep?: () => void }) => {
    const [reportData, setReportData] = useState<any>(null);

    useEffect(() => {
        const saved = localStorage.getItem('pdx_simulator_state');
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                setReportData(parsed);
            } catch (e) {
                console.error("Failed to read storage for PDF", e);
            }
        }
    }, []);

    const handleDownload = () => {
        if (!reportData) return;

        const { projectInfo, property } = reportData;
        
        const dataForPdf = {
            ProjectIdentity: {
                Name: projectInfo.projectName,
                Goal: projectInfo.projectGoal,
                AssetClass: projectInfo.assetClass,
                TargetRaise: `$${projectInfo.targetRaiseAmount?.toLocaleString()}`
            },
            AssetDetails: {
                Type: property.property_type,
                Status: property.status,
                Description: projectInfo.description
            },
            ContactInfo: {
                Sponsor: projectInfo.sponsorEntityName,
                ContactPerson: projectInfo.primaryContactName,
                Email: projectInfo.primaryContactEmail
            }
        };

        downloadPDF(`${(projectInfo.projectName || 'Project').replace(/\s+/g, '_')}_Initiation_Report`, dataForPdf);
    };

    if (!reportData) return <div className="p-8 text-center text-slate-500">No saved data found. Please complete the form first.</div>;

    const { projectInfo } = reportData;

    return (
        <div className="animate-fadeIn p-8 bg-white border border-sim-border rounded-2xl shadow-sm max-w-3xl mx-auto mt-8 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-sim-progress"></div>
            
            <div className="flex items-center gap-4 mb-8 border-b border-sim-border pb-6">
                <div className="w-16 h-16 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center text-3xl shadow-sm border border-red-100">
                    📄
                </div>
                <div>
                    <h3 className="text-2xl font-bold text-sim-orange font-display">Step 1 Completed</h3>
                    <p className="text-slate-600 text-sm">Download your report or proceed to jurisdiction selection.</p>
                </div>
            </div>

            <div className="bg-slate-50 rounded-xl p-6 mb-8 border border-sim-border">
                 <h4 className="text-xs font-bold text-sim-blue uppercase tracking-widest mb-4">Project Snapshot</h4>
                 <div className="grid grid-cols-2 gap-6">
                    <div>
                        <span className="text-xs text-slate-500 block mb-1">Project Name</span>
                        <span className="text-sm font-bold text-slate-900 block">{projectInfo.projectName || '-'}</span>
                    </div>
                    <div>
                        <span className="text-xs text-slate-500 block mb-1">Goal</span>
                        <span className="text-sm font-bold text-slate-900 block">{projectInfo.projectGoal || '-'}</span>
                    </div>
                    <div>
                        <span className="text-xs text-slate-500 block mb-1">Target Raise</span>
                        <span className="text-sm font-bold text-sim-green block">${projectInfo.targetRaiseAmount?.toLocaleString() || '0'}</span>
                    </div>
                    <div>
                        <span className="text-xs text-slate-500 block mb-1">Sponsor</span>
                        <span className="text-sm font-bold text-slate-900 block">{projectInfo.sponsorEntityName || 'N/A'}</span>
                    </div>
                 </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
                <Button onClick={handleDownload} variant="secondary" className="flex-1 bg-white border-slate-300 text-slate-700 hover:bg-slate-50">
                    📥 Download Report (PDF)
                </Button>
                {onNextStep && (
                    <Button variant="sim" onClick={onNextStep} className="flex-1 shadow-lg">
                        💾 Save & Continue to Jurisdiction →
                    </Button>
                )}
            </div>
        </div>
    );
};


// --- MAIN COMPONENT ---

interface WizardPageProps {
  currentStep: number;
  data: TokenizationState;
  isStepValid: boolean;
  onNext: () => void;
  onBack: () => void;
  updateData: (section: keyof TokenizationState, payload: any) => void;
  setIsStepValid: (valid: boolean) => void;
  onCancel: () => void;
  onDeploy: (data: TokenizationState) => void;
  onReset?: () => void;
  isLoggedIn?: boolean;
  onLogin?: () => void;
}

export const WizardPage: React.FC<WizardPageProps> = ({ 
  currentStep, 
  data, 
  isStepValid, 
  onNext, 
  onBack, 
  updateData, 
  setIsStepValid,
  onCancel,
  onDeploy,
  onReset,
  isLoggedIn,
  onLogin
}) => {
  const [activeSubTab, setActiveSubTab] = useState<string>('');
  const [internalStep, setInternalStep] = useState(currentStep); // Control step internally for jumps
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Sync internal step with prop if it changes externally (e.g. Next/Back buttons)
  useEffect(() => {
    setInternalStep(currentStep);
  }, [currentStep]);

  // When changing main steps, update the active sub-tab if needed
  useEffect(() => {
    const config = WIZARD_CONFIG[internalStep];
    // Only reset if the current active subtab doesn't belong to the new step
    const subTabExists = config.tabs.find(t => t.id === activeSubTab);
    if (!subTabExists && config.tabs.length > 0) {
        setActiveSubTab(config.tabs[0].id);
    }
  }, [internalStep]);

  // Fix: Explicitly cast the component to any to allow dynamic prop passing, avoiding TS errors on optional methods like onDeploy
  const CurrentStepComponent = WIZARD_CONFIG[internalStep].component as any;
  const progressPercent = ((internalStep + 1) / WIZARD_CONFIG.length) * 100;

  // Jump Logic
  const handleJumpToStep = (stepIdx: number) => {
    setInternalStep(stepIdx);
  };

  const handleJumpToSubTab = (stepIdx: number, tabId: string) => {
    setInternalStep(stepIdx);
    setActiveSubTab(tabId);
    if (window.innerWidth < 1024) setIsSidebarOpen(false);
  };

  const handleResetClick = () => {
    if (window.confirm("Vuoi davvero cancellare tutti i dati della simulazione? Questa azione non può essere annullata.")) {
      if (onReset) onReset();
    }
  };

  // Completion Logic
  const checkStepCompletion = (stepId: string): boolean => {
      switch (stepId) {
          case 'initiation':
              return Boolean(data.projectInfo.projectName && data.projectInfo.description && data.projectInfo.projectGoal);
          case 'jurisdiction':
              return Boolean(data.jurisdiction.country && data.jurisdiction.spvType);
          case 'asset':
              return Boolean(data.property.title && data.property.total_value > 0);
          case 'compliance':
              return Boolean(data.compliance.regFramework && data.compliance.regFramework !== 'None');
          case 'tokenomics':
              return Boolean(data.property.token_price > 0 && data.property.total_tokens > 0);
          case 'distribution':
              return Boolean(data.distribution.targetInvestorType);
          case 'summary':
              return true; // Summary is viewed
          case 'pre_deployment':
              return false; // Report view
          case 'business_plan':
              return false; // Report view
          case 'final_deploy':
              return Boolean(data.deployment?.goLive?.isLive);
          default:
              return false;
      }
  };

  // Wrapper for onNext to ensure we sync state
  const handleNextStep = () => {
    if (isStepValid || internalStep >= WIZARD_CONFIG.length - 2) {
      if (internalStep < WIZARD_CONFIG.length - 1) {
          setInternalStep(prev => prev + 1);
      } else {
        onNext();
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 flex flex-col lg:flex-row font-sans overflow-hidden">
      
      {/* MOBILE HEADER */}
      <header className="lg:hidden bg-white border-b border-sim-border flex flex-col shrink-0 sticky top-0 z-30 shadow-sm">
         <div className="h-14 flex items-center justify-between px-4">
            <div className="flex items-center gap-3">
              <button onClick={() => setIsSidebarOpen(true)} className="p-2 -ml-2 text-slate-500 hover:text-slate-900 rounded-lg">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
              </button>
              <div className="w-8 h-8 bg-sim-step rounded-lg flex items-center justify-center text-white font-bold text-sm">P</div>
              <div>
                  <h1 className="font-bold text-slate-900 text-sm leading-tight">{WIZARD_CONFIG[internalStep].title}</h1>
                  <p className="text-xs text-slate-500 leading-tight">Step {internalStep + 1} of {WIZARD_CONFIG.length}</p>
              </div>
            </div>
            <button onClick={onCancel} className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
         </div>
         <div className="h-1 bg-slate-100 w-full">
            <div 
              className="h-full bg-sim-progress transition-all duration-500 ease-out" 
              style={{ width: `${progressPercent}%` }}
            ></div>
         </div>
      </header>

      {/* MOBILE SIDEBAR BACKDROP */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm lg:hidden" onClick={() => setIsSidebarOpen(false)}></div>
      )}

      {/* SIDEBAR (Desktop & Mobile Slide-over) */}
      <aside className={`
          fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-sim-border flex flex-col shadow-2xl lg:shadow-xl lg:shadow-slate-200/50 lg:static transition-transform duration-300 transform
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="p-8 pb-4 border-b border-slate-100 shrink-0 hidden lg:block">
           <div className="flex items-center gap-2.5 mb-1 cursor-pointer" onClick={onCancel}>
             <div className="w-9 h-9 bg-sim-step rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-blue-500/20">P</div>
             <span className="font-bold font-display text-slate-900 text-xl tracking-tight">PropertyDEX</span>
           </div>
           <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold mt-4 pl-1">Simulator Workflow</p>
        </div>
        
        {/* Mobile Sidebar Header */}
        <div className="p-4 border-b border-slate-100 flex justify-between items-center lg:hidden">
            <span className="font-bold text-slate-900">Navigation</span>
            <button onClick={() => setIsSidebarOpen(false)} className="text-slate-500">✕</button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-2 custom-scrollbar">
            {WIZARD_CONFIG.map((step, idx) => {
                const isActive = idx === internalStep;
                const isComplete = checkStepCompletion(step.id);
                
                return (
                <div key={idx} className="flex flex-col">
                    {/* Main Step Button */}
                    <button 
                        onClick={() => handleJumpToStep(idx)}
                        className={`
                            relative pl-4 py-3 rounded-xl transition-all duration-300 group flex items-center gap-3 w-full text-left
                            ${isActive ? 'bg-blue-50/50' : 'hover:bg-slate-50'}
                        `}
                    >
                        <div className={`
                            w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all duration-300 shrink-0 relative z-10
                            ${isActive 
                                ? 'bg-sim-step border-sim-step text-white shadow-md scale-110' 
                                : isComplete 
                                    ? 'bg-sim-success border-sim-success text-white' 
                                    : 'bg-white border-slate-200 text-slate-300'
                            }
                        `}>
                            {isComplete ? '✓' : idx + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-center">
                                <h4 className={`text-sm font-bold truncate transition-colors ${isActive ? 'text-sim-step' : isComplete ? 'text-slate-800' : 'text-slate-500'}`}>
                                    {step.title}
                                </h4>
                            </div>
                            <p className="text-[10px] font-medium text-slate-400 truncate">{step.desc}</p>
                        </div>
                        {/* Dropdown Indicator */}
                        {step.tabs.length > 0 && (
                            <div className={`mr-2 text-slate-400 transition-transform duration-300 ${isActive ? 'rotate-180' : ''}`}>
                                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                            </div>
                        )}
                    </button>

                    {/* SUB-TABS DROPDOWN (Accordion) */}
                    <div className={`
                        overflow-hidden transition-all duration-300 ease-in-out
                        ${isActive ? 'max-h-[500px] opacity-100 mt-1' : 'max-h-0 opacity-0'}
                    `}>
                        <div className="ml-5 pl-4 border-l-2 border-slate-100 space-y-1 py-1">
                            {step.tabs.map(tab => (
                                <button
                                    key={tab.id}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleJumpToSubTab(idx, tab.id);
                                    }}
                                    className={`
                                        w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition-colors flex items-center gap-2
                                        ${activeSubTab === tab.id && isActive
                                            ? 'text-sim-step bg-blue-50 font-bold' 
                                            : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
                                        }
                                    `}
                                >
                                    <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${activeSubTab === tab.id && isActive ? 'bg-sim-step' : 'bg-slate-300'}`}></span>
                                    <span className="truncate">{tab.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
                );
            })}
        </div>
        
        <div className="p-6 border-t border-slate-100 bg-slate-50/50 shrink-0 hidden lg:block">
           <button onClick={onCancel} className="w-full text-slate-500 text-xs font-bold uppercase tracking-wider hover:text-red-600 flex items-center justify-center gap-2 py-2 rounded-lg hover:bg-red-50 transition-colors">
             <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
             Exit Simulation
           </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col h-full lg:h-screen overflow-hidden relative">
        {/* CONTENT SCROLLABLE */}
        <div className="flex-1 overflow-y-auto bg-white w-full scroll-smooth">
           <div className="max-w-7xl mx-auto p-6 md:p-8 lg:p-10 pb-32 lg:pb-24">
              <CurrentStepComponent 
                  data={data} 
                  updateData={updateData} 
                  onValidationChange={setIsStepValid}
                  // Pass down tab control
                  activeTabId={activeSubTab}
                  onTabChange={setActiveSubTab}
                  // Pass down navigation control to child steps
                  onNext={handleNextStep}
                  // Pass down deploy function if it's the final step
                  onDeploy={internalStep === WIZARD_CONFIG.length - 1 ? () => onDeploy(data) : undefined}
                  // Auth props
                  isLoggedIn={isLoggedIn}
                  onLogin={onLogin}
              />
           </div>
        </div>

        {/* STICKY FOOTER */}
        <footer className="fixed lg:absolute bottom-0 left-0 w-full bg-white/95 backdrop-blur-md border-t border-sim-border px-4 md:px-12 py-4 flex items-center justify-between flex-shrink-0 z-40 lg:z-10 shadow-[0_-4px_20px_-5px_rgba(0,0,0,0.05)]">
           <div className="flex items-center gap-2">
               <Button variant="ghost" onClick={onBack} disabled={internalStep === 0} className="text-slate-500 hover:text-slate-900 font-medium text-sm">
                 ← Back
               </Button>
               {internalStep < 2 && onReset && (
                 <button 
                    onClick={handleResetClick}
                    className="text-red-500 hover:text-red-700 text-xs font-bold uppercase tracking-wider ml-4 hover:bg-red-50 px-3 py-2 rounded-lg transition-colors flex items-center gap-2"
                 >
                    <span>🗑</span> Reset Simulation
                 </button>
               )}
           </div>
           
           <div className="flex items-center gap-4">
              {internalStep < WIZARD_CONFIG.length - 2 && (
                <div className={`hidden md:flex items-center gap-2 text-xs font-medium px-3 py-1.5 rounded-full ${isStepValid ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-amber-50 text-amber-700 border border-amber-100'}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${isStepValid ? 'bg-green-500' : 'bg-amber-500'}`}></span>
                    {isStepValid ? 'Ready to proceed' : 'Complete required fields'}
                </div>
              )}
              
              {internalStep < WIZARD_CONFIG.length - 1 ? (
                   <Button 
                    variant="sim"
                    onClick={handleNextStep} 
                    className={`
                        px-8 md:px-10 h-12 md:h-12 rounded-xl whitespace-nowrap text-sm md:text-base font-bold transition-all transform active:scale-95
                        ${(!isStepValid && internalStep < WIZARD_CONFIG.length - 2) ? 'opacity-90 grayscale-[0.2]' : 'hover:scale-105'}
                    `}
                  >
                    Next Step →
                  </Button>
              ) : (
                  <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">Simulation End</div>
              )}
           </div>
        </footer>
      </main>
    </div>
  );
};
