
import React, { useMemo } from 'react';
import { TokenizationState } from '../../types';
import { Button } from '../ui/Button';

interface Props {
  data: TokenizationState;
}

const ScoreBar = ({ label, score, color }: { label: string, score: number, color: string }) => (
    <div className="mb-6">
        <div className="flex justify-between items-end mb-2">
            <span className="text-sm font-bold text-slate-400 uppercase tracking-wider">{label}</span>
            <span className={`text-lg font-bold ${color}`}>{score}/100</span>
        </div>
        <div className="w-full bg-slate-800 h-3 rounded-full overflow-hidden shadow-inner">
            <div className={`h-full ${color.replace('text-', 'bg-')} transition-all duration-1000 ease-out`} style={{ width: `${score}%` }}></div>
        </div>
    </div>
);

const MetricBadge = ({ label, value, color }: { label: string, value: string, color: string }) => (
    <div className="flex flex-col items-center p-4 bg-slate-800/50 rounded-2xl border border-slate-700/50">
        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">{label}</span>
        <span className={`text-xl font-display font-bold ${color}`}>{value}</span>
    </div>
);

export const FeasibilityScoreTab: React.FC<Props> = ({ data }) => {
  
  // "AI Lite" Logic - Heuristic scoring based on inputs
  const scores = useMemo(() => {
      let feasibility = 72; // Base
      let marketFit = "Strong";
      let complexity = "Medium";
      let robustness = "Good";

      // Adjust based on data
      if (data.property.annual_yield > 12) feasibility -= 10; // Suspiciously high yield
      if (data.compliance.regFramework !== 'None') feasibility += 10; // Regulated is better
      if (data.jurisdiction.country === 'US' && data.distribution.targetInvestorType === 'Retail') complexity = "High";
      if (data.property.token_price > 0 && data.property.token_price <= 1000) robustness = "High";

      return { feasibility, marketFit, complexity, robustness };
  }, [data]);

  return (
    <div className="animate-slideUp space-y-12">
        
        {/* Main Score Card */}
        <div className="bg-slate-900 rounded-3xl p-8 md:p-12 border border-slate-800 shadow-2xl relative overflow-hidden text-white">
            <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
                <div>
                    <div className="inline-block px-3 py-1 rounded bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-xs font-bold uppercase tracking-widest mb-4">
                        Lite Assessment
                    </div>
                    <h3 className="text-4xl font-bold font-display mb-2">Feasibility Report</h3>
                    <p className="text-slate-400 text-lg mb-8">Based on the simulation parameters provided.</p>

                    <div className="grid grid-cols-2 gap-4">
                        <MetricBadge label="Market Fit" value={scores.marketFit} color="text-emerald-400" />
                        <MetricBadge label="Complexity" value={scores.complexity} color="text-amber-400" />
                        <MetricBadge label="Token Design" value={scores.robustness} color="text-blue-400" />
                        <MetricBadge label="Attractiveness" value="High" color="text-purple-400" />
                    </div>
                </div>

                <div className="bg-slate-950/50 p-8 rounded-2xl border border-slate-800">
                    <div className="text-center mb-8">
                        <div className="text-6xl font-display font-bold text-white mb-2">{scores.feasibility}%</div>
                        <div className="text-sm text-slate-500 font-bold uppercase tracking-widest">Overall Feasibility Score (Demo)</div>
                    </div>
                    
                    <ScoreBar label="Regulatory Safety" score={scores.complexity === 'High' ? 40 : 85} color="text-blue-500" />
                    <ScoreBar label="Financial Viability" score={data.property.annual_yield > 0 ? 90 : 50} color="text-emerald-500" />
                    <ScoreBar label="Execution Readiness" score={65} color="text-amber-500" />
                </div>
            </div>
        </div>

        {/* PRO UPSELL SECTION */}
        <div className="relative rounded-3xl overflow-hidden border-2 border-amber-500/30 shadow-2xl group">
            
            {/* Background Content (Blurred) */}
            <div className="absolute inset-0 bg-slate-900 filter blur-sm scale-105 z-0">
                <div className="p-10 grid grid-cols-3 gap-8 opacity-30">
                     <div className="h-40 bg-slate-800 rounded-xl"></div>
                     <div className="h-40 bg-slate-800 rounded-xl"></div>
                     <div className="h-40 bg-slate-800 rounded-xl"></div>
                     <div className="h-40 bg-slate-800 rounded-xl"></div>
                     <div className="h-40 bg-slate-800 rounded-xl"></div>
                     <div className="h-40 bg-slate-800 rounded-xl"></div>
                </div>
            </div>

            {/* Overlay Content */}
            <div className="relative z-10 py-20 px-6 text-center bg-gradient-to-b from-slate-900/90 to-slate-950/95">
                <div className="w-20 h-20 bg-gradient-to-br from-amber-400 to-orange-600 rounded-2xl flex items-center justify-center text-4xl mx-auto mb-8 shadow-lg shadow-amber-500/20 animate-bounce">
                    🔒
                </div>
                <h2 className="text-3xl md:text-5xl font-bold text-white font-display mb-6">
                    Unlock the Full <span className="text-amber-400">32-Factor</span> Analysis
                </h2>
                <p className="text-slate-300 text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
                    The Free Simulator gives you a taste. The <strong>PRO Version</strong> gives you the blueprint.
                    <br/>
                    Get personalized recommendations on Tax Efficiency, Banking Partners, and Specific Legal Clauses.
                </p>
                
                <Button className="px-12 py-5 text-xl font-bold bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-slate-900 shadow-xl shadow-amber-900/30 rounded-xl transform hover:-translate-y-1 transition-all">
                    Upgrade to PRO & Unlock Report
                </Button>
                
                <p className="text-xs text-slate-500 mt-6 uppercase tracking-widest font-bold">
                    Included: Free 30min Strategy Call with an Expert
                </p>
            </div>
        </div>

    </div>
  );
};
