
import React from 'react';
import { ProjectEconomics } from '../../services/valuation_service';

interface Props {
  economics?: ProjectEconomics;
}

export const ProjectEconomicsTab: React.FC<Props> = ({ economics }) => {
  if (!economics) return <div className="text-slate-500 p-8 text-center">Run analysis to view economics.</div>;

  return (
    <div className="space-y-6 animate-slideUp">
       <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-2xl p-6">
          <h3 className="text-xl font-bold text-yellow-400 mb-6 flex items-center gap-2">
              <span className="text-2xl">🟨</span> Project Economics
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
                  <p className="text-[10px] text-slate-400 uppercase font-bold">Gross Dev Value (GDV)</p>
                  <p className="text-xl text-white font-mono font-bold mt-1">${economics.grossDevelopmentValue.toLocaleString()}</p>
              </div>
              <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
                  <p className="text-[10px] text-slate-400 uppercase font-bold">Total Cost</p>
                  <p className="text-xl text-white font-mono font-bold mt-1">${economics.developmentCost.toLocaleString()}</p>
              </div>
              <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
                  <p className="text-[10px] text-slate-400 uppercase font-bold">Profit Margin</p>
                  <p className={`text-xl font-mono font-bold mt-1 ${economics.profitMargin > 20 ? 'text-emerald-400' : 'text-yellow-400'}`}>
                      {economics.profitMargin.toFixed(1)}%
                  </p>
              </div>
              <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
                  <p className="text-[10px] text-slate-400 uppercase font-bold">Yield on Cost</p>
                  <p className="text-xl text-white font-mono font-bold mt-1">{economics.yieldOnCost.toFixed(1)}%</p>
              </div>
          </div>

          <div className="mt-6 p-4 bg-slate-900/50 rounded-xl border border-yellow-500/10 text-sm text-slate-300 italic">
              "{economics.commentary}"
          </div>
       </div>
    </div>
  );
};
