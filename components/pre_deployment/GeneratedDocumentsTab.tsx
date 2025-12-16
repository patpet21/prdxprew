
import React from 'react';
import { TokenizationState } from '../../types';
import { Button } from '../ui/Button';

interface Props {
  data: TokenizationState;
}

const DocSection = ({ title, children }: { title: string, children?: React.ReactNode }) => (
    <div className="mb-6 border-b border-slate-100 pb-4 last:border-0 last:pb-0">
        <h5 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">{title}</h5>
        <div className="space-y-2">
            {children}
        </div>
    </div>
);

const DocRow = ({ label, value, highlight }: { label: string, value: string | number | undefined, highlight?: boolean }) => (
    <div className="flex justify-between text-sm">
        <span className="text-slate-500">{label}</span>
        <span className={`font-medium ${highlight ? 'text-indigo-600 font-bold' : 'text-slate-900'}`}>
            {value || '-'}
        </span>
    </div>
);

export const GeneratedDocumentsTab: React.FC<Props> = ({ data }) => {
  const { projectInfo, property, jurisdiction, compliance } = data;

  return (
    <div className="animate-fadeIn space-y-12 pb-12">
        
        <div className="text-center max-w-2xl mx-auto">
            <h3 className="text-3xl font-bold text-slate-900 font-display mb-2">Official Documentation</h3>
            <p className="text-slate-500 text-lg">
                The system has generated preliminary documentation based on your inputs. 
                <br/><span className="text-sm text-amber-600 font-bold uppercase tracking-wide">Preview Mode (Demo)</span>
            </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* CARD 1: PROJECT SNAPSHOT */}
            <div className="bg-white rounded-[20px] shadow-2xl border border-slate-200 overflow-hidden relative group">
                {/* PDF Header Visual */}
                <div className="h-3 bg-gradient-to-r from-slate-800 to-slate-600"></div>
                <div className="p-8 relative">
                    <div className="absolute top-4 right-4 opacity-10 text-6xl font-display font-bold text-slate-900 rotate-12 pointer-events-none">DEMO</div>
                    
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h4 className="text-xl font-bold text-slate-900 font-display">Project Snapshot</h4>
                            <p className="text-xs text-slate-400 uppercase tracking-wider">Executive Summary • v1.0</p>
                        </div>
                        <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center text-xl border border-slate-200">
                            📄
                        </div>
                    </div>

                    <DocSection title="Executive Summary">
                        <DocRow label="Project Name" value={projectInfo.projectName} highlight />
                        <DocRow label="Jurisdiction" value={`${jurisdiction.country} (${jurisdiction.spvType})`} />
                        <DocRow label="Asset Class" value={property.category} />
                    </DocSection>

                    <DocSection title="Asset Overview">
                        <DocRow label="Location" value={property.city} />
                        <DocRow label="Use Case" value={property.property_type} />
                        <DocRow label="Valuation" value={`€${property.total_value?.toLocaleString()}`} highlight />
                    </DocSection>

                    <DocSection title="Market Fit Analysis">
                         <ul className="list-disc list-inside text-xs text-slate-600 space-y-1 pl-2">
                             <li>Strong yield potential relative to {property.city} averages.</li>
                             <li>Asset class ({property.property_type}) shows high liquidity demand.</li>
                             <li>Structure aligns with {compliance.regFramework} standards.</li>
                         </ul>
                    </DocSection>

                    <DocSection title="Financial Projection (12 Mo)">
                        <div className="h-32 w-full bg-slate-50 rounded-lg border border-slate-100 flex items-end justify-between p-4 gap-2 relative">
                             {/* Mock Line Chart */}
                             <div className="absolute inset-0 flex items-center justify-center text-slate-300 text-xs font-bold uppercase tracking-widest">Simulated ROI Trend</div>
                             <div className="w-full h-1/4 bg-indigo-100 rounded-t"></div>
                             <div className="w-full h-2/4 bg-indigo-200 rounded-t"></div>
                             <div className="w-full h-3/4 bg-indigo-300 rounded-t"></div>
                             <div className="w-full h-full bg-indigo-500 rounded-t relative group-hover:bg-indigo-600 transition-colors">
                                 <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-bold text-indigo-600">{property.annual_yield}%</div>
                             </div>
                        </div>
                    </DocSection>
                </div>
                <div className="bg-slate-50 p-4 text-center border-t border-slate-100">
                    <button className="text-xs font-bold text-slate-500 uppercase tracking-wider hover:text-indigo-600 flex items-center justify-center gap-2">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                        Download Preview PDF
                    </button>
                </div>
            </div>

            {/* CARD 2: TOKEN MODEL SUMMARY */}
            <div className="bg-white rounded-[20px] shadow-2xl border border-slate-200 overflow-hidden relative group">
                <div className="h-3 bg-gradient-to-r from-indigo-600 to-purple-600"></div>
                <div className="p-8 relative">
                    <div className="absolute top-4 right-4 opacity-10 text-6xl font-display font-bold text-slate-900 rotate-12 pointer-events-none">DEMO</div>

                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h4 className="text-xl font-bold text-slate-900 font-display">Token Model</h4>
                            <p className="text-xs text-slate-400 uppercase tracking-wider">Structure & Rights • v1.0</p>
                        </div>
                        <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center text-xl border border-slate-200">
                            🪙
                        </div>
                    </div>

                    <DocSection title="Token Structure">
                        <DocRow label="Total Supply" value={property.total_tokens?.toLocaleString()} />
                        <DocRow label="Issue Price" value={`€${property.token_price}`} />
                        <DocRow label="Hard Cap" value={`€${property.hard_cap?.toLocaleString()}`} highlight />
                    </DocSection>

                    <DocSection title="Distribution Logic">
                         <div className="flex items-center gap-4 mb-2">
                             <div className="w-16 h-16 rounded-full border-4 border-slate-100 relative flex-shrink-0">
                                 {/* CSS Donut Mock */}
                                 <div className="absolute inset-0 rounded-full border-4 border-purple-500 border-l-transparent border-b-transparent transform rotate-45"></div>
                             </div>
                             <div className="text-xs space-y-1">
                                 <div className="flex items-center gap-2"><span className="w-2 h-2 bg-purple-500 rounded-full"></span> Investors (70%)</div>
                                 <div className="flex items-center gap-2"><span className="w-2 h-2 bg-slate-200 rounded-full"></span> Team/Treasury (30%)</div>
                             </div>
                         </div>
                         <DocRow label="Yield Type" value="Quarterly Revenue Share" />
                         <DocRow label="Lock-up" value="12 Months (Reg D)" />
                    </DocSection>

                    <DocSection title="Investor Rights">
                         <div className="grid grid-cols-2 gap-2">
                             <div className="bg-slate-50 p-2 rounded border border-slate-100 text-center">
                                 <span className="block text-[10px] text-slate-400 uppercase font-bold">Voting</span>
                                 <span className="text-xs font-bold text-slate-700">No</span>
                             </div>
                             <div className="bg-slate-50 p-2 rounded border border-slate-100 text-center">
                                 <span className="block text-[10px] text-slate-400 uppercase font-bold">Economic</span>
                                 <span className="text-xs font-bold text-slate-700">Pro-Rata</span>
                             </div>
                         </div>
                    </DocSection>

                    <DocSection title="Technical Spec">
                         <DocRow label="Standard" value="ERC-3643 (Permissioned)" />
                         <DocRow label="Compliance" value="On-chain Whitelist" />
                    </DocSection>
                </div>
                <div className="bg-slate-50 p-4 text-center border-t border-slate-100">
                    <button className="text-xs font-bold text-slate-500 uppercase tracking-wider hover:text-purple-600 flex items-center justify-center gap-2">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                        Download Model PDF
                    </button>
                </div>
            </div>

        </div>

        {/* PRO UPSELL FOOTER */}
        <div className="bg-slate-900 rounded-3xl p-8 md:p-12 text-center border border-slate-800 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 pointer-events-none"></div>
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-amber-500/20 rounded-full blur-3xl pointer-events-none animate-pulse"></div>

            <div className="relative z-10 max-w-3xl mx-auto">
                <h3 className="text-2xl md:text-3xl font-bold text-white font-display mb-6">
                    Ready to generate the <span className="text-amber-400">Real Documents</span>?
                </h3>
                
                <p className="text-slate-400 mb-8 text-lg">
                    Upgrade to <strong className="text-white">PRO</strong> to auto-generate the complete legal and technical pack, ready for your lawyer and developers.
                </p>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-10 text-left">
                    {[
                        "Full Term Sheet", "Offering Memorandum", "SPV Bylaws Draft",
                        "Token Purchase Agreement", "Dynamic Cap Table (XLS)", "Provider Audit Pack"
                    ].map((item, i) => (
                        <div key={i} className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-lg border border-slate-700">
                            <span className="text-amber-500">🔒</span>
                            <span className="text-sm text-slate-300 font-medium">{item}</span>
                        </div>
                    ))}
                </div>

                <div className="flex flex-col sm:flex-row justify-center gap-4">
                     <Button className="px-10 py-4 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-slate-900 font-bold shadow-xl shadow-amber-900/20 text-lg">
                         Unlock PRO Documents
                     </Button>
                     <Button variant="secondary" className="px-10 py-4 border-slate-700 text-slate-300 hover:text-white">
                         Save & Finish Simulation
                     </Button>
                </div>
            </div>
        </div>

    </div>
  );
};
