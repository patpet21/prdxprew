
import React, { useEffect, useState } from 'react';

interface Props {
  onImport: (data: any) => void;
}

export const ProjectImporter: React.FC<Props> = ({ onImport }) => {
  const [loading, setLoading] = useState(true);
  const [modules, setModules] = useState<any[]>([]);

  useEffect(() => {
    setTimeout(() => {
        setModules([
            { id: 'vision', name: 'Vision & Goals', status: 'Ready', items: 5 },
            { id: 'asset', name: 'Asset & Market', status: 'Ready', items: 8 },
            { id: 'legal', name: 'Jurisdiction & SPV', status: 'Ready', items: 4 },
            { id: 'financial', name: 'Financial Model', status: 'Pending', items: 0 },
            { id: 'token', name: 'Token Design', status: 'Ready', items: 6 },
        ]);
        setLoading(false);
        // Simulate import payload
        onImport({ projectId: "temp-123", name: "Imported Project", status: "Draft" });
    }, 1500);
  }, []);

  return (
    <div className="space-y-6">
        <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
            <h4 className="text-sm font-bold text-white uppercase tracking-widest mb-4">Data Source Modules</h4>
            {loading ? (
                <div className="text-center py-8 text-slate-500">Scanning Academy history...</div>
            ) : (
                <div className="space-y-3">
                    {modules.map((mod) => (
                        <div key={mod.id} className="flex items-center justify-between p-3 bg-slate-950 rounded-lg border border-slate-800">
                            <div className="flex items-center gap-3">
                                <div className={`w-2 h-2 rounded-full ${mod.status === 'Ready' ? 'bg-emerald-500' : 'bg-amber-500'}`}></div>
                                <span className="text-sm font-bold text-slate-300">{mod.name}</span>
                            </div>
                            <div className="text-xs text-slate-500">
                                {mod.status === 'Ready' ? `${mod.items} Data Points` : 'Incomplete'}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    </div>
  );
};
