
import React, { useState, useEffect } from 'react';
import { Button } from '../../../../ui/Button';
import { generateSpvDecisionMatrix } from '../../../../../services/mockAiService';
import { Select } from '../../../../ui/Select';
import { Input } from '../../../../ui/Input';

interface Props {
    onNext?: () => void;
}

export const SpvModelCompare: React.FC<Props> = ({ onNext }) => {
  // Inputs State
  const [inputs, setInputs] = useState({
      structureA: 'Local SPV (AssetCo)',
      structureB: 'Double SPV (HoldCo + OpCo)',
      complexity: 'Low',
      distribution: 'One-off Raise'
  });

  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Load from LocalStorage
  useEffect(() => {
      const saved = localStorage.getItem('academyPro_compare');
      if (saved) {
          try {
              const parsed = JSON.parse(saved);
              if (parsed.spv) {
                  setInputs(parsed.spv.inputs || inputs);
                  setResult(parsed.spv.result);
              }
          } catch(e) {}
      }
  }, []);

  const handleCompare = async () => {
      setLoading(true);
      const data = await generateSpvDecisionMatrix(inputs);
      setResult(data);
      setLoading(false);
      saveState(data);
  };

  const saveState = (dataToSave = result) => {
      const current = JSON.parse(localStorage.getItem('academyPro_compare') || '{}');
      current.spv = { inputs, result: dataToSave };
      localStorage.setItem('academyPro_compare', JSON.stringify(current));
  };

  const handleSaveAndNext = () => {
      setIsSaving(true);
      saveState();
      setTimeout(() => {
          setIsSaving(false);
          if (onNext) onNext();
      }, 500);
  };

  const handleChange = (field: string, val: any) => {
      setInputs(prev => ({ ...prev, [field]: val }));
  };

  const renderScoreRow = (label: string, data: any) => {
      const valA = data?.A || 0;
      const valB = data?.B || 0;
      const reason = data?.reason || 'No analysis available';

      return (
          <div className="border-b border-slate-700/50 pb-3 last:border-0">
              <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">{label}</span>
                  <div className="flex gap-4 text-xs font-mono">
                      <span className="text-indigo-400">A: {valA}</span>
                      <span className="text-emerald-400">B: {valB}</span>
                  </div>
              </div>
              
              <div className="flex h-1.5 w-full bg-slate-800 rounded-full overflow-hidden mb-1">
                  <div style={{ width: `${valA * 10}%` }} className="bg-indigo-500"></div>
              </div>
              <div className="flex h-1.5 w-full bg-slate-800 rounded-full overflow-hidden mb-2">
                  <div style={{ width: `${valB * 10}%` }} className="bg-emerald-500"></div>
              </div>
              
              <p className="text-[10px] text-slate-500 italic">"{reason}"</p>
          </div>
      );
  };

  return (
    <div className="space-y-8 animate-fadeIn">
        
        {/* INPUT CONFIGURATION */}
        <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-lg">
            <div className="flex justify-between items-center mb-6">
                <h4 className="text-sm font-bold text-white uppercase tracking-widest flex items-center gap-2">
                    <span className="text-xl">🏗️</span> Structure Battle
                </h4>
                <div className="text-[10px] bg-slate-800 text-slate-400 px-2 py-1 rounded border border-slate-700">
                    SPV Logic Engine
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div>
                    <Select 
                        label="Structure A"
                        value={inputs.structureA} 
                        onChange={e => handleChange('structureA', e.target.value)} 
                        options={[
                            { value: 'Local SPV (AssetCo)', label: 'Local SPV (AssetCo)' },
                            { value: 'Foreign SPV (Offshore)', label: 'Foreign SPV (Offshore)' },
                            { value: 'Double SPV (HoldCo + OpCo)', label: 'Double SPV (HoldCo + OpCo)' },
                            { value: 'Fund Structure (LP/GP)', label: 'Fund Structure (LP/GP)' }
                        ]}
                        className="bg-slate-800 border-slate-700 text-white text-sm"
                    />
                </div>
                <div className="flex items-center justify-center pt-6 text-slate-600 font-bold">VS</div>
                <div>
                    <Select 
                        label="Structure B"
                        value={inputs.structureB} 
                        onChange={e => handleChange('structureB', e.target.value)} 
                        options={[
                            { value: 'Local SPV (AssetCo)', label: 'Local SPV (AssetCo)' },
                            { value: 'Foreign SPV (Offshore)', label: 'Foreign SPV (Offshore)' },
                            { value: 'Double SPV (HoldCo + OpCo)', label: 'Double SPV (HoldCo + OpCo)' },
                            { value: 'Fund Structure (LP/GP)', label: 'Fund Structure (LP/GP)' }
                        ]}
                        className="bg-slate-800 border-slate-700 text-white text-sm"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                 <div>
                    <Select 
                        label="Operations Complexity"
                        value={inputs.complexity} 
                        onChange={e => handleChange('complexity', e.target.value)} 
                        options={[
                            { value: 'Low', label: 'Low (Passive Holding)' },
                            { value: 'Medium', label: 'Medium (Active Mgmt)' },
                            { value: 'High', label: 'High (Development/Trading)' }
                        ]}
                        className="bg-slate-800 border-slate-700 text-white text-sm"
                    />
                </div>
                 <div>
                    <Select 
                        label="Capital Model"
                        value={inputs.distribution} 
                        onChange={e => handleChange('distribution', e.target.value)} 
                        options={[
                            { value: 'One-off Raise', label: 'One-off Raise' },
                            { value: 'Ongoing Subscriptions', label: 'Ongoing Subscriptions' },
                            { value: 'Revolving Fund', label: 'Revolving Fund' }
                        ]}
                        className="bg-slate-800 border-slate-700 text-white text-sm"
                    />
                </div>
            </div>

            <div className="flex justify-center">
                <Button 
                    onClick={handleCompare} 
                    isLoading={loading} 
                    className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-xl px-12 py-3"
                >
                    {loading ? 'Analyzing Structures...' : '🧬 Compare DNA'}
                </Button>
            </div>
        </div>

        {/* RESULTS */}
        {result && (
            <div className="animate-slideUp space-y-6">
                
                {/* 1. DIDACTIC EXPLANATION */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-indigo-900/10 border border-indigo-500/20 p-5 rounded-xl">
                        <h5 className="text-xs font-bold text-indigo-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                             <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                             {inputs.structureA}
                        </h5>
                        <p className="text-sm text-indigo-100/80 leading-relaxed font-light">
                            {result.explanations?.structureA}
                        </p>
                    </div>
                    <div className="bg-emerald-900/10 border border-emerald-500/20 p-5 rounded-xl">
                         <h5 className="text-xs font-bold text-emerald-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                             <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                             {inputs.structureB}
                        </h5>
                        <p className="text-sm text-emerald-100/80 leading-relaxed font-light">
                            {result.explanations?.structureB}
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    
                    {/* 2. REASONED SCORECARD */}
                    <div className="lg:col-span-7 bg-slate-900 p-6 rounded-2xl border border-slate-800">
                        <h4 className="text-sm font-bold text-white uppercase tracking-widest mb-6">Structural Scoring</h4>
                        <div className="space-y-4">
                            {renderScoreRow("Bankruptcy Remote", result.scorecard?.bankruptcyRemote)}
                            {renderScoreRow("Tax & Ops Complexity", result.scorecard?.taxOps)}
                            {renderScoreRow("Investor Comfort", result.scorecard?.investorComfort)}
                            {renderScoreRow("Bankability", result.scorecard?.bankability)}
                            {renderScoreRow("Cost Efficiency", result.scorecard?.costEfficiency)}
                        </div>
                    </div>

                    {/* 3. FAILURE MODES */}
                    <div className="lg:col-span-5 space-y-4">
                        <div className="p-4 bg-red-900/20 border border-red-500/20 rounded-xl">
                             <h4 className="text-xs font-bold text-red-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                                <span>💥</span> Failure Modes
                             </h4>
                             <div className="space-y-3">
                                 {(result.failureModes || []).map((mode: any, i: number) => (
                                     <div key={i} className="bg-slate-900/50 p-3 rounded-lg border border-red-500/10">
                                         <div className="flex justify-between items-start mb-1">
                                             <span className="text-xs font-bold text-white">{mode.mode}</span>
                                             <span className="text-[10px] text-slate-500 bg-slate-800 px-1.5 rounded">{mode.structure}</span>
                                         </div>
                                         <div className="text-[10px] text-slate-400 mt-1">
                                             <strong className="text-emerald-500">Fix:</strong> {mode.prevention}
                                         </div>
                                     </div>
                                 ))}
                             </div>
                        </div>

                         {/* 4. CONDITIONAL RECOMMENDATION */}
                         <div className="bg-slate-50 border border-slate-200 p-5 rounded-xl h-full">
                            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Professor's Verdict</h4>
                            
                            <div className="mb-4">
                                <span className="block text-[10px] text-emerald-600 font-bold uppercase mb-1">Primary Choice</span>
                                <p className="text-sm text-slate-800 font-medium leading-relaxed">
                                    {result.recommendation?.primary}
                                </p>
                            </div>
                            
                            <div className="pt-3 border-t border-slate-200">
                                <span className="block text-[10px] text-amber-600 font-bold uppercase mb-1">Alternative Scenario</span>
                                <p className="text-xs text-slate-600 leading-relaxed italic">
                                    {result.recommendation?.alternative}
                                </p>
                            </div>
                        </div>
                    </div>

                </div>

            </div>
        )}

        {/* FOOTER */}
        <div className="flex justify-end pt-6 border-t border-slate-200/50">
            <Button 
                onClick={handleSaveAndNext} 
                disabled={isSaving || !result}
                className="bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg px-8 py-3 font-bold flex items-center gap-2"
            >
                {isSaving ? 'Saving...' : 'Save & Next: Token Types →'}
            </Button>
        </div>

    </div>
  );
};
