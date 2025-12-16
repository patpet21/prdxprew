
import React from 'react';

interface Props {
  onSelect: (preset: any) => void;
}

export const TokenPresets: React.FC<Props> = ({ onSelect }) => {
  
  const PRESETS = [
      {
          id: 'multifamily',
          label: 'US Multifamily',
          icon: '🏘️',
          data: {
              price: 50,
              supply: 100000, // 5M raise
              yield: 6.5,
              allocation: { investors: 80, founders: 20, treasury: 0, advisors: 0 }
          }
      },
      {
          id: 'hotel',
          label: 'Boutique Hotel',
          icon: '🏨',
          data: {
              price: 100,
              supply: 20000, // 2M raise
              yield: 8.2,
              allocation: { investors: 70, founders: 25, treasury: 5, advisors: 0 }
          }
      },
      {
          id: 'dev',
          label: 'Development',
          icon: '🏗️',
          data: {
              price: 1000,
              supply: 5000, // 5M raise
              yield: 0, // No yield during dev
              allocation: { investors: 90, founders: 10, treasury: 0, advisors: 0 }
          }
      }
  ];

  return (
    <div className="mb-8">
        <div className="flex items-center gap-2 mb-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Quick Load Presets</span>
            <div className="h-px bg-slate-200 flex-1"></div>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-2 custom-scrollbar">
            {PRESETS.map(p => (
                <button
                    key={p.id}
                    onClick={() => onSelect(p.data)}
                    className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200 transition-colors whitespace-nowrap flex items-center gap-2 shadow-sm"
                >
                    <span>{p.icon}</span> {p.label}
                </button>
            ))}
        </div>
    </div>
  );
};
