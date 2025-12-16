
import React, { useState } from 'react';
import { Button } from '../../../../ui/Button';
import { generateSpvStrategyAdvanced } from '../../../../../services/mockAiService';

interface Props {
  data: any;
  onUpdate: (data: any) => void;
  onResult: (result: any) => void;
}

export const StrategicContextBuilder: React.FC<Props> = ({ data, onUpdate, onResult }) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleChange = (key: string, value: string) => {
    onUpdate({ [key]: value });
  };

  const handleAnalyze = async () => {
      setIsAnalyzing(true);
      const result = await generateSpvStrategyAdvanced(data);
      onResult(result);
      setIsAnalyzing(false);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 to-indigo-900 rounded-2xl p-8 text-white relative overflow-hidden shadow-lg">
            <div className="relative z-10">
                <h3 className="text-2xl font-bold font-display mb-2">Strategic Context Builder</h3>
                <p className="text-indigo-200 text-sm max-w-2xl">
                    The legal structure (SPV) is not one-size-fits-all. It depends on 12 critical vectors.
                    Fill in the details below to generate a tailored "Jurisdictional Blueprint".
                </p>
            </div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* COLUMN 1: ASSET DNA */}
            <div className="bg-white p-6 rounded-2xl border border-sim-border shadow-sm space-y-5">
                <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                    <span className="text-xl">📍</span>
                    <h4 className="font-bold text-slate-800 text-sm uppercase tracking-wider">Asset DNA</h4>
                </div>
                
                <div>
                    <label className="text-xs font-bold text-slate-500 uppercase block mb-2">Jurisdiction</label>
                    <div className="grid grid-cols-2 gap-2">
                        <input 
                            value={data.locationCountry}
                            onChange={(e) => handleChange('locationCountry', e.target.value)}
                            placeholder="Country"
                            className="bg-slate-50 border border-sim-border rounded-lg p-2 text-sm outline-none focus:border-sim-blue"
                        />
                         <input 
                            value={data.locationCity}
                            onChange={(e) => handleChange('locationCity', e.target.value)}
                            placeholder="City"
                            className="bg-slate-50 border border-sim-border rounded-lg p-2 text-sm outline-none focus:border-sim-blue"
                        />
                    </div>
                </div>

                <div>
                    <label className="text-xs font-bold text-slate-500 uppercase block mb-2">Current Ownership</label>
                    <select 
                        value={data.currentOwnership}
                        onChange={(e) => handleChange('currentOwnership', e.target.value)}
                        className="w-full bg-slate-50 border border-sim-border rounded-lg p-2 text-sm outline-none focus:border-sim-blue"
                    >
                        <option>Owned by Developer</option>
                        <option>Owned by SPV</option>
                        <option>Option to Buy</option>
                        <option>Distressed / Auction</option>
                    </select>
                </div>

                 <div>
                    <label className="text-xs font-bold text-slate-500 uppercase block mb-2">Timeframe (Exit)</label>
                    <select 
                        value={data.timeframe}
                        onChange={(e) => handleChange('timeframe', e.target.value)}
                        className="w-full bg-slate-50 border border-sim-border rounded-lg p-2 text-sm outline-none focus:border-sim-blue"
                    >
                        <option>1-2 Years (Flip)</option>
                        <option>3-5 Years (Value Add)</option>
                        <option>5-10 Years (Hold)</option>
                        <option>Perpetual</option>
                    </select>
                </div>
            </div>

            {/* COLUMN 2: INVESTOR PROFILE */}
            <div className="bg-white p-6 rounded-2xl border border-sim-border shadow-sm space-y-5">
                <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                    <span className="text-xl">👥</span>
                    <h4 className="font-bold text-slate-800 text-sm uppercase tracking-wider">Investor Profile</h4>
                </div>

                <div>
                    <label className="text-xs font-bold text-slate-500 uppercase block mb-2">Origin</label>
                    <select 
                        value={data.investorOrigin}
                        onChange={(e) => handleChange('investorOrigin', e.target.value)}
                        className="w-full bg-slate-50 border border-sim-border rounded-lg p-2 text-sm outline-none focus:border-sim-blue"
                    >
                        <option>Local Only</option>
                        <option>EU / EEA</option>
                        <option>US (Accredited)</option>
                        <option>Global (Crypto Native)</option>
                    </select>
                </div>

                <div>
                    <label className="text-xs font-bold text-slate-500 uppercase block mb-2">Type</label>
                    <select 
                        value={data.investorType}
                        onChange={(e) => handleChange('investorType', e.target.value)}
                        className="w-full bg-slate-50 border border-sim-border rounded-lg p-2 text-sm outline-none focus:border-sim-blue"
                    >
                        <option>Retail (Crowd)</option>
                        <option>Accredited / HNWI</option>
                        <option>Institutional / Family Office</option>
                    </select>
                </div>

                 <div>
                    <label className="text-xs font-bold text-slate-500 uppercase block mb-2">Target Raise</label>
                    <select 
                        value={data.targetRaise}
                        onChange={(e) => handleChange('targetRaise', e.target.value)}
                        className="w-full bg-slate-50 border border-sim-border rounded-lg p-2 text-sm outline-none focus:border-sim-blue"
                    >
                        <option>{'<'} $1M</option>
                        <option>$1M - $5M</option>
                        <option>$5M - $20M</option>
                        <option>{'>'} $20M</option>
                    </select>
                </div>

                <div>
                    <label className="text-xs font-bold text-slate-500 uppercase block mb-2">Cross-Border Needs</label>
                    <div className="flex gap-2">
                        {['Yes', 'No'].map(opt => (
                            <button
                                key={opt}
                                onClick={() => handleChange('crossBorder', opt)}
                                className={`flex-1 py-2 text-xs font-bold rounded-lg border ${data.crossBorder === opt ? 'bg-indigo-50 border-indigo-500 text-indigo-700' : 'bg-white border-slate-200 text-slate-500'}`}
                            >
                                {opt}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* COLUMN 3: STRATEGIC PRIORITIES */}
            <div className="bg-white p-6 rounded-2xl border border-sim-border shadow-sm space-y-5">
                <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                    <span className="text-xl">⚖️</span>
                    <h4 className="font-bold text-slate-800 text-sm uppercase tracking-wider">Priorities</h4>
                </div>

                <div>
                    <label className="text-xs font-bold text-slate-500 uppercase block mb-2">Capital Structure</label>
                    <select 
                        value={data.capitalStructure}
                        onChange={(e) => handleChange('capitalStructure', e.target.value)}
                        className="w-full bg-slate-50 border border-sim-border rounded-lg p-2 text-sm outline-none focus:border-sim-blue"
                    >
                        <option>Equity (Shares)</option>
                        <option>Debt (Bonds)</option>
                        <option>Revenue Share</option>
                        <option>Hybrid</option>
                    </select>
                </div>

                <div>
                    <label className="text-xs font-bold text-slate-500 uppercase block mb-2">Legal Priority</label>
                    <select 
                        value={data.legalPriority}
                        onChange={(e) => handleChange('legalPriority', e.target.value)}
                        className="w-full bg-slate-50 border border-sim-border rounded-lg p-2 text-sm outline-none focus:border-sim-blue"
                    >
                        <option value="Simplicity">Simplicity (Speed)</option>
                        <option value="Optimization">Tax Optimization</option>
                        <option value="Protection">Asset Protection</option>
                    </select>
                </div>

                 <div>
                    <label className="text-xs font-bold text-slate-500 uppercase block mb-2">Governance</label>
                    <select 
                        value={data.governancePref}
                        onChange={(e) => handleChange('governancePref', e.target.value)}
                        className="w-full bg-slate-50 border border-sim-border rounded-lg p-2 text-sm outline-none focus:border-sim-blue"
                    >
                        <option>Centralized (GP Run)</option>
                        <option>Shared (Board)</option>
                        <option>DAO (Token Voting)</option>
                    </select>
                </div>
            </div>

        </div>

        <div className="flex justify-end">
            <Button 
                onClick={handleAnalyze} 
                isLoading={isAnalyzing}
                className="bg-sim-cta hover:bg-sim-cta-hover text-white shadow-xl px-10 py-4 font-bold text-lg rounded-xl"
            >
                {isAnalyzing ? 'Architecting Solution...' : 'Generate Strategic Blueprint'}
            </Button>
        </div>
    </div>
  );
};
