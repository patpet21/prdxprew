
import React from 'react';
import { ComplianceData } from '../../../../types';

interface Props {
  compliance: ComplianceData;
  updateData: (field: string, val: any) => void;
}

export const GeoRestrictionsSection: React.FC<Props> = ({ compliance, updateData }) => {
  const regions = [
      { code: 'US', label: 'United States', flag: '🇺🇸' },
      { code: 'EU', label: 'Europe (EEA)', flag: '🇪🇺' },
      { code: 'UK', label: 'United Kingdom', flag: '🇬🇧' },
      { code: 'CH', label: 'Switzerland', flag: '🇨🇭' },
      { code: 'AE', label: 'UAE / Dubai', flag: '🇦🇪' },
      { code: 'ASIA', label: 'Asia Pacific', flag: '🌏' },
      { code: 'SANCTIONS', label: 'Sanctioned List', flag: '🚫' },
  ];

  const currentRestrictions = compliance.jurisdictionRestrictions || [];

  const toggleRegion = (code: string) => {
    const updated = currentRestrictions.includes(code)
        ? currentRestrictions.filter(c => c !== code)
        : [...currentRestrictions, code];
    updateData('jurisdictionRestrictions', updated);
  };

  const isUsBlocked = currentRestrictions.includes('US');

  return (
    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm h-full flex flex-col">
      <div className="flex items-center gap-2.5 mb-4">
        <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center text-sm font-bold shadow-md shadow-emerald-600/20">3</div>
        <div>
            <h3 className="font-bold text-slate-900 text-base leading-tight">Geo-Blocking</h3>
            <p className="text-slate-500 text-xs">Toggle to <span className="text-red-500 font-bold">BLOCK</span> regions.</p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-7 gap-2.5 mb-5">
          {regions.map(r => {
              const isBlocked = currentRestrictions.includes(r.code);
              return (
                  <button
                    key={r.code}
                    onClick={() => toggleRegion(r.code)}
                    className={`
                        flex flex-col items-center justify-center p-2.5 rounded-lg border transition-all duration-200
                        ${isBlocked 
                            ? 'bg-red-50 border-red-200 text-red-600' 
                            : 'bg-white border-slate-200 text-slate-600 hover:border-emerald-500 hover:shadow-sm'
                        }
                    `}
                  >
                      <span className={`text-xl mb-1 ${isBlocked ? 'grayscale opacity-50' : ''}`}>{r.flag}</span>
                      <span className="text-[9px] font-bold uppercase leading-tight text-center">{r.label}</span>
                      <span className={`text-[8px] font-bold mt-1 ${isBlocked ? 'text-red-500' : 'text-emerald-500'}`}>
                          {isBlocked ? 'BLOCKED' : 'ALLOWED'}
                      </span>
                  </button>
              )
          })}
      </div>

      {!isUsBlocked ? (
          <div className="mt-auto p-3.5 bg-slate-900 rounded-lg border border-slate-800 flex gap-3 items-center">
              <span className="text-xl">🇺🇸</span>
              <div>
                  <h5 className="text-emerald-400 font-bold text-[10px] uppercase mb-0.5">US Market Access Active</h5>
                  <p className="text-slate-400 text-xs leading-relaxed">
                      Including the US triggers <strong className="text-white">Reg D Rule 506(c)</strong> compliance automatically. Ensure you have a registered Transfer Agent.
                  </p>
              </div>
          </div>
      ) : (
          <div className="mt-auto p-3.5 bg-slate-50 rounded-lg border border-slate-200 flex gap-3 items-center">
              <span className="text-xl opacity-50">🌍</span>
              <div>
                  <h5 className="text-slate-500 font-bold text-[10px] uppercase mb-0.5">Offshore Offering</h5>
                  <p className="text-slate-400 text-xs">
                      US investors are blocked. This simplifies compliance to <strong className="text-slate-600">Reg S</strong> standards (Non-US only).
                  </p>
              </div>
          </div>
      )}
    </div>
  );
};
