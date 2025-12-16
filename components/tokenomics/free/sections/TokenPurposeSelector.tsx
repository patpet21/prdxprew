
import React from 'react';

interface Props {
  selected: string;
  onSelect: (model: string) => void;
}

const MODELS = [
    {
        id: 'Equity',
        label: 'Equity Token',
        icon: '🏢',
        desc: 'Digital shares. Grants economic + voting rights.',
        badge: 'RWA Standard',
        color: 'bg-indigo-500'
    },
    {
        id: 'Revenue',
        label: 'Revenue-Share',
        icon: '💸',
        desc: 'Right to cashflow only. No ownership of the entity.',
        badge: 'Simplified',
        color: 'bg-emerald-500'
    },
    {
        id: 'Utility',
        label: 'Utility Token',
        icon: '🔑',
        desc: 'Access or credits only. NO financial rights. (Demo)',
        badge: 'Educational',
        color: 'bg-purple-500'
    }
];

export const TokenPurposeSelector: React.FC<Props> = ({ selected, onSelect }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {MODELS.map(model => {
            const isSelected = selected === model.id;
            return (
                <button
                    key={model.id}
                    onClick={() => onSelect(model.id)}
                    className={`
                        relative p-4 rounded-xl border-2 text-left transition-all group
                        ${isSelected 
                            ? `bg-slate-900 border-slate-800 shadow-xl scale-[1.02]` 
                            : 'bg-white border-slate-200 hover:border-slate-300'
                        }
                    `}
                >
                    {isSelected && (
                         <div className={`absolute top-0 right-0 px-2 py-1 text-[9px] font-bold uppercase text-white rounded-bl-lg ${model.color}`}>
                             Active
                         </div>
                    )}
                    
                    <div className="flex items-center gap-3 mb-2">
                        <span className="text-2xl">{model.icon}</span>
                        <div>
                            <h4 className={`font-bold text-sm ${isSelected ? 'text-white' : 'text-slate-900'}`}>{model.label}</h4>
                            <span className="text-[10px] text-slate-500 uppercase font-bold">{model.badge}</span>
                        </div>
                    </div>
                    
                    <p className={`text-xs leading-snug ${isSelected ? 'text-slate-400' : 'text-slate-600'}`}>
                        {model.desc}
                    </p>
                </button>
            );
        })}
    </div>
  );
};
