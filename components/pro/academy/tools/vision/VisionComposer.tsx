
import React, { useState, useEffect } from 'react';
import { Button } from '../../../../ui/Button';

interface Props {
  data: any;
  onUpdate: (data: any) => void;
  onNext: () => void;
}

export const VisionComposer: React.FC<Props> = ({ data, onUpdate, onNext }) => {
  const [inputs, setInputs] = useState(data.inputs || {
    goal: 'Capital Raise',
    timeframe: '6-12 Months',
    geography: 'Global',
    risk: 'Moderate',
    control: 'Shared',
    amount: '1M-5M',
    tech: 'Proven Standards'
  });

  const [statement, setStatement] = useState(data.statement || '');

  useEffect(() => {
      // Auto-generate statement
      const newStatement = `To achieve a ${inputs.goal} of ${inputs.amount} within ${inputs.timeframe}, focusing on ${inputs.geography} markets with a ${inputs.risk} risk profile, while maintaining ${inputs.control} control and leveraging ${inputs.tech}.`;
      setStatement(newStatement);
      // Persist locally for parent to save
      onUpdate({ inputs, statement: newStatement });
  }, [inputs]);

  const handleChange = (key: string, val: string) => {
    setInputs((prev: any) => ({ ...prev, [key]: val }));
  };

  return (
    <div className="space-y-8 animate-fadeIn">
        <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800">
            <h3 className="text-xl font-bold text-white mb-6">1. Vision Composer</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="text-xs font-bold text-slate-500 uppercase block mb-2">Primary Goal</label>
                    <select 
                        value={inputs.goal} 
                        onChange={e => handleChange('goal', e.target.value)}
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white outline-none"
                    >
                        <option>Capital Raise</option>
                        <option>Liquidity</option>
                        <option>Community</option>
                        <option>Exit</option>
                    </select>
                </div>
                <div>
                    <label className="text-xs font-bold text-slate-500 uppercase block mb-2">Target Amount</label>
                    <select 
                        value={inputs.amount} 
                        onChange={e => handleChange('amount', e.target.value)}
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white outline-none"
                    >
                        <option>{'<'} $1M</option>
                        <option>$1M - $5M</option>
                        <option>$5M - $20M</option>
                        <option>{'>'} $20M</option>
                    </select>
                </div>
                <div>
                    <label className="text-xs font-bold text-slate-500 uppercase block mb-2">Geography</label>
                    <select 
                        value={inputs.geography} 
                        onChange={e => handleChange('geography', e.target.value)}
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white outline-none"
                    >
                        <option>Global</option>
                        <option>US Only</option>
                        <option>EU Only</option>
                        <option>Emerging Markets</option>
                    </select>
                </div>
                <div>
                    <label className="text-xs font-bold text-slate-500 uppercase block mb-2">Control Preference</label>
                    <select 
                        value={inputs.control} 
                        onChange={e => handleChange('control', e.target.value)}
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white outline-none"
                    >
                        <option>Tight (Sponsor-led)</option>
                        <option>Shared (Board)</option>
                        <option>Decentralized (DAO)</option>
                    </select>
                </div>
                <div>
                    <label className="text-xs font-bold text-slate-500 uppercase block mb-2">Timeframe</label>
                    <select 
                        value={inputs.timeframe} 
                        onChange={e => handleChange('timeframe', e.target.value)}
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white outline-none"
                    >
                        <option>ASAP (1-3 Mo)</option>
                        <option>6-12 Months</option>
                        <option>Long Term (1yr+)</option>
                    </select>
                </div>
                 <div>
                    <label className="text-xs font-bold text-slate-500 uppercase block mb-2">Tech Appetite</label>
                    <select 
                        value={inputs.tech} 
                        onChange={e => handleChange('tech', e.target.value)}
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white outline-none"
                    >
                        <option>Proven Standards</option>
                        <option>Cutting Edge (DeFi)</option>
                        <option>Minimal / Off-chain</option>
                    </select>
                </div>
            </div>
        </div>

        {/* Output Card */}
        <div className="bg-gradient-to-r from-indigo-900 to-purple-900 p-8 rounded-2xl border border-indigo-500/30 shadow-2xl relative overflow-hidden">
             <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
             
             <h4 className="text-xs font-bold text-indigo-300 uppercase tracking-widest mb-4">Generated Vision Statement</h4>
             <p className="text-xl md:text-2xl text-white font-display leading-relaxed italic">
                 "{statement}"
             </p>
             
             <div className="mt-8 grid grid-cols-3 gap-4 border-t border-indigo-500/30 pt-4">
                 <div>
                     <span className="text-[10px] text-indigo-300 uppercase block">Complexity</span>
                     <span className="text-white font-bold">{inputs.amount.includes('>') || inputs.geography === 'Global' ? 'High' : 'Moderate'}</span>
                 </div>
                 <div>
                     <span className="text-[10px] text-indigo-300 uppercase block">Investor Appeal</span>
                     <span className="text-white font-bold">{inputs.control === 'Tight' ? 'Niche' : 'Broad'}</span>
                 </div>
                 <div>
                     <span className="text-[10px] text-indigo-300 uppercase block">Execution</span>
                     <span className="text-white font-bold">{inputs.timeframe.includes('ASAP') ? 'Aggressive' : 'Standard'}</span>
                 </div>
             </div>
        </div>

        <div className="flex justify-end">
             <Button onClick={onNext} className="bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg px-8 py-3">
                 Save & Next: Investor Fit →
             </Button>
        </div>
    </div>
  );
};
