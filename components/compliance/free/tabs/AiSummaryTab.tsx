
import React, { useState } from 'react';
import { Button } from '../../../../components/ui/Button';
import { ComplianceData } from '../../../../types';
import { generateComplianceSummary } from '../../../../services/mockAiService';

interface Props {
  compliance: ComplianceData;
  onNext: () => void;
}

export const AiSummaryTab: React.FC<Props> = ({ compliance, onNext }) => {
  const [summary, setSummary] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
      setIsGenerating(true);
      const result = await generateComplianceSummary(compliance);
      setSummary(result);
      setIsGenerating(false);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
        
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden">
            {/* Header */}
            <div className="bg-slate-900 p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
                
                <div className="relative z-10 flex items-center gap-4">
                    <div className="w-16 h-16 bg-indigo-500/20 text-indigo-300 rounded-2xl flex items-center justify-center text-3xl border border-indigo-500/30 shadow-inner">
                        🤖
                    </div>
                    <div>
                        <h3 className="font-bold text-white text-xl font-display">AI Compliance Officer</h3>
                        <p className="text-slate-400 text-sm mt-1 max-w-md">
                            Get a simplified breakdown of your regulatory obligations based on your current configuration.
                        </p>
                    </div>
                </div>

                <div className="relative z-10">
                    <Button 
                        onClick={handleGenerate} 
                        isLoading={isGenerating}
                        className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 shadow-lg shadow-indigo-900/20 font-bold uppercase text-xs tracking-wider"
                    >
                        {isGenerating ? 'Analyzing Rules...' : '✨ Generate Report'}
                    </Button>
                </div>
            </div>

            {/* Body */}
            <div className="p-8 min-h-[300px] bg-slate-50/50">
                {summary ? (
                    <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm animate-slideUp">
                        <div className="prose prose-slate prose-sm md:prose-base max-w-none">
                            <div className="whitespace-pre-wrap leading-relaxed text-slate-700 font-medium">
                                {summary}
                            </div>
                        </div>
                        <div className="mt-8 pt-6 border-t border-slate-100 flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
                            <span>✓ AI Verified</span>
                            <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                            <span>{new Date().toLocaleDateString()}</span>
                        </div>
                    </div>
                ) : (
                    <div className="h-full flex flex-col items-center justify-center text-center py-12 border-2 border-dashed border-slate-300 rounded-2xl">
                        <div className="text-6xl mb-4 opacity-20 grayscale">📋</div>
                        <h4 className="text-slate-900 font-bold text-lg mb-2">Ready for Analysis</h4>
                        <p className="text-slate-500 max-w-xs mx-auto text-sm">
                            Click the generate button above to create your custom compliance summary.
                        </p>
                    </div>
                )}
            </div>
        </div>

        <div className="flex justify-end pt-4">
             <Button 
                onClick={onNext}
                className="bg-slate-900 hover:bg-slate-800 text-white px-10 py-4 shadow-xl font-bold rounded-xl flex items-center gap-2"
            >
                Save & Next: Knowledge →
            </Button>
        </div>
    </div>
  );
};
