
import React, { useState } from 'react';
import { Button } from '../../../../ui/Button';
import { generateDistributionPdfContent } from '../../../../../services/mockAiService';
import { AcademyPdfService } from '../../../../../services/academyPdfService';

export const DistributionExportTab: React.FC = () => {
    const [isGenerating, setIsGenerating] = useState(false);
    const [isDownloading, setIsDownloading] = useState(false);
    const [aiContent, setAiContent] = useState<any>(null);

    const gatherData = () => {
        return JSON.parse(localStorage.getItem('academyPro_distribution') || '{}');
    };

    const handleGenerate = async () => {
        setIsGenerating(true);
        const data = gatherData();
        const content = await generateDistributionPdfContent(data);
        setAiContent(content);
        setIsGenerating(false);
    };

    const handleDownload = () => {
        setIsDownloading(true);
        const data = gatherData();
        AcademyPdfService.generateDistributionBlueprintPDF(data, aiContent);
        setIsDownloading(false);
    };

    return (
        <div className="space-y-8 animate-fadeIn text-center max-w-4xl mx-auto">
            <div className="bg-slate-900 p-10 rounded-3xl border border-slate-800 shadow-2xl relative overflow-hidden">
                <div className="relative z-10">
                    <h2 className="text-3xl font-bold text-white font-display mb-4">Go-To-Market Blueprint</h2>
                    <p className="text-slate-400 text-lg mb-8 max-w-2xl mx-auto">
                        Your complete distribution strategy. Consolidates investor targeting, legal compliance, and financial forecasts.
                    </p>

                    {!aiContent ? (
                        <Button onClick={handleGenerate} isLoading={isGenerating} className="bg-gradient-to-r from-teal-600 to-emerald-600 text-white px-10 py-4 text-lg shadow-lg">
                            {isGenerating ? 'Architecting Blueprint...' : '✨ Generate GTM Blueprint'}
                        </Button>
                    ) : (
                        <div className="animate-slideUp space-y-6">
                            <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700 text-left">
                                <h4 className="text-sm font-bold text-teal-400 uppercase tracking-widest mb-2">Executive Summary</h4>
                                <p className="text-slate-300 italic text-sm">"{aiContent.executiveSummary}"</p>
                            </div>
                            <Button onClick={handleDownload} isLoading={isDownloading} className="bg-teal-600 hover:bg-teal-500 text-white px-10 py-4 text-lg shadow-lg w-full">
                                📥 Download GTM PDF
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
