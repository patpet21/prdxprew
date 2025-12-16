
import React, { useState, useEffect } from 'react';
import { Button } from '../../../../ui/Button';
import { Select } from '../../../../ui/Select';
import { generateFinalReport, harmonizeReportTone } from '../../../../../services/mockAiService';
import { useAcademyState } from '../../../../../hooks/useAcademyState';
import { AcademyPdfService } from '../../../../../services/academyPdfService';

interface ReportSection {
    title: string;
    content: string;
}

interface ReportResponse {
    education?: string[];
    finalReport: {
        toc: string[];
        sections: ReportSection[];
    };
    qualityControl: {
        inconsistencies: string[];
        missingData: string[];
        validationChecklist: string[];
    };
    readiness: {
        score: number;
        verdict: string;
    };
    nextActions: string[];
    reasoningWhyThisStepExists?: string;
}

export const FinalReportCompiler: React.FC = () => {
  // Inputs
  const [inputs, setInputs] = useState({
      reportTitle: 'Tokenization Strategy Blueprint',
      brandingMode: 'PropertyDEX',
      includeAppendix: true,
      exportMode: 'PDF'
  });

  // State
  const [reportData, setReportData] = useState<ReportResponse | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isHarmonizing, setIsHarmonizing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [activeSectionIndex, setActiveSectionIndex] = useState<number>(0);
  const [version, setVersion] = useState<'DRAFT' | 'HARMONIZED'>('DRAFT');

  // Context for PDF metadata
  const [projectInfo, setProjectInfo] = useState<any>({});

  // Load Context
  useEffect(() => {
    const simState = JSON.parse(localStorage.getItem('pdx_simulator_state') || '{}');
    if (simState?.projectInfo) {
        setProjectInfo(simState.projectInfo);
        setInputs(prev => ({
            ...prev,
            reportTitle: `${simState.projectInfo.projectName || 'Project'} - Strategy Blueprint`
        }));
    }
    
    // Load saved report if available
    const savedReports = JSON.parse(localStorage.getItem('academyPro_reports') || '{}');
    if (savedReports.finalReport) {
        setReportData(savedReports.finalReport);
    }
  }, []);

  const handleGenerate = async () => {
      setIsGenerating(true);
      setVersion('DRAFT');
      
      const fullContext = JSON.parse(localStorage.getItem('pdx_simulator_state') || '{}');
      // Augment with ALL deep module data to give AI full context
      fullContext.academyPro_reports = JSON.parse(localStorage.getItem('academyPro_reports') || '{}');
      fullContext.academyPro_distribution = JSON.parse(localStorage.getItem('academyPro_distribution') || '{}');
      fullContext.academyPro_financial = JSON.parse(localStorage.getItem('academyPro_financial') || '{}');
      fullContext.academyPro_tokenomics = JSON.parse(localStorage.getItem('academyPro_tokenomics') || '{}');
      fullContext.academyPro_compliance = JSON.parse(localStorage.getItem('academyPro_compliance') || '{}');
      fullContext.academyPro_spvModule = JSON.parse(localStorage.getItem('academyPro_spvModule') || '{}');
      
      // Pass this augmented context to the service
      const result = await generateFinalReport(fullContext, inputs);
      setReportData(result);
      
      // Auto-save to local storage
      const currentReports = JSON.parse(localStorage.getItem('academyPro_reports') || '{}');
      currentReports.finalReport = result;
      localStorage.setItem('academyPro_reports', JSON.stringify(currentReports));
      
      setIsGenerating(false);
  };

  const handleHarmonize = async () => {
      if (!reportData) return;
      setIsHarmonizing(true);
      
      const harmonized = await harmonizeReportTone(reportData, projectInfo);
      
      // Update report data with harmonized sections
      const updatedReport = {
          ...reportData,
          finalReport: {
              ...reportData.finalReport,
              sections: harmonized.harmonizedSections
          }
      };
      
      setReportData(updatedReport);
      setVersion('HARMONIZED');
      setIsHarmonizing(false);
  };

  const handleSaveAndExport = () => {
      if (!reportData) return;
      setIsSaving(true);
      
      // 1. Save State
      const currentReports = JSON.parse(localStorage.getItem('academyPro_reports') || '{}');
      currentReports.finalReport = reportData;
      localStorage.setItem('academyPro_reports', JSON.stringify(currentReports));
      
      // 2. Generate High-Fidelity Brochure
      try {
          AcademyPdfService.generateFinalMasterReport(reportData, projectInfo, version === 'DRAFT');
      } catch (e) {
          console.error("PDF Generation failed", e);
          alert("Failed to generate PDF. See console.");
      }
      
      setTimeout(() => {
          setIsSaving(false);
      }, 1000);
  };

  const handleSectionEdit = (newContent: string) => {
      if (!reportData) return;
      const newSections = [...reportData.finalReport.sections];
      newSections[activeSectionIndex].content = newContent;
      setReportData({
          ...reportData,
          finalReport: {
              ...reportData.finalReport,
              sections: newSections
          }
      });
  };

  const sections = reportData?.finalReport?.sections || [];
  const currentSection = sections[activeSectionIndex];

  return (
    <div className="flex flex-col h-full bg-slate-50 rounded-xl overflow-hidden border border-slate-200">
        
        {/* HEADER CONFIG */}
        <div className="bg-white border-b border-slate-200 px-6 py-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shrink-0">
            <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-600 rounded-lg text-white">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                </div>
                <div>
                    <h3 className="font-bold text-slate-900 text-lg">Report Compiler</h3>
                    <p className="text-slate-500 text-xs">Merge all modules into a decision-grade document.</p>
                </div>
            </div>

            <div className="flex gap-2 w-full md:w-auto items-center">
                 {/* Version Control */}
                 {reportData && (
                     <div className="flex items-center bg-slate-100 rounded-lg p-1 mr-2">
                         <button 
                            onClick={() => setVersion('DRAFT')}
                            className={`px-3 py-1 rounded text-xs font-bold transition-all ${version === 'DRAFT' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500'}`}
                         >
                             Draft
                         </button>
                         <button 
                            onClick={() => setVersion('HARMONIZED')}
                            disabled={isHarmonizing}
                            className={`px-3 py-1 rounded text-xs font-bold transition-all ${version === 'HARMONIZED' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-500'}`}
                         >
                             Advisory Mode
                         </button>
                     </div>
                 )}

                 <Button onClick={handleGenerate} isLoading={isGenerating} variant="secondary" className="bg-white border border-slate-300 text-slate-700">
                    {reportData ? 'Recompile' : 'Compile Draft'}
                 </Button>
                 
                 {reportData && (
                     <Button onClick={handleHarmonize} isLoading={isHarmonizing} className="bg-indigo-600 text-white shadow-lg">
                        {isHarmonizing ? 'Polishing...' : '✨ Harmonize Tone'}
                     </Button>
                 )}
            </div>
        </div>

        {/* WORKSPACE */}
        <div className="flex-1 flex overflow-hidden">
            
            {/* LEFT SIDEBAR: Structure & QC */}
            <div className="w-80 bg-slate-50 border-r border-slate-200 overflow-y-auto p-4 hidden lg:flex flex-col gap-6">
                
                {/* 1. Structure */}
                <div>
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Table of Contents</h4>
                    {!reportData ? (
                         <div className="p-4 border-2 border-dashed border-slate-200 rounded-lg text-center text-slate-400 text-xs">
                             Compile to view structure.
                         </div>
                    ) : (
                        <div className="space-y-1">
                            {sections.map((sec, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setActiveSectionIndex(idx)}
                                    className={`
                                        w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center justify-between
                                        ${activeSectionIndex === idx 
                                            ? 'bg-white text-emerald-600 shadow-sm border border-slate-200' 
                                            : 'text-slate-500 hover:bg-slate-100'
                                        }
                                    `}
                                >
                                    <span className="truncate">{sec.title}</span>
                                    {activeSectionIndex === idx && <span className="text-emerald-500 text-[10px]">●</span>}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* 2. Readiness & Actions */}
                {reportData && (
                    <div className="animate-slideUp space-y-6">
                        
                        {/* Score */}
                        <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 text-center">
                            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Readiness Score</h4>
                            <div className={`text-3xl font-display font-bold ${reportData.readiness?.score >= 80 ? 'text-emerald-400' : 'text-amber-400'}`}>
                                {reportData.readiness?.score}/100
                            </div>
                            <div className="text-[10px] text-slate-500 uppercase">{reportData.readiness?.verdict}</div>
                        </div>

                        {/* QC */}
                        <div>
                            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Quality Control</h4>
                            <div className="space-y-3">
                                {reportData.qualityControl.inconsistencies.length > 0 ? (
                                    <div className="bg-red-50 border border-red-100 p-3 rounded-lg">
                                        <div className="flex items-center gap-2 mb-2 text-red-700 font-bold text-xs">
                                            <span>⚠️</span> Inconsistencies
                                        </div>
                                        <ul className="space-y-1">
                                            {reportData.qualityControl.inconsistencies.map((err, i) => (
                                                <li key={i} className="text-[10px] text-red-600 leading-tight">• {err}</li>
                                            ))}
                                        </ul>
                                    </div>
                                ) : (
                                    <div className="bg-emerald-50 border border-emerald-100 p-3 rounded-lg flex items-center gap-2 text-emerald-700 text-xs font-bold">
                                        <span>✓</span> No Data Conflicts
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

            </div>

            {/* RIGHT: Document Preview / Editor */}
            <div className="flex-1 bg-white p-8 overflow-y-auto custom-scrollbar relative flex flex-col items-center">
                {!reportData ? (
                    <div className="text-center max-w-md mt-20">
                        <div className="text-6xl mb-4 opacity-20 grayscale">🗂️</div>
                        <h3 className="text-xl font-bold text-slate-900 mb-2">Final Assembly</h3>
                        <p className="text-slate-500 text-sm mb-8">
                            This tool aggregates your Strategy, Tokenomics, Legal Structure, and Execution Plan into a single "Investment Memorandum" format.
                        </p>
                        <Button onClick={handleGenerate} className="bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg">
                            Start Compilation
                        </Button>
                    </div>
                ) : currentSection ? (
                    <div className="w-full max-w-4xl h-full flex flex-col">
                        <div className="flex justify-between items-end mb-6 pb-4 border-b border-slate-100">
                             <div>
                                 <div className="flex items-center gap-2 mb-1">
                                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                                        Section {activeSectionIndex + 1}
                                    </span>
                                    {version === 'HARMONIZED' && (
                                        <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-500 bg-indigo-50 px-2 py-0.5 rounded">
                                            Advisory Tone Active
                                        </span>
                                    )}
                                 </div>
                                 <h2 className="text-2xl font-bold text-slate-900 font-display">{currentSection.title}</h2>
                             </div>
                        </div>

                        <textarea 
                            value={currentSection.content}
                            onChange={(e) => handleSectionEdit(e.target.value)}
                            className="flex-1 w-full resize-none outline-none text-slate-700 font-serif text-lg leading-relaxed placeholder:text-slate-300 h-full pb-20 focus:bg-slate-50 transition-colors p-4 rounded-xl"
                        />
                    </div>
                ) : (
                    <div className="flex items-center justify-center h-full text-slate-400">Select a section to edit.</div>
                )}
            </div>

        </div>

        {/* FOOTER */}
        {reportData && (
            <div className="bg-white border-t border-slate-200 px-6 py-4 flex justify-between items-center shrink-0">
                <div className="text-xs text-slate-400">
                    {version === 'DRAFT' ? 'Working Draft' : 'Final Version'} • Auto-saved
                </div>
                <div className="flex gap-3">
                    <Button onClick={handleSaveAndExport} isLoading={isSaving} className="bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg px-8">
                        {isSaving ? 'Printing...' : 'Download High-Fidelity PDF'}
                    </Button>
                </div>
            </div>
        )}

    </div>
  );
};
