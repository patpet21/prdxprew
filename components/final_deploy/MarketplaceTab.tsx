
import React from 'react';
import { DeploymentData } from '../../types';
import { Button } from '../ui/Button';

interface Props {
  deployment: DeploymentData;
  updateDeployment: (field: keyof DeploymentData, value: any) => void;
}

export const MarketplaceTab: React.FC<Props> = ({ deployment, updateDeployment }) => {
  const { marketplace } = deployment;

  const checklist = [
      { id: 'spv', label: 'SPV Formed & Valid' },
      { id: 'token', label: 'Token Contract Deployed' },
      { id: 'kyc', label: 'KYC Portal Active' },
      { id: 'legal', label: 'Legal Opinion Signed' }
  ];

  const toggleCheck = (id: string) => {
      const newChecks = { ...marketplace.eligibilityChecks, [id]: !marketplace.eligibilityChecks[id] };
      updateDeployment('marketplace', { ...marketplace, eligibilityChecks: newChecks });
  };

  const allChecked = checklist.every(c => marketplace.eligibilityChecks[c.id]);

  const handleRequest = () => {
      updateDeployment('marketplace', { ...marketplace, listingStatus: 'Requested' });
  };

  return (
    <div className="space-y-8 animate-fadeIn">
         <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 text-white">
             <div className="flex justify-between items-start mb-6">
                 <div>
                     <h3 className="text-lg font-bold">Marketplace Eligibility</h3>
                     <p className="text-slate-400 text-sm mt-1">Pre-listing due diligence checklist.</p>
                 </div>
                 <div className={`px-3 py-1 rounded text-xs font-bold uppercase ${marketplace.listingStatus === 'Requested' ? 'bg-amber-500 text-slate-900' : marketplace.listingStatus === 'Approved' ? 'bg-emerald-500 text-white' : 'bg-slate-800 text-slate-500'}`}>
                     {marketplace.listingStatus}
                 </div>
             </div>

             <div className="space-y-3 mb-8">
                 {checklist.map(item => (
                     <div 
                        key={item.id} 
                        onClick={() => toggleCheck(item.id)}
                        className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${marketplace.eligibilityChecks[item.id] ? 'bg-emerald-900/20 border-emerald-500/50' : 'bg-slate-800 border-slate-700 hover:border-slate-600'}`}
                     >
                         <div className={`w-5 h-5 rounded flex items-center justify-center border ${marketplace.eligibilityChecks[item.id] ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-500'}`}>
                             {marketplace.eligibilityChecks[item.id] && '✓'}
                         </div>
                         <span className={`text-sm ${marketplace.eligibilityChecks[item.id] ? 'text-emerald-100' : 'text-slate-400'}`}>{item.label}</span>
                     </div>
                 ))}
             </div>

             <Button 
                onClick={handleRequest}
                disabled={!allChecked || marketplace.listingStatus !== 'Draft'}
                className={`w-full py-3 font-bold ${marketplace.listingStatus !== 'Draft' ? 'bg-slate-700 text-slate-400' : 'bg-indigo-600 hover:bg-indigo-500 text-white'}`}
             >
                 {marketplace.listingStatus === 'Requested' ? 'Listing Requested' : marketplace.listingStatus === 'Approved' ? 'Listing Approved' : 'Request Live Listing'}
             </Button>
         </div>
    </div>
  );
};
