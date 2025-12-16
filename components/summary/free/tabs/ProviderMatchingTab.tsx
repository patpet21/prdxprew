
import React, { useState, useEffect } from 'react';
import { TokenizationState } from '../../../../types';

interface Props {
  data: TokenizationState;
}

export const ProviderMatchingTab: React.FC<Props> = ({ data }) => {
  const [matching, setMatching] = useState(true);
  const [matchResult, setMatchResult] = useState<any>(null);

  // Simulated Matching Logic based on user inputs
  useEffect(() => {
    const timer = setTimeout(() => {
      const country = data.jurisdiction.country;
      const asset = data.property.category;
      
      let provider = { name: 'DigiShares', reason: 'Global white-label flexibility.' };
      
      if (country === 'US') {
        provider = { name: 'Securitize', reason: 'SEC Registered Transfer Agent & ATS.' };
      } else if (['IT', 'DE', 'FR', 'ES'].includes(country)) {
        if (asset === 'Real Estate') {
             provider = { name: 'Blocksquare', reason: 'Specialized EU Real Estate Protocol.' };
        } else {
             provider = { name: 'Tokeny', reason: 'T-REX Standard for EU Compliance.' };
        }
      } else if (country === 'AE') {
         provider = { name: 'Zeniq / Safir', reason: 'Local UAE focus.' }; 
      }

      setMatchResult(provider);
      setMatching(false);
    }, 2000);
    
    return () => clearTimeout(timer);
  }, [data]);

  const criteria = [
      { icon: '🌍', label: 'Jurisdiction', val: data.jurisdiction.country },
      { icon: '⚖️', label: 'Compliance', val: data.compliance.regFramework },
      { icon: '🪙', label: 'Standard', val: 'ERC-3643 / ERC-1400' },
      { icon: '🔐', label: 'KYC/AML', val: 'Required' },
      { icon: '💼', label: 'Custody', val: 'Self / Third-Party' },
      { icon: '🏦', label: 'Secondary', val: 'ATS / DEX' }
  ];

  const providers = [
      { name: 'Blocksquare', type: 'Protocol' },
      { name: 'Tokeny', type: 'Platform' },
      { name: 'Securitize', type: 'Issuer & ATS' },
      { name: 'Fleap', type: 'Digital Sandbox' },
      { name: 'DigiShares', type: 'White Label' },
      { name: 'Vertalo', type: 'Cap Table' },
      { name: 'INX', type: 'Exchange' },
      { name: 'Oasis Pro', type: 'ATS' }
  ];

  return (
    <div className="space-y-8 animate-fadeIn">
        
        {/* Hero Section */}
        <div className="bg-slate-900 p-8 rounded-2xl border border-slate-800 text-center relative overflow-hidden">
             <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
             <div className="relative z-10">
                 <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-500/20 text-blue-400 rounded-xl mb-4 text-2xl border border-blue-500/30">
                     🤝
                 </div>
                 <h3 className="text-2xl font-bold text-white font-display mb-2">Provider Matching Engine</h3>
                 <p className="text-slate-400 max-w-2xl mx-auto text-sm leading-relaxed">
                     PropertyDEX is an ecosystem hub, not just an issuer. We analyze your 
                     <strong> Jurisdiction</strong>, <strong>Asset Class</strong>, and <strong>Compliance Needs</strong> 
                     to connect you with the compatible regulated provider.
                 </p>
             </div>
        </div>

        {/* Matching Criteria Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {criteria.map((c, i) => (
                <div key={i} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col items-center text-center">
                    <span className="text-2xl mb-2">{c.icon}</span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{c.label}</span>
                    <span className="text-xs font-bold text-slate-900 mt-1 truncate w-full">{c.val || 'Any'}</span>
                </div>
            ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Supported Providers */}
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
                <h4 className="text-sm font-bold text-slate-700 uppercase tracking-widest mb-4">Ecosystem Partners</h4>
                <div className="flex flex-wrap gap-3">
                    {providers.map((p, i) => (
                        <span key={i} className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-600 shadow-sm">
                            {p.name}
                        </span>
                    ))}
                </div>
                <p className="text-xs text-slate-400 mt-4 italic">
                    *Availability depends on your selected jurisdiction.
                </p>
            </div>

            {/* Live Matching Preview */}
            <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 flex flex-col justify-center relative overflow-hidden">
                {matching ? (
                    <div className="flex flex-col items-center justify-center h-full py-8">
                        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                        <p className="text-blue-400 font-bold text-sm animate-pulse">Analyzing Regulations...</p>
                    </div>
                ) : (
                    <div className="animate-scaleIn relative z-10">
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest bg-emerald-900/20 px-2 py-1 rounded border border-emerald-500/30">
                                Top Match Found
                            </span>
                            <span className="text-xs text-slate-500">Free Preview</span>
                        </div>
                        <h3 className="text-3xl font-display font-bold text-white mb-2">{matchResult?.name}</h3>
                        <p className="text-sm text-slate-400 mb-6">{matchResult?.reason}</p>
                        
                        <div className="p-3 bg-slate-800 rounded-lg border border-slate-700 text-xs text-slate-300">
                            <span className="font-bold text-white">Pro Feature:</span> Unlock the full comparative report with fee structures and onboarding checklists.
                        </div>
                    </div>
                )}
            </div>

        </div>

        {/* Tier Comparison Footer */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 opacity-70">
                <span className="block text-xs font-bold text-slate-500 uppercase mb-1">Free Tier</span>
                <span className="block text-sm font-bold text-slate-700">Single Provider Preview</span>
            </div>
            <div className="p-4 rounded-xl border-2 border-amber-400 bg-amber-50">
                <span className="block text-xs font-bold text-amber-600 uppercase mb-1">Pro Tier</span>
                <span className="block text-sm font-bold text-amber-900">Full Matching Report</span>
            </div>
            <div className="p-4 rounded-xl border border-slate-800 bg-slate-900 text-white">
                <span className="block text-xs font-bold text-slate-400 uppercase mb-1">Enterprise</span>
                <span className="block text-sm font-bold">Direct API Submission</span>
            </div>
        </div>

    </div>
  );
};
