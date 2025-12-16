
import React, { useEffect } from 'react';
import { StepProps } from '../../../types';
import { Select } from '../../../components/ui/Select';

export const Ent_ComplianceStep: React.FC<StepProps> = ({ data, updateData, onValidationChange }) => {
  const { compliance } = data;

  useEffect(() => {
    onValidationChange(Boolean(compliance.kycProvider && compliance.regFramework));
  }, [compliance, onValidationChange]);

  const handleChange = (field: string, val: any) => updateData('compliance', { [field]: val });
  const toggleRestriction = (code: string) => {
    const list = compliance.jurisdictionRestrictions.includes(code)
      ? compliance.jurisdictionRestrictions.filter(c => c !== code)
      : [...compliance.jurisdictionRestrictions, code];
    handleChange('jurisdictionRestrictions', list);
  };

  return (
    <div className="space-y-8 animate-fadeIn text-white">
      <div className="space-y-2">
        <h2 className="text-3xl font-bold font-display text-white">Compliance & Regulations</h2>
        <p className="text-slate-400">Configure the rules engine for automated compliance.</p>
      </div>

      <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 shadow-sm space-y-6">
        <h3 className="font-bold text-slate-300 border-b border-slate-700 pb-2">Regulatory Framework</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           <Select
             id="framework" label="Primary Exemption"
             value={compliance.regFramework || ''}
             onChange={e => handleChange('regFramework', e.target.value)}
             options={[
               { value: 'Reg D', label: 'US Reg D 506(c)' },
               { value: 'Reg S', label: 'US Reg S' },
               { value: 'Reg A+', label: 'US Reg A+' },
               { value: 'MiCA', label: 'EU MiCA' },
             ]} 
             className="bg-slate-950 border-slate-700 text-white"
           />
           <Select
             id="kyc" label="KYC/AML Partner"
             value={compliance.kycProvider}
             onChange={e => handleChange('kycProvider', e.target.value)}
             options={[
               { value: 'SumSub', label: 'SumSub (Global)' },
               { value: 'ParallelMarkets', label: 'Parallel Markets' },
               { value: 'Fractal', label: 'Fractal ID' },
             ]} 
             className="bg-slate-950 border-slate-700 text-white"
           />
        </div>
      </div>

      <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
         <h3 className="font-bold text-slate-300 mb-4">Geo-Blocking</h3>
         <p className="text-sm text-slate-500 mb-4">Select jurisdictions to block at the smart contract level.</p>
         
         <div className="flex flex-wrap gap-3">
            {[
              { code: 'KP', label: 'North Korea' },
              { code: 'IR', label: 'Iran' },
              { code: 'SY', label: 'Syria' },
              { code: 'RU', label: 'Russia' },
              { code: 'US', label: 'United States' },
              { code: 'CN', label: 'China' },
            ].map(c => {
               const isBlocked = compliance.jurisdictionRestrictions.includes(c.code);
               return (
                 <button 
                   key={c.code}
                   onClick={() => toggleRestriction(c.code)}
                   className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all ${
                     isBlocked 
                       ? 'bg-red-900/30 text-red-400 border-red-500/50' 
                       : 'bg-slate-800 text-slate-400 border-slate-700 hover:border-slate-500'
                   }`}
                 >
                   {isBlocked ? 'Blocked: ' : 'Allow: '} {c.label}
                 </button>
               );
            })}
         </div>
      </div>
    </div>
  );
};
