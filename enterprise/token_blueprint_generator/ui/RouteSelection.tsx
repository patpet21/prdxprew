
import React from 'react';

interface Props {
  onSelect: (route: 'PARTNER' | 'DEFI') => void;
}

export const RouteSelection: React.FC<Props> = ({ onSelect }) => {
  return (
    <div className="h-full flex flex-col items-center justify-center p-6 animate-fadeIn">
      
      <div className="text-center mb-12 max-w-2xl">
        <h2 className="text-3xl md:text-4xl font-bold text-white font-display mb-4">Tokenization Strategy</h2>
        <p className="text-slate-400 text-lg">
          How do you want to execute the issuance? You can rely on regulated partners for full compliance outsourcing, or architect a custom DeFi protocol.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-5xl items-stretch">
        
        {/* Option A: Partner Network */}
        <button 
          onClick={() => onSelect('PARTNER')}
          className="group relative bg-slate-900 p-10 rounded-3xl border-2 border-slate-800 hover:border-blue-500 text-left transition-all duration-300 hover:shadow-2xl hover:shadow-blue-900/20 overflow-hidden flex flex-col"
        >
           <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-blue-500/20 transition-colors"></div>
           
           <div className="relative z-10 flex flex-col h-full">
             <div className="w-20 h-20 bg-blue-500/20 text-blue-400 rounded-2xl flex items-center justify-center text-4xl mb-6 shadow-inner border border-blue-500/30 group-hover:scale-110 transition-transform">
               🤝
             </div>
             <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">Regulated Partner Network</h3>
             <div className="flex gap-2 mb-6">
               <span className="px-2 py-1 bg-blue-900/40 text-blue-300 text-[10px] uppercase font-bold rounded border border-blue-500/30">Recommended</span>
               <span className="px-2 py-1 bg-slate-800 text-slate-400 text-[10px] uppercase font-bold rounded border border-slate-700">Low Tech Risk</span>
             </div>
             <p className="text-slate-400 text-sm leading-relaxed mb-8 flex-1">
               Use established platforms (e.g., Blocksquare, RealT, Securitize) that handle the legal wrapper, KYC, and smart contract auditing for you.
               <br/><br/>
               <span className="text-slate-500">• Best for: Real Estate, Equity, Regulated Assets.</span>
             </p>
             
             <div className="w-full py-3 rounded-xl bg-blue-600 text-white font-bold text-center shadow-lg group-hover:bg-blue-500 transition-colors">
               Browse Partners
             </div>
           </div>
        </button>

        {/* Option B: DeFi Architect */}
        <button 
          onClick={() => onSelect('DEFI')}
          className="group relative bg-slate-900 p-10 rounded-3xl border-2 border-slate-800 hover:border-purple-500 text-left transition-all duration-300 hover:shadow-2xl hover:shadow-purple-900/20 overflow-hidden flex flex-col"
        >
           <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-purple-500/20 transition-colors"></div>
           
           <div className="relative z-10 flex flex-col h-full">
             <div className="w-20 h-20 bg-purple-500/20 text-purple-400 rounded-2xl flex items-center justify-center text-4xl mb-6 shadow-inner border border-purple-500/30 group-hover:scale-110 transition-transform">
               ⚡
             </div>
             <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-purple-400 transition-colors">DeFi Architect</h3>
             <div className="flex gap-2 mb-6">
               <span className="px-2 py-1 bg-purple-900/40 text-purple-300 text-[10px] uppercase font-bold rounded border border-purple-500/30">Advanced</span>
               <span className="px-2 py-1 bg-slate-800 text-slate-400 text-[10px] uppercase font-bold rounded border border-slate-700">Self-Custody</span>
             </div>
             <p className="text-slate-400 text-sm leading-relaxed mb-8 flex-1">
               Design your own ERC-3643 or ERC-20 smart contracts. Define custom voting rights, dividend logic, and manage your own liquidity pools.
               <br/><br/>
               <span className="text-slate-500">• Best for: Web3 Startups, DAOs, Tech-Savvy Issuers.</span>
             </p>
             
             <div className="w-full py-3 rounded-xl bg-slate-800 text-slate-300 font-bold text-center shadow-lg group-hover:bg-purple-600 group-hover:text-white transition-colors">
               Enter Architect Mode
             </div>
           </div>
        </button>

      </div>
    </div>
  );
};
