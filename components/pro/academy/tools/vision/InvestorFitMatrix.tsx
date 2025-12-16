
import React, { useState, useEffect } from 'react';
import { Button } from '../../../../ui/Button';

interface Props {
  data: any;
  onUpdate: (data: any) => void;
  onNext: () => void;
}

export const InvestorFitMatrix: React.FC<Props> = ({ data, onUpdate, onNext }) => {
  const [inputs, setInputs] = useState(data.inputs || {
    roi: 8,
    volatility: 2,
    lockup: 12,
    dealSize: 5
  });

  const [outputs, setOutputs] = useState({
      persona: 'Pending',
      regPath: 'Pending',
      friction: 'Low',
      marketing: 'Pending'
  });

  useEffect(() => {
      // Simple Logic Engine
      let persona = "Accredited Investor";
      let regPath = "Reg D 506(c)";
      let friction = "Medium";
      let marketing = "Direct Sales";

      if (inputs.roi > 15 && inputs.volatility > 3) {
          persona = "Crypto Native / Speculator";
          regPath = "Offshore / Reg S";
          friction = "Low";
          marketing = "Community / Twitter";
      } else if (inputs.roi < 6 && inputs.volatility < 2) {
          persona = "Institutional / Family Office";
          regPath = "Private Placement";
          friction = "High";
          marketing = "Personal Network";
      } else if (inputs.dealSize < 1) {
          persona = "Retail (Crowd)";
          regPath = "Reg CF / Reg A+";
          friction = "High (Process)";
          marketing = "Public Ads";
      }

      const newOutputs = { persona, regPath, friction, marketing };
      setOutputs(newOutputs);
      onUpdate({ inputs, ...newOutputs });
  }, [inputs]);

  const handleChange = (key: string, val: number) => {
    setInputs((prev: any) => ({ ...prev, [key]: val }));
  };

  return (
    <div className="space-y-8 animate-fadeIn">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="text-xl font-bold text-slate-900 mb-6">2. Investor Fit Matrix</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                    <label className="flex justify-between text-xs font-bold text-slate-500 uppercase mb-2">
                        <span>Target ROI (%)</span>
                        <span className="text-indigo-600">{inputs.roi}%</span>
                    </label>
                    <input type="range" min="2" max="30" value={inputs.roi} onChange={e => handleChange('roi', Number(e.target.value))} className="w-full accent-indigo-600" />
                </div>
                <div>
                    <label className="flex justify-between text-xs font-bold text-slate-500 uppercase mb-2">
                        <span>Volatility Tolerance (1-5)</span>
                        <span className="text-indigo-600">{inputs.volatility}</span>
                    </label>
                    <input type="range" min="1" max="5" value={inputs.volatility} onChange={e => handleChange('volatility', Number(e.target.value))} className="w-full accent-indigo-600" />
                </div>
                <div>
                    <label className="flex justify-between text-xs font-bold text-slate-500 uppercase mb-2">
                        <span>Lock-up Period (Months)</span>
                        <span className="text-indigo-600">{inputs.lockup}m</span>
                    </label>
                    <input type="range" min="0" max="60" step="3" value={inputs.lockup} onChange={e => handleChange('lockup', Number(e.target.value))} className="w-full accent-indigo-600" />
                </div>
                 <div>
                    <label className="flex justify-between text-xs font-bold text-slate-500 uppercase mb-2">
                        <span>Deal Size ($M)</span>
                        <span className="text-indigo-600">${inputs.dealSize}M</span>
                    </label>
                    <input type="range" min="0.1" max="100" step="0.5" value={inputs.dealSize} onChange={e => handleChange('dealSize', Number(e.target.value))} className="w-full accent-indigo-600" />
                </div>
            </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase block mb-1">Ideal Persona</span>
                <span className="text-white font-bold text-sm">{outputs.persona}</span>
            </div>
            <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase block mb-1">Regulatory Path</span>
                <span className="text-amber-400 font-bold text-sm">{outputs.regPath}</span>
            </div>
            <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase block mb-1">Friction Score</span>
                <span className={`text-sm font-bold ${outputs.friction === 'Low' ? 'text-emerald-400' : 'text-red-400'}`}>{outputs.friction}</span>
            </div>
             <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase block mb-1">Marketing</span>
                <span className="text-blue-400 font-bold text-sm">{outputs.marketing}</span>
            </div>
        </div>
        
        <div className="p-4 bg-blue-50 text-blue-800 text-xs rounded-xl border border-blue-100 flex gap-2">
            <span>💡</span>
            <span>Educational Note: Higher returns typically attract riskier capital (Crypto-native), while lower volatility appeals to Family Offices. Your lock-up period must match the liquidity needs of your persona.</span>
        </div>

        <div className="flex justify-end">
             <Button onClick={onNext} className="bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg px-8 py-3">
                 Save & Next: Tech Strategy →
             </Button>
        </div>
    </div>
  );
};
