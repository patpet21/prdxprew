
import React, { useState, useEffect } from 'react';
import { Button } from '../../../../ui/Button';
import { generatePayoutFinalReview } from '../../../../../services/mockAiService';

export const AiFinanceInsights: React.FC = () => {
  const [analysis, setAnalysis] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const gatherData = () => {
      return JSON.parse(localStorage.getItem('academyPro_payout') || '{}');
  };

  const handleAnalyze = async () => {
      setLoading(true);
      const data = gatherData();
      const res = await generatePayoutFinalReview(data);
      setAnalysis(res);
      
      const current = JSON.parse(localStorage.getItem('academyPro_payout') || '{}');
      current.pdfContent = res; 
      localStorage.setItem('academyPro_payout', JSON.stringify(current));
      setLoading(false);
  };

  return (
    <div className="h-full flex flex-col justify-center items-center text-center max-w-4xl mx-auto animate-fadeIn">
        
        {/* Hero Section */}
        <div className="mb-12">
            <h2 className="text-4xl md:text-5xl font-bold font-display text-slate-900 mb-6">Institutional Verdict</h2>
            <p className="text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed">
                Our AI Strategist reviews your entire Payout & Treasury configuration against institutional standards to provide a final readiness score.
            </p>
        </div>

        {!analysis ? (
            <div className="mt-8">
                <Button 
                    onClick={handleAnalyze} 
                    isLoading={loading} 
                    className="px-12 py-5 text-xl bg-indigo-600 hover:bg-indigo-500 text-white shadow-2xl shadow-indigo-500/30 rounded-2xl transform hover:scale-105 transition-all"
                >
                    {loading ? 'Analyzing 40+ Data Points...' : '⚡ Run Final Review'}
                </Button>
            </div>
        ) : (
            <div className="w-full animate-slideUp space-y-12">
                
                {/* Score Big Display */}
                <div className="flex flex-col items-center">
                     <span className="text-sm font-bold text-slate-400 uppercase tracking-[0.3em] mb-2">Investment Readiness</span>
                     <div className="text-9xl font-display font-bold text-slate-900">{analysis.investmentReadinessScore}</div>
                     <div className="h-2 w-64 bg-slate-200 rounded-full mt-4 overflow-hidden">
                         <div className="h-full bg-emerald-500 transition-all duration-1000" style={{ width: `${analysis.investmentReadinessScore}%` }}></div>
                     </div>
                </div>

                {/* Executive Summary */}
                <div className="bg-white p-10 rounded-3xl border border-slate-200 shadow-xl text-left">
                    <h4 className="text-xl font-bold text-indigo-900 mb-6 flex items-center gap-3">
                        <span className="text-3xl">🎙️</span> Executive Summary
                    </h4>
                    <p className="text-xl text-slate-700 leading-loose font-serif italic border-l-4 border-indigo-500 pl-8">
                        "{analysis.finalReview}"
                    </p>
                </div>

                {/* SWOT Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
                    <div className="bg-emerald-50 border border-emerald-100 p-8 rounded-3xl">
                        <h5 className="text-sm font-bold text-emerald-700 uppercase mb-6 flex items-center gap-2">
                            <span className="text-xl">💪</span> Strengths
                        </h5>
                        <ul className="space-y-4">
                            {(analysis.strengths || []).map((s: string, i: number) => (
                                <li key={i} className="text-lg text-emerald-900 flex gap-3 font-medium">
                                    <span className="text-emerald-500">✓</span> {s}
                                </li>
                            ))}
                        </ul>
                    </div>
                    
                    <div className="bg-red-50 border border-red-100 p-8 rounded-3xl">
                        <h5 className="text-sm font-bold text-red-700 uppercase mb-6 flex items-center gap-2">
                            <span className="text-xl">📉</span> Weaknesses
                        </h5>
                        <ul className="space-y-4">
                            {(analysis.weaknesses || []).map((w: string, i: number) => (
                                <li key={i} className="text-lg text-red-900 flex gap-3 font-medium">
                                    <span className="text-red-500">!</span> {w}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
                
                {/* Recommendations */}
                <div className="bg-slate-900 text-white p-10 rounded-3xl border border-slate-800 text-left">
                    <h4 className="text-2xl font-bold mb-8">Strategic Recommendations</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {(analysis.providerRecommendations || []).map((rec: string, i: number) => (
                            <div key={i} className="flex items-center gap-4 p-4 bg-slate-950 rounded-2xl border border-slate-800">
                                <div className="w-10 h-10 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-sm">
                                    {i+1}
                                </div>
                                <span className="text-slate-300 text-lg">{rec}</span>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        )}
    </div>
  );
};
