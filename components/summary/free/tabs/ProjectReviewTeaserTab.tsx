
import React from 'react';
import { Button } from '../../../../components/ui/Button';

export const ProjectReviewTeaserTab: React.FC = () => {
  const features = [
      { title: "SPV Blueprint", desc: "Legal structure, roles, and incorporation roadmap.", icon: "🏛️" },
      { title: "Token Blueprint", desc: "Technical standard (ERC-3643), rights matrix, and waterfall.", icon: "🪙" },
      { title: "Compliance Pre-Audit", desc: "Risk detection, blocked jurisdictions, and document checklist.", icon: "🛡️" },
      { title: "Valuation Snapshots", desc: "Professional financial model with IRR and sensitivity analysis.", icon: "📊" },
      { title: "Investor Persona", desc: "Target audience profiling and marketing hooks.", icon: "👤" },
      { title: "Risk Flags", desc: "Critical warnings that a real provider would flag immediately.", icon: "🚩" },
  ];

  return (
    <div className="animate-fadeIn h-full flex flex-col items-center justify-center text-center p-8 bg-slate-900 rounded-2xl border border-slate-800 relative overflow-hidden">
        
        {/* Background Effects */}
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 pointer-events-none"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-slate-900/50 via-slate-900/80 to-slate-900 pointer-events-none z-0"></div>
        
        <div className="relative z-10 max-w-4xl w-full">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-bold uppercase tracking-widest mb-6">
                Professional Suite
            </div>
            
            <h3 className="text-3xl md:text-4xl font-bold text-white font-display mb-4">
                Transform Simulation into Reality
            </h3>
            <p className="text-slate-400 text-lg mb-10 max-w-2xl mx-auto">
                Unlocking Pro upgrades your educational simulation into a comprehensive <strong>Project File</strong>, 
                ready to be analyzed by regulated providers and legal partners.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-left mb-10">
                {features.map((feat, i) => (
                    <div key={i} className="bg-slate-800/50 border border-slate-700 p-5 rounded-xl flex flex-col gap-3 hover:border-amber-500/30 transition-colors group">
                        <div className="text-3xl group-hover:scale-110 transition-transform">{feat.icon}</div>
                        <div>
                            <h4 className="text-white font-bold text-sm mb-1">{feat.title}</h4>
                            <p className="text-slate-400 text-xs leading-relaxed">{feat.desc}</p>
                        </div>
                    </div>
                ))}
            </div>

            <Button className="px-10 py-4 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-slate-900 font-bold text-lg shadow-xl shadow-amber-900/20 rounded-xl transform hover:-translate-y-1 transition-all">
                Unlock Project File
            </Button>
            
            <p className="text-xs text-slate-500 mt-4">
                Includes free consultation with our tokenization experts.
            </p>
        </div>
    </div>
  );
};
