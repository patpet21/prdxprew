
import React from 'react';

export const RiskAndNextSteps: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Red Flags */}
        <div className="bg-white p-6 rounded-2xl border border-red-100 shadow-sm">
            <h4 className="text-sm font-bold text-red-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                <span>🚩</span> AI Red Flags
            </h4>
            <ul className="space-y-3">
                <li className="flex items-start gap-3 p-3 bg-red-50 rounded-lg border border-red-100">
                    <span className="text-red-500 font-bold text-xs mt-0.5">!</span>
                    <p className="text-sm text-red-800">Liquidity Risk: Lock-up period of 12 months may deter retail investors.</p>
                </li>
                <li className="flex items-start gap-3 p-3 bg-red-50 rounded-lg border border-red-100">
                    <span className="text-red-500 font-bold text-xs mt-0.5">!</span>
                    <p className="text-sm text-red-800">Sponsor Allocation: 20% retained equity is on the lower end for skin-in-the-game.</p>
                </li>
                 <li className="flex items-start gap-3 p-3 bg-red-50 rounded-lg border border-red-100">
                    <span className="text-red-500 font-bold text-xs mt-0.5">!</span>
                    <p className="text-sm text-red-800">Compliance: Cross-border solicitation requires legal opinion in target jurisdictions.</p>
                </li>
            </ul>
        </div>

        {/* Next Steps */}
        <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 text-white">
            <h4 className="text-sm font-bold text-emerald-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                <span>🚀</span> Recommended Actions
            </h4>
            <div className="space-y-4">
                <div className="flex items-center gap-4 group cursor-pointer">
                    <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-sm font-bold group-hover:bg-emerald-500 group-hover:text-slate-900 transition-colors">1</div>
                    <p className="text-sm text-slate-300 group-hover:text-white transition-colors">Finalize SPV incorporation in Delaware.</p>
                </div>
                <div className="flex items-center gap-4 group cursor-pointer">
                    <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-sm font-bold group-hover:bg-emerald-500 group-hover:text-slate-900 transition-colors">2</div>
                    <p className="text-sm text-slate-300 group-hover:text-white transition-colors">Engage KYC provider (SumSub) for investor onboarding.</p>
                </div>
                <div className="flex items-center gap-4 group cursor-pointer">
                    <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-sm font-bold group-hover:bg-emerald-500 group-hover:text-slate-900 transition-colors">3</div>
                    <p className="text-sm text-slate-300 group-hover:text-white transition-colors">Prepare Data Room with Offering Memorandum.</p>
                </div>
            </div>
            
            <div className="mt-8 pt-6 border-t border-slate-800">
                <button className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-emerald-900/20 text-sm uppercase tracking-wider">
                    Generate Professional PDF Report
                </button>
            </div>
        </div>

    </div>
  );
};
