
import React from 'react';

export const ComplianceEducationPanel: React.FC = () => {
  return (
    <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 text-white h-full">
       <h4 className="text-sm font-bold text-white uppercase tracking-widest mb-6 flex items-center gap-2">
           <span className="text-xl">🎓</span> What You Should Know
       </h4>

       <div className="space-y-6">
           <div>
               <h5 className="text-xs font-bold text-blue-400 uppercase mb-2">Not just Crypto</h5>
               <p className="text-xs text-slate-400 leading-relaxed">
                   Tokenized assets are <strong>Securities</strong>, not utility tokens. 
                   They represent legal ownership of a real-world asset and must follow strict financial laws.
               </p>
           </div>

           <div className="p-3 bg-slate-800 rounded-xl border border-slate-700">
               <h5 className="text-xs font-bold text-slate-300 uppercase mb-2">Key Concepts</h5>
               <ul className="space-y-2 text-xs text-slate-400">
                   <li>
                       <strong className="text-slate-200">KYC/AML:</strong> "Know Your Customer". You MUST verify the identity of every investor to prevent money laundering.
                   </li>
                   <li>
                       <strong className="text-slate-200">Accredited:</strong> High-net-worth investors who can access riskier private deals (Reg D).
                   </li>
                   <li>
                       <strong className="text-slate-200">Whitelist:</strong> A smart contract rule that only allows approved wallets to hold the token.
                   </li>
               </ul>
           </div>

           <div>
               <h5 className="text-xs font-bold text-amber-400 uppercase mb-2">Warning</h5>
               <p className="text-xs text-slate-400 leading-relaxed">
                   This module helps you define a strategy, but <strong>does not replace a lawyer</strong>. 
                   Always consult legal counsel before accepting funds.
               </p>
           </div>
       </div>
    </div>
  );
};
