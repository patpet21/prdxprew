
import React, { useState, useEffect } from 'react';
import { runYieldSimulation } from '../../../../services/mockAiService';

interface Props {
  yieldPct: number;
  irrPct: number;
}

export const YieldSimulationCard: React.FC<Props> = ({ yieldPct, irrPct }) => {
  const [sim, setSim] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
      const run = async () => {
          setLoading(true);
          const res = await runYieldSimulation(yieldPct, irrPct, 5);
          setSim(res);
          setLoading(false);
      };
      run();
  }, [yieldPct, irrPct]);

  if (loading || !sim) return <div className="p-6 text-center text-slate-400 text-xs">Simulating returns...</div>;

  // Determine visuals
  const cashHeight = Math.min(100, (sim.cashComponent / irrPct) * 100) || 0;
  const appHeight = 100 - cashHeight;

  return (
    <div className="bg-slate-900 text-white p-6 rounded-2xl border border-slate-800 h-full">
        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
            <span className="text-xl">🧪</span> Return Composition
        </h4>

        <div className="flex gap-6 items-end h-40 mb-6 px-4">
            {/* Bar */}
            <div className="w-16 h-full bg-slate-800 rounded-lg relative overflow-hidden flex flex-col">
                <div style={{ height: `${appHeight}%` }} className="w-full bg-indigo-500 transition-all duration-1000 relative group">
                    <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold opacity-0 group-hover:opacity-100 transition-opacity">Appr.</span>
                </div>
                <div style={{ height: `${cashHeight}%` }} className="w-full bg-emerald-500 transition-all duration-1000 relative group">
                    <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-slate-900 opacity-0 group-hover:opacity-100 transition-opacity">Cash</span>
                </div>
            </div>

            {/* Legend/Stats */}
            <div className="flex-1 space-y-4 pb-2">
                <div>
                    <div className="flex justify-between text-xs mb-1">
                        <span className="text-emerald-400 font-bold">Cash Yield</span>
                        <span className="font-mono">{sim.cashComponent}%</span>
                    </div>
                    <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500" style={{ width: '100%' }}></div>
                    </div>
                </div>
                <div>
                    <div className="flex justify-between text-xs mb-1">
                        <span className="text-indigo-400 font-bold">Appreciation</span>
                        <span className="font-mono">{sim.appreciationComponent.toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                        <div className="h-full bg-indigo-500" style={{ width: '100%' }}></div>
                    </div>
                </div>
                
                <div className="pt-4 border-t border-slate-800">
                     <div className="flex justify-between items-baseline">
                         <span className="text-xs text-slate-500 font-bold uppercase">Total IRR</span>
                         <span className="text-2xl font-display font-bold text-white">{irrPct}%</span>
                     </div>
                </div>
            </div>
        </div>

        <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-xs text-slate-400 italic leading-relaxed">
            "{sim.marketComparison}"
        </div>
    </div>
  );
};
