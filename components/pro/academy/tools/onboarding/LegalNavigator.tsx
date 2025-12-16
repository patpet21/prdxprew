
import React, { useState } from 'react';
import { Button } from '../../../../ui/Button';

interface Props {
  data: any;
  onChange: (data: any) => void;
  onNext: () => void;
}

export const LegalNavigator: React.FC<Props> = ({ data, onChange, onNext }) => {
  const [investorLoc, setInvestorLoc] = useState('Global');
  
  // Simple Logic
  let spv = "Local SPV";
  let reg = "Standard";
  
  if (data.location?.includes("USA") || data.location?.includes("US")) {
      spv = "Delaware LLC";
      reg = investorLoc === "US" ? "Reg D 506(c)" : "Reg S (Non-US)";
  } else if (data.location?.includes("Italy") || data.location?.includes("IT")) {
      spv = "S.r.l. (Italian LLC)";
      reg = "Crowdfunding Reg (ECSP)";
  } else {
      spv = "Offshore Foundation / LTD";
      reg = "Reg S / Local Compliance";
  }

  const handleConfirm = () => {
      onChange({ structure: spv, compliance: reg });
      onNext();
  };

  return (
    <div className="space-y-8 animate-fadeIn">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm text-center">
            <h3 className="font-bold text-slate-900 text-lg mb-2">5. Legal Navigator</h3>
            <p className="text-slate-500 text-sm mb-6">Select Investor Origin to determine the optimal structure.</p>
            
            <div className="flex justify-center gap-4 mb-8">
                {['Global', 'US Only', 'EU Only'].map(loc => (
                    <button 
                        key={loc}
                        onClick={() => setInvestorLoc(loc)}
                        className={`px-4 py-2 rounded-lg border text-sm font-bold transition-all ${investorLoc === loc ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-slate-500 border-slate-200'}`}
                    >
                        {loc}
                    </button>
                ))}
            </div>

            <div className="flex items-center justify-center gap-4 md:gap-8">
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl w-40">
                    <span className="text-[10px] text-slate-400 uppercase font-bold block mb-1">Asset Location</span>
                    <span className="text-slate-900 font-bold text-sm">{data.location || 'Global'}</span>
                </div>
                <div className="text-slate-300 text-2xl">➔</div>
                <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl w-40 text-white shadow-lg transform scale-110">
                    <span className="text-[10px] text-slate-500 uppercase font-bold block mb-1">Recommended SPV</span>
                    <span className="text-emerald-400 font-bold text-sm">{spv}</span>
                </div>
                <div className="text-slate-300 text-2xl">➔</div>
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl w-40">
                    <span className="text-[10px] text-slate-400 uppercase font-bold block mb-1">Compliance</span>
                    <span className="text-slate-900 font-bold text-sm">{reg}</span>
                </div>
            </div>
        </div>

        <div className="flex justify-end">
            <Button onClick={handleConfirm} className="bg-indigo-600 text-white hover:bg-indigo-500 px-8">Confirm & Review Blueprint →</Button>
        </div>
    </div>
  );
};
