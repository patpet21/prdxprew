
import React, { useState } from 'react';
import { Button } from '../../../../ui/Button';
import { checkProjectCoherence } from '../../../../../services/mockAiService';

export const CoherenceChecker: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'LEGAL' | 'MARKET' | 'TOKEN'>('LEGAL');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const runCheck = async () => {
      setLoading(true);
      // Mock project context causing conflict
      const context = { jurisdiction: 'US', investors: 'Retail' }; 
      const res = await checkProjectCoherence(context, activeTab);
      setResult(res);
      setLoading(false);
  };

  return (
    <div className="space-y-6">
        <div className="flex gap-2 border-b border-slate-800 pb-4">
            {['LEGAL', 'MARKET', 'TOKEN'].map(t => (
                <button 
                    key={t} 
                    onClick={() => { setActiveTab(t as any); setResult(null); }}
                    className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${activeTab === t ? 'bg-slate-800 text-white' : 'text-slate-500 hover:text-slate-300'}`}
                >
                    {t} Consistency
                </button>
            ))}
        </div>

        <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 min-h-[200px] flex flex-col justify-center items-center">
            {!result ? (
                <Button onClick={runCheck} isLoading={loading} className="bg-purple-600">Check Logic</Button>
            ) : (
                <div className="w-full text-left animate-fadeIn">
                    <div className="flex items-center gap-3 mb-4">
                        <span className={`text-2xl ${result.status === 'Conflict' ? 'text-amber-500' : 'text-emerald-500'}`}>
                            {result.status === 'Conflict' ? '⚠️' : '✅'}
                        </span>
                        <h4 className="text-white font-bold text-lg">{result.status} Detected</h4>
                    </div>
                    
                    {result.conflicts.length > 0 && (
                        <ul className="bg-amber-900/20 p-4 rounded-lg border border-amber-500/30 mb-4 space-y-2">
                            {result.conflicts.map((c: string, i: number) => (
                                <li key={i} className="text-xs text-amber-200">• {c}</li>
                            ))}
                        </ul>
                    )}
                    
                    <div className="p-4 bg-slate-800 rounded-lg border border-slate-700">
                        <span className="text-[10px] text-slate-500 uppercase font-bold block mb-1">Professor Recommendation</span>
                        <p className="text-sm text-slate-300 leading-relaxed">{result.recommendation}</p>
                    </div>
                </div>
            )}
        </div>
    </div>
  );
};
