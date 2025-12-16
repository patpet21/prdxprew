
import React from 'react';
import { AuditConfigEntity } from '../../domain/audit_config.entity';
import { Button } from '../../../../../components/ui/Button';

interface Props {
  config: AuditConfigEntity;
  updateConfig: (updates: Partial<AuditConfigEntity>) => void;
  onNext: () => void;
}

export const RiskAppetiteTab: React.FC<Props> = ({ config, updateConfig, onNext }) => {
  const { riskTolerance } = config;

  const handleSliderChange = (field: keyof typeof riskTolerance, val: number) => {
    updateConfig({
        riskTolerance: { ...riskTolerance, [field]: val }
    });
  };

  const getRiskLabel = (val: number) => {
      if (val < 20) return { label: 'Zero Tolerance', color: 'text-red-500' };
      if (val < 50) return { label: 'Conservative', color: 'text-amber-400' };
      if (val < 80) return { label: 'Balanced', color: 'text-blue-400' };
      return { label: 'Aggressive', color: 'text-emerald-400' };
  };

  const renderSlider = (label: string, field: keyof typeof riskTolerance, description: string) => {
      const val = riskTolerance[field];
      const status = getRiskLabel(val);
      
      return (
          <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
              <div className="flex justify-between items-center mb-4">
                  <div>
                      <h4 className="text-sm font-bold text-white">{label}</h4>
                      <p className="text-xs text-slate-500 mt-1">{description}</p>
                  </div>
                  <div className={`text-right`}>
                      <div className={`text-xl font-display font-bold ${status.color}`}>{val}%</div>
                      <div className={`text-[10px] uppercase font-bold tracking-wider ${status.color}`}>{status.label}</div>
                  </div>
              </div>
              <input 
                  type="range" min="0" max="100" step="5"
                  value={val}
                  onChange={(e) => handleSliderChange(field, parseInt(e.target.value))}
                  className="w-full h-3 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-slate-500"
              />
              <div className="flex justify-between mt-2 text-[10px] text-slate-600 uppercase font-bold">
                  <span>Strict</span>
                  <span>Flexible</span>
              </div>
          </div>
      );
  };

  return (
    <div className="space-y-8 animate-fadeIn">
        <div className="flex justify-between items-end border-b border-slate-800 pb-6">
            <div>
                <h3 className="text-2xl font-bold text-white font-display mb-2">Risk Appetite Configuration</h3>
                <p className="text-slate-400 text-sm">
                    Tune the sensitivity of the audit engine. 
                    Stricter settings will flag minor issues as critical.
                </p>
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Left Col */}
            <div className="space-y-6">
                {renderSlider(
                    "Regulatory Compliance", 
                    "regulatoryTolerance", 
                    "Tolerance for ambiguity in legal frameworks."
                )}
                {renderSlider(
                    "Reputational Risk", 
                    "reputationalTolerance", 
                    "Sensitivity to negative PR or partner association."
                )}
            </div>

            {/* Right Col */}
            <div className="space-y-6">
                {renderSlider(
                    "Financial Exposure", 
                    "financialExposureTolerance", 
                    "Willingness to accept currency/market volatility."
                )}
                {renderSlider(
                    "Operational Friction", 
                    "operationalFrictionTolerance", 
                    "Trade-off between user experience and security checks."
                )}
            </div>

        </div>

        {/* Visualization Summary */}
        <div className="bg-slate-900 rounded-2xl p-8 border border-slate-800 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl -mr-20 -mt-20"></div>
            <div className="relative z-10 flex items-center justify-between">
                <div>
                    <h4 className="text-lg font-bold text-white mb-2">Audit Profile Summary</h4>
                    <p className="text-slate-400 text-sm max-w-xl">
                        Based on your settings, the audit engine will behave like a 
                        <strong className="text-amber-400"> "Compliance-First Institution"</strong>. 
                        Expect high scrutiny on legal documents and moderate flexibility on UX.
                    </p>
                </div>
                <div className="w-24 h-24 bg-slate-800 rounded-full border-4 border-slate-700 flex items-center justify-center shadow-xl">
                    <span className="text-3xl">🛡️</span>
                </div>
            </div>
        </div>

        <div className="flex justify-end pt-6">
            <Button onClick={onNext} className="bg-blue-600 hover:bg-blue-500 text-white px-8">
                Save & Preview Checks →
            </Button>
        </div>
    </div>
  );
};
