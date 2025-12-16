
import React, { useState, useEffect } from 'react';
import { Button } from '../../../../ui/Button';
import { generateFunnelSimulation } from '../../../../../services/mockAiService';
import { Input } from '../../../../ui/Input';

export const FunnelSimulator: React.FC = () => {
  const [inputs, setInputs] = useState({
      adBudget: 10000,
      cpmCost: 25,
      landingPageConvRate: 2.5,
      minTicket: 5000,
      targetRaise: 500000
  });
  const [aiResult, setAiResult] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('academyPro_distribution');
    if (saved) {
        try {
            const parsed = JSON.parse(saved);
            if (parsed.funnelSim) {
                if (parsed.funnelSim.inputs) setInputs(parsed.funnelSim.inputs);
                if (parsed.funnelSim.aiOutput) setAiResult(parsed.funnelSim.aiOutput);
            }
        } catch (e) { console.error(e); }
    }
  }, []);

  const handleChange = (field: string, val: number) => {
      setInputs(prev => ({ ...prev, [field]: val }));
  };

  const handleSimulate = async () => {
      setIsAnalyzing(true);
      const context = {
          channelMix: JSON.parse(localStorage.getItem('academyPro_distribution') || '{}').channelMix?.aiOutput,
      };
      const result = await generateFunnelSimulation(inputs, context);
      setAiResult(result);
      setIsAnalyzing(false);
      
      const current = JSON.parse(localStorage.getItem('academyPro_distribution') || '{}');
      current.funnelSim = { inputs, aiOutput: result };
      localStorage.setItem('academyPro_distribution', JSON.stringify(current));
  };

  return (
    <div className="space-y-8 animate-fadeIn">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 space-y-6">
                <h4 className="text-sm font-bold text-white uppercase tracking-widest mb-2">🎛️ Funnel Calibration</h4>
                <div className="space-y-4">
                    <div>
                        <div className="flex justify-between text-xs font-bold text-slate-500 mb-2">
                            <span>Monthly Ad Budget</span>
                            <span className="text-white">${inputs.adBudget.toLocaleString()}</span>
                        </div>
                        <input type="range" min="1000" max="100000" step="1000" value={inputs.adBudget} onChange={e => handleChange('adBudget', Number(e.target.value))} className="w-full accent-indigo-500 h-2 bg-slate-800 rounded-lg" />
                    </div>
                    <div>
                         <div className="flex justify-between text-xs font-bold text-slate-500 mb-2">
                            <span>CPM (Cost/1k Impressions)</span>
                            <span className="text-white">${inputs.cpmCost}</span>
                        </div>
                        <input type="range" min="5" max="100" value={inputs.cpmCost} onChange={e => handleChange('cpmCost', Number(e.target.value))} className="w-full accent-indigo-500 h-2 bg-slate-800 rounded-lg" />
                    </div>
                     <div>
                        <div className="flex justify-between text-xs font-bold text-slate-500 mb-2">
                            <span>LP Conversion (%)</span>
                            <span className="text-white">{inputs.landingPageConvRate}%</span>
                        </div>
                        <input type="range" min="0.5" max="10" step="0.5" value={inputs.landingPageConvRate} onChange={e => handleChange('landingPageConvRate', Number(e.target.value))} className="w-full accent-indigo-500 h-2 bg-slate-800 rounded-lg" />
                    </div>
                </div>
                <Button onClick={handleSimulate} isLoading={isAnalyzing} className="w-full bg-sim-ai hover:bg-purple-600 text-white shadow-lg">
                    {isAnalyzing ? 'Simulating Traffic...' : '🚀 Run Funnel Simulation'}
                </Button>
            </div>

            <div className="flex flex-col gap-6">
                <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden relative min-h-[300px] flex flex-col items-center justify-center p-6">
                    {aiResult ? (
                        <div className="w-full max-w-sm animate-slideUp space-y-1">
                            <div className="bg-indigo-900/40 p-3 text-center rounded-t-lg border-x border-t border-indigo-500/30">
                                <span className="block text-xs text-indigo-300 uppercase font-bold">Impressions</span>
                                <span className="block text-xl text-white font-mono">{(aiResult.funnelNumbers.impressions || 0).toLocaleString()}</span>
                            </div>
                            <div className="bg-purple-900/60 p-3 text-center mx-8 border-x border-purple-500/30">
                                <span className="block text-xs text-purple-300 uppercase font-bold">Leads</span>
                                <span className="block text-xl text-white font-mono">{(aiResult.funnelNumbers.leads || 0).toLocaleString()}</span>
                            </div>
                            <div className="bg-emerald-600 p-4 text-center mx-12 rounded-b-lg shadow-lg">
                                <span className="block text-xs text-emerald-100 uppercase font-bold">Investors</span>
                                <span className="block text-2xl text-white font-mono font-bold">{(aiResult.funnelNumbers.investors || 0).toLocaleString()}</span>
                            </div>
                             <div className="pt-4 text-center">
                                 <span className="text-xs text-slate-500 uppercase tracking-widest">Projected Capital</span>
                                 <div className="text-3xl text-emerald-400 font-display font-bold">
                                     ${(aiResult.funnelNumbers.capitalRaised || 0).toLocaleString()}
                                 </div>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center text-slate-500">
                            <span className="text-4xl mb-2 grayscale opacity-20 block">📉</span>
                            Run simulation to visualize the drop-off.
                        </div>
                    )}
                </div>
            </div>
        </div>
    </div>
  );
};
