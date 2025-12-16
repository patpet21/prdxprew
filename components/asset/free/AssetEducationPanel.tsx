
import React from 'react';

export const AssetEducationPanel: React.FC = () => {
  return (
    <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 text-white h-full">
       <h4 className="text-sm font-bold text-white uppercase tracking-widest mb-6 flex items-center gap-2">
           <span className="text-xl">🎓</span> What You Should Know
       </h4>

       <div className="space-y-6">
           <div>
               <h5 className="text-xs font-bold text-blue-400 uppercase mb-2">Minimum Viable Data</h5>
               <ul className="space-y-2 text-sm text-slate-400">
                   <li className="flex gap-2"><span className="text-blue-500">•</span> Type (e.g. Hotel, Land)</li>
                   <li className="flex gap-2"><span className="text-blue-500">•</span> Location (City + Country)</li>
                   <li className="flex gap-2"><span className="text-blue-500">•</span> Scale (Size, Units)</li>
                   <li className="flex gap-2"><span className="text-blue-500">•</span> Stage (Stabilized vs Dev)</li>
               </ul>
           </div>

           <div>
               <h5 className="text-xs font-bold text-emerald-400 uppercase mb-2">Why it Matters</h5>
               <div className="space-y-3 text-xs text-slate-400 leading-relaxed">
                   <p><strong>Asset Type:</strong> Determines investor appetite. Hotels yield cashflow, Land offers appreciation.</p>
                   <p><strong>Location:</strong> Drives the compliance jurisdiction and market risk profile.</p>
                   <p><strong>Sponsor:</strong> Your track record is the #1 trust factor for token buyers.</p>
               </div>
           </div>

           <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
               <h5 className="text-[10px] font-bold text-slate-500 uppercase mb-2">Perfect Example</h5>
               <p className="text-xs text-slate-300 italic leading-relaxed">
                   "Skyline Tower is a 40-unit residential building in New York, currently in value-add renovation. Led by ABC Dev with 20 years experience."
               </p>
           </div>
       </div>
    </div>
  );
};
