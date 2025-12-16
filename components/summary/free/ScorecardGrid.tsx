import React from 'react';

export const ScorecardGrid: React.FC = () => {
  // Mock scores for simulation
  const scores = [
      { label: "Deal Feasibility", score: 85, color: "text-emerald-500", bar: "bg-emerald-500" },
      { label: "Investor Readiness", score: 72, color: "text-blue-500", bar: "bg-blue-500" },
      { label: "Compliance Fit", score: 90, color: "text-indigo-500", bar: "bg-indigo-500" },
      { label: "Tokenomics Strength", score: 65, color: "text-amber-500", bar: "bg-amber-500" },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {scores.map((s, i) => (
            <div key={i} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between h-28">
                <div className="flex justify-between items-start">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider max-w-[70px] leading-tight">{s.label}</span>
                    <span className={`text-2xl font-display font-bold ${s.color}`}>{s.score}</span>
                </div>
                
                <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                    <div className={`h-full ${s.bar}`} style={{ width: `${s.score}%` }}></div>
                </div>
            </div>
        ))}
    </div>
  );
};