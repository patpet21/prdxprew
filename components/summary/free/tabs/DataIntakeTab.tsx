
import React, { useEffect, useState } from 'react';
import { TokenizationState } from '../../../../types';
import { generateProjectDna } from '../../../../services/mockAiService';

interface Props {
  data: TokenizationState;
}

const Section = ({ title, icon, children, className = "" }: { title: string, icon: string, children?: React.ReactNode, className?: string }) => (
    <div className={`bg-slate-50 rounded-3xl p-8 border border-slate-200 hover:border-indigo-200 hover:shadow-md transition-all ${className}`}>
        <div className="flex items-center gap-4 mb-6 border-b border-slate-200 pb-4">
            <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-2xl shadow-sm border border-slate-100">
                {icon}
            </div>
            <h4 className="text-lg font-bold text-slate-800 uppercase tracking-widest font-display">{title}</h4>
        </div>
        <div className="space-y-6">
            {children}
        </div>
    </div>
);

const Field = ({ label, value, highlight, subValue }: { label: string, value: any, highlight?: boolean, subValue?: string }) => (
    <div>
        <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">{label}</span>
        <div className="flex items-baseline gap-2">
            <span className={`block font-mono font-bold ${highlight ? 'text-indigo-600 text-2xl' : 'text-slate-900 text-lg'}`}>
                {value || '—'}
            </span>
            {subValue && <span className="text-xs text-slate-500 font-medium">{subValue}</span>}
        </div>
    </div>
);

export const DataIntakeTab: React.FC<Props> = ({ data }) => {
  const [dna, setDna] = useState<string>('');

  useEffect(() => {
      generateProjectDna(data).then(setDna);
  }, [data]);

  return (
    <div className="animate-fadeIn space-y-8">
        
        {/* PROJECT PASSPORT HEADER */}
        <div className="bg-white rounded-[2rem] border border-slate-200 p-8 md:p-10 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
                <div className="flex items-center gap-3 mb-2">
                    <span className="px-3 py-1 rounded-full bg-slate-900 text-white text-[10px] font-bold uppercase tracking-widest">Project Passport</span>
                    <span className="text-xs font-mono text-slate-400">#PDX-{Math.floor(Math.random()*10000)}</span>
                </div>
                <h3 className="text-2xl font-bold text-slate-900 font-display">Project DNA Analysis</h3>
                <p className="text-slate-500 mt-2 max-w-3xl text-lg italic font-light">
                    "{dna || 'Analyzing deal structure...'}"
                </p>
            </div>
            <div className="hidden md:block text-right">
                 <div className="w-20 h-20 bg-slate-50 rounded-2xl flex items-center justify-center text-4xl border border-slate-100">
                    🧬
                 </div>
            </div>
        </div>

        {/* MAIN GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            
            <Section title="Asset Core" icon="📍">
                <div className="grid grid-cols-2 gap-6">
                    <Field label="Project Name" value={data.projectInfo.projectName} />
                    <Field label="Asset Class" value={data.property.property_type} />
                </div>
                <Field label="Location" value={`${data.property.city}, ${data.property.country}`} />
                <div className="pt-4 border-t border-slate-200">
                    <Field label="Total Valuation" value={`€${data.property.total_value?.toLocaleString()}`} highlight />
                </div>
            </Section>

            <Section title="Legal Frame" icon="⚖️">
                <div className="grid grid-cols-2 gap-6">
                    <Field label="Jurisdiction" value={data.jurisdiction.country} />
                    <Field label="Entity Type" value={data.jurisdiction.spvType} />
                </div>
                <Field label="Regulatory Lane" value={data.compliance.regFramework} highlight subValue={data.compliance.targetInvestorType} />
                <Field label="Geofencing" value={`${data.compliance.jurisdictionRestrictions.length} Regions Blocked`} />
            </Section>

            <Section title="Tokenomics" icon="🪙">
                <div className="grid grid-cols-2 gap-6">
                    <Field label="Token Supply" value={data.property.total_tokens?.toLocaleString()} />
                    <Field label="Unit Price" value={`€${data.property.token_price}`} />
                </div>
                <div className="pt-4 border-t border-slate-200">
                    <Field label="Hard Cap" value={`€${data.property.hard_cap?.toLocaleString()}`} highlight />
                </div>
                <Field label="Cap Table" value={`${data.tokenAllocation.investors}% Public`} subValue={`${data.tokenAllocation.founders}% Team`} />
            </Section>

            {/* Full Width Bottom Section */}
            <div className="xl:col-span-3 bg-slate-900 rounded-3xl p-8 md:p-10 border border-slate-800 text-white flex flex-col md:flex-row gap-12">
                 <div className="flex-shrink-0">
                     <div className="flex items-center gap-4 mb-6">
                         <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-2xl shadow-lg shadow-indigo-500/30">📢</div>
                         <h4 className="text-xl font-bold uppercase tracking-widest font-display">Distribution Strategy</h4>
                     </div>
                     <div className="space-y-6">
                        <Field label="Target Audience" value={data.distribution.targetInvestorType} />
                        <Field label="Minimum Ticket" value={`$${data.distribution.minInvestment?.toLocaleString()}`} />
                     </div>
                 </div>

                 <div className="flex-1 border-t md:border-t-0 md:border-l border-slate-700 pt-8 md:pt-0 md:pl-12">
                      <span className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-6">Active Marketing Channels</span>
                      <div className="flex flex-wrap gap-3">
                         {data.distribution.marketingChannels.length > 0 
                            ? data.distribution.marketingChannels.map((c,i) => (
                                <span key={i} className="px-5 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white font-bold text-sm shadow-sm">
                                    {c}
                                </span>
                              ))
                            : <span className="text-slate-600 italic text-lg">No channels selected</span>
                         }
                     </div>
                 </div>
            </div>
        
        </div>
    </div>
  );
};
