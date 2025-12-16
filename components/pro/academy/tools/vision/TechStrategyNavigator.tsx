
import React, { useState } from 'react';
import { Button } from '../../../../ui/Button';

interface Props {
  data: any;
  onUpdate: (data: any) => void;
  onNext: () => void;
}

export const TechStrategyNavigator: React.FC<Props> = ({ data, onUpdate, onNext }) => {
  const [inputs, setInputs] = useState(data.inputs || {
    securityLevel: 'Institutional',
    tokenType: 'ERC-3643',
    complianceMode: 'On-chain Whitelist',
    marketplace: 'OTC / Peer-to-Peer',
    paymentRails: 'USDC + Fiat'
  });

  const handleSave = () => {
      onUpdate({ inputs });
      onNext();
  };

  const handleChange = (key: string, val: string) => {
      setInputs((prev: any) => ({ ...prev, [key]: val }));
  };

  return (
    <div className="space-y-8 animate-fadeIn">
        <div className="flex flex-col md:flex-row gap-8">
            {/* Inputs */}
            <div className="flex-1 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                <h3 className="text-xl font-bold text-slate-900 mb-4">3. Tech Stack Config</h3>
                
                <div>
                    <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Token Standard</label>
                    <select value={inputs.tokenType} onChange={e => handleChange('tokenType', e.target.value)} className="w-full p-2 rounded border border-slate-300">
                        <option>ERC-3643 (T-REX)</option>
                        <option>ERC-1400</option>
                        <option>ERC-20 + Blacklist</option>
                    </select>
                </div>
                <div>
                    <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Compliance Mode</label>
                    <select value={inputs.complianceMode} onChange={e => handleChange('complianceMode', e.target.value)} className="w-full p-2 rounded border border-slate-300">
                        <option>On-chain Whitelist</option>
                        <option>Off-chain API Check</option>
                        <option>Permissionless (Risky)</option>
                    </select>
                </div>
                <div>
                    <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Trading Venue</label>
                    <select value={inputs.marketplace} onChange={e => handleChange('marketplace', e.target.value)} className="w-full p-2 rounded border border-slate-300">
                        <option>OTC / Peer-to-Peer</option>
                        <option>Private ATS</option>
                        <option>Public DEX (Uniswap)</option>
                    </select>
                </div>
                 <div>
                    <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Payment Rails</label>
                    <select value={inputs.paymentRails} onChange={e => handleChange('paymentRails', e.target.value)} className="w-full p-2 rounded border border-slate-300">
                        <option>USDC + Fiat</option>
                        <option>Crypto Only</option>
                        <option>Fiat Only</option>
                    </select>
                </div>
            </div>

            {/* Visual Stack Map */}
            <div className="flex-1 bg-slate-900 p-6 rounded-2xl border border-slate-800 text-white flex flex-col justify-center items-center">
                 <h4 className="text-sm font-bold text-emerald-400 uppercase tracking-widest mb-6">Generated Stack Map</h4>
                 
                 <div className="space-y-2 w-full max-w-xs">
                     <div className="p-3 bg-slate-800 rounded border border-slate-700 text-center text-sm">
                         Frontend / Investor Portal
                     </div>
                     <div className="h-4 w-0.5 bg-slate-600 mx-auto"></div>
                     <div className="p-3 bg-indigo-900/50 rounded border border-indigo-500/50 text-center text-sm font-bold text-indigo-300">
                         {inputs.complianceMode}
                     </div>
                     <div className="h-4 w-0.5 bg-slate-600 mx-auto"></div>
                     <div className="p-3 bg-slate-800 rounded border border-slate-700 text-center text-sm">
                         {inputs.tokenType} Token
                     </div>
                     <div className="h-4 w-0.5 bg-slate-600 mx-auto"></div>
                     <div className="flex gap-2">
                         <div className="flex-1 p-2 bg-slate-800 rounded border border-slate-700 text-center text-xs">
                             {inputs.marketplace}
                         </div>
                         <div className="flex-1 p-2 bg-slate-800 rounded border border-slate-700 text-center text-xs">
                             {inputs.paymentRails}
                         </div>
                     </div>
                 </div>

                 <p className="mt-8 text-xs text-slate-400 text-center italic">
                     {inputs.marketplace.includes('OTC') 
                        ? "OTC reduces regulatory friction compared to public markets, ideal for initial phases." 
                        : "Public DEX listing requires extreme caution with securities laws."}
                 </p>
            </div>
        </div>

        <div className="flex justify-end">
             <Button onClick={handleSave} className="bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg px-8 py-3">
                 Save & Next: Founder Diagnostic →
             </Button>
        </div>
    </div>
  );
};
