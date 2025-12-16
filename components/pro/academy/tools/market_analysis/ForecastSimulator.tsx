
import React, { useState, useEffect } from 'react';
import { generateForecastAnalysis } from '../../../../../services/mockAiService';
import { Button } from '../../../../ui/Button';

interface Props {
  data: any;
  onUpdate: (data: any) => void;
  onNext: () => void;
}

const LOCAL_STORAGE_KEY = 'academyPro_assetMarket';

export const ForecastSimulator: React.FC<Props> = ({ data, onUpdate, onNext }) => {
  const [inputs, setInputs] = useState({
      occupancyRate: 90,
      monthlyRent: 5000,
      marketCapRate: 6.0
  });

  const [calcs, setCalcs] = useState({
      noi: 0,
      valuation: 0
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
            if (parsed.forecastSim) {
                if (parsed.forecastSim.inputs) setInputs(parsed.forecastSim.inputs);
                if (parsed.forecastSim.calcs) setCalcs(parsed.forecastSim.calcs);
                if (parsed.forecastSim.aiOutput) setAiOutput(parsed.forecastSim.aiOutput);
            }
        } catch (e) {
            console.error("Failed to load forecast data", e);
        }
    }
  }, []);

  // Update Calculations on Input Change
  useEffect(() => {
      const noi = inputs.monthlyRent * (inputs.occupancyRate / 100) * 12;
      const capRateDecimal = inputs.marketCapRate / 100;
      const valuation = capRateDecimal > 0 ? noi / capRateDecimal : 0;
      
      setCalcs({ noi, valuation });
  }, [inputs]);

  const saveToStorage = () => {
      const existing = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || '{}');
      const updated = {
          ...existing,
          forecastSim: {
              inputs,
              calcs,
              aiOutput
          }
      };
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
      onUpdate(updated.forecastSim);
  };

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    const result = await generateForecastAnalysis(inputs, calcs);
    setAiOutput(result);
    setIsAnalyzing(false);
    
    // Auto-save
    const existing = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || '{}');
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify({
        ...existing,
        forecastSim: { inputs, calcs, aiOutput: result }
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
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* LEFT: INPUTS */}
            <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 space-y-6">
                <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-2 flex items-center gap-2">
                    <span className="text-xl">🎛️</span> Variables
                </h4>

                <div>
                    <div className="flex justify-between text-xs font-bold text-slate-400 mb-2">
                        <span>Occupancy Rate</span>
                        <span className="text-blue-400">{inputs.occupancyRate}%</span>
                    </div>
                    <input 
                        type="range" min="0" max="100" step="1" 
                        value={inputs.occupancyRate} 
                        onChange={e => updateInput('occupancyRate', parseInt(e.target.value))} 
                        className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500" 
                    />
                </div>

                <div>
                    <div className="flex justify-between text-xs font-bold text-slate-400 mb-2">
                        <span>Monthly Rent (Gross)</span>
                        <span className="text-emerald-400">${inputs.monthlyRent.toLocaleString()}</span>
                    </div>
                    <input 
                        type="range" min="500" max="50000" step="500" 
                        value={inputs.monthlyRent} 
                        onChange={e => updateInput('monthlyRent', parseInt(e.target.value))} 
                        className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500" 
                    />
                </div>

                <div>
                    <div className="flex justify-between text-xs font-bold text-slate-400 mb-2">
                        <span>Market Cap Rate</span>
                        <span className="text-amber-400">{inputs.marketCapRate}%</span>
                    </div>
                    <input 
                        type="range" min="2" max="15" step="0.1" 
                        value={inputs.marketCapRate} 
                        onChange={e => updateInput('marketCapRate', parseFloat(e.target.value))} 
                        className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500" 
                    />
                </div>
            </div>

            {/* RIGHT: REAL-TIME CALCS */}
            <div className="bg-gradient-to-br from-slate-900 to-indigo-900 p-6 rounded-xl border border-indigo-500/30 flex flex-col justify-center relative overflow-hidden">
                <div className="absolute top-0 right-0 p-6 opacity-10 text-8xl pointer-events-none">📊</div>
                
                <h4 className="text-sm font-bold text-indigo-300 uppercase tracking-wider mb-6 relative z-10">Forecast Output</h4>
                
                <div className="space-y-6 relative z-10">
                    <div>
                        <span className="text-xs text-slate-400 uppercase font-bold block mb-1">Annual NOI</span>
                        <div className="text-3xl font-mono font-bold text-white">
                            ${(calcs.noi || 0).toLocaleString(undefined, {maximumFractionDigits:0})}
                        </div>
                    </div>
                    
                    <div className="pt-4 border-t border-white/10">
                        <span className="text-xs text-slate-400 uppercase font-bold block mb-1">Implied Valuation</span>
                        <div className="text-4xl font-mono font-bold text-emerald-400">
                            ${(calcs.valuation || 0).toLocaleString(undefined, {maximumFractionDigits:0})}
                        </div>
                    </div>
                </div>

                <div className="mt-8 relative z-10">
                    <Button onClick={handleAnalyze} isLoading={isAnalyzing} className="w-full bg-white text-indigo-900 hover:bg-indigo-50">
                        {isAnalyzing ? 'Running AI Models...' : '🧠 Run AI Forecast'}
                    </Button>
                </div>
            </div>

        </div>

        {/* AI OUTPUT */}
        {aiOutput && (
            <div className="animate-slideUp bg-slate-800/50 p-6 rounded-xl border border-slate-700">
                <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                    <span>🤖</span> AI Verdict
                </h4>
                
                <p className="text-sm text-slate-300 italic mb-6 leading-relaxed">
                    "{aiOutput.commentary}"
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-red-900/20 border border-red-500/20 p-4 rounded-lg">
                        <span className="text-xs font-bold text-red-400 uppercase block mb-2">Warnings</span>
                        <ul className="list-disc list-inside text-xs text-red-200 space-y-1">
                            {aiOutput.warnings?.map((w: string, i: number) => <li key={i}>{w}</li>)}
                            {(!aiOutput.warnings || aiOutput.warnings.length === 0) && <li>No critical warnings.</li>}
                        </ul>
                    </div>
                    <div className="bg-amber-900/20 border border-amber-500/20 p-4 rounded-lg">
                        <span className="text-xs font-bold text-amber-400 uppercase block mb-2">Sensitivity Note</span>
                        <p className="text-xs text-amber-200">{aiOutput.sensitivityNote}</p>
                    </div>
                </div>
            </div>
        )}

        {/* FOOTER ACTIONS */}
        <div className="flex justify-end gap-4 pt-4 border-t border-slate-200/20">
            <Button onClick={handleSave} disabled={isSaving} variant="secondary" className="border-slate-600 text-slate-400 hover:text-white hover:bg-slate-800">
                {isSaving ? 'Saving...' : 'Save Progress'}
            </Button>
            <Button onClick={handleSaveAndNext} className="bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg">
                Save & Continue to Export →
            </Button>
        </div>

    </div>
  );
};
