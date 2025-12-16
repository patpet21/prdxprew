
import React, { useState, useEffect } from 'react';
import { Button } from '../../../../ui/Button';
import { Select } from '../../../../ui/Select';
import { Input } from '../../../../ui/Input';
import { 
    generateAdvancedComplianceTemplate, 
    generateTemplateEducation 
} from '../../../../../services/mockAiService';

interface Props {
  data: any;
  onUpdate: (data: any) => void;
  onNext: () => void;
}

const LOCAL_STORAGE_KEY = 'academyPro_compliance';

export const LegalTemplatesTab: React.FC<Props> = ({ data, onUpdate, onNext }) => {
  // 1. INPUTS
  const [inputs, setInputs] = useState({
      issuerLegalName: '',
      jurisdictionOfIncorporation: 'Delaware',
      tokenType: 'Security Token',
      investorRights: [] as string[],
      lockupPeriod: '12 Months',
      resaleRestrictions: 'Reg D Restricted',
      distributionMethod: 'Smart Contract',
      transferabilityRules: 'Whitelist Only',
      riskDisclosureLevel: 'High',
      offerSize: '$5M',
      fundFlowModel: 'Escrow'
  });

  const [selectedTemplate, setSelectedTemplate] = useState('Risk Disclosure');
  const [generatedResult, setGeneratedResult] = useState<any>(null);
  const [education, setEducation] = useState<any>(null);
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Load from Storage
  useEffect(() => {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
          try {
              const parsed = JSON.parse(saved);
              if (parsed.templates) {
                  if (parsed.templates.inputs) setInputs(prev => ({ ...prev, ...parsed.templates.inputs }));
                  // Load last generated state if available? Maybe complex. 
                  // For now, let's keep it simple and just load inputs.
                  // Could map parsed.templates.generatedTemplates back to local state if we want persistence of the text.
                  if (parsed.templates.generatedTemplates && parsed.templates.generatedTemplates[selectedTemplate]) {
                      setGeneratedResult(parsed.templates.generatedTemplates[selectedTemplate]);
                  }
              }
              // Pre-fill jurisdiction if empty
              if (!inputs.jurisdictionOfIncorporation && parsed.framework?.inputs?.jurisdiction) {
                  setInputs(prev => ({ ...prev, jurisdictionOfIncorporation: parsed.framework.inputs.jurisdiction }));
              }
          } catch (e) {
              console.error("Failed to load Template data", e);
          }
      }
  }, []);

  const handleChange = (field: string, value: any) => {
      setInputs(prev => ({ ...prev, [field]: value }));
  };

  const toggleRight = (right: string) => {
      const current = inputs.investorRights;
      if (current.includes(right)) {
          handleChange('investorRights', current.filter(r => r !== right));
      } else {
          handleChange('investorRights', [...current, right]);
      }
  };

  const templatesList = [
      'Risk Disclosure',
      'Token Purchase Agreement',
      'Website Terms of Use',
      'Privacy Policy (GDPR)',
      'Accredited Investor Questionnaire',
      'AML/KYC Policy'
  ];

  const handleGenerate = async () => {
      setIsGenerating(true);
      
      // Get context from other tabs
      const saved = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || '{}');
      const context = {
          regulatoryFramework: saved.framework,
          investorRules: saved.investorRules
      };

      const [result, edu] = await Promise.all([
          generateAdvancedComplianceTemplate(selectedTemplate, inputs, context),
          generateTemplateEducation(selectedTemplate, inputs.jurisdictionOfIncorporation)
      ]);

      setGeneratedResult(result);
      setEducation(edu);
      setIsGenerating(false);

      // Save to storage structure
      const currentTemplates = saved.templates?.generatedTemplates || {};
      currentTemplates[selectedTemplate] = result;
      
      const updated = {
          ...saved,
          templates: {
              inputs,
              generatedTemplates: currentTemplates,
              education: edu // Just save last edu for simplicity or map it
          }
      };
      
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
      onUpdate(updated.templates);
  };

  const handleSave = () => {
      setIsSaving(true);
      // Ensure current state is flushed
      const saved = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || '{}');
      const updated = {
          ...saved,
          templates: {
              inputs,
              generatedTemplates: saved.templates?.generatedTemplates || {},
              education // Save current edu
          }
      };
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
      onUpdate(updated.templates);
      setTimeout(() => setIsSaving(false), 500);
  };

  const handleSaveNext = () => {
      handleSave();
      onNext();
  };

  return (
    <div className="space-y-8 animate-fadeIn">
        
        {/* Header */}
        <div className="flex justify-between items-center">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <span className="w-6 h-6 rounded-md bg-blue-500 flex items-center justify-center text-slate-900 text-xs">4</span>
                Legal Templates
            </h4>
            <div className="px-3 py-1 bg-blue-500/10 border border-blue-500/30 rounded-full text-[10px] text-blue-400 font-bold uppercase tracking-wider">
                Drafting Engine
            </div>
        </div>

        {/* INPUTS SECTION */}
        <div className="bg-white p-6 rounded-xl border border-sim-border shadow-sm">
            <div className="flex items-center justify-between mb-4">
                <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                    <span className="text-xl">📝</span> Template Context
                </h4>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                <Input 
                    label="Issuer Legal Name" id="issuer"
                    value={inputs.issuerLegalName}
                    onChange={e => handleChange('issuerLegalName', e.target.value)}
                    placeholder="e.g. Project Alpha LLC"
                />
                <Input 
                    label="Jurisdiction" id="jur"
                    value={inputs.jurisdictionOfIncorporation}
                    onChange={e => handleChange('jurisdictionOfIncorporation', e.target.value)}
                />
                 <Select 
                    label="Token Type" id="tokenType"
                    value={inputs.tokenType}
                    onChange={e => handleChange('tokenType', e.target.value)}
                    options={[
                        { value: 'Security Token', label: 'Security Token' },
                        { value: 'Utility Token', label: 'Utility Token' },
                        { value: 'Equity Token', label: 'Equity Token' },
                        { value: 'Revenue Share', label: 'Revenue Share' }
                    ]}
                />
                <Input 
                    label="Offer Size" id="offerSize"
                    value={inputs.offerSize}
                    onChange={e => handleChange('offerSize', e.target.value)}
                    placeholder="e.g. $5,000,000"
                />
                <Select 
                    label="Distribution Method" id="distMethod"
                    value={inputs.distributionMethod}
                    onChange={e => handleChange('distributionMethod', e.target.value)}
                    options={[
                        { value: 'Smart Contract', label: 'Smart Contract' },
                        { value: 'Manual', label: 'Manual Allocation' },
                        { value: 'Exchange', label: 'Exchange IEO' }
                    ]}
                />
                <Select 
                    label="Fund Flow" id="fundFlow"
                    value={inputs.fundFlowModel}
                    onChange={e => handleChange('fundFlowModel', e.target.value)}
                    options={[
                        { value: 'Escrow', label: 'Escrow Agent' },
                        { value: 'Direct', label: 'Direct to Issuer' },
                        { value: 'Smart Contract', label: 'Smart Contract Vault' }
                    ]}
                />
                 <Input 
                    label="Lockup Period" id="lockup"
                    value={inputs.lockupPeriod}
                    onChange={e => handleChange('lockupPeriod', e.target.value)}
                />
                 <Input 
                    label="Resale Restrictions" id="resale"
                    value={inputs.resaleRestrictions}
                    onChange={e => handleChange('resaleRestrictions', e.target.value)}
                    placeholder="e.g. Rule 144"
                />
                 <Select 
                    label="Risk Disclosure" id="riskLevel"
                    value={inputs.riskDisclosureLevel}
                    onChange={e => handleChange('riskDisclosureLevel', e.target.value)}
                    options={[
                        { value: 'Standard', label: 'Standard' },
                        { value: 'High', label: 'High (Retail focus)' },
                        { value: 'Minimal', label: 'Minimal (Institutional)' }
                    ]}
                />
            </div>
            
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                <label className="text-xs font-bold text-slate-500 uppercase block mb-2">Investor Rights</label>
                <div className="flex flex-wrap gap-2">
                    {['Voting', 'Dividends', 'Information', 'Redemption', 'Liquidation Pref'].map(r => (
                        <button
                            key={r}
                            onClick={() => toggleRight(r)}
                            className={`px-3 py-1.5 rounded-lg border text-xs font-bold transition-all ${
                                inputs.investorRights.includes(r) 
                                    ? 'bg-blue-600 text-white border-blue-600' 
                                    : 'bg-white text-slate-500 border-slate-300'
                            }`}
                        >
                            {r}
                        </button>
                    ))}
                </div>
            </div>
        </div>

        {/* EDITOR AREA */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Sidebar List */}
            <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
                <h5 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Template Library</h5>
                <div className="space-y-2">
                    {templatesList.map(t => (
                        <button
                            key={t}
                            onClick={() => { setSelectedTemplate(t); setGeneratedResult(null); }}
                            className={`w-full text-left p-3 rounded-lg text-sm transition-all flex justify-between items-center ${
                                selectedTemplate === t 
                                    ? 'bg-blue-600 text-white shadow-lg' 
                                    : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700'
                            }`}
                        >
                            <span>{t}</span>
                            {selectedTemplate === t && <span>Example</span>}
                        </button>
                    ))}
                </div>
            </div>

            {/* Viewer / Editor */}
            <div className="lg:col-span-2 bg-slate-900 p-6 rounded-xl border border-slate-800 flex flex-col min-h-[500px]">
                <div className="flex justify-between items-center mb-6">
                    <h4 className="text-white font-bold text-lg">{selectedTemplate}</h4>
                    <Button onClick={handleGenerate} isLoading={isGenerating} size="sm" className="bg-sim-ai hover:bg-purple-600 text-white shadow-lg shadow-purple-500/20">
                        {isGenerating ? 'Drafting...' : '✨ Generate with AI'}
                    </Button>
                </div>

                {generatedResult ? (
                    <div className="flex-1 bg-slate-950 rounded-lg p-6 border border-slate-800 overflow-y-auto max-h-[500px] custom-scrollbar">
                        <h2 className="text-xl font-bold text-white mb-4 border-b border-slate-800 pb-2">{generatedResult.title}</h2>
                        
                        {generatedResult.sections?.map((sec: any, i: number) => (
                            <div key={i} className="mb-6">
                                <h5 className="text-sm font-bold text-indigo-400 uppercase mb-2">{sec.heading}</h5>
                                <div className="text-sm text-slate-300 leading-relaxed whitespace-pre-wrap font-serif">
                                    {sec.content}
                                </div>
                            </div>
                        ))}

                        <div className="mt-8 pt-4 border-t border-slate-800 bg-slate-900/50 p-4 rounded-lg">
                            <h6 className="text-xs font-bold text-amber-500 uppercase mb-2">Compliance Notes for Counsel</h6>
                            <ul className="list-disc list-inside text-xs text-slate-400 space-y-1">
                                {generatedResult.complianceNotes?.map((n: string, i: number) => <li key={i}>{n}</li>)}
                            </ul>
                        </div>
                    </div>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-center opacity-60 border-2 border-dashed border-slate-800 rounded-lg">
                        <span className="text-5xl mb-4">📄</span>
                        <p className="text-sm text-slate-400">Select a template and click Generate.</p>
                        <p className="text-xs text-slate-600 mt-2">AI will use your context inputs to draft the content.</p>
                    </div>
                )}
            </div>
        </div>

        {/* Education Panel */}
        {education && (
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex gap-4 items-start animate-slideUp">
                <span className="text-2xl">🎓</span>
                <div>
                    <h5 className="text-xs font-bold text-indigo-700 uppercase mb-1">Education</h5>
                    <p className="text-xs text-slate-600 mb-1"><strong>Purpose:</strong> {education.purpose}</p>
                    <p className="text-xs text-slate-600 mb-1"><strong>Regulatory:</strong> {education.regulatoryMeaning}</p>
                    <p className="text-xs text-red-500 font-bold"><strong>Review:</strong> {education.requiredLegalReview}</p>
                </div>
            </div>
        )}

        {/* Footer Actions */}
        <div className="flex justify-end gap-4 pt-4 border-t border-slate-200/50">
            <Button onClick={handleSave} disabled={isSaving} variant="secondary" className="border-slate-300 text-slate-500">
                {isSaving ? 'Saving...' : 'Save Progress'}
            </Button>
            <Button onClick={handleSaveNext} className="bg-sim-cta hover:bg-sim-cta-hover text-white shadow-lg">
                Finish & Go to Export →
            </Button>
        </div>

    </div>
  );
};
