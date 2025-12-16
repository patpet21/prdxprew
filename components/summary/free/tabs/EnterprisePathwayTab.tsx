
import React from 'react';
import { Button } from '../../../../components/ui/Button';

interface Props {
  onNext?: () => void;
}

export const EnterprisePathwayTab: React.FC<Props> = ({ onNext }) => {
  return (
    <div className="animate-fadeIn h-full flex flex-col justify-center items-center p-6">
        
        <div className="bg-gradient-to-br from-amber-900 to-slate-900 rounded-3xl p-10 md:p-14 text-center text-white shadow-2xl border border-amber-500/30 relative overflow-hidden max-w-3xl w-full">
            <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-[100px] -mr-20 -mt-20 pointer-events-none"></div>
            
            <div className="relative z-10">
                <div className="w-20 h-20 bg-gradient-to-br from-amber-400 to-orange-600 rounded-2xl flex items-center justify-center text-4xl mx-auto mb-8 shadow-lg shadow-amber-500/20">
                    🏗️
                </div>
                
                <h2 className="text-3xl md:text-5xl font-bold font-display mb-6 leading-tight">
                    Bring Your Project <br/>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-orange-200">To The Real World.</span>
                </h2>
                
                <p className="text-lg text-slate-300 leading-relaxed mb-10 max-w-xl mx-auto">
                    The Enterprise Suite connects your model directly to regulated issuers, top-tier legal counsel, qualified custodians, and notaries. 
                    It is an end-to-end assisted journey from concept to capital.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button className="px-8 py-4 bg-white text-slate-900 font-bold text-lg rounded-xl hover:bg-amber-50 transition-all shadow-xl shadow-white/10">
                        Book Enterprise Discovery Call →
                    </button>
                    {onNext && (
                        <button onClick={onNext} className="px-8 py-4 bg-slate-800/50 text-amber-100 font-bold text-lg rounded-xl border border-amber-500/30 hover:bg-slate-800 transition-all">
                            Continue to Next Step
                        </button>
                    )}
                </div>
            </div>
        </div>

    </div>
  );
};
