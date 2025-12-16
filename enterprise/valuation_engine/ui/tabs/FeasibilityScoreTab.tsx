
import React from 'react';
import { FeasibilityReport } from '../../services/valuation_service';

interface Props {
  report?: FeasibilityReport;
}

export const FeasibilityScoreTab: React.FC<Props> = ({ report }) => {
  if (!report) return null;

  const getScoreColor = (score: number) => {
      if (score >= 80) return 'text-emerald-500';
      if (score >= 60) return 'text-amber-500';
      return 'text-red-500';
  };

  return (
    <div className="animate-slideUp bg-red-900/10 border border-red-500/30 rounded-2xl p-8">
        <h3 className="text-xl font-bold text-red-400 mb-6 flex items-center gap-2">
            <span className="text-2xl">🟥</span> Feasibility Score
        </h3>

        <div className="flex flex-col md:flex-row items-center gap-10">
            
            {/* Gauge */}
            <div className="relative w-40 h-40 flex items-center justify-center shrink-0">
                <svg className="w-full h-full transform -rotate-90">
                    <circle cx="80" cy="80" r="70" stroke="#334155" strokeWidth="10" fill="none" />
                    <circle cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="10" 
                        className={`${getScoreColor(report.score)} transition-all duration-1000 ease-out`}
                        strokeDasharray={440} 
                        strokeDashoffset={440 - (440 * report.score) / 100}
                        fill="none" 
                    />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-4xl font-bold text-white">{report.score}</span>
                    <span className={`text-xs font-bold uppercase ${getScoreColor(report.score)}`}>{report.riskLevel} Risk</span>
                </div>
            </div>

            <div className="flex-1 w-full">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <h4 className="text-xs font-bold text-emerald-400 uppercase mb-2">Strengths</h4>
                        <ul className="space-y-2">
                            {report.strengths.map((s, i) => (
                                <li key={i} className="text-sm text-slate-300 flex items-start gap-2">
                                    <span className="text-emerald-500 text-xs">✓</span> {s}
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-xs font-bold text-red-400 uppercase mb-2">Weaknesses</h4>
                        <ul className="space-y-2">
                            {report.weaknesses.map((w, i) => (
                                <li key={i} className="text-sm text-slate-300 flex items-start gap-2">
                                    <span className="text-red-500 text-xs">!</span> {w}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
                
                <div className="mt-6 pt-4 border-t border-red-500/20">
                    <span className="text-xs font-bold text-slate-400 uppercase mr-2">Verdict:</span>
                    <span className="text-white font-bold">{report.verdict}</span>
                </div>
            </div>

        </div>
    </div>
  );
};
