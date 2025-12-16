
import React from 'react';
import { ComplianceData } from '../../../../types';

interface Props {
  compliance: ComplianceData;
  updateData: (field: string, val: any) => void;
}

export const InvestorEligibilitySection: React.FC<Props> = ({ compliance, updateData }) => {
  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm h-full flex flex-col">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center text-lg font-bold shadow-lg shadow-amber-500/20">2</div>
        <div>
            <h3 className="font-bold text-slate-900 text-lg leading-tight">Investor Eligibility</h3>
            <p className="text-slate-500 text-xs">Who can participate?</p>
        </div>
      </div>

      <div className="space-y-6 flex-1">
          {/* Visual Selector for Investor Type */}
          <div className="grid grid-cols-2 gap-3">
              {[
                  { val: 'Accredited', label: 'Accredited Only', icon: '🎩' },
                  { val: 'Retail', label: 'Retail Allowed', icon: '🛍️' },
                  { val: 'Institutional', label: 'Institutional', icon: '🏛️' },
                  { val: 'Family Office', label: 'Family Offices', icon: '🏰' },
              ].map((opt) => (
                  <button
                    key={opt.val}
                    onClick={() => updateData('targetInvestorType', opt.val)}
                    className={`
                        flex items-center gap-2 p-3 rounded-lg border text-sm font-bold transition-all text-left
                        ${compliance.targetInvestorType === opt.val
                            ? 'bg-amber-50 border-amber-500 text-amber-900'
                            : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                        }
                    `}
                  >
                      <span className="text-lg">{opt.icon}</span>
                      {opt.label}
                  </button>
              ))}
          </div>

          {/* Ticket Sizes */}
          <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-400 uppercase">Min Ticket ($)</label>
                  <input 
                    type="number"
                    value={compliance.minInvestment || ''} 
                    onChange={e => updateData('minInvestment', parseFloat(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-slate-900 font-mono focus:ring-2 focus:ring-amber-500 outline-none"
                    placeholder="1,000"
                  />
              </div>
              <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-400 uppercase">Max Ticket ($)</label>
                  <input 
                    type="number"
                    value={compliance.maxInvestment || ''} 
                    onChange={e => updateData('maxInvestment', parseFloat(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-slate-900 font-mono focus:ring-2 focus:ring-amber-500 outline-none"
                    placeholder="Unlimited"
                  />
              </div>
          </div>
      </div>
      
      {compliance.targetInvestorType === 'Retail' && (
          <div className="mt-4 p-3 bg-red-50 text-red-600 text-xs rounded-lg border border-red-100 flex items-center gap-2 font-medium">
              <span>⚠️</span>
              Warning: Retail usually requires a prospectus.
          </div>
      )}
    </div>
  );
};
