
import React, { useState } from 'react';
import { Button } from '../../../../ui/Button';
import { generateRegulationCaseStudy } from '../../../../../services/mockAiService';

interface Props {
  onUpdateState: (key: string, value: any) => void;
  savedResult?: any;
}

export const CaseStudyGenerator: React.FC<Props> = ({ onUpdateState, savedResult }) => {
  const [scenario, setScenario] = useState('');
  const [result, setResult] = useState<any>(savedResult || null);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
      if (!scenario) return;
      setLoading(true);
      const data = await generateRegulationCaseStudy(scenario);
      setResult(data);
      onUpdateState('case_study_result', data);
      setLoading(false);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
        
        {/* Input Area */}
        <div className="bg-gradient-to-br from-slate-900 to-indigo-950 rounded-3xl p-8 border border-indigo-500/20 shadow-2xl relative overflow-hidden">
             <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
             
             <div className="relative z-10">
                 <div className="flex items-center gap-4 mb-6">
                     <div className="text-4xl">🎓</div>
                     <div>
                         <h3 className="text-xl font-bold text-white font-display">Regulatory Sandbox</h3>
                         <p className="text-sm text-indigo-200">Describe a scenario to see how regulation applies.</p>
                     </div>
                 </div>

                 <textarea 
                    value={scenario}
                    onChange={e => setScenario(e.target.value)}
                    className="w-full h-32 p-4 rounded-xl bg-slate-800/50 border border-indigo-500/30 text-white placeholder-slate-500 focus:ring-2 focus:ring-indigo-500 outline-none resize-none mb-6 text-lg"
                    placeholder="e.g. I want to tokenize a hotel in Italy and sell tokens to US retail investors..."
                 />

                 <div className="flex justify-end">
                     <Button 
                        onClick={handleGenerate} 
                        isLoading={loading} 
                        className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-8 py-3 rounded-xl shadow-lg shadow-indigo-500/30"
                     >
                         {loading ? 'Consulting Legal AI...' : 'Analyze Scenario'}
                     </Button>
                 </div>
             </div>
        </div>

        {/* Results */}
        {result && (
            <div className="bg-white rounded-3xl border border-slate-200 p-10 shadow-xl animate-slideUp relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-3 bg-gradient-to-r from-blue-500 to-purple-500"></div>
                
                <h4 className="text-2xl font-bold text-slate-900 mb-8 font-display flex items-center gap-3">
                    <span className="text-3xl">📑</span> Analysis Report
                </h4>
                
                <div className="space-y-8">
                    <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
                        <h5 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Recommended Structure</h5>
                        <p className="text-lg text-slate-900 font-medium leading-relaxed font-serif">"{result.structure}"</p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                             <h5 className="text-xs font-bold text-red-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                                 <span className="w-2 h-2 rounded-full bg-red-500"></span> Compliance Risks
                             </h5>
                             <ul className="space-y-3">
                                 {result.risks?.map((r: string, i: number) => (
                                     <li key={i} className="flex items-start gap-3 p-3 rounded-xl bg-red-50 border border-red-100">
                                         <span className="text-red-500 font-bold mt-0.5">!</span>
                                         <span className="text-sm text-red-900 leading-snug">{r}</span>
                                     </li>
                                 ))}
                             </ul>
                        </div>
                        
                        <div>
                             <h5 className="text-xs font-bold text-emerald-600 uppercase tracking-widest mb-4 flex items-center gap-2">
                                 <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Alternatives
                             </h5>
                             <ul className="space-y-3">
                                 {result.alternatives?.map((a: string, i: number) => (
                                     <li key={i} className="flex items-start gap-3 p-3 rounded-xl bg-emerald-50 border border-emerald-100">
                                         <span className="text-emerald-600 font-bold mt-0.5">✓</span>
                                         <span className="text-sm text-emerald-900 leading-snug">{a}</span>
                                     </li>
                                 ))}
                             </ul>
                        </div>
                    </div>
                </div>
            </div>
        )}
    </div>
  );
};
