
import React, { useState, useEffect } from 'react';
import { Button } from '../../../../ui/Button';
import { generateJurisdictionDecisionMatrix } from '../../../../../services/mockAiService';
import { Select } from '../../../../ui/Select';
import { Input } from '../../../../ui/Input';

interface Props {
    onNext?: () => void;
}

export const JurisdictionCompare: React.FC<Props> = ({ onNext }) => {
  // Inputs State
  const [inputs, setInputs] = useState({
      optionA: 'United States (Delaware)',
      optionB: 'Italy (S.r.l.)',
      assetContext: 'Real Estate (Commercial)',
      investorType: 'Accredited / Professional',
      timeline: '3 Months',
      budget: '$10k - $20k'
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
              if (parsed.jurisdiction) {
                  setInputs(parsed.jurisdiction.inputs || inputs);
                  setResult(parsed.jurisdiction.result);
              }
          } catch(e) {}
      }
  }, []);

  const handleCompare = async () => {
      setLoading(true);
      const data = await generateJurisdictionDecisionMatrix(inputs);
      setResult(data);
      setLoading(false);
      saveState(data);
  };

  const saveState = (dataToSave = result) => {
      const current = JSON.parse(localStorage.getItem('academyPro_compare') || '{}');
      current.jurisdiction = { inputs, result: dataToSave };
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

  const renderBar = (valA: number, valB: number) => (
      <div className="flex items-center gap-2 text-xs w-full">
          <div className="flex-1 flex justify-end gap-2 items-center">
              <span className="font-bold text-slate-400">{valA}</span>
              <div className="h-2 rounded-l-full bg-indigo-500" style={{ width: `${valA * 10}%` }}></div>
          </div>
          <div className="w-px h-4 bg-slate-700"></div>
          <div className="flex-1 flex justify-start gap-2 items-center">
              <div className="h-2 rounded-r-full bg-emerald-500" style={{ width: `${valB * 10}%` }}></div>
              <span className="font-bold text-slate-400">{valB}</span>
          </div>
      </div>
  );

  // Safe access helper
  const getRecommendationText = (key: 'chooseAIf' | 'chooseBIf') => {
      if (!result || !result.recommendation) return '';
      const text = result.recommendation[key];
      return typeof text === 'string' ? text : JSON.stringify(text);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
        
        {/* INPUT CONFIGURATION */}
        <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-lg">
            <div className="flex justify-between items-center mb-6">
                <h4 className="text-sm font-bold text-white uppercase tracking-widest flex items-center gap-2">
                    <span className="text-xl">⚖️</span> Battle Configuration
                </h4>
                <div className="text-[10px] bg-slate-800 text-slate-400 px-2 py-1 rounded border border-slate-700">
                    AI Decision Matrix
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Contenders */}
                <div className="space-y-4 p-4 bg-slate-950/50 rounded-xl border border-slate-700/50">
                    <h5 className="text-xs font-bold text-indigo-400 uppercase mb-2">The Contenders</h5>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-[10px] text-slate-500 uppercase font-bold block mb-1">Jurisdiction A</label>
                            <input 
                                value={inputs.optionA} 
                                onChange={e => handleChange('optionA', e.target.value)} 
                                className="w-full bg-slate-900 text-white p-2 rounded border border-indigo-500/30 focus:border-indigo-500 outline-none text-sm"
                            />
                        </div>
                        <div>
                            <label className="text-[10px] text-slate-500 uppercase font-bold block mb-1">Jurisdiction B</label>
                            <input 
                                value={inputs.optionB} 
                                onChange={e => handleChange('optionB', e.target.value)} 
                                className="w-full bg-slate-900 text-white p-2 rounded border border-emerald-500/30 focus:border-emerald-500 outline-none text-sm"
                            />
                        </div>
                    </div>
                </div>

                {/* Context */}
                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <Input 
                            label="Asset Context" 
                            value={inputs.assetContext} 
                            onChange={e => handleChange('assetContext', e.target.value)} 
                            className="bg-slate-800 border-slate-700 text-white text-xs"
                        />
                        <Select 
                            label="Target Investor" 
                            options={[
                                { value: 'Retail (Public)', label: 'Retail (Public)' },
                                { value: 'Accredited / Professional', label: 'Accredited / Professional' },
                                { value: 'Institutional Only', label: 'Institutional Only' }
                            ]}
                            value={inputs.investorType} 
                            onChange={e => handleChange('investorType', e.target.value)}
                            className="bg-slate-800 border-slate-700 text-white text-xs"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <Input 
                            label="Timeline" 
                            value={inputs.timeline} 
                            onChange={e => handleChange('timeline', e.target.value)} 
                            className="bg-slate-800 border-slate-700 text-white text-xs"
                        />
                        <Input 
                            label="Est. Budget" 
                            value={inputs.budget} 
                            onChange={e => handleChange('budget', e.target.value)} 
                            className="bg-slate-800 border-slate-700 text-white text-xs"
                        />
                    </div>
                </div>
            </div>

            <div className="mt-8 flex justify-center">
                <Button 
                    onClick={handleCompare} 
                    isLoading={loading} 
                    className="bg-gradient-to-r from-indigo-600 to-emerald-600 hover:from-indigo-500 hover:to-emerald-500 text-white shadow-xl px-12 py-3"
                >
                    {loading ? 'Running Simulation...' : '⚔️ Run Head-to-Head Analysis'}
                </Button>
            </div>
        </div>

        {/* RESULTS */}
        {result && (
            <div className="animate-slideUp grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* Winner Card */}
                <div className="lg:col-span-12 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row items-center gap-6">
                    <div className="w-20 h-20 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center text-4xl shadow-inner shrink-0">
                        🏆
                    </div>
                    <div className="flex-1">
                        <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1">Strategic Verdict</h4>
                        <h3 className="text-2xl font-bold text-slate-900 mb-2">Winner: <span className="text-indigo-600">{result.winner}</span></h3>
                        <p className="text-slate-600 text-sm leading-relaxed border-l-4 border-amber-400 pl-4 italic">
                            "{result.verdict}"
                        </p>
                    </div>
                </div>

                {/* Scoring Matrix */}
                <div className="lg:col-span-7 bg-slate-900 rounded-2xl p-6 border border-slate-800">
                    <div className="flex justify-between mb-6 border-b border-slate-800 pb-4">
                        <span className="text-indigo-400 font-bold text-sm truncate w-1/3">{inputs.optionA}</span>
                        <span className="text-slate-500 text-xs uppercase font-bold tracking-widest text-center w-1/3">vs</span>
                        <span className="text-emerald-400 font-bold text-sm text-right truncate w-1/3">{inputs.optionB}</span>
                    </div>
                    <div className="space-y-4">
                        <div className="space-y-1">
                            <div className="text-center text-[10px] text-slate-500 uppercase">Regulatory Clarity</div>
                            {renderBar(result.scores.regClarity.A, result.scores.regClarity.B)}
                        </div>
                        <div className="space-y-1">
                            <div className="text-center text-[10px] text-slate-500 uppercase">Setup Friction</div>
                            {renderBar(result.scores.setupFriction.A, result.scores.setupFriction.B)}
                        </div>
                        <div className="space-y-1">
                            <div className="text-center text-[10px] text-slate-500 uppercase">Cost Efficiency</div>
                            {renderBar(result.scores.costEfficiency.A, result.scores.costEfficiency.B)}
                        </div>
                        <div className="space-y-1">
                            <div className="text-center text-[10px] text-slate-500 uppercase">Investor Access</div>
                            {renderBar(result.scores.investorAccess.A, result.scores.investorAccess.B)}
                        </div>
                         <div className="space-y-1">
                            <div className="text-center text-[10px] text-slate-500 uppercase">Reporting Burden</div>
                            {renderBar(result.scores.reportingBurden.A, result.scores.reportingBurden.B)}
                        </div>
                    </div>
                </div>

                {/* Red Flags & Advice */}
                <div className="lg:col-span-5 flex flex-col gap-6">
                    <div className="bg-red-50 border border-red-100 rounded-xl p-5">
                        <h5 className="text-xs font-bold text-red-600 uppercase mb-3 flex items-center gap-2">
                            <span>🚩</span> Critical Red Flags
                        </h5>
                        <ul className="space-y-3">
                            {(result.redFlags || []).map((flag: any, i: number) => (
                                <li key={i} className="text-xs">
                                    <span className="font-bold text-red-800 block mb-0.5">{flag.jurisdiction} Risk:</span>
                                    <span className="text-slate-700">{flag.risk}. </span>
                                    <span className="text-slate-500 italic">Fix: {flag.mitigation}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 flex-1">
                        <h5 className="text-xs font-bold text-slate-500 uppercase mb-3">Best-Fit Guide</h5>
                        <div className="space-y-3">
                            <div className="text-xs text-slate-600">
                                <strong className="text-indigo-600 block mb-1">Choose {inputs.optionA} if:</strong>
                                {getRecommendationText('chooseAIf')}
                            </div>
                            <div className="w-full h-px bg-slate-200"></div>
                            <div className="text-xs text-slate-600">
                                <strong className="text-emerald-600 block mb-1">Choose {inputs.optionB} if:</strong>
                                {getRecommendationText('chooseBIf')}
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
                {isSaving ? 'Saving...' : 'Save & Next: SPV Model →'}
            </Button>
        </div>

    </div>
  );
};
