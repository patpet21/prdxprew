
import React, { useState, useEffect } from 'react';
import { Button } from '../../../../ui/Button';
import { Select } from '../../../../ui/Select';
import { generateMacroRiskAnalysis } from '../../../../../services/mockAiService';

interface Props {
  data: any;
  onUpdate: (data: any) => void;
  onNext: () => void;
}

const LOCAL_STORAGE_KEY = 'academyPro_assetMarket';

export const MacroRisksTab: React.FC<Props> = ({ data, onUpdate, onNext }) => {
  const [inputs, setInputs] = useState({
      interestRateSensitivity: 'Medium',
      regulationSensitivity: 'High',
      inflationSensitivity: 'Medium',
      geographyRisk: 'US'
  });

  const [aiOutput, setAiOutput] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
        try {
            const parsed = JSON.parse(saved);
            if (parsed.macroRisks) {
                if (parsed.macroRisks.inputs) setInputs(parsed.macroRisks.inputs);
                if (parsed.macroRisks.aiOutput) setAiOutput(parsed.macroRisks.aiOutput);
            } else {
                // Try to infer geography from other tabs if possible
                const region = parsed.globalBenchmark?.inputs?.regionFocus;
                if (region) setInputs(prev => ({ ...prev, geographyRisk: region }));
            }
        } catch (e) {
            console.error("Failed to load macro risk data", e);
        }
    }
  }, []);

  const saveToStorage = () => {
    const existing = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || '{}');
    const updated = {
        ...existing,
        macroRisks: {
            inputs,
            aiOutput
        }
    };
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
    onUpdate(updated.macroRisks);
  };

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    const result = await generateMacroRiskAnalysis(inputs);
    setAiOutput(result);
    setIsAnalyzing(false);
    
    // Auto-save
    const existing = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || '{}');
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify({
        ...existing,
        macroRisks: { inputs, aiOutput: result }
    }));
  };

  const handleSave = () => {
      setIsSaving(true);
      saveToStorage();
      setTimeout(() => setIsSaving(false), 500);
  };

  const handleSaveAndNext = () => {
      handleSave();
      onNext();
  };

  const updateInput = (field: string, val: any) => {
      setInputs(prev => ({ ...prev, [field]: val }));
  };

  const getHeatColor = (level: string) => {
      switch(level) {
          case 'Low': return 'bg-emerald-500';
          case 'Medium': return 'bg-amber-500';
          case 'High': return 'bg-orange-500';
          case 'Critical': return 'bg-red-600';
          default: return 'bg-slate-500';
      }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
        
        {/* INPUTS */}
        <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
             <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-6 flex items-center gap-2">
                <span className="text-xl">📉</span> Sensitivity Calibration
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <Select
                    label="Interest Rate Sensitivity"
                    id="rates"
                    value={inputs.interestRateSensitivity}
                    onChange={e => updateInput('interestRateSensitivity', e.target.value)}
                    options={[
                        { value: 'Low', label: 'Low (Fixed Debt)' },
                        { value: 'Medium', label: 'Medium' },
                        { value: 'High', label: 'High (Floating Debt / Cap Rates)' }
                    ]}
                    className="bg-slate-800 border-slate-700 text-white"
                />
                <Select
                    label="Regulation Sensitivity"
                    id="reg"
                    value={inputs.regulationSensitivity}
                    onChange={e => updateInput('regulationSensitivity', e.target.value)}
                    options={[
                        { value: 'Low', label: 'Low (Established Framework)' },
                        { value: 'Medium', label: 'Medium' },
                        { value: 'High', label: 'High (Uncertain Laws)' }
                    ]}
                    className="bg-slate-800 border-slate-700 text-white"
                />
                <Select
                    label="Inflation Sensitivity"
                    id="inflation"
                    value={inputs.inflationSensitivity}
                    onChange={e => updateInput('inflationSensitivity', e.target.value)}
                    options={[
                        { value: 'Low', label: 'Low (CPI Linked Rents)' },
                        { value: 'Medium', label: 'Medium' },
                        { value: 'High', label: 'High (Cost exposure)' }
                    ]}
                    className="bg-slate-800 border-slate-700 text-white"
                />
                 <Select
                    label="Geography"
                    id="geo"
                    value={inputs.geographyRisk}
                    onChange={e => updateInput('geographyRisk', e.target.value)}
                    options={[
                        { value: 'US', label: 'United States' },
                        { value: 'EU', label: 'Europe (EU)' },
                        { value: 'Emerging Markets', label: 'Emerging Markets' },
                        { value: 'Global', label: 'Global Diversified' }
                    ]}
                    className="bg-slate-800 border-slate-700 text-white"
                />
            </div>
            
            <div className="flex justify-end">
                <Button 
                    onClick={handleAnalyze} 
                    isLoading={isAnalyzing} 
                    className="bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-900/20"
                >
                    {isAnalyzing ? 'Running Stress Test...' : '🔥 Analyze Macro Risks'}
                </Button>
            </div>
        </div>

        {/* OUTPUTS */}
        {aiOutput && (
            <div className="animate-slideUp space-y-8">
                
                {/* Heat Map Banner */}
                <div className={`p-6 rounded-2xl flex items-center justify-between shadow-lg relative overflow-hidden ${getHeatColor(aiOutput.macroRiskHeat).replace('bg-', 'bg-opacity-20 border border-').replace('500', '500/50')}`}>
                    <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
                    <div className="relative z-10">
                        <span className="text-xs font-bold uppercase tracking-widest text-white block mb-1">Overall Risk Heat</span>
                        <h2 className={`text-4xl font-display font-bold ${aiOutput.macroRiskHeat === 'Critical' ? 'text-red-500' : 'text-white'}`}>
                            {aiOutput.macroRiskHeat}
                        </h2>
                    </div>
                    <div className="relative z-10 text-6xl opacity-50">
                        {aiOutput.macroRiskHeat === 'Low' ? '🛡️' : aiOutput.macroRiskHeat === 'Medium' ? '⚠️' : '🔥'}
                    </div>
                </div>

                {/* Risk Cards Grid */}
                <div className="grid grid-cols-1 gap-4">
                    {aiOutput.risks?.map((risk: any, i: number) => (
                        <div key={i} className="bg-slate-900 border border-slate-800 p-5 rounded-xl flex items-start gap-4 transition-all hover:bg-slate-800/80">
                             <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold shadow-lg shrink-0 ${
                                 risk.severity === 'Critical' ? 'bg-red-900/20 text-red-500 border border-red-500/30' : 
                                 risk.severity === 'High' ? 'bg-orange-900/20 text-orange-500 border border-orange-500/30' : 
                                 'bg-blue-900/20 text-blue-500 border border-blue-500/30'
                             }`}>
                                {risk.severity === 'Critical' ? '!' : risk.severity === 'High' ? 'H' : 'M'}
                            </div>
                            <div className="flex-1">
                                <div className="flex justify-between items-start mb-1">
                                    <h4 className="text-white font-bold text-sm">{risk.title}</h4>
                                    <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded border ${
                                        risk.severity === 'Critical' ? 'border-red-500 text-red-500' : 
                                        risk.severity === 'High' ? 'border-orange-500 text-orange-500' : 
                                        'border-blue-500 text-blue-500'
                                    }`}>
                                        {risk.severity} Impact
                                    </span>
                                </div>
                                <p className="text-xs text-slate-400 mb-2">{risk.explanation}</p>
                                <div className="p-2 bg-slate-950 rounded border border-slate-800/50 text-xs text-slate-300 font-mono">
                                    <span className="text-slate-500 mr-2">Est. Impact:</span> {risk.expectedImpact}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        )}

        {/* Footer Actions */}
        <div className="flex justify-end gap-4 pt-4 border-t border-slate-200/20">
            <Button onClick={handleSave} disabled={isSaving} variant="secondary" className="border-slate-600 text-slate-400 hover:text-white hover:bg-slate-800">
                {isSaving ? 'Saving...' : 'Save Draft'}
            </Button>
            <Button onClick={handleSaveAndNext} className="bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg">
                Save & Next →
            </Button>
        </div>

    </div>
  );
};
