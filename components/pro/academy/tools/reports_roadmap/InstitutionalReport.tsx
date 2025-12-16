
import React, { useState, useEffect } from 'react';
import { Button } from '../../../../ui/Button';
import { generateIcMemo, scanMemoRedFlags, rewriteMemoClarity } from '../../../../../services/mockAiService';

// Define the Memo Sections
const MEMO_SECTIONS = [
    { id: 'executiveSummary', label: 'Executive Summary' },
    { id: 'assetSnapshot', label: 'Asset Snapshot' },
    { id: 'marketThesis', label: 'Market Thesis' },
    { id: 'structureOverview', label: 'Structure Overview' },
    { id: 'investorRights', label: 'Investor Rights & Waterfall' },
    { id: 'financialHighlights', label: 'Financial Highlights' },
    { id: 'riskRegister', label: 'Risk Register' },
    { id: 'timeline', label: 'Timeline & Milestones' },
    { id: 'openQuestions', label: 'Open Questions' }
];

export const InstitutionalReport: React.FC = () => {
  // 1. STATE MANAGEMENT
  const [activeSection, setActiveSection] = useState('executiveSummary');
  const [memoData, setMemoData] = useState<Record<string, string>>({});
  const [redFlags, setRedFlags] = useState<any[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [isRewriting, setIsRewriting] = useState(false);
  
  const getContext = () => {
      // Pull data from local storage for simulation context
      const fin = JSON.parse(localStorage.getItem('academyPro_financial') || '{}');
      const leg = JSON.parse(localStorage.getItem('academyPro_spvModule') || '{}');
      const tok = JSON.parse(localStorage.getItem('academyPro_tokenomics') || '{}');
      const gen = JSON.parse(localStorage.getItem('pdx_simulator_state') || '{}');
      
      return {
          projectName: gen.projectInfo?.projectName || "Project Alpha",
          projectGoal: gen.projectInfo?.projectGoal || "Capital Raise",
          targetRaiseAmount: gen.projectInfo?.targetRaiseAmount || 5000000,
          financials: fin,
          legal: leg,
          tokenomics: tok,
          jurisdiction: gen.jurisdiction || {},
          property: gen.property || {}
      };
  };

  const handleGenerate = async () => {
      setIsGenerating(true);
      const context = getContext();
      
      const result = await generateIcMemo(context);
      
      const newMemoData: Record<string, string> = {};
      MEMO_SECTIONS.forEach(sec => {
          // Map response keys to section ids. The mock service returns keys matching ids.
          // Fallback to "Generating..." if AI return is missing a key (robustness)
          const content = result[sec.id] || `[Content for ${sec.label} not generated. Check AI response.]`;
          newMemoData[sec.id] = content;
      });
      
      setMemoData(newMemoData);
      setIsGenerating(false);
  };

  const handleEditorChange = (val: string) => {
      setMemoData(prev => ({ ...prev, [activeSection]: val }));
  };

  // Micro-Tools
  const handleScanRisks = async () => {
      setIsScanning(true);
      const currentText = memoData[activeSection] || "";
      const result = await scanMemoRedFlags(currentText);
      setRedFlags(result.redFlags || []);
      setIsScanning(false);
  };

  const handleRewriteClarity = async () => {
      setIsRewriting(true);
      const currentText = memoData[activeSection] || "";
      const result = await rewriteMemoClarity(currentText);
      handleEditorChange(result.revisedText);
      setIsRewriting(false);
  };

  const activeContent = memoData[activeSection] || "";

  return (
    <div className="flex flex-col h-full bg-slate-50 rounded-xl overflow-hidden border border-slate-200">
        
        {/* TOOLBAR */}
        <div className="bg-white border-b border-slate-200 px-6 py-4 flex flex-col md:flex-row justify-between items-center gap-4 shrink-0">
            <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-600 rounded-lg text-white">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                </div>
                <div>
                    <h3 className="font-bold text-slate-900 text-lg">IC Memo Coach</h3>
                    <p className="text-slate-500 text-xs">Drafting Mode: Professional</p>
                </div>
            </div>

            <div className="flex items-center gap-3">
                {/* Micro-Tools */}
                <div className="flex bg-slate-100 p-1 rounded-lg">
                    <button 
                        onClick={handleScanRisks} 
                        disabled={isScanning || !activeContent}
                        className="px-3 py-1.5 text-xs font-bold text-slate-600 hover:text-red-600 hover:bg-white rounded-md transition-all flex items-center gap-2 disabled:opacity-50"
                    >
                        {isScanning ? 'Scanning...' : '🕵️ Scan Risks'}
                    </button>
                    <div className="w-px bg-slate-300 my-1 mx-1"></div>
                    <button 
                        onClick={handleRewriteClarity} 
                        disabled={isRewriting || !activeContent}
                        className="px-3 py-1.5 text-xs font-bold text-slate-600 hover:text-indigo-600 hover:bg-white rounded-md transition-all flex items-center gap-2 disabled:opacity-50"
                    >
                        {isRewriting ? 'Rewriting...' : '✨ Make Clearer'}
                    </button>
                </div>

                <Button onClick={handleGenerate} isLoading={isGenerating} className="bg-slate-900 hover:bg-slate-800 text-white shadow-lg text-xs px-4">
                    {Object.keys(memoData).length > 0 ? 'Regenerate All' : 'Generate Full Memo'}
                </Button>
            </div>
        </div>

        {/* WORKSPACE */}
        <div className="flex-1 flex overflow-hidden">
            
            {/* LEFT SIDEBAR: OUTLINE */}
            <div className="w-64 bg-slate-50 border-r border-slate-200 overflow-y-auto p-4 hidden md:block">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Document Sections</h4>
                <div className="space-y-1">
                    {MEMO_SECTIONS.map(sec => (
                        <button
                            key={sec.id}
                            onClick={() => setActiveSection(sec.id)}
                            className={`
                                w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-all flex justify-between items-center
                                ${activeSection === sec.id 
                                    ? 'bg-white text-indigo-600 shadow-sm border border-slate-200' 
                                    : 'text-slate-500 hover:bg-slate-100'
                                }
                            `}
                        >
                            {sec.label}
                            {memoData[sec.id] && <span className="text-[10px] text-emerald-500">●</span>}
                        </button>
                    ))}
                </div>
            </div>

            {/* CENTER: EDITOR */}
            <div className="flex-1 bg-white p-8 overflow-y-auto custom-scrollbar relative">
                {Object.keys(memoData).length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-slate-400">
                        <span className="text-6xl mb-4 opacity-20">📝</span>
                        <p className="text-lg font-medium text-slate-600">No Memo Generated Yet</p>
                        <p className="text-sm max-w-sm text-center mt-2">
                            Click "Generate Full Memo" to compile your project data into an investment-grade document.
                        </p>
                    </div>
                ) : (
                    <textarea 
                        className="w-full h-full resize-none outline-none text-slate-800 font-serif text-lg leading-relaxed placeholder:text-slate-300"
                        value={activeContent}
                        onChange={(e) => handleEditorChange(e.target.value)}
                        placeholder="Start typing or generating..."
                    />
                )}
            </div>

            {/* RIGHT: COACH'S CORNER */}
            <div className="w-80 bg-slate-50 border-l border-slate-200 overflow-y-auto p-6 hidden xl:block">
                <div className="mb-6">
                    <h4 className="text-xs font-bold text-indigo-600 uppercase tracking-widest mb-3 flex items-center gap-2">
                        <span className="text-lg">🧠</span> IC Coach Lens
                    </h4>
                    <div className="bg-indigo-50 border border-indigo-100 p-4 rounded-xl text-xs text-indigo-800 leading-relaxed">
                        <strong className="block mb-1 text-indigo-900">Focus: {MEMO_SECTIONS.find(s=>s.id===activeSection)?.label}</strong>
                        Ensure this section directly addresses the risks associated with the jurisdiction. Institutional investors will look for downside protection here.
                    </div>
                </div>

                {redFlags.length > 0 && (
                    <div className="mb-6 animate-slideUp">
                        <h4 className="text-xs font-bold text-red-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                            <span className="text-lg">🚩</span> Red Flags Detected
                        </h4>
                        <div className="space-y-2">
                            {redFlags.map((flag, i) => (
                                <div key={i} className="bg-red-50 border border-red-100 p-3 rounded-lg text-xs text-red-800">
                                    <strong>{flag.issue}</strong>
                                    <p className="mt-1 opacity-80">{flag.fixSuggestion}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

        </div>

    </div>
  );
};
