
import React from 'react';
import { DeploymentData } from '../../types';

interface Props {
  deployment: DeploymentData;
  updateDeployment: (field: keyof DeploymentData, value: any) => void;
}

export const KycOnboardingTab: React.FC<Props> = ({ deployment, updateDeployment }) => {
  const { kyc } = deployment;
  const currentRegimes = kyc.regimes || [];

  const toggleRegime = (reg: string) => {
      const updated = currentRegimes.includes(reg) ? currentRegimes.filter(r => r !== reg) : [...currentRegimes, reg];
      updateDeployment('kyc', { ...kyc, regimes: updated });
  };

  return (
    <div className="space-y-8 animate-fadeIn">
         <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
             <h3 className="text-lg font-bold text-slate-900 mb-4">Investor Onboarding Portal</h3>
             <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 mb-6 flex flex-col gap-4">
                 <label className="text-xs font-bold text-slate-500 uppercase">Active Compliance Regimes</label>
                 <div className="flex flex-wrap gap-2">
                     {['Reg D (US)', 'Reg S (Global)', 'MiCA (EU)', 'Retail (KYC Lite)'].map(reg => (
                         <button
                            key={reg}
                            onClick={() => toggleRegime(reg)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                                currentRegimes.includes(reg) 
                                    ? 'bg-indigo-600 text-white border-indigo-600' 
                                    : 'bg-white text-slate-500 border-slate-300 hover:border-slate-400'
                            }`}
                         >
                             {reg}
                         </button>
                     ))}
                 </div>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div className="p-4 rounded-lg border border-slate-200 bg-white">
                     <div className="flex items-center gap-2 mb-2">
                         <span className="text-xl">🆔</span>
                         <span className="font-bold text-sm text-slate-800">Identity Verification</span>
                     </div>
                     <p className="text-xs text-slate-500">Automated document scan & biometric selfie check enabled.</p>
                 </div>
                 <div className="p-4 rounded-lg border border-slate-200 bg-white">
                     <div className="flex items-center gap-2 mb-2">
                         <span className="text-xl">📜</span>
                         <span className="font-bold text-sm text-slate-800">Accreditation</span>
                     </div>
                     <p className="text-xs text-slate-500">Upload of tax returns or bank letters for 506(c) investors.</p>
                 </div>
             </div>
         </div>
    </div>
  );
};
