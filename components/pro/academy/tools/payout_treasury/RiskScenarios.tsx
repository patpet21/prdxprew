
import React, { useState, useEffect } from 'react';
import { Button } from '../../../../ui/Button';
import { Select } from '../../../../ui/Select';
import { generateRiskScenariosAnalysis } from '../../../../../services/mockAiService';

interface Props {
  onNext?: () => void;
  // Legacy props
  data?: any;
  onUpdate?: (data: any) => void;
}

const LOCAL_STORAGE_KEY = 'academyPro_payout';

export const RiskScenarios: React.FC<Props> = ({ onNext }) => {
  const [inputs, setInputs] = useState({
      scenarioType: 'Occupancy Drop',
      severity: 'Moderate',
      marketContext: 'Stable'
  });

  const [aiOutput, setAiOutput] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
        try {
            const parsed = JSON.parse(saved);
            if (parsed.riskScenarios) {
                if (parsed.riskScenarios.inputs) setInputs(prev => ({ ...prev, ...parsed.riskScenarios.inputs }));
                if (parsed.riskScenarios.aiOutput) setAiOutput(parsed.riskScenarios.aiOutput);
            }
        } catch(e) { console.error(e); }
    }
  }, []);

  const handleChange = (field: string, val: string) => {
      setInputs(prev => ({ ...prev, [field]: val }));
  };

  const handleAnalyze = async () => {
      setIsAnalyzing(true);
      const payoutData = JSON.parse(localStorage.getItem('academyPro_payout') || '{}');
      const context = { waterfallStructure: payoutData.waterfall?.inputs || {}, treasuryRules: payoutData.treasuryRules?.inputs || {} };
      const result = await generateRiskScenariosAnalysis(inputs, context);
      setAiOutput(result);
      setIsAnalyzing(false);
      saveToStorage(result);
  };

  const saveToStorage = (output = aiOutput) => {
      const existing = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || '{}');
      const updated = { ...existing, riskScenarios: { inputs, aiOutput: output } };
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
  };

  const handleSaveNext = () => {
      setIsSaving(true);
      saveToStorage();
      setTimeout(() => {
          setIsSaving(false);
          if(onNext) onNext();
      }, 500);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 h-full">
        
        {/* Input Config */}
        <div className="lg:col-span-4 space-y-10">
             <div>
                <h2 className="text-3xl font-display font-bold text-slate-900 mb-6">Stress Test Lab</h2>
                <p className="text-slate-500 text-lg leading-relaxed">
                    Simulate market shocks. See if your waterfall and reserves break under pressure.
                </p>
            </div>
            
            <div className="space-y-6">
                <div>
                    <label className="text-xs font-bold text-slate-400 uppercase block mb-3">Scenario Type</label>
                    <Select 
                        label="Type"
                        value={inputs.scenarioType} 
                        onChange={e => handleChange('scenarioType', e.target.value)} 
                        options={[
                            { value: 'Occupancy Drop', label: 'Occupancy / Revenue Drop' }, 
                            { value: 'Interest Rate Spike', label: 'Interest Rate Spike (+200bps)' }, 
                            { value: 'CapEx Shock', label: 'Unexpected CapEx Event' }, 
                            { value: 'Tenant Default', label: 'Major Tenant Default' }
                        ]} 
                        className="w-full bg-white border border-slate-200 rounded-xl p-4 text-slate-900 outline-none focus:border-red-500 transition-all text-lg" 
                    />
                </div>
                
                <div>
                    <label className="text-xs font-bold text-slate-400 uppercase block mb-3">Severity Level</label>
                    <div className="grid grid-cols-3 gap-3">
                        {['Mild', 'Moderate', 'Severe'].map(level => (
                            <button 
                                key={level} 
                                onClick={() => handleChange('severity', level)} 
                                className={`py-4 rounded-xl text-sm font-bold border transition-all ${
                                    inputs.severity === level 
                                    ? (level === 'Severe' ? 'bg-red-600 text-white border-red-600' : level === 'Moderate' ? 'bg-amber-500 text-slate-900 border-amber-500' : 'bg-emerald-600 text-white border-emerald-600') 
                                    : 'bg-white border-slate-200 text-slate-400 hover:border-slate-300'
                                }`}
                            >
                                {level}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="pt-8">
                    <Button onClick={handleAnalyze} isLoading={isAnalyzing} className="w-full py-4 text-lg bg-red-600 hover:bg-red-500 text-white shadow-lg">
                        {isAnalyzing ? 'Simulating Crash...' : '🔥 Run Stress Test'}
                    </Button>
                </div>
            </div>
        </div>

        {/* Results */}
        <div className="lg:col-span-8 flex flex-col justify-center items-center pl-8 border-l border-slate-200">
            
            {!aiOutput ? (
                <div className="text-center opacity-30">
                    <span className="text-8xl block mb-4">📉</span>
                    <p className="text-2xl font-display font-bold text-slate-900">Awaiting Simulation</p>
                </div>
            ) : (
                <div className="w-full max-w-3xl animate-slideUp">
                    <div className="flex justify-between items-end mb-8">
                         <h3 className="text-2xl font-bold text-slate-900">Impact Report</h3>
                         <div className="text-right">
                             <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Severity Score</p>
                             <p className={`text-5xl font-mono font-bold ${aiOutput.institutionalSeverityScore > 50 ? 'text-red-500' : 'text-amber-500'}`}>{aiOutput.institutionalSeverityScore}/100</p>
                         </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6 mb-8">
                        <div className="bg-slate-100 p-6 rounded-2xl border border-slate-200">
                            <span className="text-xs font-bold text-slate-500 uppercase block mb-2">Yield Impact</span>
                            <span className="text-3xl font-mono font-bold text-red-500">{aiOutput.impactAnalysis.yieldDrop}</span>
                        </div>
                        <div className="bg-slate-100 p-6 rounded-2xl border border-slate-200">
                            <span className="text-xs font-bold text-slate-500 uppercase block mb-2">Cashflow Gap</span>
                            <span className="text-xl font-medium text-slate-800">{aiOutput.impactAnalysis.cashflowGap}</span>
                        </div>
                    </div>

                    <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
                         <h4 className="text-lg font-bold text-indigo-900 mb-4">Risk Analysis</h4>
                         <p className="text-lg text-slate-600 leading-relaxed">
                             "{aiOutput.impactAnalysis.sponsorPain}"
                         </p>
                         {aiOutput.weakPoints.length > 0 && (
                             <div className="mt-6 pt-6 border-t border-slate-100">
                                 <p className="text-sm font-bold text-red-500 uppercase mb-2">Weak Points</p>
                                 <ul className="space-y-2">
                                     {aiOutput.weakPoints.map((wp: string, i: number) => (
                                         <li key={i} className="text-sm text-slate-700">• {wp}</li>
                                     ))}
                                 </ul>
                             </div>
                         )}
                    </div>
                </div>
            )}

            <div className="mt-auto w-full flex justify-end pt-12">
                <Button onClick={handleSaveNext} disabled={isSaving} className="bg-indigo-600 hover:bg-indigo-500 text-white px-10 py-4 text-lg shadow-xl shadow-indigo-200">
                    {isSaving ? 'Saving...' : 'Save & Next: Final Review →'}
                </Button>
            </div>
        </div>
    </div>
  );
};
