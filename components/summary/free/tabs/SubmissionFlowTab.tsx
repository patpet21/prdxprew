
import React from 'react';

export const SubmissionFlowTab: React.FC = () => {
  const steps = [
      { id: 1, title: "Simulation", desc: "Data Entry & Config", status: "current" },
      { id: 2, title: "AI Review", desc: "Feasibility Check", status: "current" },
      { id: 3, title: "Project File", desc: "Generate Artifacts", status: "next" },
      { id: 4, title: "Matching", desc: "Provider Selection", status: "next" },
      { id: 5, title: "Submission", desc: "Compliance Review", status: "next" }
  ];

  const artifacts = [
      { name: "SPV Summary", icon: "🏛️", desc: "Legal structure blueprint" },
      { name: "Token Blueprint", icon: "🪙", desc: "Technical specs (ERC-3643)" },
      { name: "Compliance Sheet", icon: "🛡️", desc: "Rules & Restrictions" },
      { name: "Cap Table", icon: "🍰", desc: "Distribution Logic" },
      { name: "Offering Snapshot", icon: "📸", desc: "Deal Terms" },
      { name: "Biz Plan Lite", icon: "📝", desc: "Strategic Summary" },
  ];

  return (
    <div className="space-y-10 animate-fadeIn">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-slate-900 font-display mb-2">From Simulation to Reality</h3>
            <p className="text-slate-500 text-sm">
                Understand the lifecycle of a tokenization project on PropertyDEX.
            </p>
        </div>

        {/* Timeline Visualization */}
        <div className="relative">
            <div className="hidden md:block absolute top-1/2 left-0 w-full h-1 bg-slate-200 -translate-y-1/2 z-0"></div>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative z-10">
                {steps.map((step, i) => (
                    <div key={i} className="flex flex-col items-center text-center bg-white p-4 rounded-xl border border-slate-200 shadow-sm md:shadow-none md:border-none md:bg-transparent">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm mb-3 border-4 ${step.status === 'current' ? 'bg-indigo-600 text-white border-white shadow-lg' : 'bg-slate-100 text-slate-400 border-white'}`}>
                            {step.id}
                        </div>
                        <h4 className="font-bold text-slate-900 text-sm">{step.title}</h4>
                        <p className="text-[10px] text-slate-500 uppercase tracking-wide mt-1">{step.desc}</p>
                    </div>
                ))}
            </div>
        </div>

        {/* Generated Artifacts Grid */}
        <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200">
            <h4 className="text-sm font-bold text-slate-600 uppercase tracking-widest mb-6 text-center">
                Automatically Generated Project Assets
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {artifacts.map((art, i) => (
                    <div key={i} className="flex items-center gap-4 p-4 bg-white rounded-xl border border-slate-200 hover:border-indigo-300 transition-all hover:shadow-md group">
                        <div className="text-2xl group-hover:scale-110 transition-transform">{art.icon}</div>
                        <div>
                            <h5 className="font-bold text-slate-900 text-sm">{art.name}</h5>
                            <p className="text-xs text-slate-500">{art.desc}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>

        {/* Access Levels */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-xl border border-slate-200 opacity-70">
                <div className="text-xs font-bold text-slate-400 uppercase mb-2">Free Simulator</div>
                <div className="text-2xl font-bold text-slate-700 mb-2">Preview Mode</div>
                <p className="text-xs text-slate-500 leading-relaxed">
                    View on-screen summaries and basic logic checks. Educational purpose only.
                </p>
            </div>

            <div className="bg-gradient-to-b from-indigo-50 to-white p-6 rounded-xl border-2 border-indigo-100 relative overflow-hidden shadow-lg">
                <div className="absolute top-0 right-0 bg-indigo-500 text-white text-[9px] font-bold px-2 py-1 rounded-bl-lg uppercase">Recommended</div>
                <div className="text-xs font-bold text-indigo-600 uppercase mb-2">Pro Architect</div>
                <div className="text-2xl font-bold text-indigo-900 mb-2">Full Download</div>
                <p className="text-xs text-indigo-800/70 leading-relaxed">
                    Download PDF reports, editable JSON configs, and legal term sheets. Ready for legal review.
                </p>
            </div>

            <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 text-white">
                <div className="text-xs font-bold text-emerald-400 uppercase mb-2">Enterprise</div>
                <div className="text-2xl font-bold text-white mb-2">API Submission</div>
                <p className="text-xs text-slate-400 leading-relaxed">
                    Direct data-room injection to partners (Securitize, Tokeny) for instant onboarding.
                </p>
            </div>
        </div>

    </div>
  );
};
