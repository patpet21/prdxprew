
import React from 'react';
import { DeploymentData } from '../../types';

interface Props {
  deployment: DeploymentData;
  updateDeployment: (field: keyof DeploymentData, value: any) => void;
}

export const CustodyTab: React.FC<Props> = ({ deployment, updateDeployment }) => {
  const { custody } = deployment;

  const providers = [
      { id: 'Fireblocks', label: 'Fireblocks', icon: '🔥' },
      { id: 'BitGo', label: 'BitGo Trust', icon: '🏦' },
      { id: 'Copper', label: 'Copper.co', icon: '🛡️' },
      { id: 'Self', label: 'Self-Custody (MultiSig)', icon: '🔐' },
  ];

  return (
    <div className="space-y-8 animate-fadeIn">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
             <h3 className="text-lg font-bold text-slate-900 mb-4">Select Custodian</h3>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 {providers.map(p => (
                     <button
                        key={p.id}
                        onClick={() => updateDeployment('custody', { ...custody, provider: p.id })}
                        className={`p-4 rounded-xl border text-left flex items-center gap-3 transition-all ${
                            custody.provider === p.id 
                                ? 'bg-slate-900 border-slate-900 text-white shadow-md' 
                                : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                        }`}
                     >
                         <span className="text-2xl">{p.icon}</span>
                         <span className="font-bold text-sm">{p.label}</span>
                         {custody.provider === p.id && <span className="ml-auto text-emerald-400">✓</span>}
                     </button>
                 ))}
             </div>
        </div>

        <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
             <h3 className="text-lg font-bold text-slate-900 mb-4">Configuration</h3>
             <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-slate-200 mb-4">
                 <div>
                     <span className="block text-sm font-bold text-slate-800">Cold Storage</span>
                     <span className="text-xs text-slate-500">Offline signing for maximum security.</span>
                 </div>
                 <div 
                    onClick={() => updateDeployment('custody', { ...custody, coldStorage: !custody.coldStorage })}
                    className={`w-12 h-6 rounded-full relative cursor-pointer transition-colors ${custody.coldStorage ? 'bg-emerald-500' : 'bg-slate-300'}`}
                 >
                     <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${custody.coldStorage ? 'left-7' : 'left-1'}`}></div>
                 </div>
             </div>
             
             <div className="p-4 bg-blue-50 border border-blue-100 rounded-lg text-sm text-blue-800">
                 <strong>Status:</strong> {custody.status} — {custody.provider ? 'Provider selected. API keys required for activation.' : 'Select a provider.'}
             </div>
        </div>
    </div>
  );
};
