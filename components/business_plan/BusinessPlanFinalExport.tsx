
import React, { useState } from 'react';
import { FreeBusinessPlan } from '../../types';
import { Button } from '../ui/Button';
import { downloadPDF } from '../../utils/pdfGenerator';
import { SECTIONS_CONFIG } from '../../content/business_plan/sections_config';

interface Props {
  planData: FreeBusinessPlan;
}

export const BusinessPlanFinalExport: React.FC<Props> = ({ planData }) => {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = () => {
      setIsExporting(true);
      setTimeout(() => {
          // Prepare clean data object for PDF
          const exportData: Record<string, string> = {};
          
          Object.keys(SECTIONS_CONFIG).forEach(key => {
              const config = SECTIONS_CONFIG[key];
              exportData[config.title] = planData[key] || "Section not completed.";
          });

          downloadPDF("PropertyDEX_Master_Plan", exportData);
          setIsExporting(false);
      }, 1500);
  };

  const sectionsCount = Object.keys(planData).filter(k => !!planData[k]).length;
  const totalSections = Object.keys(SECTIONS_CONFIG).length;
  const progress = Math.min(100, Math.round((sectionsCount / totalSections) * 100));

  return (
    <div className="h-full flex flex-col bg-slate-100 overflow-hidden">
        
        {/* HEADER TOOLBAR */}
        <div className="bg-white border-b border-slate-200 px-8 py-4 flex justify-between items-center shrink-0 shadow-sm z-10">
            <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center text-white text-xl shadow-lg shadow-indigo-500/30">
                    📑
                </div>
                <div>
                    <h2 className="text-xl font-bold text-slate-900 font-display">Master Plan Preview</h2>
                    <p className="text-xs text-slate-500">Ready for Export</p>
                </div>
            </div>
            <div className="flex items-center gap-4">
                 <div className="text-right mr-4 hidden md:block">
                     <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Completeness</span>
                     <span className="text-indigo-600 font-bold">{progress}%</span>
                 </div>
                 <Button 
                    onClick={handleExport} 
                    isLoading={isExporting}
                    className="bg-indigo-600 hover:bg-indigo-500 text-white shadow-xl px-8 py-3 font-bold"
                >
                    {isExporting ? 'Compiling PDF...' : '📥 Download PDF Report'}
                </Button>
            </div>
        </div>

        {/* DOCUMENT PREVIEW SCROLL AREA */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-8 md:p-12 flex justify-center bg-slate-100">
            <div className="w-full max-w-4xl bg-white shadow-2xl min-h-[1000px] p-12 md:p-20 relative">
                
                {/* Visual Watermark */}
                <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
                    <img src="https://i.ibb.co/5g7gFLQz/Logo-PRDX.jpg" className="w-32" alt="Watermark" />
                </div>

                {/* Cover Page */}
                <div className="mb-24 text-center border-b-2 border-slate-900 pb-12">
                    <h1 className="text-5xl md:text-6xl font-black text-slate-900 font-display mb-6 tracking-tight">
                        INVESTMENT<br/>MEMORANDUM
                    </h1>
                    <p className="text-xl text-slate-500 font-light italic">
                        {planData.projectIdentification ? planData.projectIdentification.split('\n')[0] : "Project Name Not Set"}
                    </p>
                    <div className="mt-12 inline-block px-4 py-2 border border-slate-300 rounded text-xs font-bold uppercase tracking-widest text-slate-400">
                        Confidential
                    </div>
                </div>

                {/* Content Sections */}
                <div className="space-y-16">
                    {Object.keys(SECTIONS_CONFIG).map((key) => {
                        const config = SECTIONS_CONFIG[key];
                        const content = planData[key];
                        
                        if (!content) return null;

                        return (
                            <section key={key} className="break-inside-avoid">
                                <h3 className="text-2xl font-bold text-slate-900 mb-4 border-l-4 border-indigo-500 pl-4 uppercase tracking-wide font-display">
                                    {config.title}
                                </h3>
                                <div className="prose prose-slate max-w-none text-slate-700 leading-loose font-serif">
                                    <div className="whitespace-pre-wrap">{content}</div>
                                </div>
                            </section>
                        );
                    })}
                </div>
                
                {/* Footer */}
                <div className="mt-32 pt-8 border-t border-slate-100 text-center text-xs text-slate-300 font-mono uppercase">
                    Generated by PropertyDEX Simulator • {new Date().toLocaleDateString()}
                </div>

            </div>
        </div>

    </div>
  );
};
