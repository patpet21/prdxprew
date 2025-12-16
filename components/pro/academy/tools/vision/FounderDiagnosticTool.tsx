
import React, { useState, useEffect } from 'react';
import { Button } from '../../../../ui/Button';

interface Props {
  data: any;
  onUpdate: (data: any) => void;
  onNext: () => void;
}

export const FounderDiagnosticTool: React.FC<Props> = ({ data, onUpdate, onNext }) => {
  const [metrics, setMetrics] = useState(data.metrics || {
      skills: 5,
      capital: 5,
      time: 5,
      risk: 5,
      network: 5,
      ops: 5
  });

  const [profile, setProfile] = useState({ type: 'Pending', weakSpots: [] as string[] });

  useEffect(() => {
      // Determine Profile
      let type = "Hybrid Operator";
      const risks = [];

      if (metrics.network > 7 && metrics.capital > 7) type = "Deal Maker";
      else if (metrics.ops > 7 && metrics.skills > 7) type = "Operator";
      else if (metrics.risk > 8) type = "Visionary";

      if (metrics.network < 4) risks.push("Low Network Strength: Fundraising will be slower.");
      if (metrics.capital < 3) risks.push("Capital Constraints: Cannot afford top-tier legal.");
      if (metrics.time < 3) risks.push("Time Poor: Execution risk is high.");

      setProfile({ type, weakSpots: risks });
      onUpdate({ metrics, profile: { type }, weakSpots: risks, riskMap: risks }); // Save as both for compatibility
  }, [metrics]);

  const updateMetric = (key: string, val: number) => {
      setMetrics((prev: any) => ({ ...prev, [key]: val }));
  };

  const renderScoreBar = (label: string, score: number, color: string) => (
    <div className="mb-4">
      <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
        <span>{label}</span>
        <span>{score}/100</span>
      </div>
      <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
        <div className={`h-full ${color} transition-all duration-1000`} style={{ width: `${score}%` }}></div>
      </div>
    </div>
  );

  return (
    <div className="space-y-8 animate-fadeIn">
        <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 text-white">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold">4. Founder Diagnostic</h3>
                <div className="px-3 py-1 bg-amber-500 text-slate-900 rounded-full text-xs font-bold uppercase">
                    {profile.type}
                </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                {[
                    { id: 'skills', label: 'Technical Skills' },
                    { id: 'capital', label: 'Starting Capital' },
                    { id: 'time', label: 'Time Availability' },
                    { id: 'risk', label: 'Risk Tolerance' },
                    { id: 'network', label: 'Network Strength' },
                    { id: 'ops', label: 'Operational Capability' },
                ].map(m => (
                    <div key={m.id}>
                         <div className="flex justify-between text-xs font-bold text-slate-400 mb-1">
                             <span>{m.label}</span>
                             <span>{(metrics as any)[m.id]}/10</span>
                         </div>
                         <input 
                            type="range" min="1" max="10" 
                            value={(metrics as any)[m.id]} 
                            onChange={e => updateMetric(m.id, Number(e.target.value))} 
                            className="w-full accent-amber-500 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer" 
                         />
                    </div>
                ))}
            </div>
        </div>

        {profile.weakSpots.length > 0 && (
            <div className="bg-red-50 border border-red-200 p-4 rounded-xl">
                <h4 className="text-sm font-bold text-red-700 uppercase tracking-wide mb-2">Detected Weak Spots</h4>
                <ul className="space-y-1">
                    {profile.weakSpots.map((r, i) => (
                        <li key={i} className="text-sm text-red-600 flex gap-2">
                            <span>⚠️</span> {r}
                        </li>
                    ))}
                </ul>
            </div>
        )}

        <div className="flex justify-end">
             <Button onClick={onNext} className="bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg px-8 py-3">
                 Save & Next: Strategic Goals →
             </Button>
        </div>
    </div>
  );
};
