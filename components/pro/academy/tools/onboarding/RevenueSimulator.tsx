
import React, { useState, useEffect } from 'react';
import { Button } from '../../../../ui/Button';

interface Props {
  data: any;
  onChange: (data: any) => void;
  onNext: () => void;
}

export const RevenueSimulator: React.FC<Props> = ({ data, onChange, onNext }) => {
  const [rent, setRent] = useState(100000);
  const [occupancy, setOccupancy] = useState(90);
  const [opex, setOpex] = useState(25); // percent
  const [valuation, setValuation] = useState(2000000);

  const noi = rent * (occupancy/100) * (1 - opex/100);
  const capRate = (noi / valuation) * 100;
  const tokenYield = capRate * 0.9; // Assume 10% fee drag

  useEffect(() => {
      onChange({ noi, roi: capRate, yield: tokenYield });
  }, [rent, occupancy, opex, valuation]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-slideUp">
        
        <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 space-y-6">
            <h3 className="font-bold text-white text-lg">4. Revenue Simulator</h3>
            
            <div>
                <label className="text-xs font-bold text-slate-500 uppercase block mb-2">Annual Gross Income ($)</label>
                <input type="range" min="10000" max="500000" step="5000" value={rent} onChange={e => setRent(Number(e.target.value))} className="w-full accent-emerald-500 mb-1" />
                <div className="text-right text-emerald-400 font-mono font-bold">${rent.toLocaleString()}</div>
            </div>

            <div>
                <label className="text-xs font-bold text-slate-500 uppercase block mb-2">Occupancy Rate (%)</label>
                <input type="range" min="50" max="100" value={occupancy} onChange={e => setOccupancy(Number(e.target.value))} className="w-full accent-blue-500 mb-1" />
                <div className="text-right text-blue-400 font-mono font-bold">{occupancy}%</div>
            </div>

            <div>
                <label className="text-xs font-bold text-slate-500 uppercase block mb-2">OPEX (% of Revenue)</label>
                <input type="range" min="10" max="60" value={opex} onChange={e => setOpex(Number(e.target.value))} className="w-full accent-red-500 mb-1" />
                <div className="text-right text-red-400 font-mono font-bold">{opex}%</div>
            </div>

            <div>
                <label className="text-xs font-bold text-slate-500 uppercase block mb-2">Asset Valuation ($)</label>
                <input type="number" value={valuation} onChange={e => setValuation(Number(e.target.value))} className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white outline-none" />
            </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
             <div>
                 <h4 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-6">Financial Output</h4>
                 <div className="grid grid-cols-2 gap-6 mb-8">
                     <div>
                         <p className="text-xs text-slate-400 mb-1">Net Operating Income</p>
                         <p className="text-2xl font-bold text-slate-900">${noi.toLocaleString(undefined, {maximumFractionDigits:0})}</p>
                     </div>
                     <div>
                         <p className="text-xs text-slate-400 mb-1">Cap Rate / ROI</p>
                         <p className="text-2xl font-bold text-indigo-600">{capRate.toFixed(2)}%</p>
                     </div>
                 </div>

                 <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                     <p className="text-xs font-bold text-slate-500 uppercase mb-3">Potential Investor Gains</p>
                     <div className="space-y-2 text-sm">
                         <div className="flex justify-between">
                             <span className="text-slate-600">$1,000 Invested</span>
                             <span className="text-emerald-600 font-bold">+${(1000 * tokenYield / 100).toFixed(0)}/yr</span>
                         </div>
                         <div className="flex justify-between">
                             <span className="text-slate-600">$10,000 Invested</span>
                             <span className="text-emerald-600 font-bold">+${(10000 * tokenYield / 100).toFixed(0)}/yr</span>
                         </div>
                     </div>
                 </div>
             </div>
             
             <Button onClick={onNext} className="w-full bg-indigo-600 hover:bg-indigo-500 text-white mt-6">
                 Next: Legal Logic →
             </Button>
        </div>

    </div>
  );
};
