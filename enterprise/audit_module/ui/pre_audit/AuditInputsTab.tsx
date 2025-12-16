
import React from 'react';
import { AuditConfigEntity } from '../../domain/audit_config.entity';
import { Button } from '../../../../../components/ui/Button';

interface Props {
  config: AuditConfigEntity;
  updateConfig: (updates: Partial<AuditConfigEntity>) => void;
  onNext: () => void;
}

export const AuditInputsTab: React.FC<Props> = ({ config, updateConfig, onNext }) => {
  const context = config.projectContext;

  const handleChange = (field: string, value: string) => {
    updateConfig({
      projectContext: { ...context, [field]: value }
    });
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="flex justify-between items-end border-b border-slate-800 pb-6">
        <div>
            <h3 className="text-2xl font-bold text-white font-display mb-2">Audit Context Review</h3>
            <p className="text-slate-400 text-sm">
                Verify the baseline data before the compliance engine initializes. 
                Inaccurate inputs will lead to false positives.
            </p>
        </div>
        <div className="px-4 py-1 bg-blue-900/30 border border-blue-500/30 text-blue-400 text-xs font-bold uppercase tracking-wider rounded-full">
            Pre-Check
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          <div className="bg-slate-900 p-6 rounded-xl border border-slate-700">
              <label className="text-xs font-bold text-slate-500 uppercase block mb-3">Project Identity</label>
              <input 
                  value={context.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-white mb-4 focus:border-blue-500 outline-none transition-colors"
              />
              <div className="grid grid-cols-2 gap-4">
                  <div>
                      <label className="text-xs font-bold text-slate-500 uppercase block mb-2">Asset Class</label>
                      <select 
                          value={context.type}
                          onChange={(e) => handleChange('type', e.target.value)}
                          className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-white outline-none focus:border-blue-500"
                      >
                          <option>Real Estate</option>
                          <option>Business Equity</option>
                          <option>Debt</option>
                          <option>Fund</option>
                      </select>
                  </div>
                  <div>
                      <label className="text-xs font-bold text-slate-500 uppercase block mb-2">Token Model</label>
                      <select 
                          value={context.tokenType}
                          onChange={(e) => handleChange('tokenType', e.target.value)}
                          className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-white outline-none focus:border-blue-500"
                      >
                          <option>Security</option>
                          <option>Utility</option>
                          <option>Hybrid</option>
                          <option>Governance</option>
                      </select>
                  </div>
              </div>
          </div>

          <div className="bg-slate-900 p-6 rounded-xl border border-slate-700">
              <label className="text-xs font-bold text-slate-500 uppercase block mb-3">Jurisdictional Nexus</label>
              <input 
                  value={context.jurisdiction}
                  onChange={(e) => handleChange('jurisdiction', e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-white mb-4 focus:border-blue-500 outline-none font-mono"
              />
              
              <div className="p-4 bg-blue-900/10 border border-blue-500/20 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                      <span className="text-lg">ℹ️</span>
                      <span className="text-xs font-bold text-blue-400 uppercase">System Note</span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                      The engine will load regulatory libraries specific to <strong>{context.jurisdiction}</strong>. 
                      Ensure this matches your SPV incorporation documents.
                  </p>
              </div>
          </div>

      </div>

      <div className="flex justify-end pt-6">
          <Button onClick={onNext} className="bg-blue-600 hover:bg-blue-500 text-white px-8">
              Save & Configure Scope →
          </Button>
      </div>
    </div>
  );
};
