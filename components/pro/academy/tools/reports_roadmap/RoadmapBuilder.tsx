
import React, { useState, useEffect } from 'react';
import { generateRoadmapStructure } from '../../../../../services/mockAiService';

export const RoadmapBuilder: React.FC = () => {
  const [horizon, setHorizon] = useState('6 Months');
  const [roadmap, setRoadmap] = useState<any>(null);

  useEffect(() => {
      generateRoadmapStructure(horizon).then(setRoadmap);
  }, [horizon]);

  if (!roadmap) return <div className="p-4 text-slate-500">Initializing Planner...</div>;

  return (
    <div className="space-y-6">
        <div className="flex justify-between items-center bg-slate-900 p-4 rounded-xl border border-slate-800">
             <h4 className="text-white font-bold">Execution Timeline</h4>
             <select 
                value={horizon} onChange={e => setHorizon(e.target.value)}
                className="bg-slate-800 text-white p-2 rounded text-sm border border-slate-700"
             >
                 <option>3 Months</option>
                 <option>6 Months</option>
                 <option>12 Months</option>
             </select>
        </div>

        <div className="space-y-4">
            {roadmap.phases && roadmap.phases.length > 0 ? (
                roadmap.phases.map((phase: any, i: number) => (
                <div key={i} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-500">
                        {i+1}
                    </div>
                    <div className="flex-1">
                        <h5 className="font-bold text-slate-900">{phase.phaseName || 'Unnamed Phase'}</h5>
                        <p className="text-xs text-slate-500">Duration: {phase.durationWeeks} weeks • Budget: ${phase.estimatedCost}</p>
                    </div>
                    <div className="w-1/3">
                         <div className="flex flex-wrap gap-2 justify-end">
                             {phase.milestones && phase.milestones.map((m: string, j: number) => (
                                 <span key={j} className="px-2 py-1 bg-emerald-50 text-emerald-700 text-[10px] font-bold rounded border border-emerald-100">
                                     {m}
                                 </span>
                             ))}
                         </div>
                    </div>
                </div>
            ))) : (
                <div className="text-center p-8 text-slate-500 bg-slate-50 rounded-xl border border-slate-200 border-dashed">
                    No phases generated.
                </div>
            )}
        </div>
    </div>
  );
};
