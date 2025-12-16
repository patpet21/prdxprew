
import React, { useState } from 'react';
import { Button } from '../../../../ui/Button';
import { findEducationalLicenses } from '../../../../../services/mockAiService';

interface Props {
  onUpdateState: (key: string, value: any) => void;
  savedResult?: any;
}

export const LicenseFinder: React.FC<Props> = ({ onUpdateState, savedResult }) => {
  const [jurisdiction, setJurisdiction] = useState('EU (MiCA)');
  const [activity, setActivity] = useState('Issuing Tokens');
  const [assetType, setAssetType] = useState('Real Estate (Security)');
  
  const [result, setResult] = useState<any>(savedResult || null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
      setLoading(true);
      const data = await findEducationalLicenses(jurisdiction, activity, assetType);
      
      // Update local state immediately for UI
      setResult(data);
      
      // Persist up
      onUpdateState('license_finder_result', data);
      
      setLoading(false);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
        <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-lg">
             <div className="flex items-center gap-4 mb-8">
                 <div className="w-12 h-12 bg-indigo-100 rounded-2xl flex items-center justify-center text-2xl text-indigo-600">
                    🕵️‍♀️
                 </div>
                 <div>
                     <h3 className="text-xl font-bold text-slate-900 font-display">License Requirements Finder</h3>
                     <p className="text-sm text-slate-500">Configure your model to see potential regulatory obligations.</p>
                 </div>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                 <div>
                     <label className="text-xs font-bold text-slate-500 block mb-2 uppercase tracking-wider">Jurisdiction</label>
                     <select 
                        value={jurisdiction} onChange={e => setJurisdiction(e.target.value)}
                        className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 font-bold outline-none focus:ring-2 focus:ring-indigo-500 transition-all cursor-pointer"
                     >
                         <option>EU (MiCA)</option>
                         <option>US (SEC)</option>
                         <option>UK (FCA)</option>
                         <option>Global / Offshore</option>
                     </select>
                 </div>
                 <div>
                     <label className="text-xs font-bold text-slate-500 block mb-2 uppercase tracking-wider">Activity</label>
                     <select 
                        value={activity} onChange={e => setActivity(e.target.value)}
                        className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 font-bold outline-none focus:ring-2 focus:ring-indigo-500 transition-all cursor-pointer"
                     >
                         <option>Issuing Tokens</option>
                         <option>Operating a Marketplace</option>
                         <option>Custody of Assets</option>
                         <option>DeFi Protocol</option>
                     </select>
                 </div>
                 <div>
                     <label className="text-xs font-bold text-slate-500 block mb-2 uppercase tracking-wider">Asset Type</label>
                     <select 
                        value={assetType} onChange={e => setAssetType(e.target.value)}
                        className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 font-bold outline-none focus:ring-2 focus:ring-indigo-500 transition-all cursor-pointer"
                     >
                         <option>Real Estate (Security)</option>
                         <option>Utility / Loyalty</option>
                         <option>Stablecoin / E-Money</option>
                         <option>NFT / Art</option>
                     </select>
                 </div>
             </div>
             
             <div className="flex justify-end">
                 <Button onClick={handleSearch} isLoading={loading} className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg px-8 py-3 rounded-xl font-bold">
                     {loading ? 'Scanning Regulatory DB...' : '🔍 Find Requirements'}
                 </Button>
             </div>
        </div>

        {result && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-slideUp">
                {/* Licenses Card */}
                <div className="bg-slate-900 rounded-3xl p-8 border border-slate-800 text-white shadow-xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl -mr-10 -mt-10"></div>
                    <h4 className="text-sm font-bold text-emerald-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                        Likely Requirements
                    </h4>
                    
                    {result.licenses && result.licenses.length > 0 ? (
                        <ul className="space-y-4 relative z-10">
                            {result.licenses.map((lic: string, i: number) => (
                                <li key={i} className="flex items-start gap-4 p-4 rounded-xl bg-slate-800/50 border border-slate-700 hover:bg-slate-800 transition-colors">
                                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 font-bold text-xs mt-0.5">
                                        {i + 1}
                                    </span>
                                    <span className="text-sm font-medium text-slate-200 leading-snug">{lic}</span>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-slate-400 italic text-sm">No specific licenses found. Check generic securities law.</p>
                    )}
                </div>
                
                {/* Restrictions Card */}
                <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/5 rounded-full blur-3xl -mr-10 -mt-10"></div>
                    <h4 className="text-sm font-bold text-red-500 uppercase tracking-widest mb-6 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-red-500"></span>
                        Critical Constraints
                    </h4>
                    
                    {result.restrictions && result.restrictions.length > 0 ? (
                        <ul className="space-y-4 relative z-10">
                            {result.restrictions.map((res: string, i: number) => (
                                <li key={i} className="flex items-start gap-4 p-4 rounded-xl bg-red-50 border border-red-100 hover:bg-red-50/80 transition-colors">
                                    <span className="text-xl">⚠️</span>
                                    <span className="text-sm font-medium text-slate-800 leading-relaxed">{res}</span>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-slate-400 italic text-sm">No critical restrictions flagged.</p>
                    )}
                </div>
            </div>
        )}
    </div>
  );
};
