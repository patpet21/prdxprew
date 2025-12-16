import React from 'react';

export const DistributionEducationPanel: React.FC = () => {
  return (
    <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 text-white h-full sticky top-4">
       <h4 className="text-sm font-bold text-white uppercase tracking-widest mb-6 flex items-center gap-2">
           <span className="text-xl">📢</span> Distribution 101
       </h4>

       <div className="space-y-6">
           <div>
               <h5 className="text-xs font-bold text-purple-400 uppercase mb-2">The "Go-To-Market"</h5>
               <p className="text-xs text-slate-400 leading-relaxed">
                   Distribution isn't just selling tokens. It's about <strong>alignment</strong>. 
                   You need to match your ticket size (entry price) to the right audience.
               </p>
           </div>

           <div className="p-3 bg-slate-800 rounded-xl border border-slate-700">
               <h5 className="text-xs font-bold text-slate-300 uppercase mb-2">Common Pitfall</h5>
               <p className="text-xs text-slate-400 leading-relaxed">
                   Targeting "Retail" with a $50,000 minimum ticket. Retail investors usually need entry points under $1,000.
               </p>
           </div>

           <div>
               <h5 className="text-xs font-bold text-emerald-400 uppercase mb-2">Vesting is Key</h5>
               <p className="text-xs text-slate-400 leading-relaxed">
                   Investors look at the <strong>Vesting Schedule</strong> to see if the team is committed long-term. 
                   Instant unlocking for the team is a major red flag.
               </p>
           </div>
       </div>
    </div>
  );
};