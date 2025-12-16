
import React, { useState } from 'react';
import { TokenizationState } from '../../types';
import { Button } from '../ui/Button';
import { generateFullBusinessPlan } from '../../services/mockAiService';
import { downloadPDF } from '../../utils/pdfGenerator';

interface Props {
  data: TokenizationState;
}

export const AiPlanGeneratorTab: React.FC<Props> = ({ data }) => {
  const [generatedPlan, setGeneratedPlan] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
        const text = await generateFullBusinessPlan(data);
        setGeneratedPlan(text);
    } catch (error) {
        console.error("Plan generation failed", error);
    } finally {
        setIsGenerating(false);
    }
  };

  const handleDownload = () => {
      if (!generatedPlan) return;
      // We wrap the raw text in a simple object for the PDF generator
      const pdfData = {
          Content: generatedPlan
      };
      downloadPDF(`${data.projectInfo.projectName}_AI_Business_Plan`, pdfData);
  };

  return (
    <div className="animate-fadeIn space-y-8 pb-12 h-full flex flex-col">
        <div className="text-center max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-slate-900 font-display mb-2">AI Business Plan Writer</h3>
            <p className="text-slate-500">
                Generate a narrative, institutional-grade business plan using our AI. 
                <br/><span className="text-xs font-bold text-emerald-600 uppercase bg-emerald-50 px-2 py-0.5 rounded">Free Access</span>
            </p>
        </div>

        <div className="flex-1 bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col overflow-hidden min-h-[500px]">
            {generatedPlan ? (
                <div className="flex-1 flex flex-col">
                    <div className="bg-slate-50 border-b border-slate-200 p-4 flex justify-between items-center">
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">AI Draft Preview</span>
                        <div className="flex gap-2">
                            <button onClick={() => setGeneratedPlan('')} className="text-xs text-slate-500 hover:text-slate-800 font-bold px-3 py-1.5">
                                Clear
                            </button>
                            <button onClick={handleDownload} className="text-xs bg-slate-900 text-white hover:bg-slate-800 font-bold px-4 py-1.5 rounded-lg flex items-center gap-2">
                                <span>📥</span> Download PDF
                            </button>
                        </div>
                    </div>
                    <div className="flex-1 p-8 overflow-y-auto custom-scrollbar bg-white">
                        <div className="prose prose-slate max-w-none">
                            <div className="whitespace-pre-wrap font-serif text-lg leading-relaxed text-slate-800">
                                {generatedPlan}
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="flex-1 flex flex-col items-center justify-center p-12 text-center bg-slate-50/50">
                    <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center text-4xl mb-6 shadow-sm text-indigo-600">
                        ✍️
                    </div>
                    <h4 className="text-xl font-bold text-slate-900 mb-2">Ready to Write</h4>
                    <p className="text-slate-500 max-w-md mb-8">
                        The AI will analyze your asset, jurisdiction, and tokenomics to write a complete Executive Summary and Strategic Plan.
                    </p>
                    <Button 
                        onClick={handleGenerate} 
                        isLoading={isGenerating}
                        className="bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-4 text-lg shadow-xl shadow-indigo-200"
                    >
                        {isGenerating ? 'AI Writing Plan...' : 'Generate Full Plan'}
                    </Button>
                </div>
            )}
        </div>
    </div>
  );
};
