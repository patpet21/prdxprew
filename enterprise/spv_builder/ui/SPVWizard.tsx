
import React, { useState, useEffect } from 'react';
import { Button } from '../../../components/ui/Button';
import { SPV_PRESETS, LegalFormPreset, ImplementationStep } from '../data/spv_presets';
import { spvService, SpvWizardResult } from '../services/spv_service';
import { SpvDesignEntity } from '../domain/spv_design.entity';
import { EnterpriseAI } from '../../services/ai/ai_manager';
import { SPV_STRUCTURING_PROMPT } from '../../core/prompts/spv_prompts';
import { EntJurisdictionEngine } from './jurisdiction_engine/EntJurisdictionEngine';

// Updated Wizard Stages
type Stage = 'CONTEXT' | 'SELECTION' | 'JURISDICTION_ENGINE' | 'GENERATING' | 'REVIEW' | 'IMPLEMENTATION';

interface Props {
  onComplete?: () => void;
  onCancel?: () => void;
}

export const SPVWizard: React.FC<Props> = ({ onComplete, onCancel }) => {
  const [stage, setStage] = useState<Stage>('CONTEXT');
  
  // 1. Context Data
  const [wizardData, setWizardData] = useState({
    country: 'IT',
    assetType: 'Real Estate',
    targetRaise: 5000000,
    projectName: 'Project Alpha',
    investorProfile: 'Accredited',
    issuerLocation: 'US-DE' 
  });

  // 2. Selection Data
  const [selectedForm, setSelectedForm] = useState<LegalFormPreset | null>(null);
  
  // 3. AI Generated Data
  const [aiResult, setAiResult] = useState<SpvWizardResult | null>(null);
  const [editedDesign, setEditedDesign] = useState<SpvDesignEntity | null>(null);
  const [spvSummary, setSpvSummary] = useState<string>('');
  
  // New AI Analysis State
  const [aiAnalysis, setAiAnalysis] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);

  // 4. Roadmap Data
  const [activeRoadmap, setActiveRoadmap] = useState<ImplementationStep[]>([]);

  // Helpers
  const currentJurisdiction = SPV_PRESETS[wizardData.country];

  // --- Handlers ---

  const handleContextNext = async () => {
    setIsAnalyzing(true);
    
    const prompt = SPV_STRUCTURING_PROMPT(
        wizardData.assetType as any,
        wizardData.country,
        wizardData.issuerLocation,
        "Global"
    );

    const analysis = await EnterpriseAI.generateJSON(
        "Senior Corporate Lawyer", 
        prompt, 
        {
            recommendedStructure: "Single SPV",
            reasoning: "Standard local structure applies.",
            riskFactors: []
        }
    );

    setAiAnalysis(analysis);
    setIsAnalyzing(false);
    
    if (selectedForm && !currentJurisdiction.forms.find(f => f.id === selectedForm.id)) {
        setSelectedForm(null);
    }
    setStage('SELECTION');
  };

  const handleFormSelect = (form: LegalFormPreset) => {
    setSelectedForm(form);
    setSpvSummary(''); 
    setStage('JURISDICTION_ENGINE'); // Go to Deep Dive instead of generating immediately
  };

  const handleJurisdictionEngineComplete = () => {
      if (selectedForm) {
          setStage('GENERATING');
          runGeneration(selectedForm);
      }
  };

  const runGeneration = async (form: LegalFormPreset) => {
    try {
        const result = await spvService.runSpvWizardStep(
            {
                projectId: "temp-id",
                projectName: wizardData.projectName,
                assetType: wizardData.assetType,
                assetCountry: wizardData.country,
                targetRaise: wizardData.targetRaise,
                investorProfile: wizardData.investorProfile
            },
            {
                code: wizardData.country,
                name: currentJurisdiction.name,
                preferredLegalForm: form.label
            }
        );
        
        setAiResult(result);
        setEditedDesign(result.spvDesign);
        setActiveRoadmap(form.roadmap.map(s => ({...s})));
        setStage('REVIEW');
    } catch (e) {
        console.error("AI Generation Failed", e);
        setStage('SELECTION'); 
    }
  };

  const handleGenerateSummary = async () => {
      if (!selectedForm) return;
      setIsGeneratingSummary(true);
      try {
          const summary = await spvService.generateStructureSummary(
            {
                projectId: "temp-id",
                projectName: wizardData.projectName,
                assetType: wizardData.assetType,
                assetCountry: wizardData.country,
                targetRaise: wizardData.targetRaise,
                investorProfile: wizardData.investorProfile
            },
            selectedForm.label,
            currentJurisdiction.name
          );
          setSpvSummary(summary);
      } catch (e) {
          console.error(e);
      } finally {
          setIsGeneratingSummary(false);
      }
  };

  const handleConfirmDesign = () => {
    setStage('IMPLEMENTATION');
  };

  const updateField = (field: string, value: any) => {
      setWizardData(prev => ({...prev, [field]: value}));
  };

  return (
    <div className="h-full flex flex-col bg-slate-950 rounded-2xl overflow-hidden border border-slate-800">
      
      {/* Header Progress Bar */}
      <div className="h-16 border-b border-slate-800 flex items-center justify-between px-4 md:px-8 bg-slate-900 shrink-0 sticky top-0 z-20">
        <div className="flex items-center gap-2 md:gap-4 overflow-x-auto no-scrollbar">
          {['CONTEXT', 'SELECTION', 'JURISDICTION_ENGINE', 'REVIEW', 'IMPLEMENTATION'].map((s, idx) => {
             const isCurrent = stage === s || (stage === 'GENERATING' && s === 'REVIEW');
             const isPast = ['CONTEXT', 'SELECTION', 'JURISDICTION_ENGINE', 'GENERATING', 'REVIEW', 'IMPLEMENTATION'].indexOf(stage) > idx;
             return (
                 <div key={s} className="flex items-center gap-2 shrink-0">
                     <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${isCurrent ? 'bg-amber-500 text-slate-900' : isPast ? 'bg-emerald-500 text-white' : 'bg-slate-800 text-slate-500'}`}>
                         {isPast ? '✓' : idx + 1}
                     </div>
                     <span className={`text-sm font-medium hidden md:block ${isCurrent ? 'text-white' : 'text-slate-600'}`}>
                         {s === 'JURISDICTION_ENGINE' ? 'Strategy' : s.charAt(0) + s.slice(1).toLowerCase()}
                     </span>
                 </div>
             )
          })}
        </div>
        <button onClick={onCancel} className="text-slate-500 hover:text-white text-xs uppercase font-bold tracking-wider">Exit</button>
      </div>

      {/* Main Content Body */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-4 md:p-8 bg-slate-950">
        <div className="max-w-6xl mx-auto pb-24 h-full">
            
            {/* STAGE 1: CONTEXT */}
            {stage === 'CONTEXT' && (
                <div className="animate-fadeIn space-y-8">
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold text-white mb-2 font-display">Structuring Context</h2>
                        <p className="text-slate-400 text-sm">Define the asset and jurisdiction to analyze SPV requirements.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800">
                            <label className="text-xs font-bold text-slate-500 uppercase block mb-4">Target Jurisdiction (Asset Location)</label>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {Object.values(SPV_PRESETS).map(jur => {
                                    const flagCode = jur.code.split('-')[0].toLowerCase();
                                    return (
                                    <button
                                        key={jur.code}
                                        onClick={() => updateField('country', jur.code)}
                                        className={`p-4 rounded-xl border-2 text-left transition-all flex items-center gap-3 ${wizardData.country === jur.code ? 'border-amber-500 bg-slate-800' : 'border-slate-700 bg-slate-900 hover:border-slate-500'}`}
                                    >
                                        <img src={`https://flagcdn.com/w40/${flagCode}.png`} alt={jur.name} className="w-8 h-5 object-cover rounded shadow-sm" />
                                        <div>
                                            <div className="font-bold text-white text-sm">{jur.name}</div>
                                            <div className="text-[10px] text-slate-500">{jur.forms.length} Models</div>
                                        </div>
                                    </button>
                                )})}
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800">
                                <label className="text-xs font-bold text-slate-500 uppercase block mb-3">Project Details</label>
                                <input 
                                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-4 text-white outline-none focus:border-amber-500 mb-4"
                                    value={wizardData.projectName}
                                    onChange={(e) => updateField('projectName', e.target.value)}
                                    placeholder="Project Name"
                                />
                                <div className="grid grid-cols-2 gap-4">
                                    <select 
                                        value={wizardData.assetType}
                                        onChange={(e) => updateField('assetType', e.target.value)}
                                        className="w-full bg-slate-950 border border-slate-700 rounded-xl p-4 text-white outline-none focus:border-amber-500"
                                    >
                                        <option>Real Estate</option>
                                        <option>Business</option>
                                        <option>Debt</option>
                                    </select>
                                    <select 
                                        value={wizardData.investorProfile}
                                        onChange={(e) => updateField('investorProfile', e.target.value)}
                                        className="w-full bg-slate-950 border border-slate-700 rounded-xl p-4 text-white outline-none focus:border-amber-500"
                                    >
                                        <option>Accredited</option>
                                        <option>Institutional</option>
                                        <option>Retail</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* STAGE 2: SELECTION */}
            {stage === 'SELECTION' && (
                <div className="animate-slideUp space-y-8">
                    {aiAnalysis && (
                        <div className="bg-gradient-to-r from-indigo-900/40 to-purple-900/40 border border-indigo-500/30 p-6 rounded-2xl flex items-start gap-4">
                            <div className="text-3xl">🧠</div>
                            <div>
                                <h3 className="text-white font-bold text-lg mb-1">AI Strategic Recommendation: {aiAnalysis.recommendedStructure}</h3>
                                <p className="text-slate-300 text-sm leading-relaxed mb-3">{aiAnalysis.reasoning}</p>
                                <div className="flex gap-2">
                                    {aiAnalysis.riskFactors.map((risk: string, i: number) => (
                                        <span key={i} className="px-2 py-1 bg-red-900/20 border border-red-500/30 text-red-300 text-[10px] font-bold uppercase rounded">
                                            Risk: {risk}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="text-center mb-8">
                        <h2 className="text-2xl font-bold text-white font-display">Select Legal Entity</h2>
                        <p className="text-slate-400 text-sm">Available structures in {currentJurisdiction.name}.</p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {currentJurisdiction.forms.map(form => (
                            <div key={form.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-amber-500/50 transition-all group flex flex-col h-full">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="text-xl font-bold text-white">{form.label}</h3>
                                        <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 text-[10px] font-bold uppercase border border-blue-500/20">{form.badge}</span>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-[10px] text-slate-500 uppercase font-bold">Min Capital</div>
                                        <div className="text-lg font-mono text-white">{form.minCapital}</div>
                                    </div>
                                </div>

                                <p className="text-sm text-slate-400 mb-6 flex-1">{form.description}</p>

                                <Button onClick={() => handleFormSelect(form)} className="w-full bg-slate-800 hover:bg-amber-500 hover:text-slate-900 text-white font-bold py-4 transition-colors rounded-xl">
                                    Select & Configure
                                </Button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* STAGE 3: JURISDICTION ENGINE (Deep Dive) */}
            {stage === 'JURISDICTION_ENGINE' && (
                <div className="h-full flex flex-col">
                    <div className="flex justify-between items-center mb-6 shrink-0">
                        <div>
                            <h2 className="text-2xl font-bold text-white font-display">Jurisdiction Engine</h2>
                            <p className="text-slate-400 text-sm">Deep dive analysis of legal and tax implications.</p>
                        </div>
                        <Button onClick={handleJurisdictionEngineComplete} className="bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg">
                            Confirm Strategy & Build
                        </Button>
                    </div>
                    <div className="flex-1 overflow-hidden rounded-2xl border border-slate-800 bg-slate-900">
                        <EntJurisdictionEngine />
                    </div>
                </div>
            )}

            {/* STAGE 2.5: GENERATING */}
            {stage === 'GENERATING' && (
                <div className="flex flex-col items-center justify-center h-[500px] animate-pulse">
                    <div className="w-20 h-20 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mb-6"></div>
                    <h3 className="text-2xl font-bold text-white mb-2">AI Architect is Working...</h3>
                    <p className="text-slate-400 text-sm">Designing Cap Table, Governance Rules, and Risk Assessment.</p>
                </div>
            )}

            {/* STAGE 4: REVIEW */}
            {stage === 'REVIEW' && editedDesign && aiResult && (
                <div className="animate-slideUp space-y-8">
                    
                    <div className="bg-gradient-to-r from-slate-900 to-indigo-950 border border-indigo-500/30 p-6 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                            <div className="flex items-center gap-3 mb-1">
                                <img src={`https://flagcdn.com/w40/${wizardData.country.split('-')[0].toLowerCase()}.png`} alt={wizardData.country} className="w-8 h-5 object-cover rounded shadow-sm" />
                                <h2 className="text-2xl font-bold text-white font-display">{editedDesign.entityNameSuggestion}</h2>
                                <span className="text-xs bg-indigo-500/20 text-indigo-300 px-2 py-1 rounded border border-indigo-500/40">Draft</span>
                            </div>
                            <p className="text-slate-400 text-sm">{editedDesign.legalForm} • {wizardData.country}</p>
                        </div>
                        
                        <div className="w-full md:w-1/2 bg-slate-900/50 border border-slate-700 rounded-xl p-4">
                             <div className="flex justify-between items-center mb-2">
                                 <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">Strategic Summary</span>
                                 <div className="flex gap-2">
                                     <button 
                                       onClick={() => setSpvSummary('')} 
                                       className="text-[10px] text-slate-500 hover:text-white flex items-center gap-1"
                                     >
                                         ✏️ Edit
                                     </button>
                                     <button 
                                       onClick={handleGenerateSummary} 
                                       disabled={isGeneratingSummary}
                                       className="text-[10px] text-indigo-400 hover:text-indigo-300 flex items-center gap-1 disabled:opacity-50"
                                     >
                                         {isGeneratingSummary ? '...' : '✨ AI Auto-Generate'}
                                     </button>
                                 </div>
                             </div>
                             {spvSummary ? (
                                 <p className="text-xs text-slate-300 leading-relaxed italic">
                                     "{spvSummary}"
                                 </p>
                             ) : (
                                 <textarea
                                     className="w-full bg-transparent text-xs text-slate-300 italic outline-none resize-none h-12 placeholder:text-slate-600"
                                     placeholder="No summary yet. Click Auto-Generate or type here to explain why this structure was chosen..."
                                     value={spvSummary}
                                     onChange={(e) => setSpvSummary(e.target.value)}
                                 />
                             )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2 space-y-6">
                            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                                <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-6 flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Cap Table Structure
                                </h4>
                                <div className="space-y-4">
                                    {editedDesign.shareClasses.map((sc, i) => (
                                        <div key={i} className="bg-slate-950 border border-slate-800 rounded-xl p-4">
                                            <div className="flex justify-between items-center mb-2">
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold ${i === 0 ? 'bg-emerald-900/50 text-emerald-400' : 'bg-indigo-900/50 text-indigo-400'}`}>
                                                        {sc.className.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <div className="text-white font-bold text-sm">{sc.className}</div>
                                                        <div className="text-[10px] text-slate-500">{sc.description}</div>
                                                    </div>
                                                </div>
                                                <div className="text-white font-mono font-bold">{sc.equityPercentage}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/5 rounded-full blur-2xl -mr-10 -mt-10"></div>
                                <h4 className="text-sm font-bold text-red-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                                    <span>🚩</span> Critical Risks (AI)
                                </h4>
                                {aiResult.redFlags.length > 0 ? (
                                    <ul className="space-y-3">
                                        {aiResult.redFlags.map((flag, i) => (
                                            <li key={i} className="text-xs text-slate-300 bg-red-950/20 p-3 rounded-lg border border-red-900/30">
                                                <strong className="block text-red-300 mb-0.5">{flag.risk}</strong>
                                                {flag.description}
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="text-xs text-slate-500 italic">No critical red flags detected.</p>
                                )}
                            </div>

                            <Button onClick={handleConfirmDesign} className="w-full py-4 text-lg font-bold bg-amber-500 hover:bg-amber-400 text-slate-900 shadow-xl">
                                Confirm Structure
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* STAGE 5: IMPLEMENTATION */}
            {stage === 'IMPLEMENTATION' && (
                <div className="animate-slideUp space-y-8">
                    <div className="text-center">
                        <div className="text-5xl mb-4">🚀</div>
                        <h2 className="text-3xl font-bold text-white">Formation Roadmap</h2>
                        <p className="text-slate-400">Follow these steps to instantiate {editedDesign?.entityNameSuggestion}.</p>
                    </div>
                    
                    <div className="space-y-4">
                        {activeRoadmap.map((step, index) => (
                             <div key={step.id} className={`flex items-center gap-4 p-5 rounded-xl border ${step.status === 'completed' ? 'bg-slate-900 border-emerald-500/50' : 'bg-slate-900 border-slate-800'}`}>
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${step.status === 'completed' ? 'bg-emerald-500 text-slate-900' : 'bg-slate-800 text-slate-500 border border-slate-600'}`}>
                                    {index + 1}
                                </div>
                                <div>
                                    <h5 className="text-white font-bold">{step.title}</h5>
                                    <p className="text-slate-500 text-sm">{step.desc}</p>
                                </div>
                             </div>
                        ))}
                    </div>
                    
                    <div className="flex justify-center pt-8">
                        <Button onClick={onComplete} className="px-10 py-3 bg-emerald-600 text-white">
                            Complete Module
                        </Button>
                    </div>
                </div>
            )}

        </div>
      </div>

      {/* Footer Navigation */}
      <div className="p-4 bg-slate-900 border-t border-slate-800 flex justify-between items-center z-30 sticky bottom-0">
          <Button 
            variant="secondary" 
            onClick={() => {
                if(stage === 'SELECTION') setStage('CONTEXT');
                else if(stage === 'JURISDICTION_ENGINE') setStage('SELECTION');
                else if(stage === 'REVIEW') setStage('JURISDICTION_ENGINE');
                else if(stage === 'IMPLEMENTATION') setStage('REVIEW');
                else onCancel && onCancel();
            }}
            disabled={stage === 'CONTEXT' || stage === 'GENERATING'}
            className="px-6 border-slate-700 text-slate-300"
          >
              ← Back
          </Button>

          {stage === 'CONTEXT' && (
              <Button onClick={handleContextNext} isLoading={isAnalyzing} className="px-8 bg-blue-600 hover:bg-blue-500 text-white font-bold shadow-lg">
                  {isAnalyzing ? 'Analyzing...' : 'Next Step'}
              </Button>
          )}
      </div>

    </div>
  );
};
