
import React, { useState, useEffect } from 'react';
import { Button } from '../../../../ui/Button';
import { generateUnitEconomicsAnalysis } from '../../../../../services/mockAiService';
import { Input } from '../../../../ui/Input';

export const CostStructure: React.FC = () => {
  const [inputs, setInputs] = useState({
      expectedInvestorLTV: 5000,
      platformFees: 2.0,
      teamCostPerMonth: 5000,
      monthsOfCampaign: 6,
  });
  const [aiResult, setAiResult] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('academyPro_distribution');
    if (saved) {
        try {
            const parsed = JSON.parse(saved);
            if (parsed.unitEconomics) {
                if (parsed.unitEconomics.inputs) setInputs(parsed.unitEconomics.inputs);
                if (parsed.unitEconomics.aiOutput) setAiResult(parsed.unitEconomics.aiOutput);
            }
        } catch (e) { console.error(e); }
    }
  }, []);

  const handleChange = (field: string, val: any) => {
      setInputs(prev => ({ ...prev, [field]: val }));
  };

  const handleAnalyze = async () => {
      setIsAnalyzing(true);
      const context = { funnelSim: JSON.parse(localStorage.getItem('academyPro_distribution') || '{}').funnelSim?.aiOutput };
      const result = await generateUnitEconomicsAnalysis(inputs, context);
      setAiResult(result);
      setIsAnalyzing(false);
      
      const current = JSON.parse(localStorage.getItem('academyPro_distribution') || '{}');
      current.unitEconomics = { inputs, aiOutput: result };
      localStorage.setItem('academyPro_distribution', JSON.stringify(current));
  };

  return (
    <div className="space-y-8 animate-fadeIn">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-5 bg-slate-900 p-6 rounded-xl border border-slate-800 space-y-6">
                <h4 className="text-sm font-bold text-white uppercase tracking-widest mb-2">🧮 Profitability Engine</h4>
                <div className="space-y-4">
                    <Input label="Expected Investor LTV ($)" id="ltv" type="number" value={inputs.expectedInvestorLTV} onChange={e => handleChange('expectedInvestorLTV', parseFloat(e.target.value))} className="bg-slate-950 border-slate-700 text-white" />
                    <Input label="Team Burn ($/mo)" id="burn" type="number" value={inputs.teamCostPerMonth} onChange={e => handleChange('teamCostPerMonth', parseFloat(e.target.value))} className="bg-slate-950 border-slate-700 text-white" />
                </div>
                <Button onClick={handleAnalyze} isLoading={isAnalyzing} className="w-full bg-sim-ai hover:bg-purple-600 text-white shadow-lg">
                    {isAnalyzing ? 'Calculating...' : '📊 Analyze Unit Economics'}
                </Button>
            </div>

            <div className="lg:col-span-7 flex flex-col gap-6">
                {aiResult && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-slideUp">
                        <div className="bg-slate-900 p-5 rounded-xl border border-slate-800">
                            <h5 className="text-xs font-bold text-slate-400 uppercase mb-4">Key Metrics</h5>
                            <div className="grid grid-cols-2 gap-4">
                                <div><span className="text-[10px] text-slate-500 uppercase block">CAC</span><span className="text-xl font-mono font-bold text-white">${aiResult.calculatedMetrics.cac}</span></div>
                                <div><span className="text-[10px] text-slate-500 uppercase block">LTV:CAC</span><span className="text-xl font-mono font-bold text-emerald-400">{aiResult.calculatedMetrics.ratio}</span></div>
                            </div>
                        </div>
                        <div className="bg-emerald-50 p-5 rounded-xl border border-emerald-100">
                             <h5 className="text-xs font-bold text-emerald-800 uppercase mb-3">Optimization Plan</h5>
                             <ul className="space-y-2">
                                {aiResult.recommendations?.map((rec: string, i: number) => (
                                    <li key={i} className="text-xs text-emerald-700 flex gap-2"><span className="font-bold">→</span> {rec}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                )}
            </div>
        </div>
    </div>
  );
};
