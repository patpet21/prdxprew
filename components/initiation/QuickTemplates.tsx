import React from 'react';

export interface ProjectTemplate {
  id: string;
  icon: string;
  label: string;
  assetClass: string;
  defaultDesc: string;
  avgRaise: number;
  // Enhanced Metadata
  typicalValue: string;
  yieldEstimate: string;
  leverage: string;
  tokenModel: string;
  useCases: string[];
}

export const TEMPLATES: ProjectTemplate[] = [
  { 
    id: 're_income', 
    icon: '🏠', 
    label: 'Real Estate Income', 
    assetClass: 'Real Estate', 
    defaultDesc: 'Acquisition of cash-flowing residential portfolio focused on high-occupancy urban zones.',
    avgRaise: 2000000,
    typicalValue: "$2M - $10M",
    yieldEstimate: "6% - 9% Net",
    leverage: "Medium (50% LTV)",
    tokenModel: "Revenue Share / Equity",
    useCases: ["Multi-family Rentals", "Student Housing", "Urban Airbnb Portfolio"]
  },
  { 
    id: 'land_dev', 
    icon: '🌱', 
    label: 'Land Development', 
    assetClass: 'Real Estate', 
    defaultDesc: 'Greenfield land development project for residential subdivision with zoning approval.',
    avgRaise: 5000000,
    typicalValue: "$5M - $50M",
    yieldEstimate: "15% - 25% IRR",
    leverage: "Low (Equity Heavy)",
    tokenModel: "Equity (Capital Appreciation)",
    useCases: ["Residential Subdivision", "Commercial Zoning", "Agricultural Conversion"]
  },
  { 
    id: 'construction', 
    icon: '🏗️', 
    label: 'Construction', 
    assetClass: 'Real Estate', 
    defaultDesc: 'Ground-up construction of a mixed-use commercial and residential complex.',
    avgRaise: 10000000,
    typicalValue: "$10M - $100M",
    yieldEstimate: "12% - 18% IRR",
    leverage: "High (Construction Loan)",
    tokenModel: "Preferred Equity",
    useCases: ["Mixed-Use Complex", "Office Tower", "Luxury Condos"]
  },
  { 
    id: 'storage', 
    icon: '🫙', 
    label: 'Storage / Hospitality', 
    assetClass: 'Real Estate', 
    defaultDesc: 'Value-add opportunity in the self-storage sector with automated management systems.',
    avgRaise: 1500000,
    typicalValue: "$1.5M - $5M",
    yieldEstimate: "8% - 12% Net",
    leverage: "Medium",
    tokenModel: "Revenue Share",
    useCases: ["Self-Storage Units", "Boutique Hotels", "Glamping Sites"]
  },
  { 
    id: 'tech_rnd', 
    icon: '🧪', 
    label: 'Tech / Biotech R&D', 
    assetClass: 'Business', 
    defaultDesc: 'Series A equity financing for a biotechnology firm specializing in longevity research.',
    avgRaise: 3000000,
    typicalValue: "$3M - $20M",
    yieldEstimate: "10x - 50x ROI (Exit)",
    leverage: "None",
    tokenModel: "Simple Equity (Shares)",
    useCases: ["Pharma Research", "SaaS Expansion", "Deep Tech Hardware"]
  },
];

interface Props {
  onSelect: (tpl: ProjectTemplate) => void;
  selectedId?: string;
}

export const QuickTemplates: React.FC<Props> = ({ onSelect, selectedId }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
      {TEMPLATES.map((tpl) => (
        <button
          key={tpl.id}
          onClick={() => onSelect(tpl)}
          className={`
            relative p-4 rounded-2xl border-2 text-left transition-all duration-300 group overflow-hidden flex flex-col h-full
            ${selectedId === tpl.id 
              ? 'bg-slate-900 border-sim-cta shadow-xl shadow-indigo-500/20 scale-[1.02]' 
              : 'bg-white border-sim-border hover:border-indigo-300 hover:shadow-lg'
            }
          `}
        >
          <div className="text-3xl mb-3 group-hover:scale-110 transition-transform duration-300">{tpl.icon}</div>
          <h4 className={`font-bold text-sm leading-tight mb-2 ${selectedId === tpl.id ? 'text-white' : 'text-slate-900'}`}>
            {tpl.label}
          </h4>
          <p className={`text-[10px] mt-auto ${selectedId === tpl.id ? 'text-slate-400' : 'text-slate-500'}`}>
            Avg Raise: ${(tpl.avgRaise / 1000000).toFixed(1)}M
          </p>
          
          <div className={`mt-2 text-[10px] font-bold uppercase tracking-wider ${selectedId === tpl.id ? 'text-sim-cta' : 'text-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity'}`}>
            View Details →
          </div>
        </button>
      ))}
    </div>
  );
};