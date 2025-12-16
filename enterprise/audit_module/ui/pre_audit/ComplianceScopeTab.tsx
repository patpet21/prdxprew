
import React from 'react';
import { AuditConfigEntity } from '../../domain/audit_config.entity';
import { Button } from '../../../../../components/ui/Button';

interface Props {
  config: AuditConfigEntity;
  updateConfig: (updates: Partial<AuditConfigEntity>) => void;
  onNext: () => void;
}

export const ComplianceScopeTab: React.FC<Props> = ({ config, updateConfig, onNext }) => {
  const { scope } = config;

  const toggleReg = (reg: string) => {
    const current = scope.regulations;
    const updated = current.includes(reg) 
        ? current.filter(r => r !== reg)
        : [...current, reg];
    updateConfig({ scope: { ...scope, regulations: updated } });
  };

  const availableRegs = [
      { id: 'Reg D', label: 'SEC Reg D (US)', desc: 'Accredited Investors' },
      { id: 'Reg S', label: 'SEC Reg S (US)', desc: 'Offshore Offering' },
      { id: 'MiCA', label: 'EU MiCA', desc: 'Crypto Asset Markets' },
      { id: 'GDPR', label: 'EU GDPR', desc: 'Data Privacy' },
      { id: 'AML/KYC', label: 'Global AML/CFT', desc: 'Anti-Money Laundering' },
      { id: 'OFAC', label: 'OFAC Sanctions', desc: 'US Sanctions Lists' },
  ];

  return (
    <div className="space-y-8 animate-fadeIn">
       <div className="flex justify-between items-end border-b border-slate-800 pb-6">
        <div>
            <h3 className="text-2xl font-bold text-white font-display mb-2">Compliance Scope</h3>
            <p className="text-slate-400 text-sm">
                Select the regulatory frameworks and audit depth to apply.
            </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left: Frameworks */}
          <div className="lg:col-span-2 space-y-4">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Target Frameworks</h4>
              <div className="grid grid-cols-2 gap-4">
                  {availableRegs.map(reg => (
                      <div 
                        key={reg.id}
                        onClick={() => toggleReg(reg.id)}
                        className={`p-4 rounded-xl border-2 cursor-pointer transition-all group ${
                            scope.regulations.includes(reg.id) 
                                ? 'bg-indigo-900/20 border-indigo-500' 
                                : 'bg-slate-900 border-slate-800 hover:border-slate-600'
                        }`}
                      >
                          <div className="flex justify-between items-start mb-1">
                              <span className={`font-bold ${scope.regulations.includes(reg.id) ? 'text-white' : 'text-slate-300'}`}>{reg.id}</span>
                              <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${scope.regulations.includes(reg.id) ? 'bg-indigo-500 border-indigo-500' : 'border-slate-600'}`}>
                                  {scope.regulations.includes(reg.id) && <span className="text-xs text-white">✓</span>}
                              </div>
                          </div>
                          <p className="text-xs text-slate-500">{reg.label}</p>
                          <p className="text-[10px] text-slate-600 mt-1">{reg.desc}</p>
                      </div>
                  ))}
              </div>
          </div>

          {/* Right: Intensity */}
          <div className="space-y-6">
              <div>
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Audit Depth</h4>
                  <div className="flex flex-col gap-2">
                      {['Standard', 'Deep Dive', 'Forensic'].map(level => (
                          <button
                            key={level}
                            onClick={() => updateConfig({ scope: { ...scope, depth: level as any } })}
                            className={`px-4 py-3 rounded-lg text-sm font-bold text-left transition-all border ${
                                scope.depth === level 
                                    ? 'bg-emerald-900/20 border-emerald-500 text-emerald-400' 
                                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800'
                            }`}
                          >
                              {level}
                          </button>
                      ))}
                  </div>
              </div>

              <div>
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Extra Modules</h4>
                  <div className="flex flex-col gap-2">
                      <label className="flex items-center justify-between p-3 bg-slate-900 border border-slate-800 rounded-lg cursor-pointer">
                          <span className="text-sm text-slate-300">Smart Contract Code</span>
                          <input 
                             type="checkbox" 
                             checked={scope.includeSmartContract}
                             onChange={e => updateConfig({ scope: { ...scope, includeSmartContract: e.target.checked } })}
                             className="w-4 h-4 rounded accent-indigo-500"
                          />
                      </label>
                      <label className="flex items-center justify-between p-3 bg-slate-900 border border-slate-800 rounded-lg cursor-pointer">
                          <span className="text-sm text-slate-300">Marketing Materials</span>
                          <input 
                             type="checkbox" 
                             checked={scope.includeMarketing}
                             onChange={e => updateConfig({ scope: { ...scope, includeMarketing: e.target.checked } })}
                             className="w-4 h-4 rounded accent-indigo-500"
                          />
                      </label>
                  </div>
              </div>
          </div>

      </div>

      <div className="flex justify-end pt-6">
          <Button onClick={onNext} className="bg-blue-600 hover:bg-blue-500 text-white px-8">
              Save & Manage Documents →
          </Button>
      </div>
    </div>
  );
};
