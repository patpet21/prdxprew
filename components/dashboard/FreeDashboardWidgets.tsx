
import React from 'react';
import { Button } from '../ui/Button';
import { Project } from '../../types';

// --- SEZIONE 6: Regulatory Roadmap (Mini) ---
export const RegulatoryTimelineCard: React.FC<{ onViewFull: () => void }> = ({ onViewFull }) => {
  // Keeping content but making container flexible height
  const steps = [
    { label: "SPV Setup", value: "Suggested: Delaware LLC", status: "success" },
    { label: "Token Standard", value: "ERC-3643 (Permissioned)", status: "success" },
    { label: "KYC/AML", value: "Provider required", status: "warning" },
  ];

  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm h-full flex flex-col justify-between">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-slate-900 text-sm">Regulatory Roadmap</h3>
        <span className="bg-slate-100 text-slate-500 text-[9px] px-2 py-0.5 rounded-full uppercase font-bold">
          Draft
        </span>
      </div>

      <div className="space-y-3">
        {steps.map((step, i) => (
          <div key={i} className="flex items-start gap-3">
            <div className={`mt-0.5 w-4 h-4 rounded-full flex items-center justify-center text-[9px] border ${
                step.status === 'success' ? 'bg-emerald-100 text-emerald-600 border-emerald-200' :
                'bg-amber-100 text-amber-600 border-amber-200'
            }`}>
                {step.status === 'success' ? '✓' : '!'}
            </div>
            <div>
                <p className="text-xs font-bold text-slate-700">{step.label}</p>
                <p className="text-[10px] text-slate-500">{step.value}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// --- SEZIONE 7: Financial Snapshot (Modified for Bento) ---
export const FinancialSnapshotCard: React.FC<{ project?: Project }> = ({ project }) => {
  const price = project?.token_price || 50;
  const yield_pct = project?.annual_yield || 8.5;
  const supply = project?.total_tokens || 100000;
  
  // Simple Chart SVG Generator
  const generateLine = () => {
     const points = [10, 25, 20, 45, 40, 60, 55, 80, 75, 90];
     const w = 300; const h = 60;
     const path = points.map((p, i) => `${(i / (points.length - 1)) * w},${h - (p / 100) * h}`).join(' ');
     return path;
  };

  return (
    <div className="bg-slate-900 rounded-[24px] p-6 border border-slate-800 shadow-xl relative overflow-hidden text-white h-full flex flex-col justify-between">
       <div className="flex justify-between items-start mb-4 z-10 relative">
          <div>
              <h3 className="font-bold font-display text-lg">Financial Projection</h3>
              <p className="text-xs text-slate-400">Model: {project?.title || 'New Asset'}</p>
          </div>
          <div className="text-right">
              <div className="text-xl font-mono font-bold text-emerald-400">${price.toFixed(2)}</div>
              <div className="text-[10px] text-emerald-500 uppercase font-bold">Target Price</div>
          </div>
       </div>

       <div className="grid grid-cols-2 gap-4 mb-4 z-10 relative flex-1 items-center">
          <div className="bg-slate-800/50 p-3 rounded-xl border border-slate-700/50">
              <p className="text-[10px] text-slate-400 uppercase font-bold">Annual Yield</p>
              <p className="text-lg font-mono font-bold">{yield_pct}%</p>
          </div>
          <div className="bg-slate-800/50 p-3 rounded-xl border border-slate-700/50">
              <p className="text-[10px] text-slate-400 uppercase font-bold">Cap (Est.)</p>
              <p className="text-lg font-mono font-bold">${((supply * price)/1000000).toFixed(1)}M</p>
          </div>
       </div>

       {/* Chart Area */}
       <div className="h-12 w-full relative z-10 mt-auto opacity-80">
           <svg viewBox="0 0 300 60" className="w-full h-full overflow-visible" preserveAspectRatio="none">
               <path d={`M0,60 ${generateLine()} L300,60 Z`} fill="rgba(16, 185, 129, 0.1)" />
               <path d={`M${generateLine()}`} fill="none" stroke="#10b981" strokeWidth="2" vectorEffect="non-scaling-stroke" />
           </svg>
       </div>

       {/* Background Decor */}
       <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
    </div>
  );
};

// --- SEZIONE 8: Next Steps (Simple List) ---
export const NextStepsSection: React.FC<{ 
    onDeploy: () => void, 
    onUpgrade: () => void, 
    onExport: () => void 
}> = ({ onDeploy, onUpgrade, onExport }) => {
  return (
    <div className="flex gap-2">
        <Button onClick={onDeploy} className="flex-1 bg-white text-indigo-600 border border-indigo-100 hover:bg-indigo-50 text-xs">
            Deploy Sim
        </Button>
        <Button onClick={onExport} className="flex-1 bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 text-xs">
            Export PDF
        </Button>
    </div>
  );
};

// --- SEZIONE 9: Live AI Feed (Compact) ---
export const AiAnalystFeed: React.FC<{ project?: Project }> = ({ project }) => {
    return (
        <div className="bg-transparent h-full flex flex-col justify-center">
            {/* Logic moved to OverviewTab for Bento layout */}
        </div>
    );
};
