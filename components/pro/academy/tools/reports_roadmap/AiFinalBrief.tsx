
import React, { useState, useEffect } from 'react';
import { TokenizationState } from '../../../../types';
import { generateFinalBriefAnalysis } from '../../../../../services/mockAiService';
import { Button } from '../../../../ui/Button';
import { AcademyPdfService } from '../../../../../services/academyPdfService';

interface Props {
  data: TokenizationState;
}

export const AiFinalBrief: React.FC<Props> = ({ data }) => {
  const [analysis, setAnalysis] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  // Load saved analysis if available
  useEffect(() => {
    if (data.proReports?.finalBrief) {
        // Ideally we would load full structure if saved, but for now we'll re-generate or check local state logic
        // Assuming data.proReports.finalBrief stores the result object structure if we saved it there
        // If it's the simplified version from type definition, we might need to cast or just re-run.
        // For simulation, let's allow re-run.
    }
  }, [data]);

  const handleAnalyze = async () => {
      setIsAnalyzing(true);
      
      // Gather comprehensive data from localStorage for the prompt
      const financials = JSON.parse(localStorage.getItem('academyPro_financial') || '{}');
      const tokenomics = JSON.parse(localStorage.getItem('academyPro_tokenomics') || '{}');
      const compliance = JSON.parse(localStorage.getItem('academyPro_compliance') || '{}');
      const distribution = JSON.parse(localStorage.getItem('academyPro_distribution') || '{}');

      const aggregatedData = {
          project: data.projectInfo,
          jurisdiction: data.jurisdiction,
          financials,
          tokenomics,
          compliance,
          distribution
      };

      const result = await generateFinalBriefAnalysis(aggregatedData);
      setAnalysis(result);
      setIsAnalyzing(false);
  };

  const handleExport = () => {
    if (!analysis) return;
    setIsExporting(true);
    // In a real scenario, we might want a specific PDF for the brief, or add it to the full report
    // For now, let's simulate a download
    setTimeout(() => {
        const payload = {
            module: "Final Strategic Verdict",
            timestamp: new Date().toISOString(),
            content: analysis
        };
        const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = "Project_Verdict.json";
        a.click();
        setIsExporting(false);
    }, 1000);
  };

  const getScoreColor = (score: number) => {
      if (score >= 80) return 'text-emerald-400';
      if (score >= 60) return 'text-amber-400';
      return 'text-red-400';
  };

  return (
    <div className="space-y-8 animate-fadeIn">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-slate-900 p-8 rounded-3xl border border-slate-800 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none"></div>
            
            <div className="relative z-10 text-center md:text-left">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-slate-300 text-xs font-bold uppercase tracking-wider mb-4">
                    <span className="animate-pulse">●</span> Capstone Module
                </div>
                <h2 className="text-3xl font-bold text-white font-display mb-2">Final Investment Verdict</h2>
                <p className="text-slate-400 max-w-xl">
                    The AI Institutional Strategist will review your entire project file—from legal structure to token economics—and provide a definitive Go/No-Go assessment.
                </p>
            </div>

            <div className="relative z-10">
                {!analysis ? (
                    <Button 
                        onClick={handleAnalyze} 
                        isLoading={isAnalyzing}
                        className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-slate-900 font-bold px-10 py-4 text-lg shadow-xl shadow-amber-900/20 rounded-xl"
                    >
                        {isAnalyzing ? 'Analyzing 50+ Data Points...' : '⚡ Run Final Review'}
                    </Button>
                ) : (
                    <div className="flex flex-col items-center">
                        <div className={`text-6xl font-display font-bold ${getScoreColor(analysis.investmentReadinessScore)}`}>
                            {analysis.investmentReadinessScore}
                        </div>
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Readiness Score</span>
                    </div>
                )}
            </div>
        </div>

        {analysis && (
            <div className="animate-slideUp space-y-8">
                
                {/* Executive Summary */}
                <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
                    <h4 className="text-sm font-bold text-slate-900 uppercase tracking-widest mb-4 flex items-center gap-2">
                        <span className="text-2xl">🎙️</span> Institutional Review
                    </h4>
                    <p className="text-lg text-slate-700 leading-relaxed font-serif italic border-l-4 border-amber-500 pl-6">
                        "{analysis.finalReview}"
                    </p>
                </div>

                {/* SWOT Analysis */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-emerald-50 border border-emerald-100 p-6 rounded-2xl">
                        <h5 className="text-xs font-bold text-emerald-700 uppercase tracking-wider mb-4 flex items-center gap-2">
                            <span>💪</span> Key Strengths
                        </h5>
                        <ul className="space-y-3">
                            {(analysis.strengths || []).map((s: string, i: number) => (
                                <li key={i} className="flex items-start gap-3 text-sm text-emerald-900 font-medium">
                                    <span className="text-emerald-500 font-bold">✓</span> {s}
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="bg-red-50 border border-red-100 p-6 rounded-2xl">
                        <h5 className="text-xs font-bold text-red-700 uppercase tracking-wider mb-4 flex items-center gap-2">
                            <span>📉</span> Critical Weaknesses
                        </h5>
                        <ul className="space-y-3">
                            {(analysis.weaknesses || []).map((w: string, i: number) => (
                                <li key={i} className="flex items-start gap-3 text-sm text-red-900 font-medium">
                                    <span className="text-red-500 font-bold">!</span> {w}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Action Plan */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Providers */}
                    <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 text-white">
                        <h5 className="text-xs font-bold text-blue-400 uppercase tracking-wider mb-4">Partner Strategy</h5>
                        <ul className="space-y-2">
                            {(analysis.providerRecommendations || []).map((rec: string, i: number) => (
                                <li key={i} className="text-xs text-slate-300 flex items-start gap-2">
                                    <span className="text-blue-500">➜</span> {rec}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Compliance */}
                    <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 text-white">
                        <h5 className="text-xs font-bold text-purple-400 uppercase tracking-wider mb-4">Legal Upgrades</h5>
                        <ul className="space-y-2">
                            {(analysis.complianceImprovements || []).map((imp: string, i: number) => (
                                <li key={i} className="text-xs text-slate-300 flex items-start gap-2">
                                    <span className="text-purple-500">➜</span> {imp}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Warnings */}
                    <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 text-white">
                        <h5 className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-4">Deal Breakers</h5>
                        <ul className="space-y-2">
                            {(analysis.warnings || []).map((warn: string, i: number) => (
                                <li key={i} className="text-xs text-slate-300 flex items-start gap-2">
                                    <span className="text-amber-500">⚠️</span> {warn}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Final Actions */}
                <div className="flex flex-col sm:flex-row justify-center gap-4 pt-8 border-t border-slate-200">
                    <Button 
                        onClick={handleExport} 
                        isLoading={isExporting}
                        className="bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg px-8 py-3 font-bold rounded-xl"
                    >
                        Save Analysis & Export JSON
                    </Button>
                    <button className="px-8 py-3 bg-white border border-slate-300 text-slate-600 hover:text-slate-900 hover:border-slate-400 font-bold rounded-xl transition-all">
                        Consult an Expert
                    </button>
                </div>

            </div>
        )}

    </div>
  );
};
