
import React, { useState, useEffect } from 'react';
import { Button } from '../../../../ui/Button';
import { generateLocalMarketAnalysis } from '../../../../../services/mockAiService';
import { Input } from '../../../../ui/Input';
import { Select } from '../../../../ui/Select';

interface Props {
  data: any;
  onUpdate: (data: any) => void;
  onNext: () => void;
}

const LOCAL_STORAGE_KEY = 'academyPro_assetMarket';

export const LocalMarketTab: React.FC<Props> = ({ data, onUpdate, onNext }) => {
  const [inputs, setInputs] = useState({
      city: '',
      districtOrZone: '',
      assetType: 'Residential',
      microDrivers: '',
      comparableUnits: 0
  });

  const [aiOutput, setAiOutput] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
          try {
              const parsed = JSON.parse(saved);
              if (parsed.localMarket) {
                  if (parsed.localMarket.inputs) setInputs(parsed.localMarket.inputs);
                  if (parsed.localMarket.aiOutput) setAiOutput(parsed.localMarket.aiOutput);
              }
          } catch (e) {
              console.error("Failed to load local market data", e);
          }
      }
  }, []);

  const saveToStorage = () => {
      const existing = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || '{}');
      const updated = {
          ...existing,
          localMarket: {
              inputs,
              aiOutput
          }
      };
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
      onUpdate(updated.localMarket); // Sync with parent if needed
  };

  const handleSave = () => {
      setIsSaving(true);
      saveToStorage();
      setTimeout(() => setIsSaving(false), 500);
  };

  const handleNext = () => {
      handleSave();
      onNext();
  };

  const handleAnalyze = async () => {
    if (!inputs.city || !inputs.assetType) {
        alert("Please enter at least City and Asset Type.");
        return;
    }
    setIsAnalyzing(true);
    const result = await generateLocalMarketAnalysis(inputs);
    setAiOutput(result);
    setIsAnalyzing(false);
    // Auto-save after analysis
    const existing = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || '{}');
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify({
        ...existing,
        localMarket: { inputs, aiOutput: result }
    }));
  };

  const updateInput = (field: string, val: any) => {
      setInputs(prev => ({ ...prev, [field]: val }));
  };

  const getScoreColor = (score: number) => {
      if (score >= 80) return 'text-emerald-400';
      if (score >= 60) return 'text-amber-400';
      return 'text-red-400';
  };

  return (
    <div className="space-y-8 animate-fadeIn">
        
        {/* INPUTS SECTION */}
        <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-6 flex items-center gap-2">
                <span className="text-xl">📍</span> Location Parameters
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <Input 
                    label="City" 
                    id="city"
                    placeholder="e.g. London" 
                    value={inputs.city} 
                    onChange={e => updateInput('city', e.target.value)} 
                    className="bg-slate-800 border-slate-700 text-white"
                />
                <Input 
                    label="District / Zone" 
                    id="district"
                    placeholder="e.g. Canary Wharf" 
                    value={inputs.districtOrZone} 
                    onChange={e => updateInput('districtOrZone', e.target.value)} 
                    className="bg-slate-800 border-slate-700 text-white"
                />
                <Select
                    label="Asset Type"
                    id="assetType"
                    value={inputs.assetType}
                    onChange={e => updateInput('assetType', e.target.value)}
                    options={[
                        { value: 'Residential', label: 'Residential' },
                        { value: 'Office', label: 'Office' },
                        { value: 'Retail', label: 'Retail' },
                        { value: 'Boutique Hotel', label: 'Boutique Hotel' },
                        { value: 'Industrial', label: 'Industrial' },
                        { value: 'Mixed Use', label: 'Mixed Use' }
                    ]}
                    className="bg-slate-800 border-slate-700 text-white"
                />
                <Input 
                    label="Comparable Units (Optional)" 
                    id="comps"
                    type="number"
                    placeholder="e.g. 5" 
                    value={inputs.comparableUnits || ''} 
                    onChange={e => updateInput('comparableUnits', parseInt(e.target.value))} 
                    className="bg-slate-800 border-slate-700 text-white"
                />
            </div>
            
            <div className="mb-6">
                <label className="text-xs font-bold text-slate-500 uppercase block mb-2 ml-1">Micro-Location Drivers</label>
                <textarea 
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-4 text-white text-sm focus:ring-2 focus:ring-amber-500 outline-none resize-none h-24 placeholder:text-slate-600"
                    placeholder="Describe demand drivers: e.g. 'New metro line opening 2025', 'University hub', 'High tourism inflow'..."
                    value={inputs.microDrivers}
                    onChange={e => updateInput('microDrivers', e.target.value)}
                />
            </div>

            <div className="flex justify-end">
                <Button 
                    onClick={handleAnalyze} 
                    isLoading={isAnalyzing} 
                    className="bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-900/20"
                >
                    {isAnalyzing ? 'Professor is Thinking...' : '🎓 Ask the Professor'}
                </Button>
            </div>
        </div>

        {/* OUTPUT SECTION */}
        {aiOutput && (
            <div className="animate-slideUp space-y-6">
                
                {/* Scores */}
                <div className="grid grid-cols-3 gap-4">
                    <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 text-center">
                        <span className="text-[10px] uppercase font-bold text-slate-500">Demand</span>
                        <div className={`text-2xl font-bold font-mono ${getScoreColor(aiOutput.demandScore)}`}>{aiOutput.demandScore}</div>
                    </div>
                    <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 text-center">
                        <span className="text-[10px] uppercase font-bold text-slate-500">Supply Constraint</span>
                        <div className={`text-2xl font-bold font-mono ${getScoreColor(aiOutput.supplyScore)}`}>{aiOutput.supplyScore}</div>
                    </div>
                    <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 text-center">
                        <span className="text-[10px] uppercase font-bold text-slate-500">Liquidity Potential</span>
                        <div className={`text-2xl font-bold font-mono ${getScoreColor(aiOutput.liquidityScore)}`}>{aiOutput.liquidityScore}</div>
                    </div>
                </div>

                {/* Narrative & Risks */}
                <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1 h-full bg-amber-500"></div>
                    <div className="mb-4">
                        <h5 className="font-bold text-slate-900 text-lg mb-2">Professor's Verdict</h5>
                        <p className="text-slate-600 text-sm leading-relaxed italic">
                            "{aiOutput.shortNarrative}"
                        </p>
                    </div>
                    
                    <div className="mt-6 pt-4 border-t border-slate-100">
                        <h6 className="text-xs font-bold text-red-500 uppercase mb-2">Key Risk Factors</h6>
                        <ul className="space-y-1">
                            {aiOutput.riskNotes?.map((risk: string, i: number) => (
                                <li key={i} className="text-sm text-slate-700 flex items-start gap-2">
                                    <span className="text-red-400 mt-1">•</span> {risk}
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
            <Button onClick={handleNext} className="bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg">
                Save & Next →
            </Button>
        </div>

    </div>
  );
};
