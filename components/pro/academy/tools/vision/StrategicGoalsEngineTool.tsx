
import React, { useState } from 'react';
import { Button } from '../../../../ui/Button';
import { generateStrategicGoals } from '../../../../../services/mockAiService';

interface Props {
  data: any;
  onUpdate: (data: any) => void;
  onExport: () => void;
}

export const StrategicGoalsEngineTool: React.FC<Props> = ({ data, onUpdate, onExport }) => {
  const [context, setContext] = useState(data.context || '');
  const [result, setResult] = useState<any>(data.result || null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleGenerate = async () => {
    if (!context) return;
    setIsAnalyzing(true);
    // Simulate passing a profile
    const aiData = await generateStrategicGoals({ archetype: "Visionary" }, context);
    setResult(aiData);
    onUpdate({ context, result: aiData });
    setIsAnalyzing(false);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
       <div className="bg-white p-6 rounded-2xl border border-sim-border shadow-sm">
           <h3 className="text-xl font-bold text-slate-900 mb-2">5. Strategic Goals Engine</h3>
           <p className="text-slate-500 text-sm mb-4">Describe your project context to generate a roadmap.</p>
           
           <textarea 
               value={context}
               onChange={(e) => setContext(e.target.value)}
               className="w-full h-32 bg-slate-50 border border-slate-200 rounded-xl p-4 text-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none resize-none mb-4"
               placeholder="e.g. Tokenizing a solar farm in Spain to raise €2M for expansion..."
           />
           
           <Button 
               onClick={handleGenerate} 
               isLoading={isAnalyzing}
               disabled={!context}
               className="w-full bg-indigo-600 hover:bg-indigo-500 text-white"
           >
               {isAnalyzing ? 'Architecting Strategy...' : 'Generate Roadmap'}
           </Button>
       </div>

       {result && (
           <div className="animate-slideUp space-y-6">
               <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                   <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 text-white">
                       <h4 className="text-xs font-bold text-emerald-400 uppercase mb-2">Operational</h4>
                       <ul className="text-xs space-y-1 text-slate-300">
                           {result.operational.metrics.map((m: string, i: number) => <li key={i}>• {m}</li>)}
                       </ul>
                   </div>
                   <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 text-white">
                       <h4 className="text-xs font-bold text-blue-400 uppercase mb-2">Financial</h4>
                       <div className="text-xs text-slate-300">
                           <p>Target: {result.financial.target_raise_range}</p>
                           <p>IRR: {result.financial.target_irr}</p>
                       </div>
                   </div>
                   <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 text-white">
                       <h4 className="text-xs font-bold text-purple-400 uppercase mb-2">Governance</h4>
                       <p className="text-xs text-slate-300">{result.governance.sponsor_control}</p>
                   </div>
               </div>

               <div className="text-center pt-4 border-t border-slate-200">
                   <p className="text-slate-500 text-sm mb-4">All modules complete. Ready to export.</p>
                   <Button onClick={onExport} className="bg-emerald-600 hover:bg-emerald-500 text-white px-10 py-4 text-lg shadow-xl">
                       📄 Export Full Strategic PDF
                   </Button>
               </div>
           </div>
       )}
    </div>
  );
};
