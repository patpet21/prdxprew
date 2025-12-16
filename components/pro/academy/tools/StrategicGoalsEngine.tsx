
import React, { useState } from 'react';
import { Button } from '../../../ui/Button';
import { generateStrategicGoals } from '../../../../services/mockAiService';

export const StrategicGoalsEngine: React.FC = () => {
  const [context, setContext] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleGenerate = async () => {
    if (!context) return;
    setIsAnalyzing(true);
    // Simulate passing a "Founder Profile" (mocked internally by service for now)
    const data = await generateStrategicGoals({ archetype: "Visionary" }, context);
    setResult(data);
    setIsAnalyzing(false);
  };

  return (
    <div className="bg-slate-900 rounded-3xl border border-slate-800 p-6 md:p-8 shadow-2xl animate-fadeIn">
       <div className="mb-8 text-center">
           <h3 className="text-2xl font-bold text-white font-display mb-2 flex items-center justify-center gap-2">
               <span className="text-3xl">🎯</span> Strategic Goals Engine
           </h3>
           <p className="text-slate-400 text-sm max-w-lg mx-auto">
               Turn your vision into a concrete banking-grade roadmap. 
               We break down your strategy into Operational, Financial, and Governance targets.
           </p>
       </div>

       {!result ? (
           <div className="max-w-xl mx-auto space-y-6">
               <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800">
                   <label className="text-xs font-bold text-slate-500 uppercase block mb-3">Project Context</label>
                   <textarea 
                       value={context}
                       onChange={(e) => setContext(e.target.value)}
                       className="w-full h-32 bg-slate-900 border border-slate-700 rounded-xl p-4 text-white placeholder-slate-600 focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
                       placeholder="e.g. I want to tokenize a boutique hotel in Milan. I need to raise capital for renovation and increase ADR. My exit strategy is in 5 years."
                   />
               </div>
               <Button 
                   onClick={handleGenerate} 
                   isLoading={isAnalyzing}
                   disabled={!context}
                   className="w-full py-4 bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white shadow-lg shadow-indigo-900/20 font-bold text-lg"
               >
                   {isAnalyzing ? 'Architecting Strategy...' : 'Generate Strategy Map'}
               </Button>
           </div>
       ) : (
           <div className="animate-slideUp space-y-6">
               
               <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                   
                   {/* Operational Card */}
                   <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 hover:border-blue-500 transition-colors group">
                       <div className="w-12 h-12 bg-blue-900/50 rounded-xl flex items-center justify-center text-2xl mb-4 text-blue-400 group-hover:scale-110 transition-transform">
                           ⚙️
                       </div>
                       <h4 className="text-lg font-bold text-white mb-2">Operational</h4>
                       <p className="text-xs text-blue-300 font-bold uppercase tracking-widest mb-4">{result.operational.title}</p>
                       <ul className="space-y-3">
                           {result.operational.metrics.map((m: string, i: number) => (
                               <li key={i} className="flex items-start gap-3 text-sm text-slate-300">
                                   <span className="text-blue-500 font-bold mt-0.5">→</span> {m}
                               </li>
                           ))}
                       </ul>
                       <div className="mt-6 pt-4 border-t border-slate-700 text-xs text-slate-500">
                           Timeline: <span className="text-white font-bold">{result.operational.timeline}</span>
                       </div>
                   </div>

                   {/* Financial Card */}
                   <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 hover:border-emerald-500 transition-colors group">
                       <div className="w-12 h-12 bg-emerald-900/50 rounded-xl flex items-center justify-center text-2xl mb-4 text-emerald-400 group-hover:scale-110 transition-transform">
                           💰
                       </div>
                       <h4 className="text-lg font-bold text-white mb-2">Financial</h4>
                       <p className="text-xs text-emerald-300 font-bold uppercase tracking-widest mb-4">Capital Structure</p>
                       
                       <div className="space-y-4">
                           <div className="flex justify-between items-center p-2 bg-slate-900/50 rounded-lg">
                               <span className="text-xs text-slate-400">Target Raise</span>
                               <span className="text-sm font-bold text-white">{result.financial.target_raise_range}</span>
                           </div>
                           <div className="flex justify-between items-center p-2 bg-slate-900/50 rounded-lg">
                               <span className="text-xs text-slate-400">Target IRR</span>
                               <span className="text-sm font-bold text-emerald-400">{result.financial.target_irr}</span>
                           </div>
                           <div className="flex justify-between items-center p-2 bg-slate-900/50 rounded-lg">
                               <span className="text-xs text-slate-400">Payback</span>
                               <span className="text-sm font-bold text-white">{result.financial.payback_period}</span>
                           </div>
                       </div>
                   </div>

                   {/* Governance Card */}
                   <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 hover:border-purple-500 transition-colors group">
                       <div className="w-12 h-12 bg-purple-900/50 rounded-xl flex items-center justify-center text-2xl mb-4 text-purple-400 group-hover:scale-110 transition-transform">
                           🧩
                       </div>
                       <h4 className="text-lg font-bold text-white mb-2">Governance</h4>
                       <p className="text-xs text-purple-300 font-bold uppercase tracking-widest mb-4">Control Matrix</p>
                       
                       <div className="space-y-4">
                           <div>
                               <span className="text-[10px] text-slate-500 uppercase block mb-1">Sponsor Control</span>
                               <span className="text-sm font-bold text-white">{result.governance.sponsor_control}</span>
                           </div>
                           <div>
                               <span className="text-[10px] text-slate-500 uppercase block mb-1">Investor Rights</span>
                               <ul className="space-y-1">
                                   {result.governance.investor_rights.map((r: string, i: number) => (
                                       <li key={i} className="text-sm text-slate-300">• {r}</li>
                                   ))}
                               </ul>
                           </div>
                       </div>
                   </div>

               </div>
               
               <div className="text-center pt-6">
                   <button onClick={() => setResult(null)} className="text-slate-500 hover:text-white text-sm font-bold uppercase tracking-wider underline decoration-slate-700 hover:decoration-white">
                       Reset Strategy
                   </button>
               </div>

           </div>
       )}
    </div>
  );
};
