
import React from 'react';
import { Button } from '../../../../ui/Button';

interface Props {
  data: any;
  onChange: (data: any) => void;
  onNext: () => void;
}

export const AssetIdentityBuilder: React.FC<Props> = ({ data, onChange, onNext }) => {
  const handleChange = (field: string, value: any) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fadeIn">
        <div className="lg:col-span-1 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5">
            <h3 className="font-bold text-slate-800 text-lg border-b border-slate-100 pb-2">1. Define Asset</h3>
            
            <div>
                <label className="text-xs font-bold text-slate-500 uppercase block mb-2">Asset Type</label>
                <select 
                    value={data.assetType}
                    onChange={(e) => handleChange('assetType', e.target.value)}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
                >
                    <option>Real Estate</option>
                    <option>Business Equity</option>
                    <option>Debt Instrument</option>
                    <option>Art / Collectible</option>
                    <option>Infrastructure</option>
                </select>
            </div>

            <div>
                <label className="text-xs font-bold text-slate-500 uppercase block mb-2">Current Status</label>
                <select 
                    value={data.status}
                    onChange={(e) => handleChange('status', e.target.value)}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
                >
                    <option>Existing / Operating</option>
                    <option>Under Development</option>
                    <option>Concept Phase</option>
                    <option>Distressed</option>
                </select>
            </div>

            <div>
                <label className="text-xs font-bold text-slate-500 uppercase block mb-2">Primary Objective</label>
                <select 
                    value={data.objective}
                    onChange={(e) => handleChange('objective', e.target.value)}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
                >
                    <option>Liquidity (Exit)</option>
                    <option>Growth Capital (Raise)</option>
                    <option>Community Engagement</option>
                    <option>Refinancing</option>
                </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
                <div>
                    <label className="text-xs font-bold text-slate-500 uppercase block mb-2">Location</label>
                    <input 
                        type="text"
                        value={data.location}
                        onChange={(e) => handleChange('location', e.target.value)}
                        placeholder="City, Country"
                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                </div>
                <div>
                    <label className="text-xs font-bold text-slate-500 uppercase block mb-2">Capital ($)</label>
                    <input 
                        type="text"
                        value={data.capital}
                        onChange={(e) => handleChange('capital', e.target.value)}
                        placeholder="e.g. 5M"
                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                </div>
            </div>
            
            <div className="pt-2">
                <Button onClick={onNext} className="w-full bg-slate-900 text-white">Generate Identity Card →</Button>
            </div>
        </div>

        <div className="lg:col-span-2 bg-slate-900 rounded-2xl border border-slate-800 p-8 relative overflow-hidden flex flex-col justify-center items-center text-center">
             <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
             
             <div className="relative z-10 w-full max-w-md bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 shadow-2xl">
                 <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-600 rounded-full flex items-center justify-center text-3xl mx-auto mb-4 border-4 border-slate-800 shadow-lg absolute -top-8 left-1/2 -translate-x-1/2">
                    {data.assetType === 'Real Estate' ? '🏠' : data.assetType === 'Business Equity' ? '🚀' : '💎'}
                 </div>
                 
                 <div className="mt-8">
                     <h2 className="text-2xl font-bold text-white font-display mb-1">{data.assetName || "Project Alpha"}</h2>
                     <p className="text-indigo-300 text-sm uppercase tracking-widest font-bold mb-6">{data.location || "Unknown Location"} • {data.assetType}</p>
                     
                     <div className="space-y-4 text-left">
                         <div className="bg-slate-900/50 p-3 rounded-lg border border-slate-700/50 flex justify-between items-center">
                             <span className="text-slate-400 text-xs uppercase">Market Perception</span>
                             <span className="text-emerald-400 font-bold text-sm">High Demand</span>
                         </div>
                         <div className="bg-slate-900/50 p-3 rounded-lg border border-slate-700/50 flex justify-between items-center">
                             <span className="text-slate-400 text-xs uppercase">Ideal Investor</span>
                             <span className="text-white font-bold text-sm">
                                 {data.capital && parseInt(data.capital) > 5000000 ? "Institutional" : "Accredited / Retail"}
                             </span>
                         </div>
                         <div className="bg-slate-900/50 p-3 rounded-lg border border-slate-700/50 flex justify-between items-center">
                             <span className="text-slate-400 text-xs uppercase">Recommended Strategy</span>
                             <span className="text-amber-400 font-bold text-sm">
                                 {data.objective === 'Liquidity' ? "Security Token Offering (STO)" : "Crowdfunding / Reg CF"}
                             </span>
                         </div>
                     </div>
                 </div>
             </div>
        </div>
    </div>
  );
};
