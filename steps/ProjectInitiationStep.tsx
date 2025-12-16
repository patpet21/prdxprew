
import React, { useEffect, useState } from 'react';
import { StepProps, TokenizationCategory } from '../types';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Button } from '../components/ui/Button';
import { QuickTemplates, ProjectTemplate } from '../components/initiation/QuickTemplates';
import { AiConceptAssistant } from '../components/initiation/AiConceptAssistant';
import { InitiationService, ConceptRefinement } from '../services/initiationService';
import { downloadPDF } from '../utils/pdfGenerator'; 

// Extend StepProps to include onNext from parent
interface ExtendedStepProps extends StepProps {
    onNext?: () => void;
}

// --- SUB-COMPONENTS ---

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

export const ProjectInitiationStep: React.FC<ExtendedStepProps> = ({ data, updateData, onValidationChange, activeTabId, onTabChange, onNext }) => {
  const { projectInfo, property } = data;
  const [activeTab, setActiveTab] = useState<'TEMPLATES' | 'AI_ASSIST' | 'MANUAL' | 'PDF'>('TEMPLATES');
  
  // Modal State
  const [inspectedTemplate, setInspectedTemplate] = useState<ProjectTemplate | null>(null);

  // Suggestions
  const [raiseSuggestion, setRaiseSuggestion] = useState<string | null>(null);

  const TABS_ORDER = ['TEMPLATES', 'AI_ASSIST', 'MANUAL', 'PDF'];

  // Sync with Sidebar
  useEffect(() => {
      if (activeTabId) {
          const mappedTab = activeTabId as any;
          setActiveTab(mappedTab);
      }
  }, [activeTabId]);

  const handleTabClick = (tab: 'TEMPLATES' | 'AI_ASSIST' | 'MANUAL' | 'PDF') => {
      setActiveTab(tab);
      if (onTabChange) onTabChange(tab);
      window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNextInternalTab = () => {
    const currentIndex = TABS_ORDER.indexOf(activeTab);
    if (currentIndex < TABS_ORDER.length - 1) {
        handleTabClick(TABS_ORDER[currentIndex + 1] as any);
    }
  };

  // Validation Logic
  useEffect(() => {
    const isValid = Boolean(
      projectInfo.projectName && 
      projectInfo.projectGoal && 
      projectInfo.description && 
      projectInfo.description.length > 20
    );
    onValidationChange(isValid);
  }, [projectInfo, onValidationChange]);

  // --- Handlers ---

  const handleChange = (field: string, val: any) => {
    updateData('projectInfo', { [field]: val });
  };

  const handleAssetClassChange = (val: TokenizationCategory) => {
    updateData('projectInfo', { assetClass: val });
    updateData('property', { category: val });
    InitiationService.suggestRaise(val).then((res: any) => {
       if (res.default > 0) setRaiseSuggestion(`Typical range for ${val}: $${(Number(res.min)/1000000).toFixed(1)}M - $${(Number(res.max)/1000000).toFixed(1)}M`);
    });
  };

  const handleAiRefinement = (result: ConceptRefinement) => {
    updateData('projectInfo', {
        projectName: result.suggestedTitle,
        description: result.professionalDescription,
        assetClass: result.assetClass as any,
        projectGoal: result.primaryGoal as any
    });
    updateData('property', { category: result.assetClass as any });
    // AI moves to Manual for review
    handleTabClick('MANUAL');
  };

  // Template Logic
  const handleInspectTemplate = (tpl: ProjectTemplate) => {
      setInspectedTemplate(tpl);
  };

  const handleConfirmTemplate = () => {
      if(inspectedTemplate) {
          updateData('projectInfo', { 
            assetClass: inspectedTemplate.assetClass as any,
            description: inspectedTemplate.defaultDesc,
            targetRaiseAmount: inspectedTemplate.avgRaise,
            projectName: `New ${inspectedTemplate.label} Project`
        });
        updateData('property', { category: inspectedTemplate.assetClass as any });
        
        setInspectedTemplate(null);
        // Template moves to Manual for review
        handleTabClick('MANUAL');
      }
  };
  
  // Improvement Logic
  const [isImproving, setIsImproving] = useState(false);

  // Complexity Visualizer
  const getComplexityScore = (): { score: 'Low' | 'Medium' | 'High'; color: string; bg: string } => {
    const cat = projectInfo.assetClass || 'Real Estate';
    const amount = projectInfo.targetRaiseAmount || 0;
    
    if (cat === 'Funds' || cat === 'Business') return { score: 'High', color: 'text-red-600', bg: 'bg-red-50 border-red-100' };
    if (amount > 5000000) return { score: 'High', color: 'text-red-600', bg: 'bg-red-50 border-red-100' };
    if (amount > 1000000 || cat === 'Debt') return { score: 'Medium', color: 'text-amber-600', bg: 'bg-amber-50 border-amber-100' };
    
    return { score: 'Low', color: 'text-emerald-600', bg: 'bg-emerald-50 border-emerald-100' };
  };

  const complexity = getComplexityScore();
  const currentAssetClass = projectInfo.assetClass || property.category || 'Real Estate';

  return (
    <div className="space-y-8 animate-fadeIn pb-12">
      
      {/* Template Modal */}
      <TemplateDetailModal 
          template={inspectedTemplate} 
          onClose={() => setInspectedTemplate(null)} 
          onConfirm={handleConfirmTemplate} 
      />

      {/* 1. Header Section */}
      <div className="text-center max-w-3xl mx-auto space-y-2">
        <h2 className="text-3xl font-bold font-display text-sim-orange">Project Initiation</h2>
        <p className="text-slate-600 text-lg">
           PropertyDEX is an early-stage tokenization framework, supported by structured insights that explain the logic behind real-world asset tokenization.
        </p>
      </div>

      {/* 2. Navigation Tabs */}
      <div className="flex justify-center gap-2 flex-wrap bg-slate-100 p-1.5 rounded-xl w-fit mx-auto border border-sim-border">
          <button 
             onClick={() => handleTabClick('TEMPLATES')}
             className={`px-5 py-2.5 rounded-lg text-sm font-bold transition-all ${activeTab === 'TEMPLATES' ? 'bg-white text-sim-blue shadow-sm border border-slate-200' : 'text-slate-500 hover:text-slate-700'}`}
           >
             1. Templates
          </button>
          <button 
             onClick={() => handleTabClick('AI_ASSIST')}
             className={`px-5 py-2.5 rounded-lg text-sm font-bold transition-all ${activeTab === 'AI_ASSIST' ? 'bg-white text-sim-blue shadow-sm border border-slate-200' : 'text-slate-500 hover:text-slate-700'}`}
           >
             2. AI Assistant
          </button>
          <button 
             onClick={() => handleTabClick('MANUAL')}
             className={`px-5 py-2.5 rounded-lg text-sm font-bold transition-all ${activeTab === 'MANUAL' ? 'bg-white text-sim-blue shadow-sm border border-slate-200' : 'text-slate-500 hover:text-slate-700'}`}
           >
             3. Manual Form
          </button>
          <button 
             onClick={() => handleTabClick('PDF')}
             className={`px-5 py-2.5 rounded-lg text-sm font-bold transition-all ${activeTab === 'PDF' ? 'bg-white text-sim-blue shadow-sm border border-slate-200' : 'text-slate-500 hover:text-slate-700'}`}
           >
             4. Export
          </button>
      </div>

      {/* 3. DYNAMIC CONTENT AREA */}
      <div className="min-h-[300px] transition-all duration-500">
          
          {/* A. TEMPLATES */}
          {activeTab === 'TEMPLATES' && (
              <div className="animate-slideUp space-y-8">
                  <div className="bg-white border border-sim-border rounded-2xl p-8 shadow-sm">
                      <div className="flex items-center gap-3 mb-6">
                          <span className="text-2xl">⚡</span>
                          <h3 className="text-xl font-bold text-sim-orange">Quick Start Templates</h3>
                      </div>
                      <QuickTemplates onSelect={handleInspectTemplate} selectedId={inspectedTemplate?.id} />
                      
                      <div className="mt-8 flex justify-end">
                        <Button variant="sim" onClick={handleNextInternalTab}>
                            Skip & Go to AI Assistant →
                        </Button>
                      </div>
                  </div>
              </div>
          )}

          {/* B. AI ASSISTANT */}
          {activeTab === 'AI_ASSIST' && (
              <div className="animate-slideUp max-w-4xl mx-auto space-y-8">
                  <AiConceptAssistant onRefined={handleAiRefinement} />
                  
                  <div className="flex justify-between items-center bg-slate-50 p-4 rounded-xl border border-sim-border">
                      <p className="text-xs text-slate-500">Don't want to use AI?</p>
                      <Button variant="sim" onClick={handleNextInternalTab}>
                          Skip & Manual Entry →
                      </Button>
                  </div>
              </div>
          )}

          {/* C. MANUAL FORM */}
          <div className={`space-y-8 animate-fadeIn ${activeTab === 'MANUAL' ? 'block' : 'hidden'}`}>
              
              <div className="flex items-center gap-4 mb-6 border-b border-sim-border pb-4">
                  <div className="w-10 h-10 rounded-full bg-sim-blue text-white flex items-center justify-center font-bold">3</div>
                  <div>
                      <h3 className="text-xl font-bold text-slate-900">Project Details</h3>
                      <p className="text-xs text-slate-500">Review and refine your project parameters.</p>
                  </div>
              </div>

              {/* Asset Class & Complexity */}
              <div className="bg-white rounded-2xl p-8 border border-sim-border shadow-sm">
                  <div className="flex flex-col md:flex-row gap-6 mb-8">
                      <div className="flex-1">
                          <Select 
                            id="assetClass"
                            label="Primary Asset Class"
                            value={currentAssetClass}
                            onChange={(e) => handleAssetClassChange(e.target.value as TokenizationCategory)}
                            options={[
                              { value: 'Real Estate', label: 'Real Estate' },
                              { value: 'Business', label: 'Company Equity / Business' },
                              { value: 'Art', label: 'Art & Collectibles' },
                              { value: 'Debt', label: 'Debt Instruments' },
                              { value: 'Funds', label: 'Investment Funds' },
                              { value: 'Other', label: 'Other / Custom' },
                            ]}
                          />
                      </div>
                      
                      <div className="md:w-1/3">
                          <label className="text-xs uppercase tracking-wider font-bold text-slate-400 ml-1 mb-2 block">Complexity Audit</label>
                          <div className={`flex items-center justify-between p-3.5 rounded-xl border ${complexity.bg}`}>
                              <span className={`font-bold text-sm uppercase ${complexity.color}`}>Level: {complexity.score}</span>
                              <div className={`w-2 h-2 rounded-full ${complexity.score === 'Low' ? 'bg-emerald-500' : complexity.score === 'Medium' ? 'bg-amber-500' : 'bg-red-500'} animate-pulse`}></div>
                          </div>
                      </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                      <Input 
                        id="pname" 
                        label="Project Name" 
                        placeholder="e.g. Green Valley Resort"
                        value={projectInfo.projectName} 
                        onChange={e => handleChange('projectName', e.target.value)} 
                      />
                      
                      <Select 
                        id="pgoal" 
                        label="Primary Goal"
                        value={projectInfo.projectGoal}
                        onChange={e => handleChange('projectGoal', e.target.value)}
                        options={[
                          { value: 'Capital Raise', label: 'Raise Capital (Equity/Debt)' },
                          { value: 'Liquidity', label: 'Liquidity for Existing Owners' },
                          { value: 'Community', label: 'Community Ownership / DAO' },
                          { value: 'Exit', label: 'Exit Strategy / Sale' },
                          { value: 'DeFi Collateral', label: 'Use as DeFi Collateral' },
                        ]}
                      />

                      <div>
                          <Input 
                            id="target" 
                            label="Target Raise Amount ($)" 
                            type="number"
                            placeholder="5000000"
                            value={projectInfo.targetRaiseAmount || ''} 
                            onChange={e => handleChange('targetRaiseAmount', parseFloat(e.target.value))} 
                          />
                          {raiseSuggestion && (
                              <p className="text-xs text-sim-blue mt-1 ml-1 font-medium animate-fadeIn">💡 {raiseSuggestion}</p>
                          )}
                      </div>
                      
                      <Input 
                        id="web" 
                        label="Website (Optional)" 
                        placeholder="https://..."
                        value={projectInfo.website || ''} 
                        onChange={e => handleChange('website', e.target.value)} 
                      />
                  </div>
              </div>

              {/* Description Section */}
              <div className="bg-white p-8 rounded-2xl border border-sim-border shadow-sm">
                  <div className="flex justify-between items-end mb-3">
                      <label className="text-xs uppercase tracking-wider font-bold text-slate-500 ml-1">
                        Professional Description
                        <span className="ml-2 text-[10px] font-normal text-slate-400 lowercase">(min 20 chars)</span>
                      </label>
                  </div>
                  <textarea 
                    className="w-full h-40 p-5 text-slate-700 bg-slate-50 border border-sim-border rounded-xl focus:ring-4 focus:ring-indigo-500/10 focus:border-sim-blue outline-none transition-all leading-relaxed resize-none placeholder:text-slate-400"
                    placeholder="Describe the asset, the business model, and why investors should care."
                    value={projectInfo.description}
                    onChange={e => handleChange('description', e.target.value)}
                  />
              </div>

              {/* Sponsor & Contact Details */}
              <div className="bg-white p-8 rounded-2xl border border-sim-border shadow-sm">
                  <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-6 flex items-center gap-2">
                      <span className="text-xl">👤</span> Sponsor & Contact
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Input 
                          id="cname" label="Primary Contact Name" placeholder="Full Name"
                          value={projectInfo.primaryContactName || ''} 
                          onChange={e => handleChange('primaryContactName', e.target.value)}
                      />
                      <Input 
                          id="cemail" label="Contact Email" placeholder="email@domain.com"
                          value={projectInfo.primaryContactEmail || ''} 
                          onChange={e => handleChange('primaryContactEmail', e.target.value)}
                      />
                      <Input 
                          id="cphone" label="Contact Phone" placeholder="+1..."
                          value={projectInfo.primaryContactPhone || ''} 
                          onChange={e => handleChange('primaryContactPhone', e.target.value)}
                      />
                      <Input 
                          id="sentity" label="Sponsor Entity Name" placeholder="Legal Company Name"
                          value={projectInfo.sponsorEntityName || ''} 
                          onChange={e => handleChange('sponsorEntityName', e.target.value)}
                      />
                      <Input 
                          id="sreg" label="Entity Registration State" placeholder="e.g. Delaware, London"
                          value={projectInfo.sponsorRegistrationState || ''} 
                          onChange={e => handleChange('sponsorRegistrationState', e.target.value)}
                      />
                      <Input 
                          id="sdir" label="Number of Directors" type="number" placeholder="e.g. 3"
                          value={projectInfo.sponsorDirectorsCount || ''} 
                          onChange={e => handleChange('sponsorDirectorsCount', parseInt(e.target.value))}
                      />
                      <Input 
                          id="sact" label="Main Business Activity" placeholder="e.g. Real Estate Development"
                          value={projectInfo.sponsorBusinessActivity || ''} 
                          onChange={e => handleChange('sponsorBusinessActivity', e.target.value)}
                          className="md:col-span-2"
                      />
                  </div>
              </div>
              
              <div className="flex justify-end pt-6">
                   <Button 
                      variant="sim"
                      onClick={handleNextInternalTab} 
                      className="px-10 py-4 text-lg font-bold shadow-xl"
                      disabled={!projectInfo.projectName || !projectInfo.description}
                   >
                       Save & Preview PDF →
                   </Button>
              </div>
          </div>

          {/* D. PDF EXPORT */}
          {activeTab === 'PDF' && <PdfExportView onNextStep={onNext} />}

      </div>

    </div>
  );
};