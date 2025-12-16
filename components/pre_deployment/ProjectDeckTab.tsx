
import React from 'react';
import { TokenizationState } from '../../types';

interface Props {
  data: TokenizationState;
}

interface SlideCardProps {
  title: string;
  icon: string;
  children?: React.ReactNode;
  colorClass: string;
}

const SlideCard = ({ title, icon, children, colorClass }: SlideCardProps) => (
    <div className={`rounded-3xl p-8 border-2 shadow-xl relative overflow-hidden group transition-transform hover:-translate-y-1 duration-300 ${colorClass}`}>
        <div className="absolute top-0 right-0 p-6 opacity-10 text-8xl pointer-events-none group-hover:scale-110 transition-transform">{icon}</div>
        <div className="relative z-10">
            <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center text-2xl shadow-inner border border-white/10">
                    {icon}
                </div>
                <h3 className="text-2xl font-bold font-display uppercase tracking-wide">{title}</h3>
            </div>
            <div className="space-y-4">
                {children}
            </div>
        </div>
    </div>
);

const DataRow = ({ label, value }: { label: string, value: string | number | undefined | null }) => (
    <div className="flex justify-between items-center border-b border-white/10 pb-2 last:border-0">
        <span className="text-sm font-medium opacity-80 uppercase tracking-wider">{label}</span>
        <span className="text-lg font-bold font-mono">{value ?? '-'}</span>
    </div>
);

export const ProjectDeckTab: React.FC<Props> = ({ data }) => {
  const { jurisdiction, property, compliance, distribution, projectInfo } = data;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-fadeIn px-2">
        
        {/* SLIDE 1: LEGAL STRUCTURE */}
        <SlideCard 
            title="Legal Structure" 
            icon="🏛️" 
            colorClass="bg-slate-900 border-slate-800 text-white"
        >
            <DataRow label="Jurisdiction" value={jurisdiction.country || 'Global'} />
            <DataRow label="Entity Type" value={jurisdiction.spvType || 'TBD'} />
            <DataRow label="Regulatory Path" value={compliance.regFramework || 'TBD'} />
            <div className="mt-4 p-3 bg-white/10 rounded-xl text-xs italic text-slate-300 border border-white/5">
                "Structured as a compliant vehicle optimized for {projectInfo.projectGoal}."
            </div>
        </SlideCard>

        {/* SLIDE 2: TOKENOMICS */}
        <SlideCard 
            title="Token Model" 
            icon="🪙" 
            colorClass="bg-indigo-900 border-indigo-700 text-white"
        >
             <DataRow label="Token Supply" value={property.total_tokens?.toLocaleString()} />
             <DataRow label="Initial Price" value={`€${property.token_price}`} />
             <DataRow label="Target Yield" value={`${property.annual_yield}% APY`} />
             <div className="mt-4 flex gap-2">
                 <span className="px-3 py-1 rounded-full bg-emerald-500 text-slate-900 text-xs font-bold uppercase">
                    Hard Cap: €{property.hard_cap?.toLocaleString()}
                 </span>
             </div>
        </SlideCard>

        {/* SLIDE 3: DISTRIBUTION */}
        <SlideCard 
            title="Go-To-Market" 
            icon="🚀" 
            colorClass="bg-emerald-900 border-emerald-700 text-white"
        >
             <DataRow label="Target Investor" value={distribution.targetInvestorType} />
             <DataRow label="Min Ticket" value={`$${distribution.minInvestment?.toLocaleString()}`} />
             <div className="mt-4">
                 <p className="text-xs opacity-70 uppercase font-bold mb-2">Active Channels</p>
                 <div className="flex flex-wrap gap-2">
                     {distribution.marketingChannels.slice(0,4).map((c, i) => (
                         <span key={i} className="px-2 py-1 bg-white/10 rounded text-xs border border-white/10">{c}</span>
                     ))}
                 </div>
             </div>
        </SlideCard>

        {/* SLIDE 4: ASSET PROFILE */}
        <SlideCard 
            title="Asset Core" 
            icon="📍" 
            colorClass="bg-amber-900 border-amber-700 text-white"
        >
             <DataRow label="Asset Class" value={property.category} />
             <DataRow label="Location" value={property.city} />
             <DataRow label="Valuation" value={`€${property.total_value?.toLocaleString()}`} />
             <div className="mt-4 p-3 bg-black/20 rounded-xl text-xs font-medium leading-relaxed">
                {projectInfo.projectName}
             </div>
        </SlideCard>

    </div>
  );
};
