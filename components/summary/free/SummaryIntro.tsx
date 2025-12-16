
import React from 'react';

export const SummaryIntro: React.FC = () => {
  return (
    <div className="w-full bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 rounded-[2.5rem] p-12 md:p-20 text-center text-white shadow-2xl relative overflow-hidden group border border-slate-800 flex flex-col justify-center min-h-[500px]">
        
        {/* Animated Background Elements */}
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-indigo-500/10 rounded-full blur-[120px] -mr-64 -mt-64 pointer-events-none animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[100px] -ml-40 -mb-40 pointer-events-none"></div>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 pointer-events-none mix-blend-overlay"></div>
        
        <div className="relative z-10 flex flex-col items-center">
            <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md text-indigo-200 shadow-lg mb-10 animate-fadeIn hover:scale-105 transition-transform cursor-default">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                </span>
                <span className="text-xs font-bold tracking-[0.2em] uppercase">Simulation Complete</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black font-display mb-8 leading-[0.95] tracking-tight drop-shadow-xl">
                YOUR DEAL<br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-indigo-200 to-blue-200">
                    ARCHITECTED.
                </span>
            </h1>
            
            <p className="text-slate-300 text-lg md:text-2xl leading-relaxed font-light max-w-3xl mx-auto mb-12">
                PropertyDEX is an early-stage tokenization framework, supported by structured insights that explain the logic behind real-world asset tokenization.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-4xl mx-auto">
                <div className="bg-white/5 backdrop-blur-sm p-6 rounded-2xl border border-white/10 flex flex-col items-center justify-center hover:bg-white/10 transition-colors">
                    <div className="text-3xl mb-2">🏛️</div>
                    <div className="text-xs font-bold text-indigo-300 uppercase tracking-widest mb-1">Structure</div>
                    <div className="text-lg font-bold text-white">Legally Sound</div>
                </div>
                <div className="bg-white/5 backdrop-blur-sm p-6 rounded-2xl border border-white/10 flex flex-col items-center justify-center hover:bg-white/10 transition-colors">
                    <div className="text-3xl mb-2">🪙</div>
                    <div className="text-xs font-bold text-indigo-300 uppercase tracking-widest mb-1">Tokenomics</div>
                    <div className="text-lg font-bold text-white">Optimized</div>
                </div>
                <div className="bg-white/5 backdrop-blur-sm p-6 rounded-2xl border border-white/10 flex flex-col items-center justify-center hover:bg-white/10 transition-colors">
                    <div className="text-3xl mb-2">🛡️</div>
                    <div className="text-xs font-bold text-indigo-300 uppercase tracking-widest mb-1">Compliance</div>
                    <div className="text-lg font-bold text-white">Verified</div>
                </div>
            </div>
        </div>
    </div>
  );
};
