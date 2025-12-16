
import React, { useState, useEffect } from 'react';
import { Button } from '../../../../ui/Button';
import { Select } from '../../../../ui/Select';
import { generateTreasuryRulesAnalysis } from '../../../../../services/mockAiService';

interface Props {
  onNext?: () => void;
  // Legacy props
  data?: any;
  onUpdate?: (data: any) => void;
}

const LOCAL_STORAGE_KEY = 'academyPro_payout';

export const TreasuryRules: React.FC<Props> = ({ onNext }) => {
  const [inputs, setInputs] = useState({
      maintenanceReservePct: 5,
      executionMethod: 'Smart Contract (Auto)',
      complianceRestrictions: [] as string[],
      jurisdiction: 'USA',
      assetType: 'Real Estate',
      volatilityProfile: 'Medium',
      treasuryGoals: ['Capital Preservation']
  });

  const [aiOutput, setAiOutput] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
        try {
            const parsed = JSON.parse(saved);
            if (parsed.treasuryRules) {
                if (parsed.treasuryRules.inputs) setInputs(prev => ({ ...prev, ...parsed.treasuryRules.inputs }));
                if (parsed.treasuryRules.aiOutput) setAiOutput(parsed.treasuryRules.aiOutput);
            }
        } catch(e) { console.error(e); }
    }
  }, []);

  const handleChange = (field: string, val: any) => {
      setInputs(prev => ({ ...prev, [field]: val }));
  };

  const handleAnalyze = async () => {
      setIsAnalyzing(true);
      const result = await generateTreasuryRulesAnalysis(inputs);
      setAiOutput(result);
      setIsAnalyzing(false);
      saveToStorage(result);
  };

  const saveToStorage = (output = aiOutput) => {
      const existing = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || '{}');
      const updated = {
          ...existing,
          treasuryRules: {
              inputs,
              aiOutput: output
          }
      };
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
        
        {/* Left: Configuration */}
        <div className="lg:col-span-4 space-y-10">
             <div>
                <h2 className="text-3xl font-display font-bold text-slate-900 mb-6">Treasury Governance</h2>
                <p className="text-slate-500 text-lg leading-relaxed">
                    Define how funds are held, secured, and released.
                </p>
            </div>
            
            <div className="space-y-8">
                <div>
                    <div className="flex justify-between items-center mb-3">
                        <label className="text-xs font-bold text-slate-500 uppercase">Maintenance Reserve</label>
                        <span className="text-lg font-bold text-indigo-600">{inputs.maintenanceReservePct}% of Gross</span>
                    </div>
                    <input 
                        type="range" min="0" max="20" step="0.5" 
                        value={inputs.maintenanceReservePct} 
                        onChange={e => handleChange('maintenanceReservePct', parseFloat(e.target.value))} 
                        className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600" 
                    />
                    <p className="text-xs text-slate-400 mt-2">Buffer for repairs/vacancy.</p>
                </div>

                <div>
                    <label className="text-xs font-bold text-slate-500 uppercase block mb-3">Execution Method</label>
                    <Select 
                        label="Method"
                        value={inputs.executionMethod} 
                        onChange={e => handleChange('executionMethod', e.target.value)} 
                        options={[
                            { value: 'Smart Contract (Auto)', label: 'Smart Contract (Automated)' }, 
                            { value: 'Multi-Sig Wallet', label: 'Multi-Sig (2 of 3)' }, 
                            { value: 'Manual (Bank)', label: 'Manual Bank Transfer' }
                        ]} 
                        className="w-full bg-white border border-slate-200 rounded-xl p-4 text-slate-900 outline-none focus:border-indigo-500 text-base" 
                    />
                </div>
                
                <div className="pt-8">
                    <Button onClick={handleAnalyze} isLoading={isAnalyzing} className="w-full py-4 text-lg bg-slate-900 text-white hover:bg-slate-800">
                        Analyze Governance
                    </Button>
                </div>
            </div>
        </div>

        {/* Right: AI Feedback */}
        <div className="lg:col-span-8 flex flex-col pl-8 border-l border-slate-200 justify-center items-center relative">
            
            {/* Visual Gauge */}
            <div className="relative w-80 h-80 flex items-center justify-center mb-10">
                 <svg className="w-full h-full transform -rotate-90">
                    <circle cx="160" cy="160" r="140" stroke="#f1f5f9" strokeWidth="20" fill="none" />
                    <circle 
                        cx="160" cy="160" r="140" 
                        stroke={aiOutput?.robustnessScore > 80 ? '#10b981' : aiOutput?.robustnessScore > 50 ? '#f59e0b' : '#ef4444'} 
                        strokeWidth="20" 
                        fill="none"
                        strokeDasharray={880} 
                        strokeDashoffset={880 - (880 * (aiOutput?.robustnessScore || 0)) / 100}
                        strokeLinecap="round"
                        className="transition-all duration-1000 ease-out"
                    />
                 </svg>
                 <div className="absolute inset-0 flex flex-col items-center justify-center">
                     <span className="text-6xl font-display font-bold text-slate-900">{aiOutput?.robustnessScore || 0}</span>
                     <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-2">Safety Score</span>
                 </div>
            </div>

            {aiOutput && (
                <div className="w-full max-w-2xl animate-slideUp text-center">
                    <h4 className="text-xl font-bold text-indigo-900 mb-4">Scholar's Assessment</h4>
                    <div className="space-y-3">
                        {aiOutput.education?.map((pt: string, i: number) => (
                            <p key={i} className="text-lg text-slate-600 leading-relaxed">
                                {pt}
                            </p>
                        ))}
                    </div>
                </div>
            )}

            <div className="mt-auto w-full flex justify-end pt-12">
                <Button onClick={handleSaveNext} disabled={isSaving} className="bg-indigo-600 hover:bg-indigo-500 text-white px-10 py-4 text-lg shadow-xl shadow-indigo-200">
                    {isSaving ? 'Saving...' : 'Save & Continue →'}
                </Button>
            </div>
        </div>
    </div>
  );
};
