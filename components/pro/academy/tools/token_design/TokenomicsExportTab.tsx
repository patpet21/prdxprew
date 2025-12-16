
import React, { useState } from 'react';
import { Button } from '../../../../ui/Button';
import { generateTokenomicsPdfContent } from '../../../../../services/mockAiService';
import { AcademyPdfService } from '../../../../../services/academyPdfService';

export const TokenomicsExportTab: React.FC = () => {
    const [isGenerating, setIsGenerating] = useState(false);
    const [isDownloading, setIsDownloading] = useState(false);
    const [aiContent, setAiContent] = useState<any>(null);

    const gatherData = () => {
        return JSON.parse(localStorage.getItem('academyPro_tokenomics') || '{}');
    };

    const handleGenerate = async () => {
        setIsGenerating(true);
        const data = gatherData();
        
        // Validate minimal data (model and supply are key)
        if (!data.model || !data.supply) {
            alert("Incomplete data. Please complete the Model and Supply tabs first.");
            setIsGenerating(false);
            return;
        }

        const content = await generateTokenomicsPdfContent(data);
        setAiContent(content);
        setIsGenerating(false);
    };

    const handleDownload = () => {
        setIsDownloading(true);
        const data = gatherData();
        AcademyPdfService.generateTokenomicsBlueprintPDF(data, aiContent);
        setIsDownloading(false);
    };

    return (
        <div className="space-y-8 animate-fadeIn text-center max-w-4xl mx-auto">
            <div className="bg-slate-900 p-10 rounded-3xl border border-slate-800 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
                
                <div className="relative z-10">
                    <h2 className="text-3xl font-bold text-white font-display mb-4">Enterprise Tokenomics Blueprint</h2>
                    <p className="text-slate-400 text-lg mb-8 max-w-2xl mx-auto">
                        Consolidate your entire economic model into an institutional-grade PDF. 
                        Includes Executive Summary, Rights Matrix, Vesting Schedules, and Risk Audit.
                    </p>

                    {!aiContent ? (
                        <Button 
                            onClick={handleGenerate} 
                            isLoading={isGenerating}
                            className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white px-10 py-4 text-lg shadow-lg"
                        >
                            {isGenerating ? 'Architecting Blueprint...' : '✨ Generate Blueprint Content'}
                        </Button>
                    ) : (
                        <div className="animate-slideUp space-y-6">
                            <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700 text-left">
                                <h4 className="text-sm font-bold text-purple-400 uppercase tracking-widest mb-2">Executive Summary Preview</h4>
                                <p className="text-slate-300 italic text-sm leading-relaxed">"{aiContent.executiveSummary}"</p>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4 text-left">
                                 <div className="p-4 bg-slate-950 rounded-lg border border-slate-800">
                                     <span className="text-xs text-slate-500 uppercase block mb-1">Governance</span>
                                     <span className="text-sm text-white">{aiContent.governanceNarrative ? aiContent.governanceNarrative.substring(0, 80) + '...' : 'Pending...'}</span>
                                 </div>
                                 <div className="p-4 bg-slate-950 rounded-lg border border-slate-800">
                                     <span className="text-xs text-slate-500 uppercase block mb-1">Risk Score</span>
                                     <span className="text-lg font-bold text-emerald-400">{aiContent.riskAudit.score}/100</span>
                                 </div>
                            </div>

                            <Button 
                                onClick={handleDownload} 
                                isLoading={isDownloading}
                                className="bg-emerald-600 hover:bg-emerald-500 text-white px-10 py-4 text-lg shadow-lg w-full"
                            >
                                📥 Download Institutional PDF
                            </Button>
                        </div>
                    )}
                </div>
            </div>
            
            <div className="text-xs text-slate-500">
                Data Sources: Model, Supply, Rights, Vesting, Fairness Modules.
            </div>
        </div>
    );
};
