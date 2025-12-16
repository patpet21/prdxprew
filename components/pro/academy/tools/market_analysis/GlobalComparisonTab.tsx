
import React, { useState, useEffect } from 'react';
import { Button } from '../../../../ui/Button';
import { Input } from '../../../../ui/Input';
import { Select } from '../../../../ui/Select';
import { generateGlobalBenchmarkAnalysis } from '../../../../../services/mockAiService';

interface Props {
  data: any;
  onUpdate: (data: any) => void;
  onNext: () => void;
}

const LOCAL_STORAGE_KEY = 'academyPro_assetMarket';

export const GlobalComparisonTab: React.FC<Props> = ({ data, onUpdate, onNext }) => {
  const [inputs, setInputs] = useState({
      assetType: 'Real Estate',
      targetYield: 8.0,
      regionFocus: 'Global',
      regulationPreference: 'Moderate'
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
            // Try to load from LocalMarket inputs if Global is empty
            const localType = parsed.localMarket?.inputs?.assetType;
            
            if (parsed.globalBenchmark?.inputs) {
                setInputs(parsed.globalBenchmark.inputs);
            } else if (localType) {
                setInputs(prev => ({ ...prev, assetType: localType }));
            }

            if (parsed.globalBenchmark?.aiOutput) {
                setAiOutput(parsed.globalBenchmark.aiOutput);
            }
        } catch (e) {
            console.error("Failed to load global benchmark data", e);
        }
    }
  }, []);

  const saveToStorage = () => {
    const existing = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || '{}');
    const updated = {
        ...existing,
        globalBenchmark: {
            inputs,
            aiOutput
        }
    };
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
    onUpdate(updated.globalBenchmark);
  };

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    const result = await generateGlobalBenchmarkAnalysis(inputs);
    setAiOutput(result);
    setIsAnalyzing(false);
    
    // Auto-save after analysis
    const existing = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || '{}');
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify({
        ...existing,
        globalBenchmark: { inputs, aiOutput: result }
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

  return (
    <div className="space-y-8 animate-fadeIn">
        
        {/* INPUTS SECTION */}
        <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-6 flex items-center gap-2">
                <span className="text-xl">🌍</span> Benchmark Parameters
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <Select
                    label="Asset Type"
                    id="assetType"
                    value={inputs.assetType}
                    onChange={e => updateInput('assetType', e.target.value)}
                    options={[
                        { value: 'Real Estate', label: 'Real Estate' },
                        { value: 'Office', label: 'Office' },
                        { value: 'Retail', label: 'Retail' },
                        { value: 'Hospitality', label: 'Hospitality' },
                        { value: 'Industrial', label: 'Industrial' },
                        { value: 'Energy', label: 'Energy / Infrastructure' },
                        { value: 'Debt', label: 'Private Debt' }
                    ]}
                    className="bg-slate-800 border-slate-700 text-white"
                />
                
                <Input 
                    label="Target Yield (%)" 
                    id="yield"
                    type="number"
                    step="0.1"
                    placeholder="8.0" 
                    value={inputs.targetYield} 
                    onChange={e => updateInput('targetYield', parseFloat(e.target.value))} 
                    className="bg-slate-800 border-slate-700 text-white"
                />

                <Select
                    label="Region Focus"
                    id="region"
                    value={inputs.regionFocus}
                    onChange={e => updateInput('regionFocus', e.target.value)}
                    options={[
                        { value: 'Global', label: 'Global' },
                        { value: 'US', label: 'United States' },
                        { value: 'EU', label: 'Europe (EU)' },
                        { value: 'Asia', label: 'Asia Pacific' }
                    ]}
                    className="bg-slate-800 border-slate-700 text-white"
                />

                <Select
                    label="Regulatory Appetite"
                    id="reg"
                    value={inputs.regulationPreference}
                    onChange={e => updateInput('regulationPreference', e.target.value)}
                    options={[
                        { value: 'Light', label: 'Light (Speed priority)' },
                        { value: 'Moderate', label: 'Moderate (Balanced)' },
                        { value: 'Strict', label: 'Strict (Institutional)' }
                    ]}
                    className="bg-slate-800 border-slate-700 text-white"
                />
            </div>
            
            <div className="flex justify-end">
                <Button 
                    onClick={handleAnalyze} 
                    isLoading={isAnalyzing} 
                    className="bg-blue-600 hover:bg-blue-500 text-white shadow-lg"
                >
                    {isAnalyzing ? 'Scanning Markets...' : '🔍 Compare with Leaders'}
                </Button>
            </div>
        </div>

        {/* OUTPUT SECTION */}
        {aiOutput && (
            <div className="animate-slideUp space-y-8">
                
                {/* Strategic Position */}
                <div className="bg-gradient-to-r from-indigo-900/40 to-slate-900 border border-indigo-500/30 p-6 rounded-2xl flex flex-col items-center text-center">
                    <h5 className="text-xs font-bold text-indigo-400 uppercase tracking-widest mb-3">Strategic Positioning</h5>
                    <p className="text-white text-lg font-medium max-w-3xl leading-relaxed">
                        "{aiOutput.strategicPosition}"
                    </p>
                </div>

                {/* Benchmark Table */}
                <div>
                     <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Competitor Landscape</h4>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {aiOutput.benchmarkComparison?.map((comp: any, i: number) => (
                            <div key={i} className="bg-slate-900 border border-slate-800 p-5 rounded-xl hover:border-blue-500/50 transition-colors">
                                <div className="flex justify-between items-start mb-4">
                                     <h4 className="font-bold text-white text-lg">{comp.platformName}</h4>
                                     <span className="text-xs bg-emerald-900/30 text-emerald-400 border border-emerald-500/30 px-2 py-1 rounded font-bold">
                                         {comp.typicalYield} Yield
                                     </span>
                                </div>
                                
                                <p className="text-xs text-slate-400 mb-4 italic">Focus: {comp.focus}</p>
                                
                                <div className="space-y-2 border-t border-slate-800 pt-3">
                                    <div className="flex justify-between text-[11px]">
                                        <span className="text-slate-500 font-bold uppercase">Pro</span>
                                        <span className="text-emerald-300 text-right">{comp.pros}</span>
                                    </div>
                                    <div className="flex justify-between text-[11px]">
                                        <span className="text-slate-500 font-bold uppercase">Con</span>
                                        <span className="text-red-300 text-right">{comp.cons}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* SWOT */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
                         <h5 className="text-xs font-bold text-emerald-500 uppercase tracking-wider mb-3">Your Competitive Strengths</h5>
                         <ul className="space-y-2">
                             {aiOutput.strengths?.map((s: string, i: number) => (
                                 <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                                     <span className="text-emerald-500 font-bold">✓</span> {s}
                                 </li>
                             ))}
                         </ul>
                    </div>
                    <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
                         <h5 className="text-xs font-bold text-red-500 uppercase tracking-wider mb-3">Relative Weaknesses</h5>
                         <ul className="space-y-2">
                             {aiOutput.weaknesses?.map((w: string, i: number) => (
                                 <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                                     <span className="text-red-500 font-bold">!</span> {w}
                                 </li>
                             ))}
                         </ul>
                    </div>
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
