
import React, { useState, useEffect } from 'react';
import { Button } from '../../../../ui/Button';
import { generateSpvBlueprint } from '../../../../../services/mockAiService';
import { AcademyPdfService } from '../../../../../services/academyPdfService';

export const SpvBlueprintTab: React.FC = () => {
  const [meta, setMeta] = useState({
      spvName: '',
      directors: '',
      shareCapital: '',
      governingLaw: '',
      tokenType: 'Equity',
      complianceModelLabel: ''
  });

  const [blueprint, setBlueprint] = useState<any>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  // Load
  useEffect(() => {
    const saved = localStorage.getItem('academyPro_spvModule');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.blueprintMeta) setMeta(parsed.blueprintMeta);
      if (parsed.blueprintContent) setBlueprint(parsed.blueprintContent);
    }
  }, []);

  const handleSave = () => {
      const current = JSON.parse(localStorage.getItem('academyPro_spvModule') || '{}');
      current.blueprintMeta = meta;
      current.blueprintContent = blueprint;
      localStorage.setItem('academyPro_spvModule', JSON.stringify(current));
  };

  const handleGenerate = async () => {
      setIsGenerating(true);
      // Gather all data
      const strategic = JSON.parse(localStorage.getItem('pdx_academy_spv_module') || '{}');
      const architect = JSON.parse(localStorage.getItem('academyPro_spvArchitect') || '{}');
      const redFlags = JSON.parse(localStorage.getItem('academyPro_spvModule') || '{}').redFlagsSummary;
      
      const allData = { strategic, architect, redFlags, meta };
      
      const content = await generateSpvBlueprint(allData);
      setBlueprint(content);
      setIsGenerating(false);
  };
  
  const handleExport = () => {
      if(!blueprint) return;
      handleSave();
      // Pass gathered data to PDF service
      const redFlags = JSON.parse(localStorage.getItem('academyPro_spvModule') || '{}').redFlagsSummary;
      AcademyPdfService.generateSpvStrategicBlueprintPDF({ blueprintMeta: meta, blueprintContent: blueprint, redFlagsSummary: redFlags });
  };

  return (
    <div className="space-y-8 animate-fadeIn">
        
        {/* Meta Inputs */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Final Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="text-xs font-bold text-slate-500 uppercase block mb-1">SPV Name</label>
                    <input className="w-full border rounded p-2 text-sm" value={meta.spvName} onChange={e => setMeta({...meta, spvName: e.target.value})} placeholder="e.g. Project Alpha S.r.l." />
                </div>
                 <div>
                    <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Directors</label>
                    <input className="w-full border rounded p-2 text-sm" value={meta.directors} onChange={e => setMeta({...meta, directors: e.target.value})} placeholder="Names or Count" />
                </div>
                 <div>
                    <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Share Capital</label>
                    <input className="w-full border rounded p-2 text-sm" value={meta.shareCapital} onChange={e => setMeta({...meta, shareCapital: e.target.value})} placeholder="e.g. €10,000" />
                </div>
                 <div>
                    <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Governing Law</label>
                    <input className="w-full border rounded p-2 text-sm" value={meta.governingLaw} onChange={e => setMeta({...meta, governingLaw: e.target.value})} placeholder="e.g. Italian Law" />
                </div>
                 <div>
                    <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Token Type</label>
                    <select className="w-full border rounded p-2 text-sm" value={meta.tokenType} onChange={e => setMeta({...meta, tokenType: e.target.value})}>
                        <option>Equity Token</option>
                        <option>Debt Token</option>
                        <option>Revenue Share</option>
                    </select>
                </div>
                 <div>
                    <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Compliance Model</label>
                    <input className="w-full border rounded p-2 text-sm" value={meta.complianceModelLabel} onChange={e => setMeta({...meta, complianceModelLabel: e.target.value})} placeholder="e.g. Reg D + Reg S" />
                </div>
            </div>
            
            <div className="mt-6 text-right">
                <Button onClick={handleGenerate} isLoading={isGenerating} className="bg-indigo-600 hover:bg-indigo-500 shadow-lg">
                    Generate Blueprint Content
                </Button>
            </div>
        </div>

        {/* Preview */}
        {blueprint && (
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-8 max-h-[600px] overflow-y-auto custom-scrollbar shadow-inner relative">
                <div className="absolute top-0 left-0 w-full h-2 bg-indigo-500"></div>
                <div className="mb-8 text-center">
                    <h2 className="text-3xl font-display font-bold text-slate-900 mb-2">Legal Strategy Blueprint</h2>
                    <p className="text-sm text-slate-500 uppercase tracking-widest">{meta.spvName || 'Project Name'}</p>
                </div>

                <div className="space-y-6 text-slate-700 leading-relaxed font-serif">
                    <section>
                        <h4 className="font-bold text-indigo-900 uppercase text-sm mb-2 border-b border-indigo-100 pb-1">1. Executive Summary</h4>
                        <p className="text-sm">{blueprint.executiveSummary}</p>
                    </section>
                    
                    <section>
                        <h4 className="font-bold text-indigo-900 uppercase text-sm mb-2 border-b border-indigo-100 pb-1">2. Structure Overview</h4>
                        <p className="text-sm">{blueprint.structureOverview}</p>
                    </section>

                    <section className="bg-white p-4 rounded-xl border border-slate-200">
                        <h4 className="font-bold text-slate-900 uppercase text-xs mb-2">Risk Snapshot</h4>
                        <p className="text-xs text-slate-600">{blueprint.riskOverview}</p>
                    </section>

                    <section>
                        <h4 className="font-bold text-indigo-900 uppercase text-sm mb-2 border-b border-indigo-100 pb-1">3. Compliance Plan</h4>
                        <p className="text-sm">{blueprint.compliancePlan}</p>
                    </section>

                    <section>
                        <h4 className="font-bold text-indigo-900 uppercase text-sm mb-2 border-b border-indigo-100 pb-1">4. Next Steps</h4>
                        <ul className="list-disc list-inside text-sm space-y-1">
                            {(blueprint.nextSteps || []).map((s: string, i: number) => (
                                <li key={i}>{s}</li>
                            ))}
                        </ul>
                    </section>
                </div>
            </div>
        )}

        <div className="flex justify-end gap-4 border-t border-slate-200 pt-6">
            <Button variant="secondary" onClick={handleSave}>Save Draft</Button>
            <Button onClick={handleExport} disabled={!blueprint} className="bg-slate-900 text-white shadow-xl px-8">
                Download PDF Blueprint
            </Button>
        </div>

    </div>
  );
};
