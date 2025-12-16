
import React, { useState, useEffect } from 'react';
import { Button } from '../../../../ui/Button';
import { Select } from '../../../../ui/Select';
import { generateStoryBuilder } from '../../../../../services/mockAiService';

interface StoryOutputs {
    institutional: string;
    simplified: string;
    hook: string;
}

interface CredibilityAudit {
    missingProof: string[];
    overclaims: string[];
    ambiguities: string[];
    fixSuggestions: string[];
}

export const NarrativeBuilder: React.FC = () => {
  // Inputs
  const [inputs, setInputs] = useState({
      storyDraft: '',
      audience: 'Investors',
      tone: 'Institutional',
      length: 'medium'
  });

  // Outputs & State
  const [outputs, setOutputs] = useState<StoryOutputs>({
      institutional: '',
      simplified: '',
      hook: ''
  });
  const [audit, setAudit] = useState<CredibilityAudit | null>(null);

  const [activeOutputTab, setActiveOutputTab] = useState<'institutional' | 'simplified' | 'hook'>('institutional');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Load Context
  useEffect(() => {
    const saved = localStorage.getItem('academyPro_reports');
    if (saved) {
        try {
            const parsed = JSON.parse(saved);
            if (parsed.storyBuilder) {
                if (parsed.storyBuilder.inputs) setInputs(prev => ({...prev, ...parsed.storyBuilder.inputs}));
                if (parsed.storyBuilder.outputs) setOutputs(parsed.storyBuilder.outputs);
                if (parsed.storyBuilder.audit) setAudit(parsed.storyBuilder.audit);
            }
        } catch(e) { console.error(e); }
    }
  }, []);

  const handleGenerate = async () => {
      setIsGenerating(true);
      
      const fullContext = JSON.parse(localStorage.getItem('pdx_simulator_state') || '{}');
      fullContext.proReports = JSON.parse(localStorage.getItem('academyPro_reports') || '{}');

      const result = await generateStoryBuilder(fullContext, inputs);
      
      const newOutputs = result.storyOutputs || { institutional: '', simplified: '', hook: '' };
      setOutputs(newOutputs);
      setAudit(result.audit || null);
      
      // Auto Save
      const currentReports = JSON.parse(localStorage.getItem('academyPro_reports') || '{}');
      currentReports.storyBuilder = {
          inputs,
          outputs: newOutputs,
          audit: result.audit || null
      };
      localStorage.setItem('academyPro_reports', JSON.stringify(currentReports));
      
      setIsGenerating(false);
  };

  const handleSave = () => {
      setIsSaving(true);
      const currentReports = JSON.parse(localStorage.getItem('academyPro_reports') || '{}');
      currentReports.storyBuilder = {
          inputs,
          outputs,
          audit
      };
      localStorage.setItem('academyPro_reports', JSON.stringify(currentReports));
      
      setTimeout(() => {
          setIsSaving(false);
          alert("Narrative Strategy Saved");
      }, 500);
  };

  const handleOutputChange = (val: string) => {
      setOutputs(prev => ({ ...prev, [activeOutputTab]: val }));
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 rounded-xl overflow-hidden border border-slate-200">
        
        {/* HEADER */}
        <div className="bg-white border-b border-slate-200 px-6 py-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shrink-0">
            <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-600 rounded-lg text-white">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                </div>
                <div>
                    <h3 className="font-bold text-slate-900 text-lg">Story & Credibility</h3>
                    <p className="text-slate-500 text-xs">Transform data into a decision-grade narrative.</p>
                </div>
            </div>
            <div className="flex gap-2">
                 <Button onClick={handleGenerate} isLoading={isGenerating} className="bg-indigo-600 hover:bg-indigo-500 text-white">
                    {outputs.institutional ? 'Rebuild Story' : 'Build Narrative'}
                 </Button>
            </div>
        </div>

        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
            
            {/* LEFT: INPUT & AUDIT */}
            <div className="w-full lg:w-1/3 bg-slate-50 border-r border-slate-200 flex flex-col overflow-y-auto p-6">
                
                {/* Section 1: Brain Dump */}
                <div className="mb-6 space-y-3">
                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                        1. Brain Dump <span className="text-[10px] bg-slate-200 px-1.5 rounded text-slate-500">Optional</span>
                    </h4>
                    <p className="text-xs text-slate-400 leading-tight">Paste rough notes, emails, or ideas. AI will structure this using your project data.</p>
                    <textarea 
                        value={inputs.storyDraft}
                        onChange={e => setInputs({...inputs, storyDraft: e.target.value})}
                        className="w-full h-32 p-3 bg-white border border-slate-300 rounded-xl text-slate-700 text-sm focus:ring-2 focus:ring-indigo-500 outline-none resize-none placeholder:text-slate-400"
                        placeholder="e.g. We are raising $5M to buy a hotel in Rome. High tourist area. Great yield..."
                    />
                </div>

                {/* Section 2: Parameters */}
                <div className="space-y-3 mb-6">
                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest">2. Narrative Settings</h4>
                    <div className="grid grid-cols-2 gap-3">
                        <Select 
                            label="Target Audience" 
                            value={inputs.audience}
                            onChange={e => setInputs({...inputs, audience: e.target.value})}
                            options={[
                                { value: 'Investors', label: 'Investors (LPs)' },
                                { value: 'Partners', label: 'Strategic Partners' },
                                { value: 'Regulators', label: 'Regulators' }
                            ]}
                        />
                        <Select 
                            label="Tone" 
                            value={inputs.tone}
                            onChange={e => setInputs({...inputs, tone: e.target.value})}
                            options={[
                                { value: 'Institutional', label: 'Institutional' },
                                { value: 'Simple', label: 'Simplified (ELI5)' },
                                { value: 'Visionary', label: 'Visionary' }
                            ]}
                        />
                    </div>
                </div>

                {/* Section 3: Credibility Audit (Results) */}
                {audit && (
                    <div className="mt-4 space-y-4 animate-slideUp">
                        <h4 className="text-xs font-bold text-slate-900 uppercase tracking-widest flex items-center gap-2 border-t border-slate-200 pt-4">
                            <span className="text-lg">🔍</span> Credibility Audit
                        </h4>
                        
                        {audit.overclaims?.length > 0 && (
                            <div className="bg-red-50 border border-red-100 p-3 rounded-lg">
                                <h5 className="text-[10px] font-bold text-red-600 uppercase mb-1">Overclaims (Risk)</h5>
                                <ul className="space-y-1">
                                    {audit.overclaims.map((oc, i) => (
                                        <li key={i} className="text-xs text-red-800 leading-snug">• {oc}</li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {audit.missingProof?.length > 0 && (
                            <div className="bg-amber-50 border border-amber-100 p-3 rounded-lg">
                                <h5 className="text-[10px] font-bold text-amber-600 uppercase mb-1">Missing Proof</h5>
                                <ul className="space-y-1">
                                    {audit.missingProof.map((mp, i) => (
                                        <li key={i} className="text-xs text-amber-800 leading-snug">• {mp}</li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {audit.fixSuggestions?.length > 0 && (
                            <div className="bg-emerald-50 border border-emerald-100 p-3 rounded-lg">
                                <h5 className="text-[10px] font-bold text-emerald-600 uppercase mb-1">Fix Suggestions</h5>
                                <ul className="space-y-1">
                                    {audit.fixSuggestions.map((fs, i) => (
                                        <li key={i} className="text-xs text-emerald-800 leading-snug">✓ {fs}</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* RIGHT: OUTPUT EDITOR */}
            <div className="flex-1 bg-white flex flex-col overflow-hidden relative">
                
                {/* Output Tabs */}
                <div className="flex border-b border-slate-200 bg-slate-50">
                    {[
                        { id: 'institutional', label: '🏛️ Institutional' },
                        { id: 'simplified', label: '👶 Simplified' },
                        { id: 'hook', label: '⚡ Sharp Hook' }
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveOutputTab(tab.id as any)}
                            className={`px-6 py-3 text-sm font-bold border-b-2 transition-all ${
                                activeOutputTab === tab.id 
                                ? 'border-indigo-600 text-indigo-600 bg-white' 
                                : 'border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-100'
                            }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                <div className="flex-1 relative bg-white">
                    {!outputs.institutional ? (
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400">
                            <span className="text-5xl mb-4 opacity-20">✍️</span>
                            <p className="font-medium">Waiting for input...</p>
                            <p className="text-xs mt-2">Enter notes or use existing project data to build the story.</p>
                        </div>
                    ) : (
                        <textarea 
                            value={outputs[activeOutputTab]}
                            onChange={e => handleOutputChange(e.target.value)}
                            className="w-full h-full p-8 text-lg leading-loose text-slate-800 resize-none outline-none font-serif placeholder:text-slate-300"
                            spellCheck={false}
                        />
                    )}
                </div>

                {/* Bottom Action Bar */}
                <div className="p-4 border-t border-slate-200 flex justify-between items-center bg-slate-50">
                    <div className="text-xs text-slate-500 italic">
                        {outputs.institutional ? "This text is auto-saved to your Project File." : ""}
                    </div>
                    <Button onClick={handleSave} disabled={!outputs.institutional || isSaving} variant="secondary">
                        {isSaving ? 'Saving...' : 'Save Narrative'}
                    </Button>
                </div>
            </div>

        </div>
    </div>
  );
};
